'use client';

import { useRef, useState } from 'react';
import { m as motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { useContactModal } from '../contexts/ContactModalContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ease = [0.22, 1, 0.36, 1];

/* ----------------------------- shared bits ----------------------------- */

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-teal">
      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
      {children}
    </span>
  );
}

function useSpotlight() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, o: 0 });
  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, o: 1 });
  };
  const onMouseLeave = () => setPos((s) => ({ ...s, o: 0 }));
  return { ref, pos, onMouseMove, onMouseLeave };
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-70px' },
    transition: { duration: 0.7, ease, delay },
  };
}

/* ---------------------- Hero (Interactive Spotlight) ------------------- */

const HERO_TECH = [
  { label: 'AI & ML', x: '58%', y: '22%', d: 0.0, dur: 9 },
  { label: 'Salesforce', x: '82%', y: '30%', d: 0.5, dur: 11 },
  { label: 'Snowflake', x: '66%', y: '52%', d: 1.0, dur: 10 },
  { label: 'Data Engineering', x: '84%', y: '64%', d: 0.7, dur: 12 },
  { label: 'DevOps', x: '60%', y: '78%', d: 0.3, dur: 10.5 },
];

function FloatingTech({ t, isLight }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: t.x, top: t.y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
      transition={{
        opacity: { duration: 0.7, ease, delay: 0.6 + t.d },
        scale: { duration: 0.7, ease, delay: 0.6 + t.d },
        y: { duration: t.dur, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ${isLight ? 'border border-black/10 bg-black/[0.05] text-slate-600' : 'border border-white/10 bg-white/[0.05] text-white/80'}`}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#90eb61,#24baac)' }} />
        {t.label}
      </span>
    </motion.div>
  );
}

function Hero({ isLight }) {
  const sp = useSpotlight();
  return (
    <section
      ref={sp.ref}
      onMouseMove={sp.onMouseMove}
      onMouseLeave={sp.onMouseLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6"
    >
      {/* background */}
      <div aria-hidden className="absolute inset-0">
        {/* base glows */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 50% at 18% 40%, rgba(36,186,172,0.18), transparent 65%),' +
              'radial-gradient(45% 45% at 85% 30%, rgba(144,235,97,0.12), transparent 70%)',
          }}
        />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 10%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 10%, transparent 75%)',
          }}
        />
        {/* animated gradient beams */}
        <motion.div
          className="absolute -inset-x-1/4 top-1/3 h-40 -rotate-12 blur-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(36,186,172,0.18), transparent)' }}
          animate={{ x: ['-10%', '10%', '-10%'], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -inset-x-1/4 top-1/2 h-32 rotate-12 blur-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(144,235,97,0.14), transparent)' }}
          animate={{ x: ['8%', '-8%', '8%'], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* mouse-follow spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            opacity: sp.pos.o,
            background: `radial-gradient(520px circle at ${sp.pos.x}% ${sp.pos.y}%, rgba(36,186,172,0.16), transparent 60%)`,
          }}
        />
      </div>

      {/* floating tech cards - desktop */}
      <div aria-hidden className="absolute inset-0 hidden lg:block">
        {HERO_TECH.map((t) => (
          <FloatingTech key={t.label} t={t} isLight={isLight} />
        ))}
      </div>

      {/* left-aligned content */}
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease, delay: 0.15 }}
            className={`mt-7 text-left font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl md:text-7xl ${isLight ? 'text-slate-900' : ''}`}
          >
            Built with Purpose.
            <br />
            <span className="text-gradient-gt">Driven by Innovation.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className={`mt-7 max-w-xl text-left text-sm leading-relaxed md:text-base ${isLight ? 'text-slate-500' : 'text-white/60'}`}
          >
            We make world-class technology accessible from anywhere - building AI, Salesforce, Snowflake,
            and Data Engineering solutions while creating meaningful opportunities for talent to grow.
          </motion.p>

          {/* tech badges - mobile / tablet */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-2 lg:hidden"
          >
            {HERO_TECH.map((t) => (
              <span
                key={t.label}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${isLight ? 'border border-black/10 bg-black/[0.05] text-slate-600' : 'border border-white/10 bg-white/[0.05] text-white/75'}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#90eb61,#24baac)' }} />
                {t.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Our Story ------------------------------ */

function OurStory({ isLight }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div {...fade()}>
          <h2 className={`font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl ${isLight ? 'text-slate-900' : ''}`}>
            From a simple question to a mission.
          </h2>
          <div className={`mt-6 space-y-4 text-sm leading-relaxed md:text-[15px] ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
            <p>Genufy was born from the real challenges faced by passionate individuals from rural India.</p>
            <p>
              Instead of accepting that opportunities existed only in major cities, we asked a different
              question.
            </p>
            <p>
              Today, we help organizations embrace digital transformation through modern technologies -
              while continuing our mission of empowering talent, innovation, and growth from anywhere.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fade(0.1)}
          className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm md:p-10 ${isLight ? 'border border-black/10 bg-black/[0.03]' : 'border border-white/10 bg-white/[0.03]'}`}
        >
          <div
            aria-hidden
            className="absolute -top-20 -right-16 h-56 w-56 rounded-full blur-3xl opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.6), transparent 70%)' }}
          />
          <div className="relative">
            <span className="font-display text-5xl leading-none text-lime/40">"</span>
            <p className={`-mt-3 font-display text-2xl font-semibold leading-snug tracking-tight md:text-[26px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Why should talent move to opportunity when{' '}
              <span className="text-gradient-gt">opportunity can move to talent?</span>
            </p>
            <p className={`mt-6 text-sm ${isLight ? 'text-slate-500' : 'text-white/55'}`}>That idea became Genufy.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------- Why Rural Matters -------------------------- */

const RURAL = [
  { icon: '🌱', title: 'Create Local Opportunities', desc: 'Helping talented individuals build meaningful careers without leaving their hometowns.' },
  { icon: '🔓', title: 'Expand Access', desc: 'Making technology careers accessible to communities that have traditionally had fewer opportunities.' },
  { icon: '🤝', title: 'Empower Communities', desc: 'Creating long-term economic and social impact through technology employment.' },
  { icon: '🌍', title: 'Bridge the Opportunity Gap', desc: 'Connecting rural talent with global opportunities and modern digital careers.' },
];

function RuralStep({ s, i, isLight }) {
  const onLeft = i % 2 === 1;
  return (
    <li className="relative pb-10 last:pb-0">
      <div className="absolute left-[22px] top-1 z-10 -translate-x-1/2 md:left-1/2">
        <div className="relative grid h-11 w-11 place-items-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.5), transparent 70%)' }}
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.16, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
          <div className={`relative grid h-11 w-11 place-items-center rounded-full text-lg ${isLight ? 'border border-black/15 bg-white' : 'border border-white/15 bg-[#070c0e]'}`}>
            {s.icon}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: onLeft ? -26 : 26, y: 16 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-70px' }}
        transition={{ duration: 0.6, ease }}
        className={`group relative overflow-hidden rounded-3xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 md:w-[calc(50%-2.75rem)] ${onLeft ? 'md:mr-auto' : 'md:ml-auto'} ml-16 md:ml-0 ${isLight ? 'border border-black/10 bg-black/[0.03]' : 'border border-white/10 bg-white/[0.03]'}`}
      >
        <div
          aria-hidden
          className="absolute -top-16 -right-12 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: 'radial-gradient(circle, #90eb61, transparent 70%)' }}
        />
        <div className="relative">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime/80">
            {String(i + 1).padStart(2, '0')}
          </div>
          <h3 className={`mt-2 font-display text-lg font-semibold md:text-xl ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/55'}`}>{s.desc}</p>
        </div>
      </motion.div>
    </li>
  );
}

function WhyRuralMatters({ isLight }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <motion.div {...fade()} className="text-center">
        <h2 className={`mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl ${isLight ? 'text-slate-900' : ''}`}>
          Great talent exists everywhere. <span className="text-gradient-gt">Opportunity should too.</span>
        </h2>
      </motion.div>

      <ol className="relative mx-auto mt-10 max-w-5xl">
        <motion.div
          aria-hidden
          className="absolute bottom-6 left-[22px] top-2 w-px origin-top -translate-x-1/2 md:left-1/2"
          style={{ background: 'linear-gradient(180deg, rgba(144,235,97,0.55), rgba(36,186,172,0.2))' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease }}
        />
        {RURAL.map((s, i) => (
          <RuralStep key={s.title} s={s} i={i} isLight={isLight} />
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------ Our Values ----------------------------- */

const VALUES = [
  { title: 'Honour Every Voice', desc: 'Great ideas can come from anyone.', accent: '#90eb61' },
  { title: 'Thrive With Our Clients', desc: 'We grow when our clients succeed.', accent: '#24baac' },
  { title: 'Succeed Together', desc: 'Collaboration creates stronger outcomes.', accent: '#38bdf8' },
  { title: 'Lead With Integrity', desc: 'Trust, transparency, and accountability guide every action.', accent: '#a78bfa' },
];

function ValueTile({ v, i, isLight }) {
  const sp = useSpotlight();
  return (
    <motion.div
      ref={sp.ref}
      onMouseMove={sp.onMouseMove}
      onMouseLeave={sp.onMouseLeave}
      {...fade(i * 0.08)}
      className={`group relative overflow-hidden rounded-3xl p-7 backdrop-blur-sm md:p-8 ${isLight ? 'border border-black/10 bg-black/[0.03]' : 'border border-white/10 bg-white/[0.03]'}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{ opacity: sp.pos.o, background: `radial-gradient(300px circle at ${sp.pos.x}% ${sp.pos.y}%, ${v.accent}1f, transparent 60%)` }}
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: `radial-gradient(circle, ${v.accent}, transparent 70%)` }}
      />
      <div className="relative flex items-start gap-4">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold ${isLight ? 'border border-black/10' : 'border border-white/10'}`}
          style={{ background: `linear-gradient(135deg, ${v.accent}26, transparent)`, color: v.accent }}
        >
          {String(i + 1).padStart(2, '0')}
        </div>
        <div>
          <h3 className={`font-display text-lg font-semibold md:text-xl ${isLight ? 'text-slate-900' : 'text-white'}`}>{v.title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/55'}`}>{v.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function OurValues({ isLight }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <motion.div {...fade()} className="text-center">
        <h2 className={`font-display text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-900' : ''}`}>What we stand for</h2>
        <p className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-[15px] ${isLight ? 'text-slate-500' : 'text-white/55'}`}>
          The principles that guide every decision, partnership, and innovation.
        </p>
      </motion.div>
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {VALUES.map((v, i) => (
          <ValueTile key={v.title} v={v} i={i} isLight={isLight} />
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Why Choose Genufy ------------------------- */

const CHOOSE = [
  { icon: '🤝', title: 'Trusted Partnership', desc: 'We build long-term relationships, not one-time projects.', accent: '#24baac' },
  { icon: '✨', title: 'Quality First', desc: 'Every solution is engineered with reliability, scalability, and excellence.', accent: '#90eb61' },
  { icon: '⚡', title: 'Innovation Driven', desc: 'We leverage emerging technologies to solve modern business challenges.', accent: '#38bdf8' },
  { icon: '⏱️', title: 'On-Time Delivery', desc: 'Consistent execution backed by transparent communication and dependable timelines.', accent: '#fbbf24' },
];

function ChooseCard({ c, i, isLight }) {
  const sp = useSpotlight();
  return (
    <motion.div
      ref={sp.ref}
      onMouseMove={sp.onMouseMove}
      onMouseLeave={sp.onMouseLeave}
      {...fade(i * 0.07)}
      className={`group relative overflow-hidden rounded-3xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${isLight ? 'border border-black/10 bg-black/[0.03]' : 'border border-white/10 bg-white/[0.03]'}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${c.accent}, transparent 60%)`,
          padding: 1,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{ opacity: sp.pos.o, background: `radial-gradient(240px circle at ${sp.pos.x}% ${sp.pos.y}%, ${c.accent}22, transparent 60%)` }}
      />
      <div className="relative">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${isLight ? 'border border-black/10' : 'border border-white/10'}`}
          style={{ background: `linear-gradient(135deg, ${c.accent}26, transparent)` }}
        >
          {c.icon}
        </div>
        <h3 className={`mt-5 font-display text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.title}</h3>
        <p className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/55'}`}>{c.desc}</p>
      </div>
    </motion.div>
  );
}

function WhyChoose({ isLight }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <motion.div {...fade()} className="text-center">
        <h2 className={`mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl ${isLight ? 'text-slate-900' : ''}`}>
          Why organizations choose Genufy
        </h2>
        <p className={`mx-auto mt-4 max-w-2xl text-sm leading-relaxed md:text-[15px] ${isLight ? 'text-slate-500' : 'text-white/55'}`}>
          We combine technology expertise, business understanding, and a people-first mindset to deliver
          solutions that create measurable impact.
        </p>
      </motion.div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CHOOSE.map((c, i) => (
          <ChooseCard key={c.title} c={c} i={i} isLight={isLight} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Closing CTA ---------------------------- */

function ClosingCTA({ isLight }) {
  const { openContact } = useContactModal();
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <motion.div
        {...fade()}
        className={`relative overflow-hidden rounded-[2rem] px-6 py-16 text-center md:px-12 md:py-20 ${isLight ? 'border border-black/10' : 'border border-white/10'}`}
        style={{
          background:
            'radial-gradient(80% 120% at 50% 0%, rgba(36,186,172,0.22), transparent 60%),' +
            'radial-gradient(60% 100% at 80% 100%, rgba(144,235,97,0.16), transparent 60%),' +
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(36,186,172,0.6) 30%, rgba(144,235,97,0.6) 70%, transparent)' }}
        />
        <h2 className={`mx-auto max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl ${isLight ? 'text-slate-900' : ''}`}>
          Technology is what we build.{' '}
          <span className="text-gradient-gt">Opportunities are what we create.</span>
        </h2>
        <p className={`mx-auto mt-6 max-w-2xl text-sm leading-relaxed md:text-base ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
          Whether you're looking to transform your business, scale your digital capabilities, or build
          the future with us, Genufy is ready to help you move forward.
        </p>
        <motion.button
          type="button"
          onClick={openContact}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-9 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-black transition hover:brightness-110"
          style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)', boxShadow: '0 10px 40px -10px rgba(36,186,172,0.6)' }}
        >
          Let's Build Together
          <span aria-hidden>→</span>
        </motion.button>
      </motion.div>
    </section>
  );
}

/* -------------------------------- Page --------------------------------- */

export default function AboutUs() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <>
      <Header />
      <main className={`relative z-10 overflow-hidden ${isLight ? 'bg-white' : 'bg-ink'}`}>
        <Hero isLight={isLight} />
        <OurStory isLight={isLight} />
        <WhyRuralMatters isLight={isLight} />
        <OurValues isLight={isLight} />
        <WhyChoose isLight={isLight} />
        <ClosingCTA isLight={isLight} />
      </main>
      <SiteFooter />
    </>
  );
}
