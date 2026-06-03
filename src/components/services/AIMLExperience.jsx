import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HERO_TITLE_CLASS } from './heroTitle.js';
import MagneticButton from '../MagneticButton.jsx';

/* ---------------- Shared atoms (mirror Informatica) ---------------- */

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
        <linearGradient id="aimlMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#24baac" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#aimlMesh)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
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
  const letters = Array.from('AI & ML');
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
          aria-label="AI and ML"
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
                  className={i < 4 ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow: i < 4 ? 'none' : 'none',
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
              text="AI Systems That Don't Just Generate — They Execute"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="At Genufy TechWorks, we bridge the gap between AI potential and real-world business impact. 
Our enterprise-grade solutions are secure, built for production - not just pilots. 
"
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From strategy to continuous optimization, we deliver AI that works reliably at scale."
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

/* ---------------- Section visuals (one per section) ---------------- */

function GenerativeAIVisual({ accent }) {
  const lines = [
    '> Draft the launch email for our Q3 release…',
    '◆ Generating ',
    '✓ Tone matched · brand voice · 3 variants',
    '⟶ Routing to review · approval · send',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">LLM Console</div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
      </div>
      <div className="mt-6 space-y-3 font-mono text-[12px]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white/85"
          >
            {l}
          </motion.div>
        ))}
      </div>
      {/* Token streaming bar */}
      <div className="absolute bottom-6 inset-x-6">
        <div className="text-[9px] tracking-[0.35em] uppercase text-white/45 mb-2">Streaming tokens</div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full w-1/3 rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}

