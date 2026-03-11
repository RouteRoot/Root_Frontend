import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "http:13.239.246.72:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
