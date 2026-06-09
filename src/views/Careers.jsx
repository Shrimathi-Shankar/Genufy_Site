'use client';

import { m as motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import CareerForm from '../components/careers/CareerForm.jsx';

const ease = [0.22, 1, 0.36, 1];

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 40% at 50% 0%, rgba(36,186,172,0.16) 0%, transparent 60%),' +
            'radial-gradient(45% 35% at 85% 20%, rgba(144,235,97,0.10) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse 70% 45% at 50% 12%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 45% at 50% 12%, black 20%, transparent 80%)',
        }}
      />
    </>
  );
}

export default function Careers() {
  return (
    <>
      <Header />

      <main className="relative z-10 overflow-hidden">
        <Backdrop />

        <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.5em] text-lime">Careers</p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
              Career Opportunities at <span className="text-gradient-gt">Genufy</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              We build intelligent digital platforms with people who care about craft, curiosity, and
              impact. If that sounds like you, we'd love to hear from you.
            </p>
          </motion.header>

          {/* Positive "no open positions" message */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
            className="mx-auto mt-16 max-w-2xl text-center md:mt-24"
          >
            <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold leading-tight tracking-tight text-gradient-gt md:text-[28px]">
              No open positions right now - but the best connections start early.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/60 md:text-[15px]">
              Great opportunities start with great connections. Share your profile, and we'll reach out when the right role opens.
            </p>
          </motion.div>

          {/* Application form */}
          <section id="apply" className="mx-auto mt-16 max-w-3xl md:mt-24">
            <h2 className="mb-6 text-center font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Tell us about yourself
            </h2>
            <CareerForm />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
