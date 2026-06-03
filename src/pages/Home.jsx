import SEO from '../components/SEO.jsx';
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
      <SEO
        title="Genufy"
        description="Genufy — engineering the next generation of intelligent experiences."
        path="/"
      />
      <ScrollProgress />
      <Header />

      <main className="relative z-10">
        {/* Act 1 — Hero (self-contained: internal parallax stage + Spline robot) */}
        <HeroGenufy />

        {/* Act 2 — Manifesto reveal */}
        <Manifesto />

        {/* Act 3 — Cinematic portal transition (Hero → Partnership / Vision / Mission triad) */}
        <PortalTransition />

        {/* Act 4 — Trusted Partners marquee */}
        <Marquee />

        {/* Act 7 — Horizontal capabilities scroll */}
        <HorizontalCapabilities />

        {/* Act 8 — Process pinned showcase */}
        <PinnedShowcase />

        {/* Act 9 — Closing CTA */}
        <ClosingCTA />
      </main>

      <SiteFooter />
      <div className="noise" aria-hidden />
    </>
  );
}
