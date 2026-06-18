import AboutUs from '../../src/views/AboutUs.jsx';

export const metadata = {
  title: 'About Us',
  description:
    'Built with purpose, driven by innovation. Genufy TechWorks makes world-class technology accessible — AI, Salesforce, Snowflake, and Data Engineering — while empowering talent and creating opportunity.',
  alternates: { canonical: '/about-us' },
  openGraph: {
    title: 'About Us | Genufy TechWorks',
    description:
      'Built with purpose, driven by innovation. Genufy TechWorks makes world-class technology accessible — AI, Salesforce, Snowflake, and Data Engineering — while empowering talent and creating opportunity.',
    url: 'https://www.genufy.in/about-us',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Genufy TechWorks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Genufy TechWorks',
    description:
      'Built with purpose, driven by innovation. Genufy TechWorks makes world-class technology accessible — AI, Salesforce, Snowflake, and Data Engineering.',
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return <AboutUs />;
}
