import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HERO_TITLE_CLASS } from './heroTitle.js';
import MagneticButton from '../MagneticButton.jsx';
import SalesforceCloudsStory from './SalesforceCloudsStory.jsx';
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

/* ---------------- Particles ---------------- */

function Particles({ count = 32, accent = '#24baac' }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 61) % 100,
    size: 2 + ((i * 7) % 4),
    dur: 6 + ((i * 3) % 8),
    delay: (i * 0.3) % 5,
  }));
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
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
          transition={{
            duration: d.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Hero ---------------- */

function HeroScene({ service }) {
  const letters = Array.from('SALESFORCE');
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
      {/* Pulsing radial halo behind title */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120vmin] w-[120vmin] rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${service.accent}55 0%, rgba(144,235,97,0.18) 45%, transparent 75%)`,
        }}
      />

      <Particles accent={service.accent} count={40} />

      <motion.div style={{ x: tx, y: ty }} className="relative max-w-7xl mx-auto w-full">

        {/* Massive layered title with letter reveal */}
        <h1
          aria-label="Salesforce"
          className={HERO_TITLE_CLASS}
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { delayChildren: 0.2, staggerChildren: 0.06 } },
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
              text="Salesforce solutions for scale and customer success."
              className="block text-base md:text-2xl text-white/85 font-display tracking-tight leading-snug"
            />
            <RevealWords
              text="At Genufy, we provide full-spectrum Salesforce services designed to maximize ROI, optimize customer engagement, and support enterprise-grade scalability."
              className="block mt-6 text-sm md:text-base text-white/65 leading-relaxed"
            />
            <RevealWords
              text="From greenfield implementations to complex multi-org strategies, we architect robust CRM solutions tailored to your business goals."
              className="block mt-4 text-sm md:text-base text-white/65 leading-relaxed"
            />
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

/* ---------------- Visuals per section ---------------- */

function ImplementationVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full">
      {/* Floating glassy code mock cards */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, -1.2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-2 md:left-6 w-[78%] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="ml-auto text-[10px] tracking-[0.3em] uppercase text-white/40">LWC</span>
        </div>
        <pre className="mt-4 text-[11px] md:text-xs text-white/80 leading-relaxed font-mono">
          {`<template>
  <c-customer-card
    record-id={recordId}
    onaction={handle}>
  </c-customer-card>
</template>`}
        </pre>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute bottom-4 right-2 md:right-4 w-[72%] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl p-5"
        style={{ boxShadow: `0 30px 70px -25px ${accent}66` }}
      >
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/45">Apex · async</div>
        <pre className="mt-3 text-[11px] md:text-xs text-white/80 leading-relaxed font-mono">
          {`public with sharing class
LeadRouter implements Queueable {
  public void execute(QueueableContext c) {
    /* AI scored routing */
  }
}`}
        </pre>
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        aria-hidden
        className="absolute -bottom-10 -right-12 h-44 w-44 rounded-full opacity-40"
        style={{
          background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

/* Slowly turning cog - automation motif, used as a subtle backdrop element. */
function Gear({ size, teeth = 10, accent, dir = 1, dur = 22, style }) {
  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      animate={{ rotate: 360 * dir }}
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      style={{ opacity: 0.22, ...style }}
    >
      {Array.from({ length: teeth }).map((_, i) => (
        <rect key={i} x={-3.5} y={-48} width={7} height={13} rx={1.6} transform={`rotate(${(i / teeth) * 360})`} fill={accent} />
      ))}
      <circle r="36" fill="none" stroke={accent} strokeWidth="6" />
      <circle r="13" fill="none" stroke={accent} strokeWidth="4" />
    </motion.svg>
  );
}

function AutomationVisual({ accent }) {
  /* Automation & Optimization - a Salesforce Flow: a record trigger kicks off an
     orchestrated sequence and an execution token travels down the flow,
     illuminating each step in turn, framed by slowly turning automation gears. */
  const steps = [
    { label: 'Record Trigger', sub: 'on create · update' },
    { label: 'Decision', sub: 'criteria evaluated' },
    { label: 'Auto Update', sub: 'fields · records' },
    { label: 'Approval Flow', sub: 'guided · dynamic' },
    { label: 'Notify', sub: 'email · in-app' },
  ];
  const n = steps.length;
  const step = 0.95;
  const cycle = n * step;
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 80%)',
        }}
      />
      <Gear size={150} teeth={12} accent={accent} dir={1} dur={26} style={{ position: 'absolute', top: -34, left: -28 }} />
      <Gear size={100} teeth={10} accent="#90eb61" dir={-1} dur={20} style={{ position: 'absolute', top: 44, left: 74 }} />
      <Gear size={124} teeth={11} accent={accent} dir={-1} dur={24} style={{ position: 'absolute', bottom: -30, right: -22 }} />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        aria-hidden
        className="absolute -bottom-12 -left-10 h-48 w-48 rounded-full opacity-30"
        style={{ background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`, filter: 'blur(46px)' }}
      />

      <div className="absolute inset-0 grid place-items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[300px] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl p-5"
          style={{ boxShadow: `0 30px 80px -24px ${accent}66` }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: '#90eb61' }} />
            <span className="text-[10px] tracking-[0.35em] uppercase text-white/45">Flow Builder</span>
            <span className="ml-auto text-[9px] tracking-[0.3em] uppercase text-white/35">Auto</span>
          </div>

          <div className="relative mt-4">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/15" />
            <motion.span
              aria-hidden
              className="absolute left-[7px] h-2 w-2 rounded-full"
              style={{ background: '#90eb61', boxShadow: `0 0 10px 2px ${accent}` }}
              animate={{ top: ['2%', '92%'] }}
              transition={{ duration: cycle, repeat: Infinity, ease: 'linear' }}
            />
            <ul className="space-y-2.5">
              {steps.map((s, i) => (
                <li key={s.label} className="relative flex items-center gap-3 pl-1">
                  <motion.span
                    className="relative z-10 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border bg-black/80"
                    style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                    animate={{
                      borderColor: ['rgba(255,255,255,0.18)', '#90eb61', 'rgba(255,255,255,0.18)'],
                      boxShadow: ['0 0 0px rgba(0,0,0,0)', `0 0 16px -2px ${accent}`, '0 0 0px rgba(0,0,0,0)'],
                    }}
                    transition={{ duration: step, repeat: Infinity, repeatDelay: cycle - step, delay: i * step, ease: 'easeInOut' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#90eb61' }} />
                  </motion.span>
                  <motion.div
                    className="min-w-0 flex-1 rounded-lg border px-3 py-1.5"
                    style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}
                    animate={{
                      borderColor: ['rgba(255,255,255,0.10)', 'rgba(144,235,97,0.55)', 'rgba(255,255,255,0.10)'],
                      backgroundColor: ['rgba(255,255,255,0.03)', 'rgba(144,235,97,0.10)', 'rgba(255,255,255,0.03)'],
                    }}
                    transition={{ duration: step, repeat: Infinity, repeatDelay: cycle - step, delay: i * step, ease: 'easeInOut' }}
                  >
                    <div className="truncate text-[11px] font-medium text-white/90">{s.label}</div>
                    <div className="truncate text-[9px] tracking-[0.15em] uppercase text-white/40">{s.sub}</div>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MultiCloudVisual({ accent }) {
  const clouds = ['Sales', 'Service', 'Experience', 'Marketing', 'Commerce', 'Revenue', 'MuleSoft'];
  return (
    <div className="relative h-[420px] md:h-[560px] w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative">
          {[260, 360, 480].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                top: -s / 2,
                left: -s / 2,
                borderColor: i % 2 ? 'rgba(144,235,97,0.20)' : 'rgba(36,186,172,0.20)',
              }}
            />
          ))}
          {clouds.map((c, i) => {
            const angle = (i / clouds.length) * Math.PI * 2;
            const r = 200;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.div
                key={c}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{ left: x, top: y }}
              >
                <div
                  className="rounded-full border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-white/85 -translate-x-1/2 -translate-y-1/2"
                  style={{ boxShadow: `0 0 28px -8px ${accent}cc` }}
                >
                  {c}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {/* Center medallion */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div
          className="h-32 w-32 md:h-40 md:w-40 rounded-full grid place-items-center border border-white/15 backdrop-blur-xl bg-white/[0.04] text-center"
          style={{
            boxShadow:
              '0 0 80px -10px rgba(36,186,172,0.55), inset 0 0 60px rgba(144,235,97,0.08)',
          }}
        >
          <div>
            <div className="text-[9px] tracking-[0.5em] uppercase text-white/55">Core</div>
            <div className="mt-1 font-display text-2xl md:text-3xl text-gradient-gt">CRM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationVisual({ accent }) {
  /* Integration & API Management - a live API client: a POST /sync call returns
     200 OK with a JSON payload, with a small connected-systems chip for depth -
     a clean, premium focal card in the family of the code cards. */
  const body = `{
  "synced": true,
  "records": 1248,
  "source": "MuleSoft"
}`;
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        aria-hidden
        className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full opacity-30"
        style={{ background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`, filter: 'blur(48px)' }}
      />

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-8 right-4 md:right-7 rounded-xl border border-white/10 bg-black/55 backdrop-blur-xl px-3 py-2"
        style={{ boxShadow: `0 22px 55px -24px ${accent}` }}
      >
        <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">Connected</div>
        <div className="mt-1.5 flex items-center gap-1 text-[9px] text-white/75">
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5">SAP</span>
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5">Stripe</span>
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5">Snowflake</span>
        </div>
      </motion.div>

      <div className="absolute inset-0 grid place-items-center px-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full max-w-[330px] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5"
          style={{ boxShadow: `0 36px 90px -26px ${accent}88` }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="ml-2 text-[10px] tracking-[0.3em] uppercase text-white/45">API Client</span>
            <span className="ml-auto flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: '#90eb61', boxShadow: `0 0 6px ${accent}` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/40">Live</span>
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
            <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-black" style={{ background: '#90eb61' }}>
              POST
            </span>
            <span className="font-mono text-[11px] text-white/85">/api/v2/sync</span>
            <motion.span
              className="ml-auto text-white/70"
              animate={{ x: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#90eb61' }} />
              <span className="font-mono" style={{ color: '#90eb61' }}>200 OK</span>
            </span>
            <span className="font-mono text-white/50">⚡ 142 ms</span>
          </div>
          <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, #90eb61, #24baac)' }}
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
          </div>

          <pre className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
            {body}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}

function SecurityVisual({ accent }) {
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        aria-hidden
        className="absolute inset-0 grid place-items-center"
      >
        <div className="relative">
          {[200, 280, 360].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                top: -s / 2,
                left: -s / 2,
                borderColor: i === 1 ? 'rgba(144,235,97,0.45)' : 'rgba(36,186,172,0.25)',
                borderStyle: i === 1 ? 'dashed' : 'solid',
              }}
            />
          ))}
        </div>
      </motion.div>
      <div className="absolute inset-0 grid place-items-center">
        <motion.svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          fill="none"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 24px ${accent})` }}
        >
          <path
            d="M60 5 L110 25 V70 C110 100 88 122 60 134 C32 122 10 100 10 70 V25 Z"
            stroke="url(#shieldG)"
            strokeWidth="2"
            fill="rgba(255,255,255,0.03)"
          />
          <defs>
            <linearGradient id="shieldG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          <rect x="48" y="62" width="24" height="22" rx="3" stroke="#90eb61" strokeWidth="1.5" fill="none" />
          <path d="M52 62 V52 a8 8 0 0 1 16 0 V62" stroke="#90eb61" strokeWidth="1.5" fill="none" />
        </motion.svg>
      </div>
      {/* CI/CD pipeline pulse bar at bottom */}
      <div className="absolute bottom-6 inset-x-6 h-2 rounded-full bg-white/10 overflow-hidden">
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

function AnalyticsVisual({ accent }) {
  const bars = [40, 65, 50, 80, 55, 95, 70];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.45em] uppercase text-white/45">CRM Analytics</div>
          <div className="mt-2 font-display text-xl md:text-2xl">Pipeline Health</div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="h-2 w-2 rounded-full"
          style={{ background: '#90eb61', boxShadow: `0 0 10px #90eb61` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-7 gap-3 h-40 items-end">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: `${h}%`,
              transformOrigin: 'bottom',
              background: `linear-gradient(180deg, #90eb61, ${accent})`,
              boxShadow: `0 0 24px -6px ${accent}`,
            }}
            className="rounded-md w-full"
          />
        ))}
      </div>

      {/* Predicted line */}
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-6 h-20 w-full">
        <motion.path
          d="M0 25 C 15 10, 30 22, 45 12 S 70 18, 100 5"
          stroke="url(#predG)"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="120"
          initial={{ strokeDashoffset: 120 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
        />
        <defs>
          <linearGradient id="predG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#90eb61" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
      </svg>

      <div className="mt-2 flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/55">
        <span className="inline-block h-1.5 w-6 rounded-full" style={{ background: '#90eb61' }} />
        Predicted · Einstein
      </div>
    </div>
  );
}

/* ---------------- Section template ---------------- */

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

        <div className={`grid gap-14 lg:gap-16 lg:grid-cols-12 items-start`}>
          <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.05]">
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

/* ---------------- Certifications ---------------- */

/**
 * cat: visual category - drives badge color strip / icon
 *   'specialist' = dark navy hex, cyan strip, cloud icon (row 1)
 *   'consultant' = dark navy hex, yellow strip, cloud icon (row 2)
 *   'designer'   = dark navy hex, pink strip, cloud icon (row 3 first two)
 *   'associate'  = lighter blue hex, chat icon (row 3 last two)
 */
const CERTS = [
  { code: 'ADM', label: 'Associate', cat: 'specialist', img: '/certificate_folder/Certificate_1.webp' },
  { code: 'APP', label: 'Administrator', cat: 'specialist', img: '/certificate_folder/Certificate_2.webp' },
  { code: 'BA', label: 'Platform Builder', cat: 'specialist', img: '/certificate_folder/Certificate_3.webp' },
  { code: 'PD-I', label: 'Business Analyst', cat: 'specialist', img: '/certificate_folder/Certificate_4.webp' },
  { code: 'PD-II', label: 'Platform Developer I', cat: 'specialist', img: '/certificate_folder/Certificate_5.webp' },
  { code: 'OSD', label: 'Platform Developer II', cat: 'specialist', img: '/certificate_folder/Certificate_6.webp' },
  { code: 'CPQ', label: 'OmniStudio Developer', cat: 'specialist', img: '/certificate_folder/Certificate_7.webp' },
  { code: 'AIS', label: 'CPQ Specialist', cat: 'specialist', img: '/certificate_folder/Certificate_8.webp' },
  { code: 'SVC', label: 'AI Specialist', cat: 'consultant', img: '/certificate_folder/Certificate_9.webp' },
  { code: 'OSC', label: 'Service Cloud Consultant', cat: 'consultant', img: '/certificate_folder/Certificate_10.webp' },


  { code: 'FSC', label: 'Strategy Designer', cat: 'consultant', img: '/certificate_folder/Certificate_13.webp' },

  { code: 'STD', label: 'Field Service Consultant', cat: 'designer', img: '/certificate_folder/Certificate_16.webp' },
  { code: 'UXD', label: 'Sales Cloud Consultant', cat: 'designer', img: '/certificate_folder/Certificate_17.webp' },
  { code: 'AIA', label: 'Experience Cloud Consultant', cat: 'associate', img: '/certificate_folder/Certificate_18.webp' },
  { code: 'ASC', label: 'OmniStudio Consultant', cat: 'associate', img: '/certificate_folder/Certificate_19.webp' },
];

/* Hexagonal Salesforce-style certification badge (SVG) */
function CertBadge({ cert }) {
  /* Load the real credential image from /public/certificates first; if the file
     is missing it gracefully falls back to the drawn badge below (no broken
     links). File name = the credential label slugified, e.g.
     "Platform Developer I" -> /certificates/platform-developer-i.png */
  const [imgOk, setImgOk] = useState(true);
  const imgSrc =
    cert.img ||
    '/certificates/' +
    cert.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '.png';
  if (imgOk) {
    return (
      <img
        src={imgSrc}
        alt={`Salesforce Certified ${cert.label}`}
        loading="lazy"
        decoding="async"
        onError={() => setImgOk(false)}
        className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
      />
    );
  }

  const STRIP = {
    specialist: '#22D3EE',
    consultant: '#FCD34D',
    designer: '#F472B6',
    associate: null,
  };
  const isAssoc = cert.cat === 'associate';
  const hexFill = isAssoc ? '#2EA8E0' : '#1B196F';
  const hexStroke = isAssoc ? '#7FCDED' : '#3B3A8E';
  const strip = STRIP[cert.cat];

  return (
    <svg viewBox="0 0 120 138" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
      <defs>
        <linearGradient id={`hexG-${cert.code}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hexFill} />
          <stop offset="100%" stopColor={isAssoc ? '#1F8FC4' : '#0E0C5C'} />
        </linearGradient>
        <clipPath id={`hexClip-${cert.code}`}>
          <polygon points="60,4 103.78,28.1 114.59,82.24 84.3,125.66 35.7,125.66 5.41,82.24 16.22,28.1" />
        </clipPath>
      </defs>

      {/* Heptagon body */}
      <polygon
        points="60,4 103.78,28.1 114.59,82.24 84.3,125.66 35.7,125.66 5.41,82.24 16.22,28.1"
        fill={`url(#hexG-${cert.code})`}
        stroke={hexStroke}
        strokeWidth="1.5"
      />

      {/* Top sheen */}
      <polygon
        points="60,4 103.78,28.1 114.59,82.24 60,60 16.22,28.1"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Cloud / chat glyph */}
      <g transform="translate(60 30)">
        {isAssoc ? (
          // chat bubble
          <path
            d="M -12 -6 a 12 9 0 1 1 4 16 l -6 2 l 1 -5 a 12 9 0 0 1 1 -13 z"
            fill="white"
          />
        ) : (
          // cloud
          <path
            d="M -14 4 a 7 7 0 0 1 4 -13 a 8 8 0 0 1 15 1 a 6 6 0 0 1 4 12 z"
            fill="#7AC1FF"
          />
        )}
      </g>

      {/* CERTIFIED ribbon */}
      <text
        x="60"
        y="64"
        textAnchor="middle"
        fill="white"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        fontWeight="800"
        letterSpacing="2"
      >
        CERTIFIED
      </text>

      {/* Label (wrapped if long) */}
      <foreignObject x="10" y="70" width="100" height="42">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 9,
            lineHeight: 1.15,
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: 0.2,
          }}
        >
          {cert.label}
        </div>
      </foreignObject>

      {/* Bottom color strip clipped to heptagon */}
      {strip && (
        <g clipPath={`url(#hexClip-${cert.code})`}>
          <rect x="0" y="116" width="120" height="22" fill={strip} />
        </g>
      )}
    </svg>
  );
}

function CertCard({ cert, accent }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 120, damping: 14 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex-none w-56 min-h-72 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-xl p-4 will-change-transform"
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 60px -10px ${accent}66, 0 0 40px -8px ${accent}66`,
        }}
      />
      <div className="relative flex flex-col items-center h-full">
        <div className="h-36 w-36 md:h-40 md:w-40 grid place-items-center">
          <CertBadge cert={cert} />
        </div>
        <div className="mt-3 text-center">
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/45">Salesforce</div>
          <div className="mt-1 font-display text-sm md:text-[15px] font-semibold leading-tight text-white/90 line-clamp-2">
            {cert.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CertificationsWall({ accent }) {
  // Duplicate for seamless marquee
  const row = [...CERTS, ...CERTS];
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <FloatingOrbs accent={accent} />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <Eyebrow>Certifications</Eyebrow>
        <h2 className="mt-5 font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
          <RevealWords text="A team certified across the full Salesforce platform." />
        </h2>
        <RevealWords
          text="We have certified Salesforce experts across multiple Salesforce domains and technologies."
          className="block mt-6 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed"
        />
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #000 0%, transparent 100%)' }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #000 0%, transparent 100%)' }}
        />
        <motion.div
          className="flex gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {row.map((c, i) => (
            <CertCard key={i} cert={c} accent={accent} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

/* ---------------- Salesforce Clouds grid ---------------- */

const SF_CLOUDS = [
  {
    id: 'sales',
    name: 'Sales Cloud',
    desc: 'Pipeline visibility, AI-assisted forecasting, and intelligent lead-to-cash workflows.',
    glyph: '◆',
    grad: 'linear-gradient(135deg, #0EA5E9, #24baac)',
  },
  {
    id: 'service',
    name: 'Service Cloud',
    desc: 'Omnichannel case management, CTI integrations, and Einstein-powered service excellence.',
    glyph: '◉',
    grad: 'linear-gradient(135deg, #6366F1, #24baac)',
  },
  {
    id: 'education',
    name: 'Education Cloud',
    desc: 'Connected student journeys from recruitment to alumni - unified across institutions.',
    glyph: '✦',
    grad: 'linear-gradient(135deg, #10B981, #24baac)',
  },
  {
    id: 'financial-services',
    name: 'Financial Services Cloud',
    desc: 'Householding, relationship management, and compliance-ready workflows for banking, wealth, and insurance.',
    glyph: '❖',
    grad: 'linear-gradient(135deg, #8B5CF6, #24baac)',
  },
  {
    id: 'pardot',
    name: 'Account Engagement (Pardot)',
    desc: 'B2B marketing automation - lead nurturing, scoring, and revenue-driven campaign analytics.',
    glyph: '▣',
    grad: 'linear-gradient(135deg, #F59E0B, #90eb61)',
  },
];

function CloudCard({ cloud, i, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.025] backdrop-blur-sm p-6 md:p-7"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 20px 40px -20px rgba(0,0,0,0.6)` }}
    >
      {/* Hover gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(70% 50% at 30% 0%, ${accent}22 0%, transparent 70%)`,
        }}
      />
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="grid h-14 w-14 flex-none place-items-center rounded-2xl text-white font-display text-2xl"
          style={{
            background: cloud.grad,
            boxShadow: `0 12px 30px -12px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        >
          {cloud.glyph}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/45">
            Salesforce
          </div>
          <div className="mt-1 font-display text-xl md:text-2xl text-white">{cloud.name}</div>
        </div>
      </div>

      <p className="relative mt-5 text-sm md:text-[15px] text-white/72 leading-relaxed">
        {cloud.desc}
      </p>

      <div className="relative mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-mono">
            Available
          </span>
        </div>
        <div className="text-white/40 text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
          →
        </div>
      </div>

      {/* Animated accent line */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] origin-left"
        style={{ background: cloud.grad }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

function SalesforceCloudsGrid({ accent }) {
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
            07
          </span>
          <Eyebrow>Salesforce Clouds</Eyebrow>
        </div>

        <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-end mb-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.05]">
              <RevealWords text="One platform. Every cloud you need to scale." />
            </h2>
          </div>
          <div className="lg:col-span-5">
            <RevealWords
              text="Sales, Service, Marketing, Experience, Commerce, and Data - engineered together to unify your customer fabric end to end."
              className="block text-sm md:text-base text-white/65 leading-relaxed"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SF_CLOUDS.map((cloud, i) => (
            <CloudCard key={cloud.id} cloud={cloud} i={i} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ accent, onClose }) {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <section className="relative px-6 md:px-12 py-40 md:py-56 overflow-hidden">
      {/* Mesh gradient backdrop */}
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
      <GridBackdrop />

      <div className="relative max-w-5xl mx-auto text-center">

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <RevealWords text="Ready to Transform Your Salesforce Ecosystem?" />
        </h2>
        <RevealWords
          text="Let's build scalable, intelligent, and future-ready Salesforce solutions together."
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

      <CinematicContact open={contactOpen} onClose={() => setContactOpen(false)} cta="Talk to Salesforce Experts" />
    </section>
  );
}

