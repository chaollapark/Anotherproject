/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Increase export timeout for large number of pages
  exportTimeout: 300000, // 5 minutes
  // Configure static export settings
  trailingSlash: false,
  // Optimize memory usage for large builds
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    // Optimize static generation
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
  // Limit concurrent static generation to prevent memory issues
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

export default nextConfig;
