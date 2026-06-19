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

/* ---------------- Shared atoms (mirror Informatica / AI / DevOps / MuleSoft) ---------------- */

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
        <linearGradient id="pegaMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#90eb61" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#pegaMesh)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
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
  const letters = Array.from('PEGA');
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
          aria-label="Pega"
          className={HERO_TITLE_CLASS}
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { delayChildren: 0.2, staggerChildren: 0.08 } } }}
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
                  className={i < 2 ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow: i < 2 ? 'none' : 'none',
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
              text="BPM, Decisioning & Workflow Automation"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="We design and implement Pega solutions that unify business processes, customer engagement, and intelligent automation."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From BPM and CRM to AI decisioning, we build scalable enterprise applications.
Drive faster operations, greater agility, and sustainable digital growth."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            {/* <RevealWords
              text="Our expert team designs and integrates scalable Pega systems that accelerate business outcomes, automate workflows, and provide a strong foundation for future growth and innovation."
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

function BPMVisual({ accent }) {
  /* Pega BPM - enterprise process automation as a live case-lifecycle console:
     each stage of the case advances in sequence, the active stage highlights as
     the case moves through the process, and an SLA gauge fills. */
  const stages = [
    { name: 'Intake', sub: 'auto-captured' },
    { name: 'Triage', sub: 'rules applied' },
    { name: 'Assign', sub: 'skill-based routing' },
    { name: 'Approve', sub: 'guided review' },
    { name: 'Resolve', sub: 'closed · SLA met' },
  ];
  const stepT = 0.9;
  const cycleT = stages.length * stepT;
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Process Automation</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Case Lifecycle</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">live</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {stages.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            className="flex items-center gap-3 rounded-lg border bg-white/[0.03] px-3 py-2"
            style={{ borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <motion.span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-[10px]"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: accent }}
              animate={{
                borderColor: ['rgba(255,255,255,0.15)', `${accent}cc`, 'rgba(255,255,255,0.15)'],
                backgroundColor: ['rgba(255,255,255,0)', `${accent}1f`, 'rgba(255,255,255,0)'],
              }}
              transition={{ duration: stepT, repeat: Infinity, repeatDelay: cycleT - stepT, delay: i * stepT, ease: 'easeInOut' }}
            >
              {String(i + 1).padStart(2, '0')}
            </motion.span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[12px] text-white/85">{s.name}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-white/40">{s.sub}</div>
            </div>
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#90eb61', boxShadow: '0 0 8px #90eb61' }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: stepT, repeat: Infinity, repeatDelay: cycleT - stepT, delay: i * stepT, ease: 'easeInOut' }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] tracking-[0.4em] uppercase text-white/45">Process SLA · 30d</div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }} initial={{ width: '0%' }} whileInView={{ width: '94%' }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
          <span>1,240 cases</span>
          <span>99.4% on-time</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Automated
      </motion.div>
    </div>
  );
}

function CRMVisual({ accent }) {
  /* Pega CRM - a unified customer-engagement console: live interactions stream
     in across every channel against one profile, with a CSAT gauge. */
  const rows = [
    { ch: 'chat', label: 'support · resolved' },
    { ch: 'email', label: 'campaign · replied' },
    { ch: 'call', label: 'inbound · 4m 12s' },
    { ch: 'web', label: 'pricing · browsing' },
    { ch: 'case', label: '#4821 · escalated' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Customer Engagement</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Unified Profile</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">omni</span>
        </div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            style={{ boxShadow: i === 3 ? `0 0 24px -10px ${accent}aa` : 'none' }}
          >
            <span className="w-12 shrink-0 text-[9px] tracking-[0.2em] uppercase text-white/45">{r.ch}</span>
            <span className="flex-1 truncate text-white/85">{r.label}</span>
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] tracking-[0.4em] uppercase text-white/45">CSAT · 30d</div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }} initial={{ width: '0%' }} whileInView={{ width: '92%' }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
          <span>4.7 / 5 CSAT</span>
          <span>8.2k touches</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        360°
      </motion.div>
    </div>
  );
}

function DecisioningVisual({ accent }) {
  /* Pega AI & Decisioning - a real-time Next-Best-Action console: candidate
     actions are scored by propensity, the bars fill live, and the top action
     is locked in as the next best action. */
  const actions = [
    { name: 'Upgrade Offer', score: 0.92, win: true },
    { name: 'Retention Save', score: 0.64 },
    { name: 'Cross-sell Bundle', score: 0.48 },
    { name: 'Service Nudge', score: 0.31 },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Customer Decision Hub</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Next Best Action</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">realtime</span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {actions.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border bg-white/[0.03] px-3 py-2"
            style={{ borderColor: a.win ? `${accent}66` : 'rgba(255,255,255,0.10)', boxShadow: a.win ? `0 0 26px -10px ${accent}` : 'none' }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] text-white/85">
                {a.win && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5 5 9.5 10 3.5" stroke="#90eb61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {a.name}
              </span>
              <span className="font-mono text-[11px]" style={{ color: a.win ? accent : 'rgba(255,255,255,0.55)' }}>{a.score.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: a.win ? 'linear-gradient(90deg, #90eb61, #24baac)' : 'rgba(255,255,255,0.3)' }}
                initial={{ width: '0%' }}
                whileInView={{ width: `${a.score * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
        <span>predicted uplift</span>
        <span style={{ color: accent }}>+18%</span>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Adaptive
      </motion.div>
    </div>
  );
}

function RPAVisual({ accent }) {
  const tasks = [
    'invoice · matched',
    'kyc · validated',
    'ticket · routed',
    'order · reconciled',
    'report · generated',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Bot Orchestration</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Pega RPA</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">12 bots</span>
        </div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {tasks.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            style={{ boxShadow: i === 0 ? `0 0 24px -10px ${accent}aa` : 'none' }}
          >
            <span className="text-white/40">{`bot-${String(i + 1).padStart(2, '0')}`}</span>
            <span className="text-white/85 flex-1">{t}</span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45 mb-2">Throughput · 24h</div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
            animate={{ width: ['0%', '78%'] }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/55 font-mono">
          <span>14,820 runs</span>
          <span>99.6% success</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Centralized
      </motion.div>
    </div>
  );
}

function WorkflowVisual({ accent }) {
  /* Pega Workflow Automation - an adaptive case-orchestration console: cases
     route dynamically across systems and stages, each with a live status, and
     resolution time trends down. */
  const cases = [
    { id: 'CASE-3471', to: 'Finance', state: 'routed' },
    { id: 'CASE-3472', to: 'Tier-2', state: 'escalated' },
    { id: 'CASE-3473', to: 'Billing', state: 'auto-resolved', done: true },
    { id: 'CASE-3474', to: 'Approval', state: 'pending' },
    { id: 'CASE-3475', to: 'Service', state: 'in SLA' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Workflow Orchestration</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Case Routing</div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">auto</span>
        </div>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[12px]">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            style={{ boxShadow: c.done ? `0 0 24px -10px ${accent}aa` : 'none' }}
          >
            <span className="text-white/70">{c.id}</span>
            <span className="text-white/30">→</span>
            <span className="flex-1 truncate text-white/85">{c.to}</span>
            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: c.done ? '#90eb61' : 'rgba(255,255,255,0.45)' }}>{c.state}</span>
            {c.done ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5 5 9.5 10 3.5" stroke="#90eb61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }} />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[10px] tracking-[0.4em] uppercase text-white/45">Avg resolution · 30d</div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }} initial={{ width: '0%' }} whileInView={{ width: '82%' }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
          <span>−42% time</span>
          <span>cross-system</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-white/70"
      >
        Orchestrated
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

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Automate, Decide, and Engage with Pega?" />
        </h2>
        <RevealWords
          text="Let's design Pega BPM, CRM, AI decisioning, and RPA solutions that compound across your enterprise."
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
            Talk to Pega Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
        </motion.div>
      </div>

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Talk to Pega Experts" />
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'BPM', 'CRM', 'Decisioning', 'RPA'];
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

export default function PegaExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#24baac';

  return (
    <>
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Enterprise Process Automation"
          title="Pega BPM"
          description="Leverage Pega BPM to design, automate, and optimize end-to-end business processes across your organization. Improve productivity, reduce operational bottlenecks and empower teams with intelligent workflows that adapt to changing business needs."
          features={[
            'End-to-end process automation',
            'Drag-and-drop workflow modeling',
            'Intelligent task routing',
          ]}
          benefits={[
            'Increased operational efficiency',
            'Reduced workflow bottlenecks',
            'Improved process consistency',
          ]}
          visual={<BPMVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Customer Engagement Excellence"
          title="Pega CRM"
          description="Deliver personalized, connected customer experiences with Pega CRM. Unify customer interactions across channels, empower service and sales teams with real-time insights, and build stronger relationships through intelligent engagement, automation, and data-driven decision-making."
          features={[
            'Unified customer profiles',
            'Case management capabilities',
            'Omnichannel communication support',
          ]}
          benefits={[
            'Improved customer satisfaction',
            'Personalized customer engagement',
            'Increased sales efficiency',
          ]}
          visual={<CRMVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="AI-Powered Decision Intelligence"
          title="Pega AI & Decisioning"
          description="Empower your organization with AI-driven decisioning that analyzes customer behavior, business rules, and operational data in real time. Deliver personalized experiences, automate complex decisions, and improve efficiency through intelligent, adaptive workflows."
          features={[
            'Real-time decisioning',
            'AI-powered rules engine',
            'Adaptive analytics',
          ]}
          benefits={[
            'Faster decision-making',
            'Reduced human error',
            'Improved business agility',
          ]}
          visual={<DecisioningVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Intelligent Process Automation"
          title="Pega Robotic Process Automation"
          description="Automate repetitive, rule-based tasks across enterprise systems with Pega RPA. Improve operational efficiency by integrating bots with existing applications, reducing manual effort, and ensuring faster, error-free business processes."
          features={[
            'Automated data entry and processing',
            'Workflow automation bots',
            'Integration with existing systems',
          ]}
          benefits={[
            'Reduced manual effort',
            'Improved operational accuracy',
            'Lower operational costs',
          ]}
          visual={<RPAVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Adaptive Workflow Orchestration"
          title="Pega Workflow Automation"
          description="Design and manage end-to-end case lifecycles with Pega’s intelligent workflow automation. Streamline complex processes, improve collaboration, and ensure every case is handled efficiently with real-time visibility and adaptive decisioning."
          features={[
            'End-to-end case and workflow automation',
            'Dynamic task routing and assignment',
            'Cross-system process orchestration',
          ]}

          benefits={[
            'Streamlined business processes',
            'Improved operational efficiency',
            'Faster case resolution times',
          ]}
          visual={<WorkflowVisual accent={accent} />}
          accent={accent}
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