function AIAgentVisual({ accent }) {
  const tools = ['CRM', 'Email', 'Search', 'DB', 'Slack'];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="agentG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#24baac" />
          </linearGradient>
        </defs>
        {tools.map((_, i) => {
          const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
          const tx = 50 + Math.cos(angle) * 36;
          const ty = 50 + Math.sin(angle) * 36;
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={tx} y2={ty} stroke="url(#agentG)" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
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
      {/* Central brain node */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-32 w-32 md:h-36 md:w-36 rounded-3xl grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04]"
          style={{ boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)` }}
        >
          <div className="text-center">
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Agent</div>
            <div className="mt-1 font-display text-xl md:text-2xl text-gradient-gt">Reason</div>
          </div>
        </motion.div>
      </div>
      {/* Tool labels */}
      {tools.map((t, i) => {
        const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
        const left = 50 + Math.cos(angle) * 36;
        const top = 50 + Math.sin(angle) * 36;
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

function NLPVisual({ accent }) {
  const tokens = ['I', 'love', 'how', 'fast', 'the', 'team', 'shipped', 'this.'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Tokenize · Embed · Classify</div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tokens.map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="font-mono text-[12px] rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-white/85"
            style={{ boxShadow: `0 0 18px -10px ${accent}aa` }}
          >
            {t}
          </motion.span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {['Positive', 'Neutral', 'Negative'].map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="text-[9px] tracking-[0.35em] uppercase text-white/45">{s}</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: i === 0 ? 'linear-gradient(90deg, #90eb61, #24baac)' : 'rgba(255,255,255,0.25)' }}
                animate={{ width: ['0%', i === 0 ? '92%' : i === 1 ? '6%' : '2%'] }}
                transition={{ duration: 1.4, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2 font-mono text-[11px] text-white/70">{i === 0 ? '0.92' : i === 1 ? '0.06' : '0.02'}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-[10px] tracking-[0.45em] uppercase text-white/45">Knowledge Graph</div>
      <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="mt-3 h-16 w-full">
        {[[8, 11, 32, 6], [8, 11, 32, 16], [32, 6, 60, 11], [32, 16, 60, 11], [60, 11, 92, 11]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="0.4" strokeDasharray="1 1" opacity="0.6" />
        ))}
        {[[8, 11], [32, 6], [32, 16], [60, 11], [92, 11]].map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r="1.2" fill={accent} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </svg>
    </div>
  );
}

function PredictiveAnalyticsVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Forecast</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Q3 · Demand model</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          ◉ Live
        </motion.div>
      </div>
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="mt-6 h-64 w-full">
        <defs>
          <linearGradient id="forecastG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Historical */}
        <motion.path
          d="M 2 38 L 12 32 L 22 35 L 32 28 L 42 30 L 52 22"
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Forecast */}
        <motion.path
          d="M 52 22 L 62 18 L 72 14 L 82 10 L 92 6"
          fill="none"
          stroke={accent}
          strokeWidth="0.7"
          strokeDasharray="1.5 1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Confidence band */}
        <motion.path
          d="M 52 22 L 62 14 L 72 8 L 82 4 L 92 2 L 92 10 L 82 16 L 72 20 L 62 22 L 52 22 Z"
          fill="url(#forecastG)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.6 }}
        />
        {[2, 12, 22, 32, 42, 52].map((x, i) => {
          const ys = [38, 32, 35, 28, 30, 22];
          return (
            <motion.circle key={i} cx={x} cy={ys[i]} r="0.6" fill="#fff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }} />
          );
        })}
      </svg>
      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3 text-center">
        {[
          { k: 'Accuracy', v: '94.2%' },
          { k: 'MAPE', v: '5.8%' },
          { k: 'Horizon', v: '90d' },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] py-2"
          >
            <div className="text-[9px] tracking-[0.3em] uppercase text-white/45">{m.k}</div>
            <div className="font-display text-base text-white">{m.v}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ComputerVisionVisual({ accent }) {
  const boxes = [
    { x: 18, y: 22, w: 22, h: 22, label: 'person · 0.98' },
    { x: 55, y: 30, w: 28, h: 18, label: 'helmet · 0.94' },
    { x: 30, y: 60, w: 38, h: 24, label: 'box · 0.89' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(40,60,55,0.7), rgba(20,30,28,0.9)), repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.04) 14px 15px)',
        }}
      />
      {/* scan beam */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 h-8 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent, ${accent}55, transparent)`, mixBlendMode: 'screen' }}
        animate={{ y: ['-30px', '460px', '-30px'] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {boxes.map((b, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={accent} strokeWidth="0.5" strokeDasharray="1 1" />
            {/* corner ticks */}
            {[
              [b.x, b.y, b.x + 3, b.y, b.x, b.y + 3],
              [b.x + b.w, b.y, b.x + b.w - 3, b.y, b.x + b.w, b.y + 3],
              [b.x, b.y + b.h, b.x + 3, b.y + b.h, b.x, b.y + b.h - 3],
              [b.x + b.w, b.y + b.h, b.x + b.w - 3, b.y + b.h, b.x + b.w, b.y + b.h - 3],
            ].map(([px1, py1, px2, py2, px3, py3], k) => (
              <g key={k}>
                <line x1={px1} y1={py1} x2={px2} y2={py2} stroke="#fff" strokeWidth="0.4" />
                <line x1={px1} y1={py1} x2={px3} y2={py3} stroke="#fff" strokeWidth="0.4" />
              </g>
            ))}
          </motion.g>
        ))}
      </svg>
      {boxes.map((b, i) => (
        <div
          key={i}
          className="absolute font-mono text-[10px] tracking-wide text-white bg-black/70 border border-white/15 rounded px-1.5 py-0.5"
          style={{ left: `${b.x}%`, top: `calc(${b.y}% - 18px)`, boxShadow: `0 0 14px -4px ${accent}cc` }}
        >
          {b.label}
        </div>
      ))}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-2 w-2 rounded-full bg-red-500" />
        <div className="text-[10px] tracking-[0.35em] uppercase text-white/80 font-mono">REC · CAM 03</div>
      </div>
    </div>
  );
}

function MLOpsVisual({ accent }) {
  const stages = ['Data', 'Train', 'Validate', 'Deploy', 'Monitor'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="mlopsG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#90eb61" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <line x1="6" y1="50" x2="94" y2="50" stroke="url(#mlopsG)" strokeWidth="0.35" strokeDasharray="2 2" />
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            r="0.7"
            fill="#90eb61"
            initial={{ cx: 6, cy: 50 }}
            animate={{ cx: [6, 94, 6] }}
            transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
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
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/75">{s}</div>
          </motion.div>
        ))}
      </div>
      {/* Drift indicator */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/70"
      >
        Drift · 0.04
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-4 right-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/70"
      >
        v2.1.4
      </motion.div>
    </div>
  );
}

function MultimodalAIVisual({ accent }) {
  const modes = [
    { icon: 'T', label: 'Text' },
    { icon: '◉', label: 'Image' },
    { icon: '♪', label: 'Audio' },
    { icon: '▶', label: 'Video' },
  ];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="mmG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#24baac" />
          </linearGradient>
        </defs>
        {modes.map((_, i) => {
          const angle = (i / modes.length) * Math.PI * 2 + Math.PI / 4;
          const tx = 50 + Math.cos(angle) * 30;
          const ty = 50 + Math.sin(angle) * 30;
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={tx} y2={ty} stroke="url(#mmG)" strokeWidth="0.35" strokeDasharray="1.5 1.5" />
              <motion.circle
                r="0.7"
                fill={accent}
                initial={{ cx: tx, cy: ty }}
                animate={{ cx: [tx, 50, tx], cy: [ty, 50, ty] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-32 w-32 md:h-40 md:w-40 rounded-full grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04]"
          style={{ boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)` }}
        >
          <div className="text-center">
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Fused</div>
            <div className="mt-1 font-display text-2xl md:text-3xl text-gradient-gt">Reason</div>
          </div>
        </motion.div>
      </div>
      {modes.map((m, i) => {
        const angle = (i / modes.length) * Math.PI * 2 + Math.PI / 4;
        const left = 50 + Math.cos(angle) * 30;
        const top = 50 + Math.sin(angle) * 30;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-2 text-center"
            style={{ left: `${left}%`, top: `${top}%`, boxShadow: `0 0 24px -8px ${accent}cc` }}
          >
            <div className="font-display text-lg text-white">{m.icon}</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-white/75">{m.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function HealthcareAIVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 85%)',
        }}
      />
      {/* ECG pulse */}
      <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 w-full">
        <motion.path
          d="M 0 20 L 30 20 L 38 8 L 46 32 L 54 20 L 90 20 L 98 8 L 106 32 L 114 20 L 150 20 L 158 8 L 166 32 L 174 20 L 200 20"
          fill="none"
          stroke={accent}
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        />
      </svg>
      {/* Heart */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.svg
          width="130"
          height="150"
          viewBox="0 0 120 140"
          fill="none"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 24px ${accent})` }}
        >
          <defs>
            <linearGradient id="heartG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          <path
            d="M60 120 C 20 90, 5 60, 25 35 C 38 22, 55 30, 60 45 C 65 30, 82 22, 95 35 C 115 60, 100 90, 60 120 Z"
            stroke="url(#heartG)"
            strokeWidth="2"
            fill="rgba(255,255,255,0.04)"
          />
        </motion.svg>
      </div>
      {/* Compliance chips */}
      {['HIPAA', 'HL7', 'FHIR', 'SOC 2'].map((c, i) => (
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

/* ---------------- ExperienceSection template ---------------- */

function ExperienceSection({ num, eyebrow, title, description, features, benefits, visual, accent, flip = false }) {
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
          Begin · 09
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Operationalize Enterprise AI?" />
        </h2>
        <RevealWords
          text="Let's build generative copilots, autonomous agents, and production ML systems your business can trust."
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
            Talk to AI Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/90 hover:bg-white/[0.04]"
          >
            Start Your AI Journey
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'GenAI', 'Agents', 'NLP', 'Predict', 'Vision', 'MLOps', 'Multimodal', 'Health'];
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

export default function AIMLExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#90eb61';

  return (
    <>
      <ScrollDots scrollRef={scrollRef} />

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Creating Content, Code, and Conversations at Scale"
          title="Generative AI Solutions"
          description="Build intelligent systems that generate high-quality text, images, code, and complete workflows 
using state-of-the-art LLMs — securely integrated into your enterprise environment. We go 
beyond chatbots to deliver production-grade generative systems tied to your business logic.."
          features={[
            'Custom LLM applications and enterprise AI copilots',
            'Retrieval-Augmented Generation (RAG) implementations',
            'AI workflow automation with advanced prompt engineering',
            'Multimodal AI systems for text, image, and audio processing',
            'Secure private LLM deployment across cloud and on-premise environments',
          ]}
          benefits={[
            'Accelerate content and code generation across teams',
            'Reduce manual effort with intelligent workflow automation',
            'Deliver personalized customer and employee experiences',
            'Improve operational efficiency with AI-powered assistance',
            'Enable secure enterprise AI adoption at scale',
          ]}
          visual={<GenerativeAIVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Autonomous Agents That Reason, Plan & Execute "
          title="AI Agent Dvelopment"
          description="We build goal-oriented AI agents capable of complex multi-step reasoning, tool usage, API 
integration, and autonomous workflow execution — with full observability, human-in-the-loop 
controls, and audit trails built in. "
          features={[
            'Multi-agent orchestration and autonomous task execution',
            'Memory and contextual reasoning capabilities',
            'CRM and ERP integrated intelligent agents',
            'Sales, support, and operations automation agents',
            'Human-in-the-loop architecture with audit tracking',
          ]}
          benefits={[
            'Automate repetitive and complex business processes',
            'Provide 24/7 intelligent support and assistance',
            'Accelerate operational decision-making and execution',
            'Scale workforce productivity with AI augmentation',
            'Improve process efficiency with autonomous systems',
          ]}
          visual={<AIAgentVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Turning Language into Actionable Intelligence "
          title="Natural Language Processing"
          description="Enable machines to truly understand human language — intent, emotion, context, and nuance 
— from text, documents, and speech. Our NLP solutions power intelligent experiences that 
scale across customer, employee, and partner interactions. ."
          features={[
            'Conversational AI and intelligent chatbot development',
            'Sentiment analysis and opinion mining solutions',
            'Intelligent document processing with OCR capabilities',
            'Semantic search and knowledge discovery systems',
            'Multilingual NLP and speech recognition support',
          ]}
          benefits={[
            'Extract valuable insights from unstructured data',
            'Improve customer support automation and responsiveness',
            'Automate document classification and processing workflows',
            'Enhance enterprise search and knowledge accessibility',
            'Deliver smarter, context-aware digital experiences',
          ]}
          visual={<NLPVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Anticipate the Future. Act with Confidence."
          title="Predictive Analytics & Forecasting"
          description="Turn historical data into accurate forecasts and proactive decisions. Our predictive intelligence 
solutions use advanced machine learning to surface risks, opportunities, and trends before they 
happen — giving your teams an unfair competitive advantage.."
          features={[
            'Demand forecasting and trend prediction models',
            'Predictive maintenance and asset intelligence systems',
            'Customer churn and revenue prediction analytics',
            'Scenario simulation and what-if analysis',
            'Real-time scoring and behavior analytics pipelines',
          ]}
          benefits={[
            'Reduce operational risks and unexpected downtime',
            'Optimize inventory, supply chain, and resource planning',
            'Improve revenue forecasting and strategic planning',
            'Enable proactive decision-making with predictive insights',
            'Increase business agility with real-time intelligence',
          ]}
          visual={<PredictiveAnalyticsVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Teach Machines to See and Understand  "
          title="Computer Vision Solutions."
          description="Deploy AI that can perceive, analyze, and act on visual data at scale. From manufacturing 
quality control to retail intelligence and medical imaging, our computer vision solutions deliver 
real-time visual understanding across industries."
          features={[
            'Object detection and image classification systems',
            'Video analytics and surveillance intelligence',
            'OCR and intelligent document understanding',
            'Quality inspection and defect detection automation',
            'Pose estimation and gesture recognition solutions',
          ]}
          benefits={[
            'Automate visual inspection and quality control processes',
            'Improve security and safety monitoring capabilities',
            'Generate insights from large-scale visual data',
            'Reduce manual inspection effort and operational costs',
            'Enhance operational efficiency with real-time visual intelligence',
          ]}
          visual={<ComputerVisionVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="06"
          eyebrow="Operationalizing AI at Enterprise Scale "
          title="MLOps & AI Engineering."
          description="Bridge the gap between AI experimentation and reliable, production-grade systems. We design 
and implement the infrastructure, pipelines, and governance needed for AI to perform 
consistently at scale — across cloud, on-prem, and hybrid environments. ."
          features={[
            'Automated CI/CD pipelines for machine learning workflows',
            'Model monitoring, drift detection, and retraining pipelines',
            'Scalable AI infrastructure and GPU optimization',
            'Vector database integration and model version control',
            'AI governance, compliance, and audit frameworks',
          ]}
          benefits={[
            'Accelerate AI model deployment cycles',
            'Maintain model accuracy and reliability over time',
            'Reduce operational risks and system downtime',
            'Enable scalable enterprise AI operations',
            'Ensure secure, compliant, and governed AI implementations',
          ]}
          visual={<MLOpsVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="07"
          eyebrow="Understanding Text, Image, Audio & Video Together "
          title="Multimodal AI."
          description="Next-generation AI that processes and reasons across multiple data modalities simultaneously 
— enabling richer, more contextual intelligence than any single-modal system can achieve. ."
          features={[
            'Vision-language AI systems for text and image understanding',
            'Audio and speech intelligence processing solutions',
            'Multimodal Retrieval-Augmented Generation (RAG)',
            'Video and language understanding capabilities',
            'Document, diagram, and screenshot comprehension systems',
          ]}
          benefits={[
            'Deliver richer AI experiences across multiple content formats',
            'Improve contextual understanding of complex inputs',
            'Unify enterprise intelligence across diverse data sources',
            'Enhance product innovation with advanced AI capabilities',
            'Differentiate digital experiences with multimodal intelligence',
          ]}
          visual={<MultimodalAIVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="08"
          eyebrow="Precision Intelligence for Patient Outcomes "
          title="AI for Healthcare & Life Sciences"
          description="Purpose-built AI solutions for healthcare providers, pharmaceutical companies, health-tech 
startups, and medical device manufacturers — designed to improve outcomes, reduce costs, 
and accelerate discovery while meeting strict regulatory and privacy standards."
          features={[
            'Medical imaging AI for radiology and pathology analysis',
            'Clinical NLP and electronic health record intelligence',
            'Patient risk stratification and predictive healthcare analytics',
            'Remote patient monitoring and wearable AI solutions',
            'HIPAA and HL7 compliant AI architectures',
          ]}
          benefits={[
            'Improve diagnosis accuracy and patient outcomes',
            'Reduce administrative and clinical operational burden',
            'Accelerate healthcare research and drug discovery initiatives',
            'Enhance patient safety and care quality',
            'Enable secure and compliant healthcare AI adoption',
          ]}
          visual={<HealthcareAIVisual accent={accent} />}
          accent={accent}
          flip
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
