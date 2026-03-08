import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beloved-ptarmigan-639.convex.cloud",
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;
