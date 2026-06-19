import Careers from '../../src/views/Careers.jsx';

export const metadata = {
  title: 'Careers',
  description:
    'Career opportunities at Genufy TechWorks. We are always looking for talented people — share your details and resume to join our Salesforce, AI, and data engineering teams.',
  alternates: { canonical: '/careers' },
  openGraph: {
    title: 'Careers | Genufy TechWorks',
    description:
      'Career opportunities at Genufy TechWorks. Join our Salesforce, AI, Snowflake, and data engineering teams — share your details and resume.',
    url: 'https://www.genufy.in/careers',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Careers at Genufy TechWorks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Genufy TechWorks',
    description:
      'Career opportunities at Genufy TechWorks. Join our Salesforce, AI, Snowflake, and data engineering teams.',
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return <Careers />;
}
