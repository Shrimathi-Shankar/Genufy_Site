import Partners from '../../src/views/Partners.jsx';

export const metadata = {
  title: 'Partners',
  description: 'Genufy TechWorks partners - our alliances and ecosystems are coming soon.',
  alternates: { canonical: '/partners' },
  // Placeholder page - keep it out of the index until there is real content.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Partners />;
}
