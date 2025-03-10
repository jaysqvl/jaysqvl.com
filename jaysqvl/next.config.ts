/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization - with compatible options
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable gzip compression (enabled by default)
  compress: true,
  
  // Disable source maps in production for smaller bundle sizes
  productionBrowserSourceMaps: false,
};

export default nextConfig;
