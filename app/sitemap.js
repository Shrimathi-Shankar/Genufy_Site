import { SERVICES } from '../src/components/services/serviceData.js';
import { POSTS } from '../src/components/insightsData.js';

const SITE_URL = 'https://www.genufy.in';

// Priority tiers:
//   1.0  homepage
//   0.9  services hub + high-priority services (Salesforce, Snowflake, Informatica, AI/ML)
//   0.8  about-us, products, careers, other core pages
//   0.7  supporting services (DevOps, MuleSoft, Pega, Web), contact, insights hub
//   0.6  qr-code utility
//   0.5  individual insight/blog posts

// Services that should rank higher in sitelinks and search signals.
const HIGH_PRIORITY_SERVICES = new Set(['salesforce', 'snowflake', 'informatica', 'ai-ml']);

export default function sitemap() {
  const lastModified = new Date();

  const coreRoutes = [
    { path: '',            priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/about-us',   priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services',   priority: 0.9, changeFrequency: 'monthly' },
    { path: '/products',   priority: 0.8, changeFrequency: 'monthly' },
    { path: '/insights',   priority: 0.7, changeFrequency: 'weekly'  },
    { path: '/contact',    priority: 0.7, changeFrequency: 'yearly'  },
    { path: '/careers',    priority: 0.8, changeFrequency: 'monthly' },
    { path: '/qr-code',    priority: 0.6, changeFrequency: 'yearly'  },
  ];

  const serviceRoutes = SERVICES.map((s) => ({
    path: `/services/${s.id}`,
    priority: HIGH_PRIORITY_SERVICES.has(s.id) ? 0.9 : 0.7,
    changeFrequency: 'monthly',
  }));

  const insightRoutes = POSTS.map((p) => ({
    path: `/insights/${p.slug}`,
    priority: 0.5,
    changeFrequency: 'monthly',
  }));

  return [...coreRoutes, ...serviceRoutes, ...insightRoutes].map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );
}
