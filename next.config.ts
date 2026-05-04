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
        port: "8080",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.239.246.72:8080/api/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://13.239.246.72:8080/images/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://13.239.246.72:8080/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
