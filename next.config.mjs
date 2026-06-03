/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static HTML/JS export (deployable anywhere, like the old Vite build).
  output: 'export',
  reactStrictMode: true,
  // Required for static export — we use plain <img>, so no optimization server.
  images: { unoptimized: true },
};

export default nextConfig;
