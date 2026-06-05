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

/* ---------------- Shared atoms (mirror Informatica / AI&ML) ---------------- */

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
        <linearGradient id="devopsMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#90eb61" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#devopsMesh)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
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
  const letters = Array.from('DEVOPS');
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
          aria-label="DevOps"
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
                  {ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] items-end">
          <div className="max-w-2xl">
            <RevealWords
              text="Accelerating Innovation Through Modern Infrastructure"
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="At Genufy, we help organizations accelerate software delivery, modernize infrastructure, and improve operational efficiency through DevOps and Platform Engineering."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From CI/CD pipelines and cloud-native infrastructure to Kubernetes orchestration and observability, we help businesses deliver applications faster, improve resilience, and achieve scalable digital growth."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
            {/* <RevealWords
              text="Our solutions focus on automation, scalability, reliability, and continuous innovation across the entire software delivery lifecycle."
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

function MaturityVisual({ accent }) {
  const levels = ['Manual', 'Repeatable', 'Automated', 'Measured', 'Optimized'];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Maturity Model</div>
          <div className="mt-1 font-display text-xl md:text-2xl">DevOps Index</div>
        </div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
      </div>
      <div className="mt-8 space-y-3">
        {levels.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex items-center justify-between text-[10px] tracking-[0.35em] uppercase text-white/65">
              <span>Lvl {i + 1} · {l}</span>
              <span className="font-mono text-white/85">{[28, 52, 71, 88, 96][i]}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: i >= 3 ? 'linear-gradient(90deg, #90eb61, #24baac)' : 'rgba(255,255,255,0.35)' }}
                animate={{ width: [`0%`, `${[28, 52, 71, 88, 96][i]}%`] }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CICDPipelineVisual({ accent }) {
  /* CI/CD engineering shown as a live pipeline run: commit → build → test →
     stage → prod, each stage with a real status (done · running · gated), a
     progress spine that fills as stages pass, and DORA-style delivery metrics. */
  const stages = [
    { name: 'Commit', meta: 'a3f9c2 · main', dur: '2s', state: 'done' },
    { name: 'Build', meta: 'docker image', dur: '48s', state: 'done' },
    { name: 'Test', meta: '248 passed', dur: '1m 04s', state: 'done' },
    { name: 'Deploy · Stage', meta: 'rolling update', dur: '12s', state: 'run' },
    { name: 'Deploy · Prod', meta: 'awaiting gate', dur: '-', state: 'pending' },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">CI/CD Pipeline</div>
          <div className="mt-1 font-display text-xl md:text-2xl">Run #2147</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          <motion.span
            className="h-3.5 w-3.5 rounded-full border-2 border-white/15"
            style={{ borderTopColor: accent }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
          Running
        </div>
      </div>

      {/* stages */}
      <div className="relative mt-6">
        <div className="absolute left-[13px] top-3 bottom-3 w-px bg-white/12" />
        <motion.div
          className="absolute left-[13px] top-3 w-px"
          style={{ background: 'linear-gradient(180deg, #90eb61, #24baac)' }}
          initial={{ height: '0%' }}
          whileInView={{ height: '64%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <ul className="space-y-2">
          {stages.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex items-center gap-3"
            >
              {/* status node */}
              {s.state === 'done' ? (
                <span className="z-10 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border border-white/15" style={{ background: `${accent}22` }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5 5 9.5 10 3.5" stroke="#90eb61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : s.state === 'run' ? (
                <motion.span
                  className="z-10 h-[26px] w-[26px] shrink-0 rounded-full border-2 border-white/15 bg-black"
                  style={{ borderTopColor: accent }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <span className="z-10 h-[26px] w-[26px] shrink-0 rounded-full border border-dashed border-white/20 bg-black" />
              )}

              {/* stage card */}
              <div
                className="flex flex-1 items-center justify-between rounded-lg border px-3 py-1.5"
                style={{
                  borderColor: s.state === 'run' ? `${accent}66` : 'rgba(255,255,255,0.10)',
                  background: s.state === 'run' ? `${accent}14` : 'rgba(255,255,255,0.03)',
                }}
              >
                <div>
                  <div className="text-[11px] font-medium text-white/90">{s.name}</div>
                  <div className="font-mono text-[9px] text-white/45">{s.meta}</div>
                </div>
                <div className="font-mono text-[10px] text-white/50">{s.dur}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* delivery metrics */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { k: 'Lead time', v: '7 min' },
          { k: 'Success', v: '99.2%' },
          { k: 'Deploys', v: '24 / day' },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
            style={{ boxShadow: `0 0 22px -14px ${accent}` }}
          >
            <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">{m.k}</div>
            <div className="mt-0.5 font-mono text-[12px] text-white/85">{m.v}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IaCTerminalVisual({ accent }) {
  const lines = [
    '$ terraform plan',
    '+ aws_eks_cluster.prod',
    '+ aws_vpc.main · 10.0.0.0/16',
    '+ helm_release.ingress',
    '✓ Plan: 18 to add, 0 to change',
    '$ terraform apply --auto-approve',
    '◆ Applying changes …',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">IaC · Terminal</div>
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
            transition={{ duration: 0.4, delay: i * 0.18 }}
            className={l.startsWith('$') ? 'text-white' : l.startsWith('+') ? 'text-emerald-300' : 'text-white/65'}
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
    </div>
  );
}

function KubernetesVisual({ accent }) {
  /* Kubernetes platform services shown as a live cluster: worker nodes each run
     a set of pods (steady "running" heartbeat), the HPA scales a new pod in,
     CPU is tracked per node, and a Helm release ships - clearly container
     platform engineering at work. */
  const nodes = [
    { name: 'node-1', cpu: 62, pods: 4 },
    { name: 'node-2', cpu: 48, pods: 4 },
    { name: 'node-3', cpu: 35, pods: 3, scaling: true },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <path d="M12 2l8.5 5v10L12 22l-8.5-5V7z" stroke={accent} strokeWidth="1.3" fill="rgba(255,255,255,0.03)" />
            <circle cx="12" cy="12" r="2.6" stroke="#90eb61" strokeWidth="1.3" />
            {[0, 72, 144, 216, 288].map((a) => {
              const r = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={12 + Math.cos(r) * 2.6}
                  y1={12 + Math.sin(r) * 2.6}
                  x2={12 + Math.cos(r) * 6.5}
                  y2={12 + Math.sin(r) * 6.5}
                  stroke="#90eb61"
                  strokeWidth="1"
                  opacity="0.6"
                />
              );
            })}
          </motion.svg>
          <div>
            <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Kubernetes</div>
            <div className="mt-0.5 font-display text-lg md:text-xl">prod-cluster</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-white/55">
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#90eb61', boxShadow: `0 0 8px ${accent}` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          Healthy
        </div>
      </div>

      {/* nodes with pods */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {nodes.map((n, ni) => (
          <motion.div
            key={n.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: ni * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="text-[9px] tracking-[0.25em] uppercase text-white/45">{n.name}</div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {Array.from({ length: n.pods }).map((_, pi) => (
                <motion.div
                  key={pi}
                  className="h-5 rounded-md border"
                  style={{ borderColor: `${accent}55`, background: `${accent}1a` }}
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: (ni + pi) * 0.2 }}
                />
              ))}
              {n.scaling && (
                <motion.div
                  className="grid h-5 place-items-center rounded-md border border-dashed"
                  style={{ borderColor: accent }}
                  animate={{ opacity: [0, 1, 0], scale: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-[9px] font-bold" style={{ color: accent }}>+</span>
                </motion.div>
              )}
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
                initial={{ width: '0%' }}
                whileInView={{ width: `${n.cpu}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.3 + ni * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-1 font-mono text-[8px] text-white/40">cpu {n.cpu}%</div>
          </motion.div>
        ))}
      </div>

      {/* autoscale + helm */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">Autoscale · HPA</div>
          <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[12px] text-white/85">
            6
            <motion.span style={{ color: accent }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>
              →
            </motion.span>
            9
            <span className="text-[9px]" style={{ color: accent }}>↑ replicas</span>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">Helm Release</div>
          <div className="mt-0.5 font-mono text-[12px] text-white/85">api-gateway · v2.3 ✓</div>
        </div>
      </div>
    </div>
  );
}

function ObservabilityVisual({ accent }) {
  const series = [38, 32, 35, 28, 30, 22, 26, 18, 20, 14];
  const alerts = [
    'svc.api · p99 latency normal',
    'k8s.node-3 · cpu 64%',
    'svc.auth · error rate 0.04%',
    'pipeline · deploy succeeded',
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">SRE · Observability</div>
          <div className="mt-1 font-display text-xl md:text-2xl">SLO · 99.95%</div>
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/55">
          ◉ Healthy
        </motion.div>
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-4 h-32 w-full">
        <defs>
          <linearGradient id="obsG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
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
          fill="url(#obsG)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        {series.map((v, i) => (
          <motion.circle key={i} cx={2 + i * 10} cy={v} r="0.6" fill="#fff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }} />
        ))}
      </svg>

      <div className="mt-4 space-y-1.5 font-mono text-[11px]">
        {alerts.map((a, i) => (
          <motion.div
            key={a}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="text-white/40">{`${10 + i}:42`}</span>
            <span className="text-white/85 flex-1 truncate">{a}</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
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
          <RevealWords text="Ready to Engineer a Faster, Safer Delivery Backbone?" />
        </h2>
        <RevealWords
          text="Let's build CI/CD pipelines, cloud-native platforms, and SRE practices your teams will trust in production."
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
            Talk to DevOps Experts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
        </motion.div>
      </div>

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Talk to DevOps Experts" />
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Consult', 'CI/CD', 'IaC', 'K8s', 'Observe'];
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

export default function DevOpsExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#24baac';

  return (
    <>
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="DevOps Transformation"
          title="DevOps Consulting & Transformation"
          description="Transform software delivery with modern DevOps practices, automation frameworks, and cloud-native strategies that improve collaboration, accelerate releases, and enhance operational efficiency."
          features={[
            'DevOps maturity assessment',
            'Process transformation strategy',
            'DevOps roadmap planning',
          ]}
          benefits={[
            'Faster development lifecycle',
            'Improved operational efficiency',
            'Better collaboration across teams',
          ]}
          visual={<MaturityVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Continuous Delivery Automation"
          title="CI/CD Engineering Services"
          description="Design and implement robust CI/CD pipelines that automate code integration, testing, and deployment, enabling faster releases, improved software quality, and reliable delivery across environments."
          features={[
            'Automated build and deployment pipelines',
            'Continuous testing integration',
            'Multi-stage deployment workflows',
          ]}
          benefits={[
            'Reduced deployment time',
            'Minimized release failures',
            'Increased deployment frequency',
          ]}
          visual={<CICDPipelineVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Cloud-Native Infrastructure"
          title="Cloud & Infrastructure Automation"
          description="Automate cloud infrastructure provisioning, configuration, and management using Infrastructure as Code (IaC) and cloud-native practices, enabling greater scalability, consistency, and operational efficiency."
          features={[
            'Infrastructure as Code (IaC) implementation',
            'Automated environment provisioning',
            'Cloud infrastructure management',
          ]}
          benefits={[
            'Faster infrastructure deployment',
            'Consistent environments',
            'Reduced manual operations',
          ]}
          visual={<IaCTerminalVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Container Platform Engineering"
          title="Kubernetes Platform Services."
          description="Build and manage scalable Kubernetes and container platforms that streamline application deployment, improve resource utilization, and deliver resilient, cloud-native operations across environments."
          features={[
            'Docker containerization',
            'Kubernetes cluster setup',
            'Helm-based deployments',
          ]}
          benefits={[
            'High availability architecture',
            'Faster application deployment',
            'Better resource optimization',
          ]}
          visual={<KubernetesVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Observability & Reliability"
          title="Monitoring, SRE & Observability."
          description="Implement comprehensive monitoring, Site Reliability Engineering (SRE), and observability solutions to gain real-time visibility, improve system reliability, reduce downtime, and ensure optimal application performance."
          features={[
            'Centralized logging and monitoring',
            'Real-time alerts and notifications',
            'Application performance monitoring',
          ]}
          benefits={[
            'Faster issue resolution',
            'Reduced downtime',
            'Improved system performance',
          ]}
          visual={<ObservabilityVisual accent={accent} />}
          accent={accent}
        />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
