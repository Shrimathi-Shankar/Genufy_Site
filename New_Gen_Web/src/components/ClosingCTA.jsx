import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ClosingCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.6]);

  return (
    <section ref={ref} className="relative py-40 md:py-56 px-6 md:px-12 overflow-hidden">
      <motion.div
        aria-hidden
        style={{ y, scale }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[1200px] h-[1200px] rounded-full blur-[150px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.55), rgba(144,235,97,0.25) 40%, transparent 70%)' }}
        />
      </motion.div>

      <motion.div style={{ opacity }} className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] tracking-[0.4em] uppercase text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
          Let's build · 05
        </div>
        <h2 className="mt-8 font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.02]">
          Build the next era <br />
          with <span className="text-gradient-gt">Genufy</span>.
        </h2>
        <p className="mt-7 mx-auto max-w-xl text-white/65 text-base md:text-lg">
          A partnership designed for ambitious teams. Tell us where you're going — we'll engineer the system that gets you there.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-black transition hover:brightness-110"
            style={{ background: 'linear-gradient(90deg,#90eb61,#24baac)' }}
          >
            Start a conversation
            <span aria-hidden>→</span>
          </a>
          <a
            href="#insights"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-white/85 hover:bg-white/[0.04] transition"
          >
            Read our insights
          </a>
        </div>
      </motion.div>
    </section>
  );
}
