import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

const TEXT =
  'Genufy transforms complex business challenges into seamless digital experiences. We design intelligent platforms, automation systems, and AI-driven solutions that help businesses scale efficiently and operate smarter.';

/* ===== Brand-style service icons (stylised, no trademarked assets) ===== */
function SalesforceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8">
      <path
        d="M14.7 6.4a4.7 4.7 0 0 0-3.5 1.5 4.1 4.1 0 0 0-6.7 2.4A3.5 3.5 0 0 0 5.8 17h11.6a3.7 3.7 0 0 0 1-7.3 4.7 4.7 0 0 0-3.7-3.3z"
        fill="#00A1E0"
      />
    </svg>
  );
}
function InformaticaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8">
      <defs>
        <linearGradient id="infIconG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB02E" />
          <stop offset="100%" stopColor="#F36523" />
        </linearGradient>
      </defs>
      <path d="M12 3 L20 12 L12 21 L4 12 Z" fill="url(#infIconG)" />
      <rect x="11" y="9" width="2" height="2.5" rx="0.4" fill="#fff" />
      <rect x="11" y="12.5" width="2" height="4" rx="0.4" fill="#fff" />
    </svg>
  );
}
function AIIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8">
      <path
        d="M9 4a3 3 0 0 0-2.9 2.3A3 3 0 0 0 4 9.5a3 3 0 0 0 1.4 2.6A3 3 0 0 0 4 14.7a3 3 0 0 0 2.1 2.9A3 3 0 0 0 9 20a3 3 0 0 0 3-1.1 3 3 0 0 0 3 1.1 3 3 0 0 0 2.9-2.3 3 3 0 0 0 2.1-2.9 3 3 0 0 0-1.4-2.6A3 3 0 0 0 20 9.5a3 3 0 0 0-2.1-3.2A3 3 0 0 0 15 4a3 3 0 0 0-3 1.1A3 3 0 0 0 9 4z"
        fill="#6D28D9"
      />
      <text
        x="12"
        y="14.6"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="800"
        fill="#fff"
        fontFamily="system-ui, sans-serif"
      >
        AI
      </text>
    </svg>
  );
}
function DevOpsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none">
      <path
        d="M16.5 8c-1.8 0-3.3 1.4-4.5 3.5-1.2 2.1-2.7 3.5-4.5 3.5a3.5 3.5 0 1 1 0-7c1.8 0 3.3 1.4 4.5 3.5 1.2 2.1 2.7 3.5 4.5 3.5a3.5 3.5 0 1 0 0-7z"
        stroke="#1877F2"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8">
      <circle cx="12" cy="12" r="10" fill="#29B5E8" />
      <g stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="4.5" x2="12" y2="19.5" />
        <line x1="5.5" y1="8.2" x2="18.5" y2="15.8" />
        <line x1="5.5" y1="15.8" x2="18.5" y2="8.2" />
      </g>
      <g fill="#fff">
        <circle cx="12" cy="4.5" r="1.1" />
        <circle cx="12" cy="19.5" r="1.1" />
        <circle cx="5.5" cy="8.2" r="1.1" />
        <circle cx="18.5" cy="15.8" r="1.1" />
        <circle cx="5.5" cy="15.8" r="1.1" />
        <circle cx="18.5" cy="8.2" r="1.1" />
      </g>
    </svg>
  );
}
function MuleSoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none">
      <path
        d="M4 18 V9 a3 3 0 0 1 6 0 V12 L12 14.5 L14 12 V9 a3 3 0 0 1 6 0 V18"
        stroke="#00A0DF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function WebDevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none">
      <rect x="3" y="4.5" width="18" height="12.5" rx="1.5" stroke="#1E88E5" strokeWidth="2" />
      <line x1="9" y1="20.5" x2="15" y2="20.5" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17.5" x2="12" y2="20.5" stroke="#1E88E5" strokeWidth="2" />
      <polyline
        points="9 9 7 11 9 13"
        stroke="#1E88E5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="15 9 17 11 15 13"
        stroke="#1E88E5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ===== Network services — perfect heptagonal layout via trigonometry =====
   7 nodes evenly spaced 360/7 ≈ 51.43° apart, starting at -90° (top). */
const NETWORK_CX = 50;   // centre X in viewBox %
const NETWORK_CY = 53;   // centre Y in viewBox %
const NETWORK_R = 28;    // radius in viewBox %
const NETWORK_N = 7;
const NETWORK_START_ANGLE = -90; // degrees — Salesforce sits at the top

const NETWORK_SERVICES = [
  { label: 'Salesforce', Icon: SalesforceIcon },
  { label: 'AI Solutions', Icon: AIIcon },
  { label: 'DevOps', Icon: DevOpsIcon },
  { label: 'Snowflake', Icon: SnowflakeIcon },
  { label: 'MuleSoft', Icon: MuleSoftIcon },
  { label: 'Web Development', Icon: WebDevIcon },
  { label: 'Informatica', Icon: InformaticaIcon },
].map((s, i) => {
  const rad = ((NETWORK_START_ANGLE + (i * 360) / NETWORK_N) * Math.PI) / 180;
  return {
    ...s,
    x: NETWORK_CX + NETWORK_R * Math.cos(rad),
    y: NETWORK_CY + NETWORK_R * Math.sin(rad),
  };
});

