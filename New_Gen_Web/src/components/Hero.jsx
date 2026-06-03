import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../animations/variants.js';
import MagneticButton from './MagneticButton.jsx';

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center gap-7">
          <motion.span
            variants={fadeUp}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-white/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent2 animate-pulseGlow" />
            Welcome to the next-gen web
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="h-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl"
          >
            Craft <span className="gradient-text">immersive</span> experiences
            <br className="hidden md:block" /> for the modern internet.
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-2xl text-white/70 md:text-lg">
            A futuristic React starter with silky-smooth scrolling, glassmorphism, magnetic interactions,
            and cinematic motion — engineered for performance and scale.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <MagneticButton className="btn-primary">Start Building</MagneticButton>
            <MagneticButton className="btn-ghost">View Components</MagneticButton>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 w-full max-w-4xl">
            <div className="glass rounded-3xl p-2">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] aspect-[16/9] grid place-items-center">
                <div className="text-center">
                  <div className="h-display text-3xl md:text-4xl gradient-text">React + Vite</div>
                  <div className="text-white/50 mt-2 text-sm tracking-[0.3em] uppercase">Lenis · Framer · Tailwind</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
