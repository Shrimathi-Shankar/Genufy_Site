import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Load the bundle analyzer ONLY when explicitly requested (ANALYZE=true).
// It is a devDependency, so the import must be conditional - otherwise a
// production install that omits devDependencies would fail to load this config,
// breaking `next build` / `next start` (server never boots -> all browsers hang
// on a perpetual load). `npm run analyze` sets ANALYZE=true.
let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === 'true') {
  try {
    withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
  } catch {
    console.warn('[next.config] @next/bundle-analyzer not installed; skipping analysis.');
  }
}

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
  // Permanent redirect so Google drops the old /about sitelink ("About New Gen")
  // and transfers any remaining link equity to the real /about-us page.
  async redirects() {
    return [
      { source: '/about', destination: '/about-us', permanent: true },
    ];
  },

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
