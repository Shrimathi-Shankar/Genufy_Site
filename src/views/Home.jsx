'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header.jsx';
import HeroGenufy from '../components/HeroGenufy.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';

const Manifesto = dynamic(() => import('../components/Manifesto.jsx'), { ssr: false });
const HorizontalCapabilities = dynamic(() => import('../components/HorizontalCapabilities.jsx'), { ssr: false });
const PinnedShowcase = dynamic(() => import('../components/PinnedShowcase.jsx'), { ssr: false });
const PortalTransition = dynamic(() => import('../components/PortalTransition.jsx'), { ssr: false });
const ClosingCTA = dynamic(() => import('../components/ClosingCTA.jsx'), { ssr: false });
const SiteFooter = dynamic(() => import('../components/SiteFooter.jsx'), { ssr: false });

// Mounts children only once the sentinel enters the viewport (rootMargin 400px).
// forceVisible=true bypasses the observer and renders children immediately —
// used when navigating directly to a section that would otherwise never trigger.
function LazySection({ children, minHeight = '100vh', forceVisible = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(forceVisible);

  useEffect(() => {
    if (visible) return;
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { rootMargin: '400px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible && children}
    </div>
  );
}

export default function Home({ intentSection = null }) {
  // When arriving via /services we need the full layout above-the-fold of the
  // services section to be rendered immediately — otherwise lazy placeholders
  // (80 vh for PortalTransition vs its real 110 vh) shift the page after we
  // scroll, landing the viewport on the PortalTransition section instead.
  const forceEager = intentSection === 'services';
  const [servicesReady, setServicesReady] = useState(forceEager);

  // Expose an imperative loader for Header to call when the user is already on
  // the home page but hasn't scrolled far enough to trigger the LazySection yet.
  useEffect(() => {
    window.__loadServicesSection = () => setServicesReady(true);
    return () => { delete window.__loadServicesSection; };
  }, []);

  useEffect(() => {
    // Priority 1: restore exact scroll position after Back from a service detail page.
    let saved;
    try { saved = sessionStorage.getItem('__restore_home_scroll'); } catch {}
    if (saved) {
      try { sessionStorage.removeItem('__restore_home_scroll'); } catch {}
      const y = parseInt(saved, 10);
      if (!isNaN(y) && y > 0) {
        const t = setTimeout(() => {
          if (window.__lenis?.scrollTo) window.__lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        }, 120);
        return () => clearTimeout(t);
      }
    }

    // Priority 2: scroll to the target section on cross-page navigation.
    // All sections above the target are force-mounted (forceEager=true) so layout
    // is fully stable before we scroll — no post-scroll content shift.
    if (!intentSection) return;
    let timer;
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(intentSection);
      if (el) {
        const lenis = window.__lenis;
        const headerH = document.querySelector('header[data-site-header]')?.getBoundingClientRect().height || 0;
        const offset = intentSection === 'services' ? -8 : -(headerH + 12);
        // Use immediate (no animation) for cross-page arrivals: the user is
        // coming from another route, so an instant jump is correct UX and it
        // avoids any remaining layout shift that could de-sync a smooth scroll.
        if (lenis?.scrollTo) {
          lenis.scrollTo(el, { offset, immediate: true });
        } else {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
        }
        return;
      }
      // Dynamic imports not resolved yet — keep polling.
      if (++attempts < 30) timer = setTimeout(tryScroll, 150);
    };
    timer = setTimeout(tryScroll, 400);
    return () => clearTimeout(timer);
  }, [intentSection]);

  return (
    <>
      <Header />

      <main className="relative z-10">
        {/* Act 1 — Hero */}
        <HeroGenufy />

        {/* Act 2 — Manifesto */}
        <LazySection minHeight="60vh" forceVisible={forceEager}>
          <Manifesto />
        </LazySection>

        {/* Act 3 — Trusted Clients (hidden) */}

        {/* Act 4 — Salesforce Partner cinematic transition
            Force-mounted when targeting services so its true height (110 vh,
            not the 80 vh placeholder) is in the layout before we scroll. */}
        <LazySection minHeight="300vh" forceVisible={forceEager}>
          <PortalTransition />
        </LazySection>

        {/* Act 5 — Services horizontal scroll */}
        <LazySection minHeight="280vh" forceVisible={servicesReady}>
          <HorizontalCapabilities />
        </LazySection>

        {/* Act 6 — Process showcase */}
        <LazySection minHeight="200vh">
          <PinnedShowcase />
        </LazySection>

        {/* Act 7 — Closing CTA */}
        <LazySection minHeight="60vh">
          <ClosingCTA />
        </LazySection>

        {/* Footer inside main to share the z-10 stacking context */}
        <LazySection minHeight="40vh">
          <SiteFooter />
        </LazySection>
      </main>

      <div className="noise" aria-hidden />
    </>
  );
}
