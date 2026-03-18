import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com"], 
  },
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
