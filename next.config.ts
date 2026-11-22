import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/fr/peages',
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
