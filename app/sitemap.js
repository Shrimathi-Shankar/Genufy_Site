import { SERVICES } from '../src/components/services/serviceData.js';

const SITE_URL = 'https://genufy.in';

// Generates /sitemap.xml at build time. Only indexable routes are listed -
// the noindex placeholders (/about-us, /partners, /careers, /insights) are
// intentionally excluded, and there are no product detail routes.
export default function sitemap() {
  const lastModified = new Date();
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    // Each service experience has its own indexable route (/services/<id>).
    ...SERVICES.map((s) => ({
      path: `/services/${s.id}`,
      priority: 0.7,
      changeFrequency: 'monthly',
    })),
    { path: '/products', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  ];
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
