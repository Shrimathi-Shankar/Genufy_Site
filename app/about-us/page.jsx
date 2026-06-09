import AboutUs from '../../src/views/AboutUs.jsx';

export const metadata = {
  title: 'About Us',
  description:
    'Built with purpose, driven by innovation. Genufy makes world-class technology accessible from anywhere - AI, Salesforce, Snowflake, and Data Engineering - while empowering rural talent and creating opportunity.',
  alternates: { canonical: '/about-us' },
};

export default function Page() {
  return <AboutUs />;
}
