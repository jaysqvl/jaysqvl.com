import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable minification (compresses JS and CSS files)
  swcMinify: true,
  
  // Image optimization
  images: {
    // Enables image optimization by default
    unoptimized: false,
    // Sets quality of optimized images
    // Quality setting is not supported in NextConfig type
    // Use the deviceSizes and imageSizes options instead
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable gzip compression
  compress: true,
  
  // Improve production builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