/* ---------------- Scroll progress indicator ---------------- */

function ScrollDots({ scrollRef }) {
  const labels = ['Hero', 'Build', 'Automate', 'Connect', 'Integrate', 'Secure', 'Insight'];
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

export default function SalesforceExperience({ service, onClose, scrollRef }) {
  const accent = service.accent || '#24baac';

  return (
    <>
      {/* <ScrollDots scrollRef={scrollRef} /> */}

      <HeroScene service={service} />

      <div className="bg-ink relative z-10">
        <ExperienceSection
          num="01"
          eyebrow="Salesforce Delivery Excellence"
          title="Implementation & Custom Development"
          description="We deliver end-to-end Salesforce implementation tailored to your business needs. From initial setup to advanced customization, we build scalable and high-performing Salesforce solutions that streamline operations and enhance customer engagement."
          features={[
            'Custom Objects designed for unique business processes',
            'Advanced Apex logic including asynchronous & batch processing',
            'Dynamic, responsive interfaces with Lightning Web Components (LWC)',
          ]}
          benefits={[
            'Automate and simplify complex business workflows',
            'Drive operational efficiency with tailored solutions',
            'Deliver exceptional, personalized digital experiences',
          ]}
          visual={<ImplementationVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="02"
          eyebrow="Smart Workflow Automation"
          title="Automation & Optimization"
          description="We automate and optimize business processes to improve efficiency, reduce manual effort, and enhance overall system performance. This helps organizations streamline workflows, increase productivity, and deliver faster, more reliable business outcomes."
          features={[
            'Record-triggered and scheduled flows for automated actions',
            'End-to-end flow orchestration for seamless process automation',
            'Approval processes with dynamic forms & guided screen flows',
          ]}
          benefits={[
            'Reduce manual tasks and operational bottlenecks',
            'Accelerate approvals and decision-making',
            'Deliver personalized, guided user experiences',
          ]}
          visual={<AutomationVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="03"
          eyebrow="Enterprise Cloud Solutions"
          title="Multi-Cloud & Industry Cloud Expertise."
          description="We deliver expertise across Salesforce multi-cloud and industry cloud platforms to build scalable, connected, and industry-specific solutions. This enables businesses to unify data, improve collaboration, and accelerate digital transformation with tailored cloud capabilities."
          features={[
            'Sales Cloud: Intelligent lead routing, opportunity lifecycle management, and accurate forecasting',
            'Service Cloud: Robust case management, omnichannel support, and CTI telephony integration',
            'Experience Cloud: Branded customer portals and collaborative partner communities',
          ]}
          benefits={[
            'Streamline sales cycles and improve pipeline visibility',
            'Enhance customer service with unified omnichannel experiences',
            'Foster stronger customer and partner relationships through personalized portals',
          ]}
          visual={<MultiCloudVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="04"
          eyebrow="Connected Enterprise Systems"
          title="Integration & API Management"
          description="We enable seamless integration and API management to connect Salesforce with enterprise systems, ensuring secure, real-time data exchange and end-to-end automation across platforms."
          features={[
            'REST & SOAP API integrations with legacy and cloud platforms',
            'Middleware expertise: MuleSoft, Boomi, Informatica, AWS Lambda',
            'Third-party tool integrations including ERP, billing, and support systems',
          ]}
          benefits={[
            'Enable real-time, reliable data exchange across diverse systems',
            'Simplify complex integration landscapes with scalable middleware solutions',
            'Improve operational agility by connecting core business applications',
          ]}
          visual={<IntegrationVisual accent={accent} />}
          accent={accent}
          flip
        />

        <ExperienceSection
          num="05"
          eyebrow="Secure & Scalable Delivery"
          title="Security, Governance & DevOps"
          description="We implement robust security, governance, and DevOps practices to ensure Salesforce environments are secure, compliant, and continuously optimized for performance and reliability."
          features={[
            'Fine-grained access with Role Hierarchies, Sharing Rules, and Shield Encryption',
            'Secure authentication with SSO, MFA, and OAuth2-based connected apps',
            'Scalable CI/CD pipelines using Salesforce DX, GitHub Actions, and Copado',
          ]}
          benefits={[
            'Strengthen platform security and meet regulatory compliance standards',
            'Streamline authentication while enhancing user experience',
            'Speed up release cycles with automated, reliable deployment pipelines',
          ]}
          visual={<SecurityVisual accent={accent} />}
          accent={accent}
        />

        <ExperienceSection
          num="06"
          eyebrow="Data-Driven Intelligence"
          title="Reporting, Analytics & AI"
          description="We enable advanced reporting, analytics, and AI capabilities to deliver actionable insights and support smarter business decisions."
          features={[
            'Dynamic, interactive dashboards and custom report types tailored to your KPIs',
            'Advanced analytics with CRM Analytics (formerly Tableau CRM) & Einstein Discovery',
            'Data cleansing, deduplication, and enrichment for accurate reporting',
          ]}
          benefits={[
            'Empower teams with real-time visibility into key business metrics',
            'Make smarter decisions with predictive AI-driven analytics',
            'Ensure data accuracy for trusted, impactful reporting',
          ]}
          visual={<AnalyticsVisual accent={accent} />}
          accent={accent}
          flip
        />

        <SalesforceCloudsStory scrollContainer={scrollRef} />

        <CertificationsWall accent={accent} />

        <FinalCTA accent={accent} onClose={onClose} />
      </div>
    </>
  );
}
