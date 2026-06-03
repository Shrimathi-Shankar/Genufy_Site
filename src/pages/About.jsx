import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants.js';
import Reveal from '../components/Reveal.jsx';
import SEO from '../components/SEO.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function About() {
  return (
    <motion.div {...pageTransition}>
      <SEO title="About" description="About New Gen Web — a futuristic React starter." path="/about" />
      <section className="section pt-40">
        <Reveal>
          <h1 className="h-display text-5xl md:text-7xl tracking-tight">
            About <span className="gradient-text">New Gen</span>
          </h1>
        </Reveal>
        <Reveal delay={1}>
          <p className="text-white/70 mt-6 max-w-2xl text-lg leading-relaxed">
            New Gen Web is a modern React starter focused on motion, performance, and aesthetic depth.
            Use it as a foundation for product pages, portfolios, and immersive marketing sites.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5 mt-14">
          {['Performance', 'Design', 'Motion', 'Scale'].map((t, i) => (
            <Reveal key={t} delay={i}>
              <div className="glass rounded-2xl p-8">
                <div className="text-white/40 uppercase tracking-widest text-xs">Pillar 0{i + 1}</div>
                <h3 className="h-display text-2xl mt-2">{t}</h3>
                <p className="text-white/65 mt-2 text-sm">
                  Thoughtful primitives that compose into rich, modern interfaces.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </motion.div>
  );
}
