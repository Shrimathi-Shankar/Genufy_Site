import Careers from '../../src/views/Careers.jsx';

export const metadata = {
  title: 'Careers',
  description: 'Careers at Genufy TechWorks - open roles coming soon.',
  alternates: { canonical: '/careers' },
  // Placeholder page - keep it out of the index until there are real openings.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Careers />;
}
