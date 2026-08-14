import Home from '../../src/views/Home.jsx';

export const metadata = {
  title: 'Services',
  description:
    'Genufy TechWorks services — Salesforce, AI & ML, Snowflake, Informatica, DevOps, MuleSoft, Pega, and Web Development. Enterprise-grade solutions built to scale.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Genufy TechWorks',
    description:
      'Salesforce, AI & ML, Snowflake, Informatica, DevOps, MuleSoft, Pega, and Web Development — enterprise-grade solutions built to scale.',
    url: 'https://www.genufy.in/services',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Genufy TechWorks Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Genufy TechWorks',
    description:
      'Salesforce, AI & ML, Snowflake, Informatica, DevOps, MuleSoft, Pega, and Web Development — enterprise-grade solutions built to scale.',
    images: ['/og-image.png'],
  },
};

// Render the full Home experience, starting at the Services section.
// This gives a clean /services URL while preserving all cinematic animations.
export default function Page() {
  return <Home intentSection="services" />;
}
