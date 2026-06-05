'use client';

import { motion } from 'framer-motion';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

const ease = [0.22, 1, 0.36, 1];

// Shared "Coming Soon" placeholder used by the lightweight pages (Careers,
// About Us, Partners, …). Pass an `eyebrow` (the section name shown above the
// heading) and a `blurb` (the supporting line) - the layout/animation stay
// identical across every placeholder page.
export default function ComingSoon({ eyebrow, blurb }) {
  return (
    <>
      <Header />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Ambient brand glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 40%, rgba(36,186,172,0.16) 0%, transparent 65%),' +
              'radial-gradient(40% 35% at 50% 70%, rgba(144,235,97,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Fine dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 80%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="relative"
        >
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.5em] text-lime">
            {eyebrow}
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-gradient-gt">Coming Soon</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
            {blurb}
          </p>

          <motion.div
            aria-hidden
            className="mx-auto mt-8 h-px w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', transformOrigin: 'center' }}
          />

          <a
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
          >
            <span aria-hidden>←</span> Back to Home
          </a>
        </motion.div>
      </main>

      <SiteFooter />
    </>
  );
}
