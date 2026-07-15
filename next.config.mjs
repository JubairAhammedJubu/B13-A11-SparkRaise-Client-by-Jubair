/** @type {import('next').NextConfig} */
const nextConfig = {
  // Safety net for `runtime: 'nodejs'` in src/middleware.js — some Next.js
  // builds still gate Node.js-runtime middleware behind this flag even
  // after it's otherwise supported. Harmless to leave in; remove if your
  // Next version logs an "unrecognized experimental key" warning.
  experimental: {
    nodeMiddleware: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**', },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'th.bing.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
