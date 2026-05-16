import { NextRequest, NextResponse } from "next/server";

interface VercelDomainRequest {
  domain: string;
}

interface VercelDomainResponse {
  domain: string;
  verified: boolean;
  verificationRecords: Array<{
    type: string;
    name: string;
    value: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID;
    const accessToken = process.env.VERCEL_ACCESS_TOKEN;

    if (!projectId || !accessToken) {
      return NextResponse.json(
        {
          error: "Vercel API credentials are not configured. Contact support.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as VercelDomainRequest;
    const domain = (body?.domain || "").trim().toLowerCase();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required." },
        { status: 400 },
      );
    }

    // Basic domain validation: must contain at least one dot
    if (!domain.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid domain (e.g., mybusiness.com)." },
        { status: 400 },
      );
    }

    // Call Vercel API to add the domain
    const vercelResponse = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      },
    );

    let vercelData: Record<string, unknown> = {};
    try {
      vercelData = (await vercelResponse.json()) as Record<string, unknown>;
    } catch {
      vercelData = {};
    }

    if (vercelResponse.status === 409) {
      return NextResponse.json(
        {
          success: true,
          domain,
          alreadyAttached: true,
          verificationRecords:
            (vercelData?.verificationRecords as Array<Record<string, string>> | undefined) || [],
        },
        { status: 200 },
      );
    }

    if (!vercelResponse.ok) {
      // Handle specific Vercel errors
      let errorMessage = "Failed to add domain to Vercel.";
      
      if (vercelResponse.status === 400) {
        const errCode = (vercelData?.code as string) || "";
        if (errCode === "domain_already_in_use") {
          errorMessage = "This domain is already in use. Please use a different domain.";
        } else if (errCode === "invalid_domain") {
          errorMessage = "Invalid domain format. Please check and try again.";
        } else {
          errorMessage = (vercelData?.message as string) || errorMessage;
        }
      } else if (vercelResponse.status === 401 || vercelResponse.status === 403) {
        errorMessage = "Authentication failed. Please check Vercel API configuration.";
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: vercelResponse.status },
      );
    }

    // Return success with domain details
    return NextResponse.json(
      {
        success: true,
        domain,
        verificationRecords: (vercelData?.verificationRecords as Array<Record<string, string>> | undefined) || [],
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error adding domain to Vercel:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
