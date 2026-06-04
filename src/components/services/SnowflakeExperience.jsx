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
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      className="space-y-3"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
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
            background: `radial-gradient(circle, ${i % 2 ? '#90eb61' : accent} 0%, transparent 70%)`,
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
        <linearGradient id="snowMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#90eb61" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#snowMesh)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
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
  const letters = Array.from('SNOWFLAKE');
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
          aria-label="Snowflake"
          className={HERO_TITLE_CLASS}
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { delayChildren: 0.2, staggerChildren: 0.05 } } }}
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
                  className={i < 4 ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow: i < 4 ? 'none' : 'none',
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
              text="Modern Data Platform for Analytics and AI"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="Genufy empowers organizations to unlock the full potential of the Snowflake Data Cloud through end-to-end data and analytics solutions."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From Snowflake migration and implementation to modern data engineering, ELT pipelines, and advanced analytics, we help businesses build scalable, secure, and high-performance data platforms."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            {/* <RevealWords
              text="Our experts enable faster insights, optimized costs, and data-driven decision-making with cloud-native architecture and industry best practices."
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

function WarehouseVisual({ accent }) {
  const warehouses = [
    { name: 'XS', size: 1, dur: 3 },
    { name: 'S', size: 2, dur: 3.4 },
    { name: 'M', size: 3, dur: 3.8 },
    { name: 'L', size: 4, dur: 4.2 },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Compute · Elastic</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Virtual Warehouses</div>
        </div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {warehouses.map((w, i) => (
          <motion.div
            key={w.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="rounded-xl border border-white/12 bg-white/[0.04] p-3 text-center"
            style={{ boxShadow: `0 0 24px -14px ${accent}cc` }}
          >
            <div className="text-[9px] tracking-[0.35em] uppercase text-white/55">WH {w.name}</div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: w.dur, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-2 mx-auto rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: `linear-gradient(135deg, ${accent}, #90eb61)`,
                boxShadow: `0 0 24px ${accent}55`,
              }}
            />
            <div className="mt-2 text-[10px] font-mono text-white/65">{w.size * 8} threads</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Storage · Shared</div>
        <div className="mt-3 grid grid-cols-6 gap-2 font-mono text-[10px] text-white/65">
          {['JSON', 'PARQUET', 'AVRO', 'ORC', 'CSV', 'STRUCT'].map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded border border-white/10 bg-black/40 py-1 text-center"
            >
              {f}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Auto-Suspend
      </motion.div>
    </div>
  );
}

function DataSharingVisual({ accent }) {
  const regions = [
    { x: 14, y: 24, label: 'AWS · us-east' },
    { x: 86, y: 24, label: 'Azure · eu' },
    { x: 14, y: 78, label: 'GCP · apac' },
    { x: 86, y: 78, label: 'AWS · us-west' },
  ];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="shareG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#90eb61" />
          </linearGradient>
        </defs>
        {regions.map((r, i) => (
          <g key={i}>
            <line x1="50" y1="50" x2={r.x} y2={r.y} stroke="url(#shareG)" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
            <motion.circle
              r="0.7"
              fill={accent}
              initial={{ cx: 50, cy: 50 }}
              animate={{ cx: [50, r.x, 50], cy: [50, r.y, 50] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
            />
          </g>
        ))}
      </svg>
      {regions.map((r) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/85"
          style={{ left: `${r.x}%`, top: `${r.y}%`, boxShadow: `0 0 28px -8px ${accent}cc` }}
        >
          {r.label}
        </motion.div>
      ))}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-40 w-40 md:h-48 md:w-48 rounded-full grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04] text-center"
          style={{ boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)` }}
        >
          <div>
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Live</div>
            <div className="mt-1 font-display text-2xl md:text-3xl text-gradient-gt">Share</div>
            <div className="mt-2 text-[10px] font-mono text-white/55">no ETL · no copy</div>
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Marketplace
      </motion.div>
    </div>
  );
}

function SnowparkVisual({ accent }) {
  const lines = [
    'from snowflake.snowpark import Session',
    'df = session.table("CUSTOMERS")',
    '  .filter(col("CHURN_RISK") > 0.7)',
    'model.fit(df.to_pandas())',
    '✓ deployed · prod.churn_v3',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Snowpark · Python</div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
      </div>
      <div className="mt-5 space-y-1.5 font-mono text-[12px]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.18 }}
            className={l.startsWith('✓') ? 'text-emerald-300' : l.startsWith('from') ? 'text-white' : 'text-white/80'}
          >
            {l}
            {i === lines.length - 1 && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-3.5 bg-white/90 ml-1 align-middle"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {['PyTorch', 'TensorFlow', 'Sklearn', 'Streamlit'].map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="rounded-lg border border-white/10 bg-white/[0.03] py-2 text-center text-[10px] tracking-[0.3em] uppercase text-white/70"
            style={{ boxShadow: `0 0 20px -12px ${accent}aa` }}
          >
            {f}
          </motion.div>
        ))}
      </div>

      <div className="mt-5">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-2">Training Progress</div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '88%'] }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/55 font-mono">
          <span>epoch 12/14</span>
          <span>AUC · 0.94</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Cortex AI
      </motion.div>
    </div>
  );
}

function ELTPipelineVisual({ accent }) {
  const stages = ['Source', 'Ingest', 'Load', 'Transform', 'Serve'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">ELT Pipeline</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Stream + Batch</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          ◉ Running
        </motion.div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="eltG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#90eb61" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <line x1="8" y1="55" x2="92" y2="55" stroke="url(#eltG)" strokeWidth="0.35" strokeDasharray="2 2" />
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            r="0.7"
            fill="#90eb61"
            initial={{ cx: 8, cy: 55 }}
            animate={{ cx: [8, 92, 8] }}
            transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
          />
        ))}
      </svg>
      <div className="relative mt-12 flex h-[220px] items-center justify-between">
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
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/75">{s}</div>
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/70"
      >
        Snowpipe · ✓
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-4 right-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/70"
      >
        dbt · v1.7
      </motion.div>
    </div>
  );
}

function MigrationVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Legacy → Snowflake</div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/12 bg-white/[0.03] p-4 text-center"
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/45">Legacy</div>
          <div className="mt-2 font-display text-base text-white/80">Teradata · Netezza · Oracle</div>
          <div className="mt-3 grid grid-cols-3 gap-1 font-mono text-[10px] text-white/55">
            {['ETL', 'JOBS', 'BTEQ', 'SQL', 'CRON', 'NFS'].map((t, i) => (
              <div key={i} className="rounded border border-white/10 bg-black/40 py-1">{t}</div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl text-gradient-gt"
          >
            →
          </motion.div>
          <div className="text-[9px] tracking-[0.35em] uppercase text-white/45">migrate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-center"
          style={{ boxShadow: `0 0 30px -14px ${accent}cc` }}
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/45">Snowflake</div>
          <div className="mt-2 font-display text-base text-gradient-gt">Data Cloud</div>
          <div className="mt-3 grid grid-cols-3 gap-1 font-mono text-[10px] text-white/65">
            {['IAM', 'SNOWPIPE', 'STREAMS', 'TASKS', 'DBT', 'TIME'].map((t, i) => (
              <div key={i} className="rounded border border-white/10 bg-black/30 py-1">{t}</div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-2">Migration progress</div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '74%'] }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/55 font-mono">
          <span>1,284 objects</span>
          <span>0 data loss</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Phased
      </motion.div>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/55 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
          Begin · 04
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Unlock the Snowflake Data Cloud?" />
        </h2>
        <RevealWords
          text="Let's design your modern data platform — migration, engineering, sharing, and AI — built for scale, governance, and speed."
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
            Talk to Data Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/90 hover:bg-white/[0.04]"
          >
            Start Your Snowflake Journey
          </MagneticButton>
        </motion.div>
      </div>

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Talk to Data Experts" />
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Warehouse', 'Engineering', 'Sharing', 'ML', 'Migrate'];
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

export default function SnowflakeExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#24baac';

  return (
    <>
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Cloud-Native Data Warehousing"
          title="Data Warehousing"
          description="Design and implement modern Snowflake data warehouses that centralize enterprise data, deliver high-performance analytics, and provide a scalable foundation for business intelligence, reporting, and AI-driven decision making."
          features={[
            'Separate compute and storage architecture for elastic scalability',
            'Support for structured and semi-structured data formats',
            'Automated scaling, auto-suspend, and performance optimization',
            'Multi-cloud and cross-region data accessibility',
            'Fully managed cloud-native data warehouse platform',
          ]}
          benefits={[
            'Eliminate data silos with centralized data storage',
            'Reduce infrastructure and maintenance costs',
            'Accelerate analytics and reporting performance',
            'Scale resources instantly based on business demand',
            'Simplify enterprise data management operations',
          ]}
          visual={<WarehouseVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Modern Data Engineering"
          title="Data Engineering & ELT Pipelines."
          description="Build robust data engineering frameworks and automated ELT pipelines that efficiently ingest, transform, and deliver data across your organization, enabling trusted analytics, reporting, and AI initiatives at scale."
          features={[
            'Automated ELT pipeline development',
            'Real-time and batch data ingestion',
            'Integration with cloud and enterprise data sources',
            'Data transformation using Snowpark and SQL',
            'Workflow orchestration and scheduling',
          ]}
          benefits={[
            'Accelerate data processing and availability',
            'Improve data quality and consistency',
            'Reduce manual data engineering efforts',
            'Enable faster business insights and reporting',
            'Support scalable enterprise analytics workloads',
          ]}
          visual={<ELTPipelineVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Secure Data Collaboration"
          title="Data Sharing & Collaboration."
          description="Enable secure, real-time data sharing across teams, partners, and business units without data duplication, accelerating collaboration, improving governance, and driving faster business decisions."
          features={[
            'Secure live data sharing capabilities',
            'Cross-cloud and cross-region replication',
            'Snowflake Marketplace integration',
            'Role-based access and governance controls',
            'Real-time collaboration across business units',
          ]}
          benefits={[
            'Eliminate data duplication and latency',
            'Improve collaboration across organizations',
            'Enhance data security and governance',
            'Enable faster partner and customer integrations',
            'Create opportunities for data monetization',
          ]}
          visual={<DataSharingVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="AI-Powered Analytics"
          title="Data Science & Machine Learning."
          description="Accelerate data science and machine learning initiatives with a unified Snowflake platform that enables advanced analytics, model development, training, and deployment using trusted, real-time data."
          features={[
            'Snowpark integration for Python, Java, and Scala',
            'Integration with TensorFlow, PyTorch, and ML tools',
            'Scalable compute for training and inference',
            'Streamlit integration for interactive applications',
            'Advanced analytics and predictive modeling support',
          ]}
          benefits={[
            'Accelerate machine learning development cycles',
            'Improve decision-making with AI-driven insights',
            'Ensure secure and governed ML workflows',
            'Enable high-performance analytics at scale',
            'Democratize insights through interactive applications',
          ]}
          visual={<SnowparkVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Cloud Data Modernization"
          title="Snowflake Migration & Modernization"
          description="Migrate legacy data warehouses and analytics platforms to Snowflake with minimal disruption, enabling improved scalability, performance, cost efficiency, and a future-ready cloud data architecture."
          features={[
            'Legacy data warehouse migration',
            'Cloud migration strategy and assessment',
            'Data validation and reconciliation',
            'Performance tuning and optimization',
            'End-to-end modernization support',
          ]}
          benefits={[
            'Reduce legacy infrastructure dependency',
            'Improve scalability and operational agility',
            'Minimize migration risks and downtime',
            'Optimize performance and cloud costs',
            'Accelerate digital transformation initiatives',
          ]}
          visual={<MigrationVisual accent={accent} />}
          accent={accent}
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
