import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.worldweatheronline.com',
        protocol: 'https',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
