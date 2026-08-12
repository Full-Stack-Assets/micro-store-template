/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isProjectPages =
  process.env.GITHUB_ACTIONS === 'true' &&
  repositoryName.length > 0 &&
  !repositoryName.endsWith('.github.io')
const basePath = isProjectPages ? `/${repositoryName}` : ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
