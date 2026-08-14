import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let withBundleAnalyzer = (c) => c;
if (process.env.ANALYZE === "true") {
  try { withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: true }); }
  catch { console.warn("bundle-analyzer not installed"); }
}
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [{ source: "/about", destination: "/about-us", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.webm",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.woff2",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
export default withBundleAnalyzer(nextConfig);
