import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This proxy protects routes that require authentication
export function proxy(request: NextRequest) {
  // You can add authentication checks here if needed
  // For now, we'll rely on client-side protection in the dashboard page
  return NextResponse.next();
}

// Configure which routes use this proxy
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Add other protected routes here
  ],
};
