const SITE_URL = 'https://genufy.in';

// Generates /sitemap.xml at build time (included in the static export).
export default function sitemap() {
  const lastModified = new Date();
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/products', priority: 0.8, changeFrequency: 'monthly' },
  ];
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
