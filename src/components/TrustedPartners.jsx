import { useRef } from 'react';
import { m as motion, useInView } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';

const PARTNERS = [
  'Salesforce',
  'Agentforce',
  'Data Cloud',
  'MuleSoft',
  'Snowflake',
  'Informatica',
  'AI Solutions',
];

const MARQUEE = [...PARTNERS, ...PARTNERS];

function Pill({ label, isLight }) {
  return (
    <span
      className="partner-pill relative inline-flex items-center rounded-full whitespace-nowrap select-none px-5 py-2 text-sm md:px-7 md:py-2.5 md:text-[15px] lg:px-8 lg:py-3 lg:text-base font-medium tracking-wide"
      style={isLight ? {
        color: '#334155',
        border: '1px solid rgba(36,186,172,0.20)',
        background: '#e4f3ef',
        boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(144,235,97,0.08) inset',
      } : {
        color: 'rgba(255,255,255,0.90)',
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 0 0 1px rgba(144,235,97,0.08) inset, 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 30px -12px rgba(36,186,172,0.18)',
      }}
    >
      <span
        aria-hidden
        className="pill-glow pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(144,235,97,0.18), transparent 70%)',
        }}
      />
      <span className="relative">{label}</span>
    </span>
  );
}

function Aurora() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[260px] rounded-full blur-[120px] opacity-0"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60% 50% at 30% 50%, rgba(36,186,172,0.35), transparent 70%),' +
            'radial-gradient(60% 50% at 70% 50%, rgba(144,235,97,0.30), transparent 70%)',
        }}
      />
    </div>
  );
}

function LightStreaks() {
  const streaks = [
    { top: '22%', delay: 0,   duration: 7 },
    { top: '58%', delay: 3.5, duration: 9 },
    { top: '78%', delay: 6,   duration: 8 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute h-px w-40"
          style={{
            top: s.top,
            background:
              'linear-gradient(90deg, transparent, rgba(144,235,97,0.65), rgba(36,186,172,0.55), transparent)',
            filter: 'blur(0.3px)',
          }}
          initial={{ x: '-20%', opacity: 0 }}
          animate={{ x: ['-20%', '120%'], opacity: [0, 0.8, 0] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
}

function GradientDivider({ position = 'top' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'}`}
    >
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #90eb61, #24baac, transparent)',
        }}
      />
      <div
        className={`h-12 w-full ${position === 'top' ? '' : '-mt-12'} opacity-30`}
        style={{
          background:
            position === 'top'
              ? 'linear-gradient(180deg, rgba(36,186,172,0.18), transparent)'
              : 'linear-gradient(0deg, rgba(36,186,172,0.18), transparent)',
        }}
      />
    </div>
  );
}

export default function TrustedPartners() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden py-20 md:py-24 lg:py-28"
      style={{
        backgroundColor: isLight ? '#f2faf8' : '#000000',
        color: isLight ? '#0f172a' : '#ffffff',
      }}
      aria-label="Trusted Partners"
    >
      <GradientDivider position="top" />
      <GradientDivider position="bottom" />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(rgba(15,23,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.5) 1px, transparent 1px)'
            : 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      <Aurora />
      <LightStreaks />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span
            className="inline-block text-xs md:text-[13px] font-semibold tracking-[0.32em] uppercase"
            style={{
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Trusted Partners
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-center text-2xl md:text-3xl lg:text-[2.2rem] font-semibold tracking-tight"
          style={{ color: isLight ? '#1e293b' : 'rgba(255,255,255,0.95)' }}
        >
          Powering Enterprise{' '}
          <span
            style={{
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Digital Transformation
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 md:mt-16"
        >
          <div className="marquee-mask group">
            <div className="marquee-track">
              {MARQUEE.map((label, i) => (
                <div key={`${label}-${i}`} className="px-3 md:px-4 lg:px-5">
                  <Pill label={label} isLight={isLight} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes tp-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-mask {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: tp-marquee 48s linear infinite;
        }
        .marquee-mask:hover .marquee-track,
        .marquee-mask:focus-within .marquee-track {
          animation-play-state: paused;
        }
        .marquee-mask:hover .partner-pill {
          border-color: rgba(144,235,97,0.28);
        }
        .marquee-mask:hover .pill-glow { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