function Word({ word, index, total, progress }) {
  const start = index / total;
  const end = (index + 1.4) / total;
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
}

/* Animated visual placed inside the left content card (mirrors the reference's mascot position) */
function CardVisual() {
  return (
    <div className="relative h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 shrink-0">
      {/* Outer rotating gradient frame */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'conic-gradient(from 0deg, #90eb61, #24baac, #90eb61)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner dark panel */}
      <div className="absolute inset-[2px] rounded-[14px] bg-black/85 backdrop-blur-xl overflow-hidden">
        {/* Faint grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          }}
        />

        {/* Constellation network */}
        <svg viewBox="-50 -50 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="cardVisualG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor="#24baac" />
            </linearGradient>
          </defs>
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const r = 30;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <g key={a}>
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke="url(#cardVisualG)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                  opacity="0.75"
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r="3.2"
                  fill="#fff"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18 }}
                  style={{ filter: 'drop-shadow(0 0 2px #90eb61)' }}
                />
              </g>
            );
          })}
          {/* Center pulsing core */}
          <motion.circle
            r="5.5"
            fill="url(#cardVisualG)"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            r="7"
            fill="none"
            stroke="url(#cardVisualG)"
            strokeWidth="0.6"
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
          />
        </svg>

        {/* Floating mini chart (top-right) */}
        <motion.div
          className="absolute top-2 right-2 flex items-end gap-0.5"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {[6, 9, 5, 11].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: h,
                background: 'linear-gradient(180deg, #90eb61, #24baac)',
                boxShadow: '0 0 6px rgba(36,186,172,0.6)',
              }}
              animate={{ scaleY: [1, 1.25, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>

        {/* Floating pie glyph (bottom-left) */}
        <motion.div
          className="absolute bottom-2 left-2 h-3.5 w-3.5 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            background:
              'conic-gradient(#90eb61 0% 60%, #24baac 60% 100%)',
            boxShadow: '0 0 8px rgba(144,235,97,0.55)',
          }}
        />
      </div>
    </div>
  );
}

function GlowBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.22), transparent 70%)' }}
        animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 bottom-10 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.18), transparent 70%)' }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}

