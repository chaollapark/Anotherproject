/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Increase export timeout for large number of pages
  exportTimeout: 300000, // 5 minutes
  // Configure static export settings
  trailingSlash: false,
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
