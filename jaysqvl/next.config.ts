/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization - enhanced for performance
  images: {
    formats: ['image/avif', 'image/webp'],
    // Minimize image size variations to improve cache hit ratio
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Enable gzip compression (enabled by default)
  compress: true,
  
  // Disable source maps in production for smaller bundle sizes
  productionBrowserSourceMaps: false,
  
  // Minimize redirects which cause additional latency
  trailingSlash: false,
  
  // Improve caching and reduce roundtrips with HTTP headers
  headers: async () => [
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
  ],
  
  // Experimental features - keeping only the recognized ones
  // experimental: {
  //   optimizeCss: true, // Requires 'critters' package
  // },
};

export default nextConfig;
