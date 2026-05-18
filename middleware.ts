import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function normalizeHost(value: string): string {
  return value.trim().toLowerCase().replace(/:\d+$/, "");
}

function getConfiguredRootDomain(): string {
  return normalizeHost(process.env.NEXT_PUBLIC_ROOT_DOMAIN || "businessbuilders.tech");
}

function extractTenantSubdomain(host: string, configuredRoot: string): string {
  if (!host) {
    return "";
  }

  if (configuredRoot && (host === configuredRoot || host === `www.${configuredRoot}`)) {
    return "";
  }

  if (configuredRoot && host.endsWith(`.${configuredRoot}`)) {
    return host.slice(0, -(configuredRoot.length + 1)).split(".")[0] || "";
  }

  if (host.endsWith(".vercel.app")) {
    const labels = host.split(".");
    if (labels.length > 3) {
      return labels[0] || "";
    }
    return "";
  }

  return "";
}

export function middleware(request: NextRequest) {
  const incomingHost = normalizeHost(
    request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      request.nextUrl.hostname ||
      "",
  );
  const configuredRoot = getConfiguredRootDomain();

  // Root app host should never be treated as a tenant domain.
  if (
    incomingHost === "localhost" ||
    incomingHost === "127.0.0.1" ||
    (configuredRoot && (incomingHost === configuredRoot || incomingHost === `www.${configuredRoot}`))
  ) {
    return NextResponse.next();
  }

  const tenantSubdomain = extractTenantSubdomain(incomingHost, configuredRoot);
  if (!tenantSubdomain) {
    return NextResponse.next();
  }

  // Tenant routing is handled in app/storefront resolution. This marker is informational.
  const response = NextResponse.next();
  response.headers.set("x-tenant-subdomain", tenantSubdomain);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
