import SEO from '../components/SEO.jsx';
import Header from '../components/Header.jsx';
import HeroGenufy from '../components/HeroGenufy.jsx';
import Manifesto from '../components/Manifesto.jsx';
import HorizontalCapabilities from '../components/HorizontalCapabilities.jsx';
import Marquee from '../components/Marquee.jsx';
import PinnedShowcase from '../components/PinnedShowcase.jsx';
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
        {/* Act 1 — Hero with its own immersive parallax stage */}
        <section className="relative">
          <HeroGenufy />
        </section>

        {/* Act 2 — Manifesto reveal */}
        <Manifesto />

        {/* Act 4 — Capability marquee */}
        <Marquee />

        {/* Act 5 — Horizontal capabilities scroll */}
        <HorizontalCapabilities />

        {/* Act 6 — Process pinned showcase */}
        <PinnedShowcase />

        {/* Act 8 — Closing CTA */}
        <ClosingCTA />
      </main>

      <SiteFooter />
      <div className="noise" aria-hidden />
    </>
  );
}
