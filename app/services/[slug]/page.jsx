import { notFound } from 'next/navigation';
import { SERVICES } from '../../../src/components/services/serviceData.js';
import ServiceDetail from '../../../src/views/ServiceDetail.jsx';

// Pre-render every service route at build time (SEO-friendly, refresh-safe).
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }) {
  const service = SERVICES.find((s) => s.id === params.slug);
  if (!service) return {};
  const description = (service.description || service.body || '').slice(0, 160);
  return {
    title: service.title,
    description,
    alternates: { canonical: `/services/${service.id}` },
  };
}

const SITE_URL = 'https://genufy.in';

export default function Page({ params }) {
  const service = SERVICES.find((s) => s.id === params.slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.id}`;
  // Service schema (what this page offers) + BreadcrumbList (Home > Services >
  // this service) so search engines can show breadcrumb rich results.
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: (service.description || service.body || '').slice(0, 300),
    serviceType: service.title,
    provider: { '@type': 'Organization', name: 'Genufy TechWorks', url: SITE_URL },
    areaServed: ['IN', 'US'],
    url,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ServiceDetail slug={params.slug} />
    </>
  );
}
