import { useEffect, useRef, useState } from 'react';
import { m as motion, useInView } from 'framer-motion';

/* ---------------- Partner data + branded SVG marks ---------------- */
const PARTNERS = [
  { name: 'Salesforce',  mark: 'sf'   },
  { name: 'Agentforce',  mark: 'af'   },
  { name: 'Data Cloud',  mark: 'dc'   },
  { name: 'MuleSoft',    mark: 'mule' },
  { name: 'Snowflake',   mark: 'snow' },
  { name: 'Informatica', mark: 'inf'  },
  { name: 'AI Solutions',mark: 'ai'   },
];

function LogoMark({ kind }) {
  switch (kind) {
    case 'sf':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <path
            d="M40 20a13 13 0 0 0-9.8 4.4 11.4 11.4 0 0 0-18.7 6.7A9.7 9.7 0 0 0 16 50h32a10.3 10.3 0 0 0 2.8-20.3A13 13 0 0 0 40 20z"
            fill="#00A1E0"
          />
        </svg>
      );
    case 'af':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <defs>
            <linearGradient id="afG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor="#24baac" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="20" fill="none" stroke="url(#afG)" strokeWidth="3" />
          <circle cx="32" cy="26" r="6" fill="url(#afG)" />
          <path d="M18 46c2.5-6.4 8-10 14-10s11.5 3.6 14 10" stroke="url(#afG)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'dc':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <defs>
            <linearGradient id="dcG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5fb1ff" />
              <stop offset="100%" stopColor="#00A1E0" />
            </linearGradient>
          </defs>
          <g fill="url(#dcG)">
            <ellipse cx="32" cy="18" rx="16" ry="5" />
            <path d="M16 18v10c0 2.8 7.2 5 16 5s16-2.2 16-5V18c0 2.8-7.2 5-16 5s-16-2.2-16-5z" opacity="0.85" />
            <path d="M16 32v10c0 2.8 7.2 5 16 5s16-2.2 16-5V32c0 2.8-7.2 5-16 5s-16-2.2-16-5z" opacity="0.7" />
          </g>
        </svg>
      );
    case 'mule':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11" fill="none">
          <path
            d="M10 46 V25 a7 7 0 0 1 14 0 V32 L32 38 L40 32 V25 a7 7 0 0 1 14 0 V46"
            stroke="#00A0DF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <circle cx="32" cy="32" r="22" fill="#29B5E8" />
          <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
            <line x1="32" y1="14" x2="32" y2="50" />
            <line x1="17" y1="22" x2="47" y2="42" />
            <line x1="17" y1="42" x2="47" y2="22" />
          </g>
          <g fill="#fff">
            <circle cx="32" cy="14" r="2.6" />
            <circle cx="32" cy="50" r="2.6" />
            <circle cx="17" cy="22" r="2.6" />
            <circle cx="47" cy="42" r="2.6" />
            <circle cx="17" cy="42" r="2.6" />
            <circle cx="47" cy="22" r="2.6" />
          </g>
        </svg>
      );
    case 'inf':
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <defs>
            <linearGradient id="infG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFB02E" />
              <stop offset="100%" stopColor="#F36523" />
            </linearGradient>
          </defs>
          <path d="M32 8 L54 32 L32 56 L10 32 Z" fill="url(#infG)" />
          <rect x="30" y="22" width="4" height="6" rx="1" fill="#fff" />
          <rect x="30" y="30" width="4" height="14" rx="1" fill="#fff" />
        </svg>
      );
    case 'ai':
    default:
      return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 md:h-11 md:w-11">
          <defs>
            <linearGradient id="aiG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor="#24baac" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="22" fill="url(#aiG)" />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontSize="20"
            fontWeight="800"
            fill="#0a0a0a"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            AI
          </text>
        </svg>
      );
  }
}

