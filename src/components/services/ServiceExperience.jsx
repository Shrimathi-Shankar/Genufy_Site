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
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
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
        <linearGradient id="meshGgen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#24baac" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#meshGgen)" strokeWidth="0.18" strokeDasharray="1.5 1.5" />
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

/* ---------------- Generic Visuals (one per section) ---------------- */

function CapabilitiesVisual({ accent, items }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 md:p-7">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Capabilities</div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
      </div>
      <div className="mt-4 space-y-2 relative">
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-10 pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent, ${accent}40, transparent)`, mixBlendMode: 'screen' }}
          animate={{ y: ['-30px', '320px', '-30px'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {items.slice(0, 6).map((r, i) => (
          <motion.div
            key={r}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2.5 text-[12px] text-white/80 font-mono"
          >
            <span className="text-white/40">›</span>
            <span className="flex-1 truncate">{r}</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#90eb61', boxShadow: '0 0 8px #90eb61' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OutcomesVisual({ accent, items }) {
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
      <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 grid place-items-center">
        <div className="relative">
          {[200, 300, 400].map((s, i) => (
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
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-40 w-40 md:h-48 md:w-48 rounded-full grid place-items-center border border-white/20 backdrop-blur-xl bg-white/[0.04] text-center"
          style={{ boxShadow: `0 0 80px -8px ${accent}99, inset 0 0 60px rgba(144,235,97,0.12)` }}
        >
          <div>
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Business</div>
            <div className="mt-1 font-display text-2xl md:text-3xl text-gradient-gt">Impact</div>
          </div>
        </motion.div>
      </div>
      {items.slice(0, 4).map((c, i) => (
        <motion.div
          key={c}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          className="absolute rounded-full border border-white/15 bg-black/65 backdrop-blur-xl px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-white/70 max-w-[180px] truncate"
          style={{
            top: ['12%', '22%', '78%', '70%'][i],
            left: ['6%', '70%', '8%', '66%'][i],
            boxShadow: `0 0 24px -8px ${accent}cc`,
          }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}

function ProcessVisual({ accent, items }) {
  const stages = items.slice(0, 5);
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="procG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#90eb61" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <line x1="6" y1="50" x2="94" y2="50" stroke="url(#procG)" strokeWidth="0.35" strokeDasharray="2 2" />
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
      <div className="relative flex h-full items-center justify-between gap-4">
        {stages.map((s, i) => (
          <motion.div
            key={s.phase || i}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 flex-1"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl font-display font-bold text-sm"
              style={{ boxShadow: `0 0 28px -6px ${accent}cc`, color: accent }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/75 text-center">{s.phase}</div>
            <div className="text-[10px] text-white/55 text-center leading-snug line-clamp-3">{s.body}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StackVisual({ accent, items }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        }}
      />
      <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">Stack</div>
      <div className="mt-6 flex flex-wrap gap-3 relative">
        {items.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-xs md:text-sm tracking-wide text-white/85 backdrop-blur-sm"
            style={{ boxShadow: `0 0 26px -10px ${accent}aa` }}
          >
            {t}
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-6 right-6 h-1.5 rounded-full overflow-hidden bg-white/10"
      >
        <motion.div
          className="h-full w-1/3 rounded-full"
          style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function HeroScene({ service }) {
  const letters = Array.from((service.title || '').toUpperCase());
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
          aria-label={service.title}
          className={HERO_TITLE_CLASS}
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { delayChildren: 0.2, staggerChildren: 0.05 } },
            }}
            className="inline-flex flex-wrap"
            style={{ overflow: 'visible' }}
          >
            {letters.map((ch, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 0.9 }}>
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
                  className={i < Math.ceil(letters.length / 2) ? 'text-gradient-gt' : 'text-white'}
                  style={{
                    display: 'inline-block',
                    textShadow:
                      i < Math.ceil(letters.length / 2)
                        ? 'none'
                        : 'none',
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
              text={service.subtitle}
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text={service.description}
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
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
              {features?.length > 0 && (
                <div>
                  <Eyebrow>Key Features</Eyebrow>
                  <div className="mt-5">
                    <StaggerFeatures items={features} accent={accent} />
                  </div>
                </div>
              )}
              {benefits?.length > 0 && (
                <div>
                  <Eyebrow>Business Benefits</Eyebrow>
                  <div className="mt-5">
                    <StaggerFeatures items={benefits} accent={accent} />
                  </div>
                </div>
              )}
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

function FinalCTA({ accent, onClose, service }) {
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
          <RevealWords text={`Ready to accelerate with ${service.title}?`} />
        </h2>
        <RevealWords
          text="Bring us the ambition. We'll return strategy, design, and a working proof of value in weeks — not quarters."
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
            Start a Project
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Scroll progress dots ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Capabilities', 'Outcomes', 'Process', 'Stack', 'Begin'];
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

export default function ServiceExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#90eb61';

  return (
    <>

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Capabilities"
          title={`What we build with ${service.title}.`}
          description={service.body || service.description}
          features={service.features}
          visual={<CapabilitiesVisual accent={accent} items={service.features || []} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Outcomes"
          title="Business impact that compounds."
          description="Measurable outcomes built into every engagement — designed to compound across teams, quarters, and platforms."
          benefits={service.benefits}
          visual={<OutcomesVisual accent={accent} items={service.benefits || []} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Process"
          title="A four-act delivery rhythm."
          description="From discovery to operate, a proven cadence that keeps teams aligned and value flowing from week one."
          visual={<ProcessVisual accent={accent} items={service.timeline || []} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Stack"
          title="The technologies we use."
          description="A modern, opinionated stack — proven at scale and continuously refined across engagements."
          visual={<StackVisual accent={accent} items={service.tech || []} />}
          accent={accent}
          flip
        />

        <FinalCTA accent={accent} onClose={onClose} service={service} />
      </div>
    </>
  );
}
