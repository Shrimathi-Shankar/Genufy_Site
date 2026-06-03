import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import MagneticButton from '../MagneticButton.jsx';

/* ---------------- Shared atoms (mirror Salesforce experience for consistent feel) ---------------- */

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

function RevealWords({ text, className, once = true }) {
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
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            variants={wordIn}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
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
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
      }}
      className="space-y-3"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
            show: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <FeatureItem accent={accent}>{it}</FeatureItem>
        </motion.div>
      ))}
    </motion.ul>
  );
}

function FloatingOrbs({ accent }) {
  const orbs = [
    { top: '14%', left: '6%', size: 360, dur: 14 },
    { top: '62%', left: '72%', size: 460, dur: 18 },
    { top: '40%', left: '44%', size: 280, dur: 12 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-25"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${i % 2 ? '#24baac' : accent} 0%, transparent 70%)`,
          }}
          animate={{ y: [0, -24, 0], x: [0, 14, 0] }}
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

/* ---------------- Data particles (binary / metadata feel) ---------------- */

function DataParticles({ count = 36, accent = '#90eb61' }) {
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
              background: i % 3 === 0 ? '#24baac' : accent,
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

/* ---------------- Animated network mesh for hero ---------------- */

function NetworkMesh({ accent }) {
  const nodes = [
    { x: 15, y: 30 },
    { x: 35, y: 70 },
    { x: 60, y: 20 },
    { x: 80, y: 55 },
    { x: 50, y: 50 },
    { x: 25, y: 85 },
    { x: 90, y: 80 },
  ];
  const edges = [
    [0, 4],
    [4, 2],
    [2, 3],
    [4, 1],
    [1, 5],
    [3, 6],
    [4, 6],
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full opacity-40"
    >
      <defs>
        <linearGradient id="meshG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#24baac" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#meshG)"
          strokeWidth="0.18"
          strokeDasharray="1.5 1.5"
        />
      ))}
      {edges.map(([a, b], i) => (
        <motion.circle
          key={`p-${i}`}
          r="0.5"
          fill={accent}
          initial={{ cx: nodes[a].x, cy: nodes[a].y }}
          animate={{
            cx: [nodes[a].x, nodes[b].x, nodes[a].x],
            cy: [nodes[a].y, nodes[b].y, nodes[a].y],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
          style={{ filter: `drop-shadow(0 0 1.5px ${accent})` }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r="0.6"
          fill="#fff"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

/* ---------------- Hero ---------------- */

function HeroScene({ service }) {
  const letters = Array.from('INFORMATICA');
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
        style={{
          background: `radial-gradient(circle, #24baac55 0%, ${service.accent}33 45%, transparent 75%)`,
        }}
      />

      <NetworkMesh accent={service.accent} />
      <DataParticles accent={service.accent} count={44} />

      <motion.div style={{ x: tx, y: ty }} className="relative max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 mb-10 text-[10px] tracking-[0.45em] uppercase text-white/65"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
          {service.tag} · Service Detail
        </motion.div>

        <h1
          aria-label="Informatica"
          className="font-display font-bold leading-[0.9] tracking-tight text-[18vw] md:text-[12vw] lg:text-[10.5rem]"
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { delayChildren: 0.2, staggerChildren: 0.05 } },
            }}
            className="inline-flex"
            style={{ overflow: 'visible' }}
          >
            {letters.map((ch, i) => (
              <span
                key={i}
                style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 0.9 }}
              >
                <motion.span
                  variants={{
                    hidden: { y: '110%', opacity: 0, filter: 'blur(14px)', rotate: -4 },
                    show: {
                      y: 0,
                      opacity: 1,
                      filter: 'blur(0px)',
                      rotate: 0,
                      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className={i < 5 ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow:
                      i < 5
                        ? '0 0 60px rgba(36,186,172,0.4), 0 0 120px rgba(144,235,97,0.25)'
                        : 'none',
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] items-end">
          <div className="max-w-2xl">
            <RevealWords
              text="Intelligent Data Integration, Governance, and Cloud Connectivity"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="Informatica empowers organizations to connect, cleanse, govern, and manage data across cloud, hybrid, and on-premise environments."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From data integration and quality to master data management and real-time API orchestration, we help businesses unlock the full potential of their data."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="With trusted, unified, and AI-powered data, you can drive smarter decisions, accelerate innovation, and achieve compliance with ease."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
          </div>

          <motion.div
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Section visuals ---------------- */

function IntegrationPipelineVisual({ accent }) {
  const stages = ['Source', 'Ingest', 'Transform', 'Govern', 'Deliver'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="pipeG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#90eb61" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <line x1="6" y1="50" x2="94" y2="50" stroke="url(#pipeG)" strokeWidth="0.35" strokeDasharray="2 2" />
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            r="0.7"
            fill="#90eb61"
            initial={{ cx: 6, cy: 50 }}
            animate={{ cx: [6, 94, 6] }}
            transition={{
              duration: 5 + i * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
          />
        ))}
      </svg>
      <div className="relative flex h-full items-center justify-between">
        {stages.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl font-display font-bold text-sm"
              style={{ boxShadow: `0 0 28px -6px ${accent}cc`, color: accent }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/70">{s}</div>
          </motion.div>
        ))}
      </div>

      {/* Floating connector cards */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/65"
      >
        Salesforce
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-4 right-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/65"
      >
        Snowflake
      </motion.div>
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute top-4 left-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/65"
      >
        SAP
      </motion.div>
    </div>
  );
}

function GovernanceVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 85%)',
        }}
      />
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 grid place-items-center"
      >
        <div className="relative">
          {[180, 260, 340].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                top: -s / 2,
                left: -s / 2,
                borderColor: i === 1 ? `${accent}99` : 'rgba(36,186,172,0.3)',
                borderStyle: i === 1 ? 'dashed' : 'solid',
              }}
            />
          ))}
        </div>
      </motion.div>
      <div className="absolute inset-0 grid place-items-center">
        <motion.svg
          width="130"
          height="150"
          viewBox="0 0 120 140"
          fill="none"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 24px ${accent})` }}
        >
          <defs>
            <linearGradient id="govG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          <path
            d="M60 5 L110 25 V70 C110 100 88 122 60 134 C32 122 10 100 10 70 V25 Z"
            stroke="url(#govG)"
            strokeWidth="2"
            fill="rgba(255,255,255,0.03)"
          />
          <path
            d="M40 70 L55 85 L82 55"
            stroke="#90eb61"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </div>
      {/* Compliance ribbons */}
      {['GDPR', 'CCPA', 'HIPAA', 'SOC 2'].map((c, i) => (
        <motion.div
          key={c}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          className="absolute rounded-full border border-white/15 bg-black/65 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
          style={{
            top: ['12%', '22%', '78%', '70%'][i],
            left: ['8%', '78%', '12%', '74%'][i],
            boxShadow: `0 0 24px -8px ${accent}cc`,
          }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}

function MDMGoldenRecordVisual({ accent }) {
  const sources = [
    { x: 12, y: 22, label: 'CRM' },
    { x: 88, y: 22, label: 'ERP' },
    { x: 12, y: 80, label: 'Billing' },
    { x: 88, y: 80, label: 'Support' },
    { x: 50, y: 8, label: 'Marketing' },
    { x: 50, y: 92, label: 'Commerce' },
  ];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="mdmG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#24baac" />
          </linearGradient>
        </defs>
        {sources.map((s, i) => (
          <g key={i}>
            <line x1="50" y1="50" x2={s.x} y2={s.y} stroke="url(#mdmG)" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
            <motion.circle
              r="0.7"
              fill={accent}
              initial={{ cx: s.x, cy: s.y }}
              animate={{ cx: [s.x, 50, s.x], cy: [s.y, 50, s.y] }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
              style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
            />
          </g>
        ))}
      </svg>
      {sources.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/85"
          style={{ left: `${s.x}%`, top: `${s.y}%`, boxShadow: `0 0 28px -8px ${accent}cc` }}
        >
          {s.label}
        </motion.div>
      ))}
      {/* Golden record */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-36 w-36 md:h-44 md:w-44 rounded-full grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04] text-center"
          style={{
            boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)`,
          }}
        >
          <div>
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Golden</div>
            <div className="mt-1 font-display text-2xl md:text-3xl text-gradient-gt">Record</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CatalogScanVisual({ accent }) {
  const rows = ['accounts', 'orders', 'customers', 'invoices', 'products'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Data Catalog</div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-2 w-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
        />
      </div>

      <div className="mt-4 space-y-2 relative">
        {/* Scanning beam */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-10 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent, ${accent}40, transparent)`,
            mixBlendMode: 'screen',
          }}
          animate={{ y: ['-30px', '260px', '-30px'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {rows.map((r, i) => (
          <motion.div
            key={r}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2.5 text-[12px] text-white/80 font-mono"
          >
            <span className="text-white/40">›</span>
            <span className="flex-1">{`db.public.${r}`}</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/50">scanned</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#90eb61', boxShadow: `0 0 8px #90eb61` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Lineage mini-graph */}
      <div className="mt-6">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-3">Lineage</div>
        <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="h-16 w-full">
          {[
            [5, 11, 35, 6],
            [5, 11, 35, 16],
            [35, 6, 65, 11],
            [35, 16, 65, 11],
            [65, 11, 95, 11],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#linG)"
              strokeWidth="0.5"
              strokeDasharray="1 1"
            />
          ))}
          {[
            [5, 11],
            [35, 6],
            [35, 16],
            [65, 11],
            [95, 11],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="1.2"
              fill={accent}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
              style={{ filter: `drop-shadow(0 0 1px ${accent})` }}
            />
          ))}
          <defs>
            <linearGradient id="linG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function IPaaSEventStreamVisual({ accent }) {
  const rows = [
    'order.created',
    'payment.received',
    'inventory.updated',
    'shipment.dispatched',
    'crm.contact.sync',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Event Stream</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Realtime · iPaaS</div>
        </div>
        <motion.div
          className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ◉ Live
        </motion.div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {rows.map((e, i) => (
          <motion.div
            key={e}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            style={{ boxShadow: i === 0 ? `0 0 24px -10px ${accent}aa` : 'none' }}
          >
            <span className="text-white/40">{`${10 + i}:42`}</span>
            <span className="text-white/85 flex-1">{e}</span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Pulse bar */}
      <div className="absolute bottom-6 inset-x-6 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full w-1/3 rounded-full"
          style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

/* ---------------- Stubbed visuals for sections 06-10 ---------------- */

function AIAgentVisual({ accent }) {
  const tools = ['Salesforce', 'Jira', 'Teams', 'DB', 'API'];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="infAgentG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#24baac" />
          </linearGradient>
        </defs>
        {tools.map((_, i) => {
          const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
          const tx = 50 + Math.cos(angle) * 34;
          const ty = 50 + Math.sin(angle) * 34;
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={tx} y2={ty} stroke="url(#infAgentG)" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
              <motion.circle
                r="0.7"
                fill={accent}
                initial={{ cx: 50, cy: 50 }}
                animate={{ cx: [50, tx, 50], cy: [50, ty, 50] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-32 w-32 md:h-36 md:w-36 rounded-3xl grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04]"
          style={{ boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)` }}
        >
          <div className="text-center">
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">CLAIRE</div>
            <div className="mt-1 font-display text-xl md:text-2xl text-gradient-gt">Agent</div>
          </div>
        </motion.div>
      </div>
      {tools.map((t, i) => {
        const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
        const left = 50 + Math.cos(angle) * 34;
        const top = 50 + Math.sin(angle) * 34;
        return (
          <motion.div
            key={t}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/85"
            style={{ left: `${left}%`, top: `${top}%`, boxShadow: `0 0 24px -8px ${accent}cc` }}
          >
            {t}
          </motion.div>
        );
      })}
    </div>
  );
}

function MigrationFlowVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">PowerCenter → IDMC</div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/12 bg-white/[0.03] p-4 text-center"
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/45">Legacy</div>
          <div className="mt-2 font-display text-base text-white/80">PowerCenter</div>
        </motion.div>
        <motion.div
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-2xl text-gradient-gt text-center"
        >
          →
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-center"
          style={{ boxShadow: `0 0 30px -14px ${accent}cc` }}
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/45">Modern</div>
          <div className="mt-2 font-display text-base text-gradient-gt">IDMC</div>
        </motion.div>
      </div>
      <div className="mt-8">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-2">Migration</div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '78%'] }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function PLSQLConversionVisual({ accent }) {
  const lines = [
    '-- Oracle PL/SQL',
    'CREATE PROCEDURE update_orders',
    '  AS BEGIN ...',
    'END;',
    '-- Converted IDMC',
    '✓ Mapping · orders_load',
    '✓ Taskflow · daily_orders',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">PL/SQL → IDMC</div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
      </div>
      <div className="mt-6 space-y-1.5 font-mono text-[12px]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className={l.startsWith('✓') ? 'text-emerald-300' : l.startsWith('--') ? 'text-white/50' : 'text-white/85'}
          >
            {l}
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
        style={{ boxShadow: `0 0 18px -8px ${accent}aa` }}
      >
        Validated
      </motion.div>
    </div>
  );
}

function IICSToIDMCVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">IICS → IDMC</div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { k: 'Mappings', v: '342' },
          { k: 'Workflows', v: '128' },
          { k: 'Connectors', v: '54' },
          { k: 'Schedules', v: '87' },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            style={{ boxShadow: `0 0 18px -10px ${accent}aa` }}
          >
            <div className="text-[9px] tracking-[0.3em] uppercase text-white/45">{m.k}</div>
            <div className="mt-1 font-display text-2xl text-white">{m.v}</div>
            <div className="mt-1 text-[10px] text-emerald-300 font-mono">migrated</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-2">CLAIRE AI · unlocked</div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '94%'] }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function ManagedServicesVisual({ accent }) {
  const services = ['24/7 Support', 'Monitoring', 'Optimization', 'Advisory', 'Enablement'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Managed Services</div>
          <div className="mt-1 font-display text-xl md:text-2xl">SLA · 99.9%</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          ◉ Active
        </motion.div>
      </div>
      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {services.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="text-white/40">{`${String(i + 1).padStart(2, '0')}`}</span>
            <span className="text-white/85 flex-1">{s}</span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Section template (matches Salesforce rhythm) ---------------- */

function ExperienceSection({
  num,
  eyebrow,
  title,
  description,
  features,
  benefits,
  visual,
  accent,
  flip = false,
}) {
  return (
    <section className="relative px-6 md:px-12 py-28 md:py-40 overflow-hidden">
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
              <RevealWords text={title} />
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
  return (
    <section className="relative px-6 md:px-12 py-40 md:py-56 overflow-hidden">
      <motion.div
        aria-hidden
        animate={{
          background: [
            `radial-gradient(40% 50% at 30% 40%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 70% 60%, rgba(36,186,172,0.45), transparent 70%)`,
            `radial-gradient(40% 50% at 70% 60%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 30% 40%, rgba(36,186,172,0.45), transparent 70%)`,
            `radial-gradient(40% 50% at 30% 40%, ${accent}55, transparent 70%), radial-gradient(50% 60% at 70% 60%, rgba(36,186,172,0.45), transparent 70%)`,
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -z-10 opacity-50 blur-[60px]"
      />
      <DataParticles accent={accent} count={28} />
      <GridBackdrop />

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/55 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
          Begin · 06
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Modernize Your Data Ecosystem?" />
        </h2>
        <RevealWords
          text="Let's build intelligent, connected, and future-ready data platforms with Informatica."
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
            as="a"
            href="#contact"
            onClick={onClose}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-black hover:brightness-110"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
          >
            Talk to Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/90 hover:bg-white/[0.04]"
          >
            Start Your Data Transformation
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Integrate', 'Govern', 'Master', 'Catalog', 'Orchestrate'];
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
            className={`text-[10px] tracking-[0.35em] uppercase transition-opacity duration-300 ${i === active ? 'opacity-100 text-white' : 'opacity-40 text-white/70'
              }`}
          >
            {l}
          </span>
          <span
            className="block h-[2px] rounded-full transition-all duration-500"
            style={{
              width: i === active ? 30 : 14,
              background:
                i === active ? 'linear-gradient(90deg,#90eb61,#24baac)' : 'rgba(255,255,255,0.25)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Main ---------------- */

export default function InformaticaExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#90eb61';

  return (
    <>
      <ScrollDots scrollRef={scrollRef} />

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Cloud Data Integration"
          title="Connect, Transform, and Deliver Data Across Cloud and On-Premise Systems."
          description="Cloud ETL and ELT pipelines at enterprise scale. Connectors for Salesforce, SAP, Oracle, and more. AI-driven mapping and integration recommendations."
          features={[
            'High-performance ETL/ELT for cloud and hybrid architectures',
            'Pre-built connectors for Salesforce, SAP, Oracle, and more',
            'Intelligent data mapping with AI-driven recommendations',
            'Real-time and batch processing support',
            'Native ELT processing for Snowflake, Databricks, and Google BigQuery',
          ]}
          benefits={[
            'Accelerate time-to-insight with automated data pipelines',
            'Eliminate data silos for a unified business view',
            'Reduce development time with reusable integration templates',
            'Enable agile, scalable data strategies for digital transformation',
            'Improve analytics performance with cloud-native data processing',
          ]}
          visual={<IntegrationPipelineVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Data Quality & Governance"
          title="Deliver Trusted, Clean, and Compliant Data for Confident Decision-Making."
          description="Profiling, validation, cleansing, and deduplication at scale. AI-assisted quality automation across domains. Real-time quality through governed APIs."
          features={[
            'Data profiling, validation, cleansing, and deduplication',
            'Rule-based and AI-assisted data quality automation',
            'Data Privacy Management for GDPR and CCPA compliance',
            'Integration with Informatica Axon for unified governance',
            'Real-time data quality validation through REST APIs',
          ]}
          benefits={[
            'Increase business confidence with reliable, high-quality data',
            'Streamline compliance with automated governance workflows',
            'Reduce costly data errors across systems',
            'Support strategic initiatives with trustworthy data assets',
            'Enable real-time trusted data across applications and analytics',
          ]}
          visual={<GovernanceVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Master Data Management"
          title="Unify Customer, Product, and Supplier Data for a Single Source of Truth."
          description="Golden records with intelligent matching and survivorship. Models for customer, product, and supplier data. Stewardship powered by CLAIRE GPT exploration."
          features={[
            'Golden record creation with intelligent matching and merging',
            'Flexible data models for customer, product, and reference data',
            'Hierarchy and relationship management between records',
            'Integrated data stewardship workflows',
            'CLAIRE GPT-powered natural language exploration of master data',
          ]}
          benefits={[
            'Enhance customer experiences with accurate, consolidated profiles',
            'Streamline operations and reporting with clean, unified data',
            'Enable personalized marketing and improved sales effectiveness',
            'Reduce redundancy and inconsistencies across systems',
            'Empower business users with faster, AI-driven data insights',
          ]}
          visual={<MDMGoldenRecordVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Data Catalog & Metadata"
          title="Discover, Understand, and Govern Enterprise Data at Scale."
          description="Automated metadata scanning across the entire estate. AI-driven discovery integrated with the business glossary. End-to-end lineage for compliance and impact."
          features={[
            'Automated metadata scanning across databases, applications, and cloud platforms',
            'AI-driven data discovery with business glossary integration',
            'Data lineage tracking for compliance and impact analysis',
            'Collaboration tools for data stewardship and knowledge sharing',
            'AI-powered inferred lineage across enterprise and AI ecosystems',
          ]}
          benefits={[
            'Speed up analytics with quick data discovery and access',
            'Strengthen compliance with full data lineage transparency',
            'Promote data literacy across business and technical teams',
            'Improve productivity with searchable, contextual data assets',
            'Accelerate responsible AI initiatives with trusted metadata visibility',
          ]}
          visual={<CatalogScanVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Cloud Application Integration · iPaaS"
          title="Accelerate Business Processes with Real-Time Data and Application Integration."
          description="Event-driven, API-led application integration at scale. Connectors for ERP, CRM, billing, and commerce. GenAI connectors for Cortex, Databricks, and NIM."
          features={[
            'Real-time API and event-driven integration capabilities',
            'Pre-built connectors for ERP, CRM, billing, and more',
            'Workflow automation with business process modelling',
            'Hybrid integration support for complex enterprise ecosystems',
            'GenAI connectors for Snowflake Cortex AI, Databricks Mosaic AI, and NVIDIA NIM',
          ]}
          benefits={[
            'Enable faster decision-making with real-time data availability',
            'Automate manual tasks to reduce operational overhead',
            'Deliver connected customer and employee experiences',
            'Support agile digital initiatives with flexible, scalable integration',
            'Future-proof enterprise integrations with AI-ready architectures',
          ]}
          visual={<IPaaSEventStreamVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="06"
          eyebrow="AI & Agentic Data Management"
          title="Automate and Scale Data Management with Informatica CLAIRE® AI Agents."
          description="Autonomous data workflows powered by CLAIRE AI agents. No-code AI Agent Engineering for rapid deployment. Pre-built agents for Salesforce, Jira, and Teams."
          features={[
            'CLAIRE Agents for autonomous data quality and integration workflows',
            'No-code AI Agent Engineering for rapid deployment',
            'AI Agent Hub with pre-built agents for Salesforce, Jira, and Microsoft Teams',
            'CLAIRE Copilot for natural language pipeline development',
            'Recipe Marketplace for reusable GenAI workflow templates',
          ]}
          benefits={[
            'Reduce AI agent development time from weeks to minutes',
            'Enable LLMs to operate on governed enterprise data',
            'Automate complex workflows without custom coding',
            'Democratize AI-powered data engineering across teams',
            'Build a scalable AI-ready data foundation for future innovation',
          ]}
          visual={<AIAgentVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="07"
          eyebrow="PowerCenter to IDMC Migration"
          title="Migrate from PowerCenter to Informatica IDMC Faster, Smarter, and Risk-Free."
          description="Automated PowerCenter to IDMC conversion accelerators. Structured assessment and phased migration planning. Post-migration optimization and team enablement."
          features={[
            'Automated mapping conversion and migration accelerators',
            'Structured assessment and phased migration planning',
            'CDI-PC deployment support on Oracle Cloud Infrastructure',
            'Post-migration optimization and performance tuning',
            'Knowledge transfer and enablement for internal teams',
          ]}
          benefits={[
            'Reduce infrastructure and legacy platform maintenance costs',
            'Unlock advanced IDMC AI, governance, and catalog capabilities',
            'Eliminate dependency on on-premise server environments',
            'Future-proof data operations with cloud-native scalability',
            'Minimize migration risk with proven implementation frameworks',
          ]}
          visual={<MigrationFlowVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="08"
          eyebrow="PL/SQL to IDMC Conversion"
          title="Convert Oracle PL/SQL Logic into Modern Informatica IDMC Pipelines."
          description="Convert Oracle PL/SQL into modern IDMC mappings. Automated validation and business logic testing. Cloud-scale performance with reduced license cost."
          features={[
            'Conversion of PL/SQL procedures and packages into IDMC mappings',
            'Transformation of complex SQL joins, cursors, and loops',
            'Automated validation and business logic testing',
            'Migration of Oracle Scheduler jobs into IDMC Taskflows',
            'Error handling and exception logic mapped into fault handlers',
          ]}
          benefits={[
            'Reduce Oracle licensing costs and infrastructure dependency',
            'Enable visually manageable and auditable ETL pipelines',
            'Improve cloud-scale performance and operational efficiency',
            'Allow broader teams to maintain and extend integrations',
            'Ensure business continuity with zero-data-loss migration approaches',
          ]}
          visual={<PLSQLConversionVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="09"
          eyebrow="IICS to IDMC Conversion"
          title="Upgrade from Legacy IICS to the Unified Informatica IDMC Platform."
          description="Migrate legacy IICS to unified IDMC platform. Mappings, workflows, and connector migrations included. CLAIRE AI capabilities unlocked post-migration."
          features={[
            'Comprehensive IICS environment audit and migration assessment',
            'IDMC org setup and Secure Agent configuration',
            'Migration of mappings, workflows, schedules, and connectors',
            'Parallel-run validation and compatibility testing',
            'Enablement of CLAIRE AI and advanced IDMC features post-migration',
          ]}
          benefits={[
            'Unlock CLAIRE AI, CLAIRE GPT, and AI Agent capabilities',
            'Access governance, catalog, MDM, and data quality services in one platform',
            'Improve scalability and operational performance',
            'Simplify administration with a consolidated IDMC environment',
            'Ensure smooth migration with phased deployment and hypercare support',
          ]}
          visual={<IICSToIDMCVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="10"
          eyebrow="Advisory & Managed Services"
          title="Expert Informatica Advisory, Consulting, and Managed Services."
          description="Data strategy and Informatica roadmap consulting. 24/7 managed services with monitoring and optimization. PSU-based expert engagement models."
          features={[
            'Data strategy and Informatica roadmap consulting',
            'Industry-specific discovery workshops and assessments',
            '24/7 managed services with monitoring and optimization',
            'Flexible PSU-based expert engagement models',
            'Resident consultant programs for accelerated team enablement',
          ]}
          benefits={[
            'Accelerate ROI from your Informatica investments',
            'Reduce project risks with certified Informatica expertise',
            'Free internal teams to focus on business innovation',
            'Maintain platform health through proactive support',
            'Scale Informatica capabilities without increasing hiring costs',
          ]}
          visual={<ManagedServicesVisual accent={accent} />}
          accent={accent}
          flip
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
