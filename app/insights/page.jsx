// import InsightsListing from '../../src/views/InsightsListing.jsx';
import ComingSoon from '../../src/components/ComingSoon.jsx';

export const metadata = {
  title: 'Insights',
  description: 'Insights from Genufy TechWorks - articles and case studies coming soon.',
  alternates: { canonical: '/insights' },
  robots: { index: false, follow: true },
};

export default function Page() {
  // return <InsightsListing />;
  return (
    <ComingSoon
      eyebrow="Genufy TechWorks · Insights"
      blurb="We're preparing valuable insights, case studies, and industry updates. Stay tuned."
    />
  );
}
