'use client';

import { useRouter } from 'next/navigation';
import { SERVICES } from '../components/services/serviceData.js';
import ServiceFullscreen from '../components/services/ServiceFullscreen.jsx';

// Renders a single service's immersive experience as a standalone page by
// reusing the existing ServiceFullscreen overlay. Closing/going back returns to
// the Services section on the landing page (not a separate Services page) - the
// same "/#services" target the header uses for cross-page Services navigation,
// so the Header on-mount handler smooth-scrolls to the section and reflects
// "/services" in the URL. Every "Back to Services" action in the experiences
// funnels through this onClose, so they all resolve here consistently.
export default function ServiceDetail({ slug }) {
  const router = useRouter();
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) return null;

  return (
    <ServiceFullscreen
      service={service}
      onClose={() => router.push('/#services')}
    />
  );
}
