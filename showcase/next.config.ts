import type { NextConfig } from 'next'

// Keep Next's generated files in a namespace that cannot collide with the main
// application. This is deliberately not basePath: public /demo/** URLs and
// routes below app/demo/** must keep their existing public URI.
const assetPrefix = process.env.SHOWCASE_ASSET_PREFIX || '/demo-assets'

const nextConfig: NextConfig = {
  // A route handler serves /demo/health, so static export is intentionally
  // retired. `next dev` remains supported by Next's normal development mode.
  output: 'standalone' as const,
  assetPrefix,
  images: {
    // Next does not apply assetPrefix to this endpoint automatically. Keep the
    // optimiser in the Showcase asset namespace to avoid the main app's path.
    path: `${assetPrefix}/_next/image`,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
