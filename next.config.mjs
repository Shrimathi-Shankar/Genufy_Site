import bundleAnalyzer from '@next/bundle-analyzer';

// Visualise the bundle with `ANALYZE=true npm run build` (opens treemap HTML).
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js server build - runs with `next start` on a Node host
  // (binds 0.0.0.0 and reads PORT automatically). Pages with no dynamic data
  // are still statically generated at build time.
  reactStrictMode: true,
  // We use plain <img> tags, so skip the image optimizer (no sharp needed).
  images: { unoptimized: true },

  // Long-cache static media served from public/ (next start applies these on a
  // Node host; they are no-ops for a static `output: export`). `/_next/static`
  // is already hashed + immutable by Next, so it is not listed here.
  //
  // NOTE: files in public/ are NOT content-hashed - the same URL (e.g.
  // /AI_bg.webp) is reused across deploys. `immutable` means browsers will not
  // revalidate for a year, so if you REPLACE an image with the same filename,
  // bust the cache by renaming it or appending a version query (?v=2).
  async headers() {
    return [
      {
        source: '/:path*.(webp|png|jpg|jpeg|gif|svg|avif|ico|mp4|webm|woff|woff2|splinecode)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
