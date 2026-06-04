import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
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
              text="From strategy and solution design to deployment and continuous optimization, we build AI systems that are reliable, scalable, and engineered to deliver consistent business value in production environments."
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

/* ============================================================
   Section — Our Promise (AI Pillars)
============================================================ */

function PillarIcon({ type }) {
  const p = {
    width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (type) {
    case 'lifecycle':
      return (<svg {...p}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 4v5h-5" /><circle cx="12" cy="12" r="2.3" /></svg>);
    case 'outcomes':
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r="0.7" fill="currentColor" /></svg>);
    case 'secure':
      return (<svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>);
    case 'roi':
      return (<svg {...p}><path d="M4 5v14h16" /><path d="M7 15l4-5 3 3 5-7" /><path d="M19 6h-3.5M19 6v3.5" /></svg>);
    default: return null;
  }
}

const PILLARS = [
  {
    icon: 'lifecycle',
    title: 'Full AI Lifecycle Ownership',
    body: 'From data strategy and model design to deployment, monitoring, and continuous optimization — we own the entire journey.',
  },
  {
    icon: 'outcomes',
    title: 'Business Outcomes First',
    body: 'Every model is engineered around measurable business goals, not novelty — AI that moves the metrics that matter.',
  },
  {
    icon: 'secure',
    title: 'Secure & Compliant Deployment',
    body: 'Privacy-first, audited, and compliant by design — deployed safely across cloud and on-premise environments.',
  },
  {
    icon: 'roi',
    title: 'Measurable ROI Focus',
    body: 'Clear baselines, tracked impact, and transparent reporting so every AI investment proves its value.',
  },
];

function PillarCard({ pillar, i, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7"
    >
      {/* Hover gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(80% 60% at 30% 0%, ${accent}22, transparent 70%)` }}
      />
      {/* Hover glow ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 60px -22px ${accent}66, 0 0 44px -14px ${accent}55` }}
      />
      {/* Index watermark */}
      <span className="absolute top-5 right-6 font-display text-2xl font-bold text-white/[0.06]">
        0{i + 1}
      </span>

      <div
        className="relative grid h-14 w-14 place-items-center rounded-2xl text-black transition-transform duration-500 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, #90eb61, ${accent})`,
          boxShadow: `0 12px 30px -12px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.35)`,
        }}
      >
        <PillarIcon type={pillar.icon} />
      </div>

      <h3 className="relative mt-5 font-display text-lg md:text-xl font-semibold tracking-tight text-white">
        {pillar.title}
      </h3>
      <p className="relative mt-2.5 text-sm text-white/65 leading-relaxed">{pillar.body}</p>
    </motion.div>
  );
}

