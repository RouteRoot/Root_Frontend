import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "velog.velcdn.com",
      },
      {
        protocol: "http",
        hostname: "13.239.246.72",
      },
    ],
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
