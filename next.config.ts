import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/cuktenqad/**',
      },
      {
        protocol: 'https',
        hostname: 'pollinations.ai',
        pathname: '/p/**',
      },
    ],
  },
};

export default nextConfig;