/* ---------------- Background layers ---------------- */
function Aurora() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[280px] rounded-full blur-[140px] opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60% 50% at 25% 50%, rgba(36,186,172,0.4), transparent 70%),' +
            'radial-gradient(60% 50% at 75% 50%, rgba(144,235,97,0.32), transparent 70%)',
        }}
      />
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    x: (i * 41) % 100,
    y: (i * 53) % 100,
    s: 0.4 + ((i * 17) % 9) / 10,
    d: 4 + (i % 7),
    dl: (i % 5) * 0.6,
  }));
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s * 3,
            height: p.s * 3,
            background: i % 2 === 0 ? 'rgba(144,235,97,0.75)' : 'rgba(36,186,172,0.75)',
            boxShadow: '0 0 6px rgba(144,235,97,0.45)',
          }}
          animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -8, 0] }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut', delay: p.dl }}
        />
      ))}
    </div>
  );
}

/* ---------------- Single partner logo holder ---------------- */
function LogoHolder({ p }) {
  return (
    <div className="logo-holder relative shrink-0 grid place-items-center select-none">
      <span
        aria-hidden
        className="logo-glow absolute inset-0 rounded-full opacity-40 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(144,235,97,0.35), transparent 65%),' +
            'radial-gradient(circle at 50% 50%, rgba(36,186,172,0.28), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <div
        className="logo-circle relative grid place-items-center rounded-full
                   h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28
                   bg-white/[0.035] backdrop-blur-xl border border-white/10
                   transition-all duration-500"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), 0 12px 30px -12px rgba(36,186,172,0.25)',
        }}
      >
        <LogoMark kind={p.mark} />
      </div>
      <div className="mt-3 text-[11px] md:text-xs tracking-[0.2em] uppercase text-white/65 font-medium">
        {p.name}
      </div>
    </div>
  );
}

/* ---------------- Arrow button ---------------- */
function ArrowButton({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'left' ? 'Previous partners' : 'Next partners'}
      className="
        group absolute top-1/2 -translate-y-1/2 z-20
        grid place-items-center h-11 w-11 md:h-12 md:w-12 rounded-full
        border border-white/15 bg-white/[0.04] backdrop-blur-xl
        text-white/70 hover:text-white hover:border-white/30
        transition
      "
      style={{
        [dir === 'left' ? 'left' : 'right']: '0.5rem',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 30px -12px rgba(36,186,172,0.35)',
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

/* ---------------- Section ---------------- */
export default function SalesforcePartner() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    let last = performance.now();
    const PX_PER_SEC = 28;
    const step = (now) => {
      const dt = now - last;
      last = now;
      if (!paused && el && el.scrollWidth > 0) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + (dt / 1000) * PX_PER_SEC;
        if (next >= half) next -= half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const nudge = (delta) => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    let next = el.scrollLeft + delta;
    if (next < 0) next += half;
    if (next >= half) next -= half;
    el.scrollTo({ left: next, behavior: 'smooth' });
  };

  const DUPLICATED = [...PARTNERS, ...PARTNERS];

  return (
    <section
      ref={sectionRef}
      aria-label="Our Partners"
      className="relative isolate overflow-hidden bg-black text-white py-20 md:py-24 lg:py-28"
    >
      {/* faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      <Aurora />
      <Particles />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="text-xs md:text-[13px] font-semibold tracking-[0.34em] uppercase text-white/70">
            Our Partners
          </div>
          <div
            className="mx-auto mt-4 h-[2px] w-16 md:w-20 rounded-full"
            style={{
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              boxShadow: '0 0 14px rgba(144,235,97,0.55), 0 0 28px rgba(36,186,172,0.35)',
            }}
          />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 md:mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <ArrowButton dir="left" onClick={() => nudge(-260)} />
          <ArrowButton dir="right" onClick={() => nudge(260)} />

          <div
            ref={trackRef}
            className="carousel-track no-scrollbar overflow-x-auto overflow-y-hidden px-12 md:px-16"
            style={{
              maskImage:
                'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div className="inline-flex items-start gap-10 md:gap-14 lg:gap-16 py-4">
              {DUPLICATED.map((p, i) => (
                <LogoHolder key={`${p.name}-${i}`} p={p} />
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        .logo-holder:hover .logo-circle,
        .logo-holder:focus-within .logo-circle {
          border-color: rgba(144,235,97,0.45);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 0 0 1px rgba(144,235,97,0.18),
            0 18px 50px -14px rgba(36,186,172,0.55);
        }
        .logo-holder:hover .logo-glow,
        .logo-holder:focus-within .logo-glow { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .carousel-track { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  );
}
