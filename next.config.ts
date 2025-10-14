import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'https://hillier-xuan-rooky.ngrok-free.dev',
  ],
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['@tailwindcss/vite'],
          as: '*.css',
        },
      },
    }
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.amapi.site/api/:path*',
      },
    ];
  },
};

export default nextConfig;
