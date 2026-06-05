import AboutUs from '../../src/views/AboutUs.jsx';

export const metadata = {
  title: 'About Us',
  description: 'About Genufy TechWorks - our story is coming soon.',
  alternates: { canonical: '/about-us' },
  // Placeholder page - keep it out of the index until there is real content.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <AboutUs />;
}
