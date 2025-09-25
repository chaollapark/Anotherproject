/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  // Build optimizations for Vercel
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
  },
  // Increase build timeout for large page counts
  staticPageGenerationTimeout: 300, // 5 minutes
  // Optimize output
  output: 'standalone',
  // Reduce bundle size
  swcMinify: true,
};

export default nextConfig;
