import { NextRequest, NextResponse } from "next/server";

const DOMAIN_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)\.[a-z]{2,63}$/i;

const GODADDY_API_BASE_URL =
  process.env.GODADDY_API_BASE_URL || "https://api.godaddy.com";

async function checkWithGoDaddy({
  domain,
  apiKey,
  apiSecret,
  baseUrl,
}: {
  domain: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}) {
  const lookupUrl = `${baseUrl}/v1/domains/available?domain=${encodeURIComponent(
    domain,
  )}&checkType=FAST&forTransfer=false`;

  const response = await fetch(lookupUrl, {
    method: "GET",
    headers: {
      Authorization: `sso-key ${apiKey}:${apiSecret}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const rawBody = await response.text();

  let data: unknown = null;
  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = rawBody;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

async function checkWithRdap(domain: string) {
  const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
    method: "GET",
    headers: {
      Accept: "application/rdap+json, application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return {
      ok: true,
      available: true,
      source: "rdap",
    };
  }

  if (response.ok) {
    return {
      ok: true,
      available: false,
      source: "rdap",
    };
  }

  return {
    ok: false,
    status: response.status,
    source: "rdap",
  };
}

function normalizeDomain(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const domain = normalizeDomain(body?.domain || "");

    if (!domain || !DOMAIN_PATTERN.test(domain)) {
      return NextResponse.json(
        { error: "Please enter a valid domain like yourbrand.com" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GODADDY_API_KEY;
    const apiSecret = process.env.GODADDY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Domain lookup is not configured. Add GODADDY_API_KEY and GODADDY_API_SECRET.",
        },
        { status: 500 },
      );
    }

    const primaryResult = await checkWithGoDaddy({
      domain,
      apiKey,
      apiSecret,
      baseUrl: GODADDY_API_BASE_URL,
    });

    let result = primaryResult;
    const alternativeBaseUrl =
      GODADDY_API_BASE_URL === "https://api.ote-godaddy.com"
        ? "https://api.godaddy.com"
        : "https://api.ote-godaddy.com";

    if (primaryResult.status === 403) {
      const fallbackResult = await checkWithGoDaddy({
        domain,
        apiKey,
        apiSecret,
        baseUrl: alternativeBaseUrl,
      });

      if (fallbackResult.ok) {
        result = fallbackResult;
      }
    }

    if (!result.ok) {
      const goDaddyAuthFailed =
        result.status === 401 ||
        result.status === 403 ||
        (result.status === 400 &&
          typeof result.data === "object" &&
          result.data !== null &&
          "code" in result.data &&
          (result.data as { code?: string }).code === "UNABLE_TO_AUTHENTICATE");

      if (goDaddyAuthFailed) {
        const rdapResult = await checkWithRdap(domain);

        if (rdapResult.ok) {
          return NextResponse.json({
            domain,
            available: rdapResult.available,
            price: null,
            currency: null,
            source: rdapResult.source,
            warning:
              "GoDaddy authentication failed, so availability is provided via RDAP fallback.",
          });
        }
      }

      const isForbidden = result.status === 403;
      return NextResponse.json(
        {
          error:
            result.status === 429
              ? "Too many checks right now. Please wait a moment and try again."
              : isForbidden
                ? "GoDaddy rejected the request (403). Your API key/secret may not match this environment. Use production keys with https://api.godaddy.com or OTE keys with https://api.ote-godaddy.com."
                : "Unable to check this domain right now.",
          details: result.data,
          configuredBaseUrl: GODADDY_API_BASE_URL,
        },
        { status: result.status },
      );
    }

    const data = result.data as
      | {
          available?: boolean;
          price?: number;
          currency?: string;
        }
      | null;

    return NextResponse.json({
      domain,
      available: Boolean(data?.available),
      price: data?.price ?? null,
      currency: data?.currency ?? null,
      source: "godaddy",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while checking domain availability." },
      { status: 500 },
    );
  }
}
