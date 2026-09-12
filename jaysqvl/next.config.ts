import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Let Next.js disable caching for development assets and hot updates.
  headers: async () => process.env.NODE_ENV === 'development' ? [] : [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
    {
      source: '/(.*)\\.(jpg|jpeg|png|webp|avif|ico|svg)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, immutable',
        },
      ],
    },
    {
      source: '/(.*)\\.(js|css)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // GitHub fetches cache successful data; the response must stay retryable.
      source: '/api/projects',
      headers: [{ key: 'Cache-Control', value: 'no-store' }],
    },
  ],
};

export default nextConfig;
