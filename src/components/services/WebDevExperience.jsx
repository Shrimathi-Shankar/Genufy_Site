import { useEffect, useRef, useState } from 'react';
import {
  m as motion,
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
  /* Premium section backdrop - a slowly drifting aurora mesh tinted by the
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
              text="Our expertise spans full-stack development, cloud-native architectures, headless CMS, and performance-driven UI/UX - delivering fast, secure, SEO-optimized, and conversion-focused web experiences."
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
  /* CMS & Headless CMS - an API-first content console: one structured content
     set is delivered to every channel through the content API, each surface
     rendering live, with an edge cache-hit gauge. */
  const channels = [
    { ch: 'web', label: 'marketing site · rendered' },
    { ch: 'mobile', label: 'iOS / Android · synced' },
    { ch: 'app', label: 'web app · cached' },
    { ch: 'email', label: 'campaign · delivered' },
    { ch: 'kiosk', label: 'in-store · live' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Headless CMS</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Omnichannel Content</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">GET /content</span>
        </div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {channels.map((c, i) => (
          <motion.div
            key={c.ch}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-lg border bg-white/[0.03] px-3 py-2"
            style={{ borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <span className="w-12 shrink-0 text-[9px] tracking-[0.2em] uppercase text-white/45">{c.ch}</span>
            <span className="flex-1 truncate text-white/85">{c.label}</span>
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#90eb61', boxShadow: '0 0 8px #90eb61' }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] tracking-[0.4em] uppercase text-white/45">Edge cache hit · 30d</div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }} initial={{ width: '0%' }} whileInView={{ width: '96%' }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
          <span>1.2M reqs</span>
          <span>120ms p95</span>
        </div>
      </div>

    </div>
  );
}

function APIMicroservicesVisual({ accent }) {
  /* API & Microservices - a live API gateway console: each microservice exposes
     a REST/GraphQL endpoint behind JWT auth, with health and latency, plus an
     overall success-rate gauge. */
  const services = [
    { name: 'auth-svc', ep: 'POST /token', ms: '38ms' },
    { name: 'orders-svc', ep: 'POST /orders', ms: '52ms' },
    { name: 'catalog-svc', ep: 'GET /catalog', ms: '44ms' },
    { name: 'search-svc', ep: 'GET /search', ms: '61ms' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">API Gateway · JWT</div>
          <div className="mt-1 font-display text-xl md:text-2xl">REST · GraphQL</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">4 svc</span>
        </div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {services.map((s, i) => {
          const get = s.ep.startsWith('GET');
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <span className="rounded px-1.5 py-0.5 text-[8px] font-semibold text-black" style={{ background: get ? '#90eb61' : accent }}>{get ? 'GET' : 'POST'}</span>
              <span className="flex-1 truncate text-white/85">
                {s.ep.replace(/^(GET|POST)\s/, '')}
                <span className="text-white/40"> · {s.name}</span>
              </span>
              <span className="text-white/45">{s.ms}</span>
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: '#90eb61', boxShadow: '0 0 8px #90eb61' }}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] tracking-[0.4em] uppercase text-white/45">Success rate · 24h</div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }} initial={{ width: '0%' }} whileInView={{ width: '99%' }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
          <span>1.2k req/s</span>
          <span>99.98% · 200 OK</span>
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
