import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.239.246.72:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
