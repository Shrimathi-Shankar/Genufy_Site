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
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            variants={wordIn} className={gradient ? 'text-gradient-gt' : undefined}
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
        show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
      }}
      className="space-y-3"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18 },
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

      <DataParticles accent={service.accent} count={44} />

      <motion.div style={{ x: tx, y: ty }} className="relative max-w-7xl mx-auto w-full">

        <h1
          aria-label="Informatica"
          className={HERO_TITLE_CLASS}
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
                        ? 'none'
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
              text="Smart Data Integration for Modern Enterprises"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="Genufy TechWorks empowers enterprises to harness the full
power of Informatica's Intelligent Data Management Cloud (IDMC) — connecting, governing,
and transforming data across cloud, hybrid, and on-premise environments."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="Powered by
CLAIRE® AI, our Informatica services help you build a trusted, AI-ready data foundation
that drives smarter decisions, accelerates innovation, and ensures compliance at scale.
Trusted by leading enterprises, delivered by certified experts."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            {/* <RevealWords
              text="With trusted, unified, and AI-powered data, you can drive smarter decisions, accelerate innovation, and achieve compliance with ease."
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

/* One field row in the mapping canvas — anchored to the left or right column. */
function FieldChip({ side, y, children, accent, ai, delay = 0 }) {
  const isLeft = side === 'left';
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -14 : 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute -translate-y-1/2 flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/65 px-2.5 py-1.5 font-mono text-[10px] text-white/80 backdrop-blur-xl ${
        isLeft ? 'left-0 flex-row-reverse' : 'right-0'
      }`}
      style={{ top: `${y}%`, boxShadow: `0 0 20px -12px ${accent}` }}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: ai ? accent : '#90eb61', boxShadow: `0 0 6px ${ai ? accent : '#90eb61'}` }}
      />
      <span className="whitespace-nowrap">{children}</span>
      {ai && (
        <span className="rounded px-1 text-[8px] font-semibold" style={{ background: `${accent}22`, color: accent }}>
          AI
        </span>
      )}
    </motion.div>
  );
}

function IntegrationPipelineVisual({ accent }) {
  /* Cloud data integration shown as an intelligent ETL/ELT field-mapping canvas:
     source schema fields are auto-mapped to the cloud target, AI-suggested
     matches are highlighted, and live data flows across each mapping link. */
  const src = [
    { label: 'account_id', y: 18 },
    { label: 'full_name', y: 40 },
    { label: 'email', y: 62 },
    { label: 'amount', y: 84 },
  ];
  const tgt = [
    { label: 'ACCOUNT_KEY', y: 18 },
    { label: 'CUSTOMER_NAME', y: 40 },
    { label: 'EMAIL_ADDR', y: 62, ai: true },
    { label: 'REVENUE', y: 84, ai: true },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Cloud Data Integration</div>
          <div className="mt-1 font-display text-xl md:text-2xl">ETL / ELT · AI Mapping</div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-mono text-white/55"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          Mapping
        </motion.div>
      </div>

      {/* column labels */}
      <div className="mt-5 flex justify-between text-[9px] tracking-[0.3em] uppercase text-white/40">
        <span>Source · Salesforce</span>
        <span>Target · Snowflake</span>
      </div>

      {/* mapping canvas */}
      <div className="relative mt-3 h-[210px] md:h-[270px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="cdiMapG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          {src.map((s, i) => (
            <g key={i}>
              <line
                x1="25"
                y1={s.y}
                x2="75"
                y2={tgt[i].y}
                stroke="url(#cdiMapG)"
                strokeWidth="0.5"
                strokeDasharray={tgt[i].ai ? '2 1.4' : undefined}
                opacity="0.7"
              />
              <motion.circle
                r="0.9"
                fill="#90eb61"
                animate={{ cx: [25, 75], cy: [s.y, tgt[i].y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
              />
            </g>
          ))}
        </svg>

        {src.map((s, i) => (
          <FieldChip key={s.label} side="left" y={s.y} accent={accent} delay={i * 0.08}>
            {s.label}
          </FieldChip>
        ))}
        {tgt.map((t, i) => (
          <FieldChip key={t.label} side="right" y={t.y} accent={accent} ai={t.ai} delay={0.2 + i * 0.08}>
            {t.label}
          </FieldChip>
        ))}
      </div>

      {/* connectors footer */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/35">Connectors</span>
        <div className="flex flex-wrap gap-1.5">
          {['Salesforce', 'SAP', 'Oracle', 'Snowflake'].map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] text-white/65">
              {c}
            </span>
          ))}
          <span className="rounded-full border px-2 py-0.5 text-[9px]" style={{ borderColor: `${accent}66`, color: accent }}>
            120+
          </span>
        </div>
      </div>
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
  /* Master data management shown as record consolidation: several duplicate /
     conflicting source records are matched and merged into one trusted golden
     record, with a live match-confidence score. */
  const dupes = [
    { src: 'CRM', name: 'Jon Smith', y: 16 },
    { src: 'ERP', name: 'John Smith', y: 44 },
    { src: 'Support', name: 'J. Smith', y: 72 },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      {/* faint grid */}
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

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Master Data Management</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Match · Merge · Master</div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-mono text-white/55"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          Resolving
        </motion.div>
      </div>

      {/* duplicates → golden record */}
      <div className="relative mt-6 h-[230px] md:h-[300px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="mdmFlowG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#90eb61" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {dupes.map((d, i) => (
            <g key={i}>
              <line x1="34" y1={d.y} x2="62" y2="50" stroke="url(#mdmFlowG)" strokeWidth="0.4" strokeDasharray="1.6 1.3" />
              <motion.circle
                r="0.85"
                fill="#90eb61"
                animate={{ cx: [34, 62], cy: [d.y, 50], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
              />
            </g>
          ))}
        </svg>

        {/* duplicate source records */}
        {dupes.map((d, i) => (
          <motion.div
            key={d.src}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 w-[38%] -translate-y-1/2 rounded-xl border border-white/10 bg-black/55 backdrop-blur-xl px-3 py-2"
            style={{ top: `${d.y}%`, boxShadow: '0 0 20px -12px rgba(0,0,0,0.7)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/40">{d.src}</span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-amber-300/70">dup</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-white/80">{d.name}</div>
          </motion.div>
        ))}

        {/* golden record */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-1/2 w-[46%] -translate-y-1/2 rounded-2xl border bg-black/75 p-3.5 backdrop-blur-xl"
          style={{ borderColor: `${accent}66`, boxShadow: `0 0 60px -14px ${accent}` }}
        >
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.8 5.9 20.9l1.5-6.7L2.3 9.6l6.8-.7z"
                fill={accent}
                fillOpacity="0.18"
                stroke="#90eb61"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[9px] tracking-[0.35em] uppercase text-gradient-gt">Golden Record</span>
          </div>
          <div className="mt-2 space-y-1 font-mono text-[10px] text-white/80">
            <div>
              <span className="text-white/35">name </span>John A. Smith
            </div>
            <div>
              <span className="text-white/35">email </span>john@acme.com
            </div>
            <div>
              <span className="text-white/35">id </span>MDM-100482
            </div>
            <div className="text-emerald-300">✓ verified · 1 profile</div>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[8px] uppercase tracking-[0.2em] text-white/40">
              <span>Match confidence</span>
              <span style={{ color: accent }}>98%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
                animate={{ width: ['0%', '98%'] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* mastered domains */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/35">Domains</span>
        <div className="flex gap-1.5">
          {['Customer', 'Product', 'Supplier'].map((d) => (
            <span key={d} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] text-white/65">
              {d}
            </span>
          ))}
        </div>
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
  /* AI & agentic data management shown as an autonomous CLAIRE agent run: given
     a goal, the agent plans and executes data steps across connected tools —
     no code — completing each with a live status, last step still running. */
  const steps = [
    { t: 'Connected sources · Salesforce, SAP', done: true },
    { t: 'Profiled 2.4M records', done: true },
    { t: 'Resolved 1,204 duplicates', done: true },
    { t: 'Applying data quality rules…', done: false },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/55 backdrop-blur-sm p-6 md:p-7">
      {/* agent identity */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ boxShadow: [`0 0 0px ${accent}00`, `0 0 24px -2px ${accent}`, `0 0 0px ${accent}00`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-black/60"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a4 4 0 0 0-4 4 3.5 3.5 0 0 0-1 6.5V17a3 3 0 0 0 6 0V7" stroke="#90eb61" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 3a4 4 0 0 1 4 4 3.5 3.5 0 0 1 1 6.5V17a3 3 0 0 1-5 2.8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
        <div>
          <div className="font-display text-lg text-white">CLAIRE Agent</div>
          <div className="text-[9px] tracking-[0.35em] uppercase text-white/45">Autonomous · No-code</div>
        </div>
        <span
          className="ml-auto rounded-full border px-2 py-0.5 text-[8px] tracking-[0.3em] uppercase"
          style={{ borderColor: `${accent}66`, color: accent }}
        >
          LLM
        </span>
      </div>

      {/* goal */}
      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <div className="text-[8px] tracking-[0.35em] uppercase text-white/40">Goal</div>
        <div className="mt-0.5 font-mono text-[12px] text-white/85">Build a trusted Customer 360</div>
      </div>

      {/* agent steps */}
      <div className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.25 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2"
          >
            {s.done ? (
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: `${accent}22` }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5 5 9.5 10 3.5" stroke="#90eb61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <motion.span
                className="h-4 w-4 shrink-0 rounded-full border-2 border-white/15"
                style={{ borderTopColor: accent }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <span className={`flex-1 font-mono text-[11px] ${s.done ? 'text-white/70' : 'text-white/90'}`}>{s.t}</span>
          </motion.div>
        ))}
      </div>

      {/* agent hub */}
      <div className="absolute bottom-5 inset-x-6 flex items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/35">Agent Hub</span>
        <div className="flex gap-1.5">
          {['Salesforce', 'Jira', 'Teams'].map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] text-white/65">
              {t}
            </span>
          ))}
        </div>
      </div>
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
            as="button"
            onClick={() => setContactOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-black hover:brightness-110"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
          >
            Talk to Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
        </motion.div>
      </div>

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Let's Build Together" />
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
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Intelligent Data Integration"
          title="Cloud Data Integration."
          description="Build scalable cloud-native data pipelines that seamlessly connect enterprise applications, databases, and cloud platforms, enabling real-time data movement, unified analytics, and faster business decision-making."
          features={[
            'High-performance ETL/ELT for cloud and hybrid architectures',
            'Pre-built connectors for Salesforce, SAP, Oracle, and more',
            'Intelligent data mapping with AI-driven recommendations',
          ]}
          benefits={[
            'Accelerate time-to-insight with automated data pipelines',
            'Eliminate data silos for a unified business view',
            'Reduce development time with reusable integration templates',
          ]}
          visual={<IntegrationPipelineVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Trusted Data Governance"
          title="Data Quality & Governance."
          description="Ensure data accuracy, consistency, and compliance with intelligent data quality controls, automated governance frameworks, and enterprise-wide visibility across critical business data assets."
          features={[
            'Data profiling, validation, cleansing, and deduplication',
            'Rule-based and AI-assisted data quality automation',
            'Data Privacy Management for GDPR and CCPA compliance',
          ]}
          benefits={[
            'Increase business confidence with reliable, high-quality data',
            'Streamline compliance with automated governance workflows',
            'Reduce costly data errors across systems',
          ]}
          visual={<GovernanceVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Unified Master Data"
          title="Master Data Management"
          description="Create a trusted single source of truth by consolidating customer, product, supplier, and reference data, enabling better governance, operational efficiency, and enterprise-wide consistency."
          features={[
            'Golden record creation with intelligent matching and merging',
            'Flexible data models for customer, product, and reference data',
            'Hierarchy and relationship management between records',
          ]}
          benefits={[
            'Enhance customer experiences with accurate, consolidated profiles',
            'Streamline operations and reporting with clean, unified data',
            'Enable personalized marketing and improved sales effectiveness',
          ]}
          visual={<MDMGoldenRecordVisual accent={accent} />}
          accent={accent}
        />

        {/* <ExperienceSection
          num="04"
          eyebrow="Data Catalog & Metadata"
          title="Discover, Understand, and Govern Enterprise Data at Scale."
          description="Automated metadata scanning across the entire estate. AI-driven discovery integrated with the business glossary. End-to-end lineage for compliance and impact."
          features={[
            'Automated metadata scanning across databases, applications, and cloud platforms',
            'AI-driven data discovery with business glossary integration',
            'Data lineage tracking for compliance and impact analysis',
          ]}
          benefits={[
            'Speed up analytics with quick data discovery and access',
            'Strengthen compliance with full data lineage transparency',
            'Promote data literacy across business and technical teams',
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
          ]}
          benefits={[
            'Enable faster decision-making with real-time data availability',
            'Automate manual tasks to reduce operational overhead',
            'Deliver connected customer and employee experiences',
          ]}
          visual={<IPaaSEventStreamVisual accent={accent} />}
          accent={accent}
        /> */}

        <ExperienceSection
          num="04"
          eyebrow="AI-Powered Data Operations"
          title="AI & Agentic Data Management"
          description="Leverage Informatica's cutting-edge agentic AI capabilities to build autonomous data workflows, connect large language models to enterprise data, and dramatically accelerate pipeline development — no code required."
          features={[
            'CLAIRE Agents for autonomous data quality and integration workflows',
            'No-code AI Agent Engineering for rapid deployment',
            'AI Agent Hub with pre-built agents for Salesforce, Jira, and Microsoft Teams',
          ]}
          benefits={[
            'Reduce AI agent development time from weeks to minutes',
            'Enable LLMs to operate on governed enterprise data',
            'Automate complex workflows without custom coding',
          ]}
          visual={<AIAgentVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Cloud Data Modernization"
          title="PowerCenter to IDMC Migration"
          description="Modernize your legacy Informatica PowerCenter workloads to the cloud
native IDMC platform. Genufy's certified experts guide your migration with a proven
methodology, minimizing downtime and business risk."
          features={[
            'Automated mapping conversion and migration accelerators',
            'Structured assessment and phased migration planning',
            'CDI-PC deployment support on Oracle Cloud Infrastructure',
          ]}
          benefits={[
            'Reduce infrastructure and legacy platform maintenance costs',
            'Unlock advanced IDMC AI, governance, and catalog capabilities',
            'Eliminate dependency on on-premise server environments',
          ]}
          visual={<MigrationFlowVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="06"
          eyebrow="Legacy ETL Transformation"
          title="PL/SQL to IDMC Conversion"
          description="Modernize your Oracle PL/SQL stored procedures, packages, functions, and
ETL logic into native Informatica IDMC mappings and mapplets — fully cloud-ready,
maintainable, and governed."
          features={[
            'Conversion of PL/SQL procedures and packages into IDMC mappings',
            'Transformation of complex SQL joins, cursors, and loops',
            'Automated validation and business logic testing',
          ]}
          benefits={[
            'Reduce Oracle licensing costs and infrastructure dependency',
            'Enable visually manageable and auditable ETL pipelines',
            'Improve cloud-scale performance and operational efficiency',
          ]}
          visual={<PLSQLConversionVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="07"
          eyebrow="Unified Data Cloud Migration"
          title="IICS to IDMC Conversion"
          description="Migrate your existing Informatica Intelligent Cloud Services (IICS) configurations, connections, mappings, and taskflows to the fully unified, AI-powered IDMC platform — unlocking CLAIRE AI, modern governance, and advanced cloud capabilities."
          features={[
            'Comprehensive IICS environment audit and migration assessment',
            'IDMC org setup and Secure Agent configuration',
            'Migration of mappings, workflows, schedules, and connectors',
          ]}
          benefits={[
            'Unlock CLAIRE AI, CLAIRE GPT, and AI Agent capabilities',
            'Access governance, catalog, MDM, and data quality services in one platform',
            'Improve scalability and operational performance',
          ]}
          visual={<IICSToIDMCVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="08"
          eyebrow="Strategic Data Advisory"
          title="Advisory & Managed Services"
          description="From data strategy workshops to hands-on managed services, Genufy's Informatica-certified team supports your entire data journey — so you can focus on business outcomes, not platform operations."
          features={[
            'Data strategy and Informatica roadmap consulting',
            'Industry-specific discovery workshops and assessments',
            '24/7 managed services with monitoring and optimization',
          ]}
          benefits={[
            'Accelerate ROI from your Informatica investments',
            'Reduce project risks with certified Informatica expertise',
            'Free internal teams to focus on business innovation',
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
