const SITE_URL = 'https://www.genufy.in';

// Generates /robots.txt at build time (included in the static export).
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
