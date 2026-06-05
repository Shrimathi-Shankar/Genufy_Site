import Insights from '../../src/views/Insights.jsx';

export const metadata = {
  title: 'Insights',
  description: 'Insights from Genufy TechWorks - articles and case studies coming soon.',
  alternates: { canonical: '/insights' },
  // Placeholder page - keep it out of the index until there's real content.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Insights />;
}
