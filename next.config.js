/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.mzstatic.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
};

module.exports = nextConfig;
