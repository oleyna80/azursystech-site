import type { NextConfig } from 'next'

const isStaticExport = process.env.SHOWCASE_STATIC_EXPORT === '1'
const assetPrefix =
  process.env.SHOWCASE_ASSET_PREFIX ||
  (isStaticExport || process.env.NODE_ENV !== 'production' ? '/demo-assets' : undefined)

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export' as const,
        trailingSlash: true,
      }
    : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
  images: {
    unoptimized: Boolean(assetPrefix),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
