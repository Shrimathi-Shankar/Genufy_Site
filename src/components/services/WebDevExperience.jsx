import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HERO_TITLE_CLASS } from './heroTitle.js';
import MagneticButton from '../MagneticButton.jsx';
import CinematicContact from '../CinematicContact.jsx';

/* ---------------- Shared atoms ---------------- */

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const wordIn = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
  show: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

function RevealWords({ text, className, once = true, gradient = false }) {
  const words = String(text).split(/(\s+)/);
  return (
    <motion.span
      variants={wordContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span variants={wordIn} className={gradient ? 'text-gradient-gt' : undefined} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/45">
      <span className="h-px w-10 bg-white/30" />
      {children}
    </div>
  );
}

function FeatureItem({ children, accent }) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 backdrop-blur-sm">
      <span
        className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full text-[10px] font-bold text-black"
        style={{ background: `linear-gradient(135deg, #90eb61, ${accent})` }}
      >
        ✓
      </span>
      <span className="text-white/85 text-[15px] md:text-base leading-relaxed">{children}</span>
    </li>
  );
}

function StaggerFeatures({ items, accent }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
      className="space-y-3"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18 },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <FeatureItem accent={accent}>{it}</FeatureItem>
        </motion.div>
      ))}
    </motion.ul>
  );
}

function FloatingOrbs({ accent }) {
  /* Premium section backdrop — a slowly drifting aurora mesh tinted by the
     section accent, layered with soft floating orbs. Kept low-opacity and
     blurred so it adds depth and domain identity without ever competing with
     the foreground text. */
  const orbs = [
    { top: '8%', left: '4%', size: 380, dur: 16, c: accent },
    { top: '58%', left: '70%', size: 460, dur: 20, c: '#90eb61' },
    { top: '34%', left: '42%', size: 300, dur: 14, c: accent },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{ filter: 'blur(44px)' }}
        animate={{
          background: [
            `radial-gradient(50% 60% at 18% 22%, ${accent}26, transparent 60%), radial-gradient(46% 56% at 82% 72%, rgba(144,235,97,0.16), transparent 62%)`,
            `radial-gradient(50% 60% at 78% 26%, ${accent}26, transparent 60%), radial-gradient(46% 56% at 22% 74%, rgba(144,235,97,0.16), transparent 62%)`,
            `radial-gradient(50% 60% at 40% 78%, ${accent}26, transparent 60%), radial-gradient(46% 56% at 64% 22%, rgba(144,235,97,0.16), transparent 62%)`,
            `radial-gradient(50% 60% at 18% 22%, ${accent}26, transparent 60%), radial-gradient(46% 56% at 82% 72%, rgba(144,235,97,0.16), transparent 62%)`,
          ],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      {orbs.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-25"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.c} 0%, transparent 70%)`,
          }}
          animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.07] pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
        backgroundSize: '70px 70px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
      }}
    />
  );
}

function DataParticles({ count = 36, accent = '#24baac' }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    x: (i * 41) % 100,
    y: (i * 67) % 100,
    size: 2 + ((i * 5) % 4),
    dur: 6 + ((i * 3) % 8),
    delay: (i * 0.3) % 5,
    binary: i % 5 === 0,
  }));
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) =>
        d.binary ? (
          <motion.span
            key={i}
            className="absolute font-mono text-[10px] tracking-widest text-white/35"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            animate={{ opacity: [0.1, 0.6, 0.1], y: [0, -28, 0] }}
            transition={{ duration: d.dur, repeat: Infinity, ease: 'easeInOut', delay: d.delay }}
          >
            {(i * 137).toString(2).slice(-6)}
          </motion.span>
        ) : (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              background: i % 3 === 0 ? '#90eb61' : accent,
              boxShadow: `0 0 ${d.size * 4}px ${accent}`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -30, 0] }}
            transition={{ duration: d.dur, repeat: Infinity, ease: 'easeInOut', delay: d.delay }}
          />
        )
      )}
    </div>
  );
}

