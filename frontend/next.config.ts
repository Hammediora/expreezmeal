import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  experimental: {
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // allow all http domains (development only)
      },
      {
        protocol: 'https',
        hostname: '**', // allow all https domains (development only)
      },
    ],
    // Optional fallback config to avoid console warnings
    dangerouslyAllowSVG: true, // only if you plan to load SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
