'use client';

import Header from '../components/Header.jsx';
import HeroGenufy from '../components/HeroGenufy.jsx';
import Marquee from '../components/Marquee.jsx';
import Manifesto from '../components/Manifesto.jsx';
import HorizontalCapabilities from '../components/HorizontalCapabilities.jsx';
import PinnedShowcase from '../components/PinnedShowcase.jsx';
import PortalTransition from '../components/PortalTransition.jsx';
import ClosingCTA from '../components/ClosingCTA.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="relative z-10">
        {/* Act 1 — Hero (self-contained: internal parallax stage + Spline robot) */}
        <HeroGenufy />

        {/* Act 2 — Manifesto reveal */}
        <Manifesto />

        {/* Act 3 — Trusted Clients marquee */}
        <Marquee />

        {/* Act 4 — Official Salesforce Partner (cinematic portal transition) */}
        <PortalTransition />

        {/* Act 7 — Horizontal capabilities scroll */}
        <HorizontalCapabilities />

        {/* Act 8 — Process pinned showcase */}
        <PinnedShowcase />

        {/* Act 9 — Closing CTA */}
        <ClosingCTA />

        {/* Footer — kept INSIDE main so it shares the z-10 stacking context and
            is not veiled by the fixed ParallaxStage overlay (which sits above
            anything outside main). */}
        <SiteFooter />
      </main>

      <div className="noise" aria-hidden />
    </>
  );
}