function AIPillars({ accent }) {
  return (
    <section className="relative px-6 md:px-12 py-28 md:py-36 overflow-hidden">
      <FloatingOrbs accent={accent} />
      <GridBackdrop />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            The pillars behind every{' '}
            <span className="text-gradient-gt">AI system</span> we ship.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
            Enterprise AI you can trust — engineered for outcomes, security, and measurable impact from day one.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} pillar={p} i={i} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section — Industries We Serve (interactive AI explorer)
============================================================ */

function IndustryIcon({ type }) {
  const p = {
    width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (type) {
    case 'health':
      return (<svg {...p}><path d="M12 21s-7-4.3-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.7-7 10-7 10z" /><path d="M8.5 11.5H11l1-2 1.5 4 1-2h1.5" /></svg>);
    case 'finance':
      return (<svg {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 14.5h3" /></svg>);
    case 'retail':
      return (<svg {...p}><path d="M6.5 8h11l-1 12h-9z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>);
    case 'factory':
      return (<svg {...p}><path d="M3 21V11l5 3V11l5 3V9l5 3v6z" /><path d="M3 21h18" /><path d="M8 17h0M13 17h0M18 17h0" /></svg>);
    case 'truck':
      return (<svg {...p}><rect x="2.5" y="7" width="11" height="9" rx="1" /><path d="M13.5 10h3.6l3 3v3h-6.6" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>);
    case 'people':
      return (<svg {...p}><circle cx="9" cy="8" r="2.7" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="16.6" cy="9" r="2" /><path d="M20.5 18.5A4.3 4.3 0 0 0 15 14.9" /></svg>);
    case 'legal':
      return (<svg {...p}><path d="M12 4v16" /><path d="M6 21h12" /><path d="M5 8h14" /><path d="M5 8l-2 5a2.8 2.8 0 0 0 5 0z" /><path d="M19 8l-2 5a2.8 2.8 0 0 0 5 0z" /></svg>);
    case 'saas':
      return (<svg {...p}><path d="M7.5 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.2A3.6 3.6 0 0 1 17.5 18z" /></svg>);
    default: return null;
  }
}

const INDUSTRIES = [
  { id: 'healthcare', name: 'Healthcare', icon: 'health', tag: 'Clinical-grade AI for safer, faster, and more predictive care.', uses: ['Medical imaging', 'Patient risk prediction', 'Clinical NLP', 'EHR intelligence', 'Drug discovery'] },
  { id: 'fintech', name: 'FinTech', icon: 'finance', tag: 'Real-time intelligence that protects, scores, and personalizes finance.', uses: ['Fraud detection', 'AML', 'Risk modeling', 'Personalized banking', 'Algorithmic trading'] },
  { id: 'retail', name: 'Retail & E-commerce', icon: 'retail', tag: 'AI that anticipates demand and converts every interaction.', uses: ['Recommendation engines', 'Demand forecasting', 'Visual search', 'Dynamic pricing'] },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'factory', tag: 'Self-optimizing factories powered by predictive intelligence.', uses: ['Predictive maintenance', 'Quality inspection', 'Supply chain optimization', 'Digital twins'] },
  { id: 'logistics', name: 'Logistics', icon: 'truck', tag: 'Intelligent movement across every route, warehouse, and fleet.', uses: ['Route optimization', 'Demand planning', 'Warehouse automation', 'Fleet intelligence'] },
  { id: 'hr', name: 'HR & Talent', icon: 'people', tag: 'AI that finds, ranks, and retains the right people.', uses: ['Resume screening', 'Candidate ranking', 'Employee retention prediction'] },
  { id: 'legal', name: 'Legal & Compliance', icon: 'legal', tag: 'Contract and regulatory intelligence at machine speed.', uses: ['Contract intelligence', 'Clause extraction', 'Regulatory monitoring'] },
  { id: 'saas', name: 'SaaS & Enterprise', icon: 'saas', tag: 'Embedded AI that makes every product smarter and stickier.', uses: ['AI copilots', 'Product intelligence', 'Usage analytics', 'Churn prediction'] },
];

function IndustriesExplorer({ accent }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = INDUSTRIES.length;

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % count), 4600);
    return () => clearInterval(t);
  }, [paused, count]);

  const ind = INDUSTRIES[active];

  return (
    <section
      className="relative px-6 md:px-12 py-28 md:py-36 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FloatingOrbs accent={accent} />
      <GridBackdrop />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            AI intelligence, tuned to{' '}
            <span className="text-gradient-gt">your industry</span>.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
            Explore how we apply AI across sectors — each with battle-tested use cases engineered for real impact.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:gap-10 lg:grid-cols-[0.85fr_1.5fr] items-stretch">
          {/* Industry selector — horizontal scroll on mobile, vertical list on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 [scrollbar-width:none]">
            {INDUSTRIES.map((it, i) => {
              const isActive = i === active;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group relative flex items-center gap-3 shrink-0 rounded-2xl border pl-4 pr-5 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-white/20 bg-white/[0.07]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ind-active-bar"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full hidden lg:block"
                      style={{ background: 'linear-gradient(180deg,#90eb61,#24baac)' }}
                    />
                  )}
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-xl transition-colors duration-300 ${
                      isActive ? 'text-black' : 'text-white/60'
                    }`}
                    style={
                      isActive
                        ? { background: `linear-gradient(135deg,#90eb61,${accent})` }
                        : { background: 'rgba(255,255,255,0.04)' }
                    }
                  >
                    <IndustryIcon type={it.icon} />
                  </span>
                  <span
                    className={`whitespace-nowrap text-sm font-medium tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/55'
                    }`}
                  >
                    {it.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel — stretches to match the industry list height */}
          <div className="relative flex h-full min-h-[440px] flex-col rounded-[28px] border border-white/10 bg-white/[0.025] backdrop-blur-xl p-7 md:p-9 overflow-hidden">
            {/* ambient corner glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full blur-[100px] opacity-60"
              style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-[110px] opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.4), transparent 70%)' }}
            />
            {/* grid texture */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 75%)',
              }}
            />
            {/* top gradient hairline */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(144,235,97,0.6), rgba(36,186,172,0.5), transparent)' }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-1 flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="grid h-16 w-16 flex-none place-items-center rounded-2xl text-black"
                      style={{
                        background: `linear-gradient(135deg,#90eb61,${accent})`,
                        boxShadow: `0 16px 38px -16px ${accent}, inset 0 1px 0 rgba(255,255,255,0.35)`,
                      }}
                    >
                      <IndustryIcon type={ind.icon} />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.4em] uppercase text-white/45">
                        Industry {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                      </div>
                      <h3 className="mt-1 font-display text-2xl md:text-3xl lg:text-[2.2rem] font-bold tracking-tight leading-tight text-gradient-gt">
                        {ind.name}
                      </h3>
                    </div>
                  </div>
                  {/* ghost index */}
                  <span className="font-display text-5xl md:text-6xl font-bold leading-none text-white/[0.05] select-none">
                    {String(active + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* tagline */}
                <p className="mt-4 max-w-md text-sm md:text-[15px] text-white/55 leading-relaxed">
                  {ind.tag}
                </p>

                {/* AI capability timeline — fills the available height */}
                <div className="mt-7 flex flex-1 flex-col justify-center">
                  <div className="mb-4 text-[10px] tracking-[0.4em] uppercase text-white/35">
                    AI Capabilities
                  </div>
                  <div className="relative pl-1">
                    <span
                      aria-hidden
                      className="absolute left-[7px] top-3 bottom-3 w-px"
                      style={{ background: 'linear-gradient(180deg, rgba(144,235,97,0.55), rgba(36,186,172,0.35), transparent)' }}
                    />
                    <div className="space-y-2.5">
                      {ind.uses.map((u, k) => (
                        <motion.div
                          key={u}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18 + k * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="group/cap relative flex items-center gap-4"
                        >
                          <span
                            className="relative z-10 h-3.5 w-3.5 flex-none rounded-full ring-4 ring-black/50"
                            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
                          />
                          <div className="flex flex-1 items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition-all duration-300 group-hover/cap:border-white/15 group-hover/cap:bg-white/[0.05]">
                            <span className="text-sm md:text-[15px] text-white/85">{u}</span>
                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                              {String(k + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer — pagination + auto-explore label */}
            <div className="relative mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {INDUSTRIES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show industry ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: i === active ? 24 : 7,
                      background:
                        i === active
                          ? 'linear-gradient(90deg,#90eb61,#24baac)'
                          : 'rgba(255,255,255,0.18)',
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-white/35">
                Auto-explore
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AIMLExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#90eb61';

  return (
    <>

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
          ]}
          benefits={[
            'Accelerate content and code generation across teams',
            'Reduce manual effort with intelligent workflow automation',
            'Deliver personalized customer and employee experiences',
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
          ]}
          benefits={[
            'Automate repetitive and complex business processes',
            'Provide 24/7 intelligent support and assistance',
            'Accelerate operational decision-making and execution',
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
          ]}
          benefits={[
            'Extract valuable insights from unstructured data',
            'Improve customer support automation and responsiveness',
            'Automate document classification and processing workflows',
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
          ]}
          benefits={[
            'Reduce operational risks and unexpected downtime',
            'Optimize inventory, supply chain, and resource planning',
            'Improve revenue forecasting and strategic planning',
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
          ]}
          benefits={[
            'Automate visual inspection and quality control processes',
            'Improve security and safety monitoring capabilities',
            'Generate insights from large-scale visual data',
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
          ]}
          benefits={[
            'Accelerate AI model deployment cycles',
            'Maintain model accuracy and reliability over time',
            'Reduce operational risks and system downtime',
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
          ]}
          benefits={[
            'Deliver richer AI experiences across multiple content formats',
            'Improve contextual understanding of complex inputs',
            'Unify enterprise intelligence across diverse data sources',
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
          ]}
          benefits={[
            'Improve diagnosis accuracy and patient outcomes',
            'Reduce administrative and clinical operational burden',
            'Accelerate healthcare research and drug discovery initiatives',
          ]}
          visual={<HealthcareAIVisual accent={accent} />}
          accent={accent}
          flip
        />

        <AIPillars accent={accent} />

        <IndustriesExplorer accent={accent} />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
