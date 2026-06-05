'use client';

import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import HorizontalCapabilities from '../components/HorizontalCapabilities.jsx';

// The Services page reuses the existing capabilities carousel. Clicking a card
// navigates to that service's dedicated route (/services/<id>).
export default function Services() {
  return (
    <>
      <Header />
      <HorizontalCapabilities />
      <SiteFooter />
    </>
  );
}