function NetworkMesh({ accent }) {
  const nodes = [
    { x: 15, y: 30 }, { x: 35, y: 70 }, { x: 60, y: 20 },
    { x: 80, y: 55 }, { x: 50, y: 50 }, { x: 25, y: 85 },
    { x: 90, y: 80 },
  ];
  const edges = [[0, 4], [4, 2], [2, 3], [4, 1], [1, 5], [3, 6], [4, 6]];
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
      <defs>
        <linearGradient id="webMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#90eb61" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#webMesh)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
      ))}
      {edges.map(([a, b], i) => (
        <motion.circle
          key={`p-${i}`}
          r="0.5"
          fill={accent}
          initial={{ cx: nodes[a].x, cy: nodes[a].y }}
          animate={{ cx: [nodes[a].x, nodes[b].x, nodes[a].x], cy: [nodes[a].y, nodes[b].y, nodes[a].y] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          style={{ filter: `drop-shadow(0 0 1.5px ${accent})` }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={`n-${i}`} cx={n.x} cy={n.y} r="0.6" fill="#fff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }} />
      ))}
    </svg>
  );
}

/* ---------------- Hero ---------------- */

function HeroScene({ service }) {
  const letters = Array.from('WEB DEV');
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 50, damping: 18 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 50, damping: 18 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[110vh] flex flex-col justify-end px-6 md:px-12 pb-24 pt-44 overflow-hidden"
    >
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120vmin] w-[120vmin] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, #24baac55 0%, ${service.accent}33 45%, transparent 75%)` }}
      />

      <DataParticles accent={service.accent} count={44} />

      <motion.div style={{ x: tx, y: ty }} className="relative max-w-7xl mx-auto w-full">

        <h1
          aria-label="Web Development"
          className={HERO_TITLE_CLASS}
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { delayChildren: 0.2, staggerChildren: 0.06 } } }}
            className="inline-flex"
            style={{ overflow: 'visible' }}
          >
            {letters.map((ch, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 0.9 }}>
                <motion.span
                  variants={{
                    hidden: { y: '110%', opacity: 0, filter: 'blur(14px)', rotate: -4 },
                    show: { y: 0, opacity: 1, filter: 'blur(0px)', rotate: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className={i < 3 ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow: i < 3 ? 'none' : 'none',
                  }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] items-end">
          <div className="max-w-2xl">
            <RevealWords
              text="Scalable, High-Performance Web Solutions for Digital Growth"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="We help businesses accelerate digital growth by building secure, scalable web solutions that deliver exceptional user experiences."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="Our expertise covers enterprise applications, e-commerce platforms, API-driven architectures, and modern full-stack development focused on performance, SEO, and conversions."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            {/* <RevealWords
              text="Our expertise spans full-stack development, cloud-native architectures, headless CMS, and performance-driven UI/UX — delivering fast, secure, SEO-optimized, and conversion-focused web experiences."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            /> */}
          </div>

          {/* <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-[10px] tracking-[0.4em] uppercase text-white/40 flex items-center gap-3"
          >
            Scroll
            <span className="relative inline-block h-10 w-[2px] overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 rounded-full"
                style={{ background: 'linear-gradient(180deg, #90eb61, #24baac)' }}
                animate={{ y: [-12, 40] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.div> */}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Section visuals ---------------- */

function CustomAppVisual({ accent }) {
  const tree = [
    { d: 0, label: '<App />' },
    { d: 1, label: '<Layout />' },
    { d: 2, label: '<Header />' },
    { d: 2, label: '<Sidebar />' },
    { d: 2, label: '<Dashboard />' },
    { d: 3, label: '<MetricsGrid />' },
    { d: 3, label: '<ChartPanel />' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Component Tree</div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
      </div>
      <div className="mt-5 space-y-1.5 font-mono text-[12px]">
        {tree.map((t, i) => (
          <motion.div
            key={t.label + i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="flex items-center gap-2"
            style={{ paddingLeft: t.d * 16 }}
          >
            <span className="text-white/40">{t.d === 0 ? '◆' : '›'}</span>
            <span className={t.d <= 1 ? 'text-emerald-300' : t.d === 2 ? 'text-sky-200' : 'text-white/80'}>{t.label}</span>
            {i === tree.length - 1 && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-3 bg-white/90 ml-1 align-middle"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { k: 'LCP', v: '0.9s' },
          { k: 'TBT', v: '40ms' },
          { k: 'CLS', v: '0.02' },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] py-2 text-center"
            style={{ boxShadow: `0 0 20px -12px ${accent}aa` }}
          >
            <div className="text-[9px] tracking-[0.3em] uppercase text-white/45">{m.k}</div>
            <div className="font-display text-base text-white">{m.v}</div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

function EcommerceVisual({ accent }) {
  const products = [
    { name: 'Linen Tee', price: '$48' },
    { name: 'Wool Coat', price: '$280' },
    { name: 'Leather Bag', price: '$190' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Storefront · Headless</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Checkout · Live</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] tracking-[0.3em] uppercase font-mono text-white/70">
          Cart · 3
        </motion.div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="rounded-2xl border border-white/12 bg-white/[0.04] p-3"
            style={{ boxShadow: `0 0 24px -14px ${accent}cc` }}
          >
            <div
              className="h-20 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${i % 2 ? '#1f2937' : '#0f172a'}, ${accent}33)`,
              }}
            />
            <div className="mt-2 text-[11px] text-white/85 truncate">{p.name}</div>
            <div className="text-[12px] font-display text-gradient-gt">{p.price}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45">Conversion · 7d</div>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '64%'] }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/55 font-mono">
          <span>3.8% CVR</span>
          <span>AOV · $164</span>
        </div>
      </div>

    </div>
  );
}

function HeadlessCMSVisual({ accent }) {
  /* CMS & Headless CMS — structured content authored once is delivered through
     a content API and rendered responsively across devices. A realistic web
     app renders content blocks on desktop, the same content reflows on mobile,
     and delivery pulses stream from the content API into both surfaces. */
  const reveal = (i) => ({
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full opacity-25"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`, filter: 'blur(46px)' }}
      />

      {/* content-API delivery connectors */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="cmsG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#90eb61" />
          </linearGradient>
        </defs>
        <line x1="86" y1="15" x2="40" y2="34" stroke="url(#cmsG)" strokeWidth="0.35" strokeDasharray="1.6 1.4" opacity="0.5" />
        <line x1="86" y1="15" x2="84" y2="68" stroke="url(#cmsG)" strokeWidth="0.35" strokeDasharray="1.6 1.4" opacity="0.5" />
        <motion.circle r="0.9" fill="#90eb61" style={{ filter: `drop-shadow(0 0 2px ${accent})` }} animate={{ cx: [86, 40], cy: [15, 34], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle r="0.9" fill="#90eb61" style={{ filter: `drop-shadow(0 0 2px ${accent})` }} animate={{ cx: [86, 84], cy: [15, 68], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
      </svg>

      {/* content API source */}
      <motion.div
        {...reveal(0)}
        className="absolute right-[5%] top-[6%] rounded-lg border border-white/12 bg-black/70 px-2.5 py-1.5 backdrop-blur-xl"
        style={{ boxShadow: `0 0 24px -10px ${accent}` }}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[12px]" style={{ color: accent }}>{'{ }'}</span>
          <span className="font-mono text-[9px] text-white/65">/content</span>
        </div>
      </motion.div>

      {/* desktop browser rendering CMS content */}
      <motion.div
        {...reveal(1)}
        className="absolute left-[4%] top-[11%] w-[70%] overflow-hidden rounded-xl border border-white/12 bg-black/70 backdrop-blur-xl"
        style={{ boxShadow: '0 30px 70px -30px rgba(0,0,0,0.85)' }}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <div className="ml-2 h-2.5 flex-1 rounded-full bg-white/[0.06]" />
        </div>
        <div className="relative space-y-2 p-2.5">
          {/* nav */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ background: `linear-gradient(135deg, #90eb61, ${accent})` }} />
            <div className="h-1 w-6 rounded-full bg-white/20" />
            <div className="h-1 w-6 rounded-full bg-white/12" />
            <div className="h-1 w-6 rounded-full bg-white/12" />
            <div className="ml-auto h-3 w-8 rounded-full" style={{ background: `${accent}33`, border: `1px solid ${accent}66` }} />
          </div>
          {/* hero */}
          <div className="relative h-14 overflow-hidden rounded-lg border border-white/10" style={{ background: `linear-gradient(135deg, ${accent}22, rgba(144,235,97,0.10))` }}>
            <div className="absolute left-2 top-2 h-1.5 w-1/2 rounded-full bg-white/35" />
            <div className="absolute left-2 top-5 h-1 w-2/3 rounded-full bg-white/18" />
            <div className="absolute bottom-2 left-2 h-3 w-10 rounded-full" style={{ background: `linear-gradient(90deg, #90eb61, ${accent})` }} />
          </div>
          {/* content grid */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((k) => (
              <motion.div key={k} {...reveal(2 + k)} className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5">
                <div className="h-7 rounded" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.06), ${accent}22)` }} />
                <div className="mt-1.5 h-1 w-3/4 rounded-full bg-white/22" />
                <div className="mt-1 h-1 w-1/2 rounded-full bg-white/12" />
              </motion.div>
            ))}
          </div>
          {/* render shimmer */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}22, transparent)` }}
            animate={{ x: ['-120%', '320%'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* mobile rendering the same content (responsive) */}
      <motion.div
        {...reveal(3)}
        className="absolute bottom-[7%] right-[6%] w-[22%] overflow-hidden rounded-[1.1rem] border border-white/15 bg-black/85 backdrop-blur-xl"
        style={{ boxShadow: `0 24px 50px -24px ${accent}` }}
      >
        <div className="mx-auto mt-1.5 h-1 w-6 rounded-full bg-white/20" />
        <div className="space-y-1.5 p-1.5">
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded" style={{ background: `linear-gradient(135deg, #90eb61, ${accent})` }} />
            <div className="h-1 flex-1 rounded-full bg-white/14" />
          </div>
          <div className="h-10 rounded-md border border-white/10" style={{ background: `linear-gradient(135deg, ${accent}22, rgba(144,235,97,0.10))` }} />
          {[0, 1].map((k) => (
            <div key={k} className="rounded-md border border-white/10 bg-white/[0.03] p-1.5">
              <div className="h-5 rounded" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.06), ${accent}22)` }} />
              <div className="mt-1 h-1 w-3/4 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function APIMicroservicesVisual({ accent }) {
  /* API & Microservices — a request flows from the client through an
     authenticated API gateway (JWT) and is routed to backend microservices,
     each backed by its own datastore. Data flows across every hop and a live
     request log streams real API activity. */
  const services = [
    { name: 'auth-svc', y: 20, ms: '38ms' },
    { name: 'orders-svc', y: 44, ms: '52ms' },
    { name: 'catalog-svc', y: 68, ms: '44ms' },
  ];
  const CX = 12;
  const CY = 30;
  const GX = 33;
  const GY = 50;
  const SXL = 60; // service card left edge (%)
  const logs = [
    { m: 'POST', p: '/orders', ms: '52ms' },
    { m: 'GET', p: '/catalog', ms: '44ms' },
    { m: 'POST', p: '/auth/token', ms: '38ms' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />

      {/* links + flowing data */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="msG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#90eb61" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* client → gateway */}
        <line x1={CX} y1={CY} x2={GX} y2={GY} stroke="url(#msG)" strokeWidth="0.4" strokeDasharray="1.6 1.3" />
        <motion.circle r="0.9" fill="#90eb61" style={{ filter: `drop-shadow(0 0 2px ${accent})` }} animate={{ cx: [CX, GX], cy: [CY, GY], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
        {/* gateway → services + service → datastore */}
        {services.map((s, i) => (
          <g key={i}>
            <line x1={GX} y1={GY} x2={SXL} y2={s.y} stroke="url(#msG)" strokeWidth="0.35" strokeDasharray="1.6 1.3" />
            <line x1="84" y1={s.y} x2="90" y2={s.y} stroke="url(#msG)" strokeWidth="0.35" strokeDasharray="1.4 1.2" opacity="0.7" />
            <motion.circle r="0.85" fill="#90eb61" style={{ filter: `drop-shadow(0 0 2px ${accent})` }} animate={{ cx: [GX, SXL], cy: [GY, s.y], opacity: [0, 1, 0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 }} />
            <motion.circle r="0.7" fill={accent} style={{ filter: 'drop-shadow(0 0 2px #90eb61)' }} animate={{ cx: [SXL, GX], cy: [s.y, GY], opacity: [0, 1, 0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 + 0.9 }} />
            <motion.circle r="0.6" fill="#90eb61" animate={{ cx: [84, 90], cy: [s.y, s.y], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 + 0.4 }} />
          </g>
        ))}
      </svg>

      {/* client (browser) */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${CX}%`, top: `${CY}%` }}>
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-black/60 backdrop-blur-xl" style={{ boxShadow: `0 0 22px -10px ${accent}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#cdebd8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
      </div>

      {/* API gateway — JWT authentication */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${GX}%`, top: `${GY}%` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative w-[112px] rounded-2xl border border-white/20 bg-black/75 p-2.5 backdrop-blur-xl"
          style={{ boxShadow: `0 0 50px -12px ${accent}, inset 0 0 24px rgba(144,235,97,0.08)` }}
        >
          <motion.span aria-hidden className="absolute inset-0 rounded-2xl" animate={{ opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ boxShadow: `0 0 22px 2px ${accent}66` }} />
          <div className="relative flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="url(#msG)" strokeWidth="1.7" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#90eb61" strokeWidth="1.7" />
              <circle cx="12" cy="15.5" r="1.4" fill="#90eb61" />
            </svg>
            <span className="text-[8px] tracking-[0.3em] uppercase text-white/55">Gateway</span>
          </div>
          <div className="relative mt-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1">
            <span className="font-mono text-[8px] text-white/60">JWT</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full w-1/2 rounded-full" style={{ background: `linear-gradient(90deg, #90eb61, ${accent})` }} animate={{ x: ['-60%', '160%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
            <motion.svg width="10" height="10" viewBox="0 0 12 12" fill="none" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <path d="M2 6.5 5 9.5 10 3.5" stroke="#90eb61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </div>
        </motion.div>
      </div>

      {/* microservices + datastores */}
      {services.map((s, i) => (
        <div key={s.name}>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -translate-y-1/2 rounded-xl border border-white/12 bg-black/65 px-2.5 py-2 backdrop-blur-xl"
            style={{ left: `${SXL}%`, top: `${s.y}%`, width: '24%', boxShadow: `0 0 26px -12px ${accent}` }}
          >
            <div className="flex items-center justify-between">
              <span className="truncate font-mono text-[10px] text-white/85">{s.name}</span>
              <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: '#90eb61' }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex items-end gap-0.5">
                {[5, 7, 6].map((h, k) => (
                  <span key={k} className="w-1 rounded-full" style={{ height: h, background: `${accent}aa` }} />
                ))}
              </div>
              <span className="ml-auto font-mono text-[8px] text-white/40">{s.ms}</span>
            </div>
          </motion.div>
          {/* datastore */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '92%', top: `${s.y}%` }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <ellipse cx="9" cy="4" rx="6.5" ry="2.4" stroke="url(#msG)" strokeWidth="1.2" fill="rgba(255,255,255,0.04)" />
              <path d="M2.5 4v12c0 1.3 2.9 2.4 6.5 2.4s6.5-1.1 6.5-2.4V4" stroke="url(#msG)" strokeWidth="1.2" />
              <path d="M2.5 10c0 1.3 2.9 2.4 6.5 2.4s6.5-1.1 6.5-2.4" stroke="url(#msG)" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
        </div>
      ))}

      {/* live API request log */}
      <div className="absolute inset-x-4 bottom-3 rounded-lg border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl">
        <div className="space-y-1">
          {logs.map((l, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 font-mono text-[8px]"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            >
              <span className="rounded px-1 py-0.5 text-[7px] font-semibold text-black" style={{ background: l.m === 'GET' ? '#90eb61' : accent }}>{l.m}</span>
              <span className="text-white/75">{l.p}</span>
              <span className="ml-auto text-white/35">{l.ms}</span>
              <span className="text-emerald-300">200</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SEOVisual({ accent }) {
  const series = [38, 32, 35, 28, 30, 22, 26, 18, 20, 14];
  const keywords = ['cloud migration', 'salesforce dev', 'data integration', 'mlops platform'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Organic Rankings</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Trend · 90d</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          ◉ GA4
        </motion.div>
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-4 h-28 w-full">
        <defs>
          <linearGradient id="seoG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 2 ${series[0]} ${series.map((v, i) => `L ${2 + i * 10} ${v}`).join(' ')}`}
          fill="none"
          stroke={accent}
          strokeWidth="0.7"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={`M 2 ${series[0]} ${series.map((v, i) => `L ${2 + i * 10} ${v}`).join(' ')} L 92 40 L 2 40 Z`}
          fill="url(#seoG)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
      </svg>

      <div className="mt-2 space-y-1.5">
        {keywords.map((k, i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px]"
          >
            <span className="text-white/40">#{i + 2}</span>
            <span className="text-white/85 flex-1 truncate">{k}</span>
            <span className="text-emerald-300">↑ {3 + i}</span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

/* ---------------- ExperienceSection template ---------------- */

function ExperienceSection({ num, eyebrow, title, description, features, benefits, visual, accent, flip = false }) {
  return (
    <section className="relative px-6 md:px-12 py-28 md:py-40">
      <FloatingOrbs accent={accent} />
      <GridBackdrop />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
          <span
            className="font-display text-6xl md:text-8xl font-bold leading-none"
            style={{
              background: `linear-gradient(135deg, ${accent}, #ffffff15)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {num}
          </span>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <div className="grid gap-14 lg:gap-16 lg:grid-cols-12 items-start">
          <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.05]">
              <RevealWords text={title} gradient />
            </h2>
            <p className="mt-8 max-w-2xl text-sm md:text-base text-white/72 leading-relaxed line-clamp-3">
              {description}
            </p>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div>
                <Eyebrow>Key Features</Eyebrow>
                <div className="mt-5">
                  <StaggerFeatures items={features} accent={accent} />
                </div>
              </div>
              <div>
                <Eyebrow>Business Benefits</Eyebrow>
                <div className="mt-5">
                  <StaggerFeatures items={benefits} accent={accent} />
                </div>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''} lg:sticky lg:top-24`}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {visual}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCTA({ accent, onClose }) {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <section className="relative px-6 md:px-12 py-40 md:py-56 overflow-hidden">
      <motion.div
        aria-hidden
        animate={{
          background: [
            `radial-gradient(40% 50% at 30% 40%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 70% 60%, rgba(144,235,97,0.45), transparent 70%)`,
            `radial-gradient(40% 50% at 70% 60%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 30% 40%, rgba(144,235,97,0.45), transparent 70%)`,
            `radial-gradient(40% 50% at 30% 40%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 70% 60%, rgba(144,235,97,0.45), transparent 70%)`,
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -z-10 opacity-50 blur-[60px]"
      />
      <DataParticles accent={accent} count={28} />
      <GridBackdrop />

      <div className="relative max-w-5xl mx-auto text-center">

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Build a Premium Digital Experience?" />
        </h2>
        <RevealWords
          text="Let's engineer fast, secure, and conversion-focused web platforms that grow your business."
          className="block mt-8 max-w-2xl mx-auto text-base md:text-lg text-white/75 leading-relaxed"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            as="button"
            onClick={() => setContactOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-black hover:brightness-110"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
          >
            Talk to Web Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
        </motion.div>
      </div>

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Talk to Web Experts" />
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Custom', 'Commerce', 'CMS', 'API', 'SEO'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      const idx = Math.min(labels.length - 1, Math.floor(p * labels.length * 0.999));
      setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3 pointer-events-none">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-3">
          <span
            className={`text-[10px] tracking-[0.35em] uppercase transition-opacity duration-300 ${i === active ? 'opacity-100 text-white' : 'opacity-40 text-white/70'}`}
          >
            {l}
          </span>
          <span
            className="block h-[2px] rounded-full transition-all duration-500"
            style={{
              width: i === active ? 30 : 14,
              background: i === active ? 'linear-gradient(90deg,#90eb61,#24baac)' : 'rgba(255,255,255,0.25)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Main ---------------- */

export default function WebDevExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#24baac';

  return (
    <>
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Tailored Digital Solutions"
          title="Custom Web Application Development"
          description="Build custom web applications designed to meet unique business needs, combining scalable architecture, modern UI/UX, and high performance to deliver seamless and future-ready digital experiences."
          features={[
            'Modern frontend frameworks: React, Angular, Vue.js',
            'Scalable backend technologies: Node.js, Django, Spring Boot, .NET',
            'Secure authentication & role-based access control',
          ]}
          benefits={[
            'Streamline operations with workflow-driven applications',
            'Improve user experience with responsive and intuitive interfaces',
            'Scale applications seamlessly as business grows',
          ]}
          visual={<CustomAppVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Digital Commerce Excellence"
          title="E-Commerce Development"
          description="Develop scalable and secure e-commerce platforms that deliver seamless shopping experiences, optimized performance, and conversion-driven design to help businesses grow online sales and customer engagement."
          features={[
            'Shopify, Magento, WooCommerce, and custom commerce solutions',
            'Headless commerce architecture with React & Next.js',
            'Secure payment gateway and shipping integrations',
          ]}
          benefits={[
            'Increase online sales and conversion rates',
            'Deliver seamless customer shopping experiences',
            'Simplify product and inventory management',
          ]}
          visual={<EcommerceVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Flexible Content Management"
          title="CMS & Headless CMS Solutions"
          description="Implement modern CMS and headless CMS solutions that enable seamless content delivery across web and digital platforms, ensuring scalability, faster updates, and consistent user experiences."
          features={[
            'Traditional CMS platforms: WordPress, Drupal, Joomla',
            'Headless CMS solutions: Strapi, Contentful, Sanity',
            'API-first content delivery architecture',
          ]}
          benefits={[
            'Simplify content management for business teams',
            'Improve website performance with decoupled architecture',
            'Deliver personalized digital experiences faster',
          ]}
          visual={<HeadlessCMSVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Connected Digital Architecture"
          title="API & Microservices Development"
          description="Design and develop secure, scalable APIs and microservices that enable seamless system integration, faster development, and flexible, cloud-ready application architectures."
          features={[
            'RESTful and GraphQL API development',
            'OAuth2, JWT, and secure API authentication',
            'Microservices architecture with Docker & Kubernetes',
          ]}
          benefits={[
            'Enable seamless system interoperability',
            'Accelerate development using reusable services',
            'Improve scalability and application flexibility',
          ]}
          visual={<APIMicroservicesVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Growth-Driven Visibility"
          title="SEO & Digital Marketing"
          description="Enhance online presence with data-driven SEO and digital marketing strategies that improve search rankings, drive targeted traffic, and increase conversions for sustained business growth."
          features={[
            'SEO audits and technical optimization',
            'Keyword strategy and content marketing',
            'Google Ads, Meta Ads, and LinkedIn campaign management',
          ]}
          benefits={[
            'Improve search engine rankings and online visibility',
            'Generate high-quality leads and customer traffic',
            'Increase ROI with performance-driven campaigns',
          ]}
          visual={<SEOVisual accent={accent} />}
          accent={accent}
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