function HolographicMesh() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 18 });

  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const CENTER = { x: NETWORK_CX, y: NETWORK_CY };
  // Radial edges — each service connects to the centre point.
  const radialEdges = NETWORK_SERVICES.map((s) => ({
    ax: s.x, ay: s.y, bx: CENTER.x, by: CENTER.y,
  }));
  // Ring edges — each service connects to its adjacent neighbour.
  const ringEdges = NETWORK_SERVICES.map((s, i) => {
    const next = NETWORK_SERVICES[(i + 1) % NETWORK_SERVICES.length];
    return { ax: s.x, ay: s.y, bx: next.x, by: next.y };
  });
  const allEdges = [...radialEdges, ...ringEdges];

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative h-full w-full will-change-transform"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-70"
        animate={{
          background: [
            'radial-gradient(45% 55% at 20% 30%, rgba(36,186,172,0.55), transparent 70%), radial-gradient(40% 50% at 80% 70%, rgba(144,235,97,0.45), transparent 70%), radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)',
            'radial-gradient(45% 55% at 70% 30%, rgba(36,186,172,0.55), transparent 70%), radial-gradient(40% 50% at 30% 70%, rgba(144,235,97,0.45), transparent 70%), radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)',
            'radial-gradient(45% 55% at 40% 75%, rgba(36,186,172,0.55), transparent 70%), radial-gradient(40% 50% at 65% 25%, rgba(144,235,97,0.45), transparent 70%), radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)',
            'radial-gradient(45% 55% at 20% 30%, rgba(36,186,172,0.55), transparent 70%), radial-gradient(40% 50% at 80% 70%, rgba(144,235,97,0.45), transparent 70%), radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)',
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(30px)' }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="meshLineG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#90eb61" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#24baac" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {allEdges.map((e, i) => (
          <line
            key={`e-${i}`}
            x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by}
            stroke="url(#meshLineG)" strokeWidth="0.22" strokeDasharray="1.2 1.2" opacity="0.75"
          />
        ))}
        {ringEdges.map((e, i) => (
          <motion.circle
            key={`p-${i}`} r="0.7" fill="#90eb61"
            initial={{ cx: e.ax, cy: e.ay }}
            animate={{ cx: [e.ax, e.bx, e.ax], cy: [e.ay, e.by, e.ay] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{ filter: 'drop-shadow(0 0 1.8px #24baac)' }}
          />
        ))}
      </svg>

      {/* Center glow point — meeting point of all radial connections */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        aria-hidden
      >
        <motion.span
          className="block h-2 w-2 md:h-2.5 md:w-2.5 rounded-full"
          style={{ background: '#90eb61', boxShadow: '0 0 16px #90eb61, 0 0 32px rgba(36,186,172,0.6)' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Service icon nodes — circle's centre is anchored to the node coordinate.
          The label is absolutely positioned BELOW the circle so it never offsets the anchor. */}
      {NETWORK_SERVICES.map((s, i) => (
        <div
          key={s.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Outward pulse ring */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.45, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
              style={{ boxShadow: '0 0 22px 4px rgba(144,235,97,0.55)' }}
            />
            {/* White circle with logo — its centre sits exactly on (s.x, s.y) */}
            <div
              className="relative grid h-10 w-10 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px] place-items-center rounded-full bg-white ring-1 ring-white/40 [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6 lg:[&_svg]:h-[26px] lg:[&_svg]:w-[26px]"
              style={{
                boxShadow:
                  '0 0 22px -2px rgba(144,235,97,0.6), 0 0 50px -10px rgba(36,186,172,0.45), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <s.Icon />
            </div>
            {/* Label sits below the circle without shifting the anchor */}
            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] md:text-[11px] lg:text-xs font-medium tracking-tight text-white/90">
              {s.label}
            </div>
          </motion.div>
        </div>
      ))}

      <div aria-hidden className="absolute inset-0 pointer-events-none font-mono text-[10px] tracking-widest text-white/35">
        {[
          { x: '12%', y: '20%', t: '01101', d: 9, dl: 0 },
          { x: '78%', y: '38%', t: '10011', d: 11, dl: 1 },
          { x: '22%', y: '70%', t: '11000', d: 10, dl: 2 },
          { x: '70%', y: '78%', t: '01110', d: 12, dl: 0.5 },
          { x: '46%', y: '14%', t: '◆ AI', d: 13, dl: 1.5 },
          { x: '60%', y: '60%', t: '◇ DATA', d: 14, dl: 0.8 },
        ].map((g, i) => (
          <motion.span
            key={i} className="absolute" style={{ left: g.x, top: g.y }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: g.d, repeat: Infinity, ease: 'easeInOut', delay: g.dl }}
          >
            {g.t}
          </motion.span>
        ))}
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(36,186,172,0.18), transparent)', mixBlendMode: 'screen' }}
        animate={{ y: ['-10%', '120%', '-10%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

function PlayOverlay() {
  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none z-10">
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative grid place-items-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1">
          <defs>
            <linearGradient id="playG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor="#24baac" />
            </linearGradient>
          </defs>
          <path d="M8 5v14l11-7z" fill="url(#playG)" />
        </svg>
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-white/60"
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  );
}

export default function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  });
  const words = TEXT.split(' ');

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 lg:py-28 px-6 md:px-12 overflow-hidden"
    >
      <GlowBackdrop />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading — top-left */}
        <h2 className="font-display font-bold tracking-tight leading-[1.05] text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.4rem] mb-7 md:mb-9 lg:mb-14 max-w-2xl">
          Built for <span className="text-gradient-gt">Intelligent Growth</span>
        </h2>

        {/* Bottom row — overlap composition mirrors the reference */}
        <div className="relative">
          {/* Right visual — anchored right */}
          <div className="lg:w-[60%] lg:ml-auto">
            <div
              className="relative aspect-[16/10] lg:aspect-[16/9.5] rounded-[1.65rem] overflow-hidden border border-white/10 ring-1 ring-white/5"
              style={{ boxShadow: '0 26px 65px -18px rgba(0,0,0,0.65)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl" />
              <HolographicMesh />
            </div>
          </div>

          {/* Left card — overlaps the right visual's bottom-left corner */}
          <div className="mt-5 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 lg:w-[43%] lg:translate-y-12 z-20">
            <div className="relative rounded-[1.65rem] overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(36,186,172,0.95) 0%, rgba(36,186,172,0.65) 45%, rgba(144,235,97,0.55) 100%)',
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-black/40"
                style={{ mixBlendMode: 'multiply' }}
              />
              <div
                aria-hidden
                className="absolute inset-0 rounded-[1.65rem] border border-white/15"
                style={{
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 75px -20px rgba(144,235,97,0.45)',
                }}
              />
              <motion.div
                aria-hidden
                className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl opacity-50"
                style={{ background: 'radial-gradient(circle, #24baac99, transparent 70%)' }}
                animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative flex items-center gap-5 md:gap-6 lg:gap-6 min-h-[190px] md:min-h-[215px] lg:min-h-[225px] px-6 md:px-7 lg:px-8 py-7 md:py-8">
                <CardVisual />
                <p className="font-display text-sm md:text-[15px] lg:text-base leading-[1.55] tracking-tight text-white">
                  {words.map((w, i) => (
                    <Word
                      key={i}
                      word={w}
                      index={i}
                      total={words.length}
                      progress={scrollYProgress}
                    />
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
