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

export default function Page({ params }) {
  const service = SERVICES.find((s) => s.id === params.slug);
  if (!service) notFound();
  return <ServiceDetail slug={params.slug} />;
}
