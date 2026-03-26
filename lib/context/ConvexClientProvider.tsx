"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL environment variable.\n" +
      "1. Create a .env.local file in the root directory\n" +
      "2. Add: NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud\n" +
      "3. Run 'npx convex dev' to get your deployment URL if you don't have one",
  );
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
