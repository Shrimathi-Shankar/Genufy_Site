import CaseStudies from '../../src/views/CaseStudies.jsx';

export const metadata = {
  title: 'Case Studies — Genufy TechWorks',
  description: 'Discover how Genufy has helped enterprises across manufacturing, healthcare, retail, banking and more achieve measurable results through Salesforce, AI, Snowflake, MuleSoft and Data Cloud implementations.',
  alternates: { canonical: '/case-studies' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CaseStudies />;
}
