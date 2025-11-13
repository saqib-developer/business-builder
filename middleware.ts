import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware protects routes that require authentication
export function middleware(request: NextRequest) {
  // You can add authentication checks here if needed
  // For now, we'll rely on client-side protection in the dashboard page
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Add other protected routes here
  ],
};
