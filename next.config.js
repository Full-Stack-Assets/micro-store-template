/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  // Optimize for Vercel deployment
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
