/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js server build - runs with `next start` on a Node host
  // (binds 0.0.0.0 and reads PORT automatically). Pages with no dynamic data
  // are still statically generated at build time.
  reactStrictMode: true,
  // We use plain <img> tags, so skip the image optimizer (no sharp needed).
  images: { unoptimized: true },
};

export default nextConfig;
