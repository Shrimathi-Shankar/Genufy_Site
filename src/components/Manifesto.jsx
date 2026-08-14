import { memo, useRef, useState, useEffect } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';

const TEXT =
  'Genufy transforms complex business challenges into seamless digital experiences. We design intelligent platforms, automation systems, and AI-driven solutions that help businesses scale efficiently and operate smarter.';

// Pre-split at module level — TEXT is a constant so this never changes.
// Splitting inside the component body created a new array on every render,
// giving all Word children a new array reference and preventing memoization.
const WORDS = TEXT.split(' ');

/* Official brand logos with a resilient multi-source fallback chain:
     1) simple-icons CDN (official SVG at the brand's hex color)
     2) Clearbit logo (official PNG from the brand's domain)
     3) Text initials (final safety net so the layout never breaks)
   Any source that fails to load automatically advances to the next. */
function BrandLogo({ sources = [], alt = '', scale = 1 }) {
  const [idx, setIdx] = useState(0);
  if (idx >= sources.length) {
    const initials = (alt || '?')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return (
      <span className="grid h-full w-full place-items-center text-[10px] md:text-xs font-bold tracking-wide text-slate-700">
        {initials}
      </span>
    );
  }
  /* Base logo fills 90% of the badge's inner box. Logos with heavy internal
     whitespace (MuleSoft, Pega, Salesforce) pass a >1 `scale` so their
     content renders as prominently as the tight Snowflake icon. The badge
     size never changes. */
  const size = `${85 * scale}%`;
  return (
    <img
      src={sources[idx]}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
      className="object-contain"
      style={{ width: size, height: size, transform: `scale(${scale})` }}
    />
  );
}

/* ===== Network services - perfect octagonal layout via trigonometry =====
   8 nodes evenly spaced 360/8 = 45° apart, starting at -90° (top). */
const NETWORK_CX = 50;   // centre X in viewBox %
const NETWORK_CY = 53;   // centre Y in viewBox %
const NETWORK_R = 28;    // radius in viewBox %
const NETWORK_N = 8;
const NETWORK_START_ANGLE = -90; // degrees - Salesforce sits at the top

/* Each entry carries an ordered list of logo sources. BrandLogo tries them in
   order. Non-brand labels (AI Solutions, DevOps, Web Development) map to the
   most recognized ecosystem brand. */
const SI = (slug, color = 'FFFFFF') => `https://cdn.simpleicons.org/${slug}/${color}`;
const CB = (domain) => `https://logo.clearbit.com/${domain}`;

const NETWORK_SERVICES = [
  { label: 'Salesforce', sources: ['/logos/salesforce.webp'], scale: 1.20 },
  { label: 'AI Solutions', sources: ['/logos/AI.webp'] },
  { label: 'DevOps', sources: ['/logos/devOps.webp'] },
  { label: 'Snowflake', sources: ['/logos/snowflake-color.webp'] },
  { label: 'MuleSoft', sources: ['/logos/mulesoft.webp'], scale: 1.10 },
  { label: 'Pega', sources: ['/logos/pega.webp'], scale: 1.40 },
  // Web Development is a category, not a brand - represented by the official
  // React mark (the ecosystem's most recognized symbol for modern web dev).
  { label: 'Web Development', sources: [SI('react', '61DAFB'), CB('react.dev')] },
  { label: 'Informatica', sources: ['/logos/informatica.webp'] },
].map((s, i) => {
  const rad = ((NETWORK_START_ANGLE + (i * 360) / NETWORK_N) * Math.PI) / 180;
  return {
    ...s,
    x: NETWORK_CX + NETWORK_R * Math.cos(rad),
    y: NETWORK_CY + NETWORK_R * Math.sin(rad),
  };
});

// memo prevents re-renders when the parent re-renders. Without it, every
// parent render called useTransform again, creating new MotionValue objects
// and breaking the scroll-linked animation continuity (visible as flickering).
// `progress` is a stable MotionValue reference; `index` and `total` never
// change after mount — so memo's shallow comparison always passes.
const Word = memo(function Word({ word, index, total, progress }) {
  const start = index / total;
  const end = (index + 1.4) / total;
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
});

/* Animated visual placed inside the left content card (mirrors the reference's mascot position) */
function CardVisual() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const spinRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!spinRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSpinning(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(spinRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={spinRef} className="relative h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 shrink-0">
      {/* Outer rotating gradient frame */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'conic-gradient(from 0deg, #90eb61, #24baac, #90eb61)', animation: spinning ? 'spin-cw 14s linear infinite' : 'none', willChange: spinning ? 'transform' : 'auto' }}
      />
      {/* Inner panel — kept intentionally dark in both themes (dark widget = tech accent) */}
      <div
        className="absolute inset-[2px] rounded-[14px] backdrop-blur-sm overflow-hidden"
        style={{ background: isLight ? 'rgba(10,15,35,0.88)' : 'rgba(0,0,0,0.85)' }}
      >
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
        <div
          className="absolute top-2 right-2 flex items-end gap-0.5"
          style={{ animation: 'chart-float 3.5s ease-in-out infinite' }}
        >
          {[6, 9, 5, 11].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: h,
                background: 'linear-gradient(180deg, #90eb61, #24baac)',
                boxShadow: '0 0 6px rgba(36,186,172,0.6)',
                animation: `hud-blink-hi 2.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Floating pie glyph (bottom-left) */}
        <div
          className="absolute bottom-2 left-2 h-3.5 w-3.5 rounded-full overflow-hidden"
          style={{
            animation: 'spin-cw 12s linear infinite',
            background:
              'conic-gradient(#90eb61 0% 60%, #24baac 60% 100%)',
            boxShadow: '0 0 8px rgba(144,235,97,0.55)',
          }}
        />
      </div>
    </div>
  );
}

/* Ambient floating particles for THIS section (light mode). In dark mode the
   hero's fixed particle field shows through; in light mode that field is hidden
   by the solid base, so this recreates a similar look on the light background: a
   mix of small crisp dots and a few larger soft bokeh orbs, in brand teal/green.
   Positions are deterministic (computed once) and animated via one CSS keyframe. */
const SECTION_PARTICLES = Array.from({ length: 58 }, (_, i) => {
  const big = i % 7 === 3;
  return {
    left: (i * 37) % 100,
    top: (i * 53 + 11) % 100,
    size: big ? 9 + ((i * 5) % 7) : 2 + ((i * 7) % 5) * 0.5,
    teal: i % 2 === 0,
    big,
    dur: 7 + ((i * 11) % 70) / 10,
    delay: ((i * 17) % 55) / 10,
    opMax: big ? 0.14 + ((i * 7) % 9) / 100 : 0.5 + ((i * 13) % 33) / 100,
  };
});

function SectionParticles() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {SECTION_PARTICLES.map((p, i) => {
        const glow = p.big ? p.size * 1.2 : p.size * 2.6;
        const rgb = p.teal ? '36,186,172' : '46,158,94';
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(${rgb},${p.big ? 0.5 : 1})`,
              boxShadow: `0 0 ${glow.toFixed(1)}px rgba(${rgb},${p.big ? 0.35 : 0.55})`,
              filter: p.big ? 'blur(2px)' : 'none',
              opacity: p.opMax,
              '--p-max': p.opMax,
              animation: `mani-particle-float ${p.dur.toFixed(1)}s ease-in-out ${p.delay.toFixed(1)}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function GlowBackdrop() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(36,186,172,0.07) 0%, rgba(144,235,97,0.03) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(36,186,172,0.14) 0%, rgba(144,235,97,0.05) 45%, transparent 72%)',
          animation: 'blob-drift-a 14s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute -right-32 bottom-10 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(144,235,97,0.06) 0%, rgba(36,186,172,0.03) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(144,235,97,0.12) 0%, rgba(36,186,172,0.05) 45%, transparent 72%)',
          animation: 'blob-drift-b 16s ease-in-out 1s infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

function HolographicMesh() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const CENTER = { x: NETWORK_CX, y: NETWORK_CY };
  // Radial edges - each service connects to the centre point.
  const radialEdges = NETWORK_SERVICES.map((s) => ({
    ax: s.x, ay: s.y, bx: CENTER.x, by: CENTER.y,
  }));
  // Ring edges - each service connects to its adjacent neighbour.
  const ringEdges = NETWORK_SERVICES.map((s, i) => {
    const next = NETWORK_SERVICES[(i + 1) % NETWORK_SERVICES.length];
    return { ax: s.x, ay: s.y, bx: next.x, by: next.y };
  });
  const allEdges = [...radialEdges, ...ringEdges];

  return (
    <div className="relative h-full w-full">
      {/* ===== LAYER 1 - Background gradients, grid, particles, scanline.
          Static layer (no mouse-driven tilt) so the card stays stable. ===== */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        {/* Drifting glow blobs. Previously this morphed a multi-radial CSS
            `background` between 4 keyframes — interpolating a gradient string and
            repainting a blur(30px) layer EVERY frame (a top main-thread cost).
            Now each blob is a pre-blurred layer animated via `x`/`y` transform
            only (composited, off the main thread) — same drifting-glow look. */}
        <div aria-hidden className={`absolute inset-0 ${isLight ? 'opacity-25' : 'opacity-70'}`}>
          {/* static faint sky-blue centre wash (was the 3rd, non-moving radial) */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.10), transparent 80%)'
                : 'radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)',
            }}
          />
          {/* teal blob */}
          <motion.div
            className="absolute h-[70%] w-[70%] rounded-full"
            style={{
              top: '5%',
              left: '-5%',
              background: isLight
                ? 'radial-gradient(circle, rgba(36,186,172,0.16), transparent 70%)'
                : 'radial-gradient(circle, rgba(36,186,172,0.55), transparent 70%)',
              filter: 'blur(30px)',
              willChange: 'transform',
            }}
            animate={{ x: ['0%', '70%', '30%', '0%'], y: ['0%', '0%', '60%', '0%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* lime blob */}
          <motion.div
            className="absolute h-[60%] w-[60%] rounded-full"
            style={{
              top: '45%',
              left: '50%',
              background: isLight
                ? 'radial-gradient(circle, rgba(144,235,97,0.12), transparent 70%)'
                : 'radial-gradient(circle, rgba(144,235,97,0.45), transparent 70%)',
              filter: 'blur(30px)',
              willChange: 'transform',
            }}
            animate={{ x: ['0%', '-60%', '20%', '0%'], y: ['0%', '0%', '-55%', '0%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: isLight
              ? 'linear-gradient(rgba(15,23,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.5) 1px, transparent 1px)'
              : 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          }}
        />

        {/* Floating ambient labels - subtle on-brand capability words */}
        <div aria-hidden className="absolute inset-0 font-mono text-[10px] tracking-[0.35em] uppercase text-white/25">
          {[
            { x: '12%', y: '20%', t: 'Innovate', d: 9, dl: 0 },
            { x: '78%', y: '38%', t: 'Automate', d: 11, dl: 1 },
            { x: '20%', y: '72%', t: 'Integrate', d: 10, dl: 2 },
            { x: '70%', y: '80%', t: 'Scale', d: 12, dl: 0.5 },
            { x: '46%', y: '13%', t: 'Transform', d: 13, dl: 1.5 },
            { x: '62%', y: '62%', t: 'Connect', d: 14, dl: 0.8 },
          ].map((g, i) => (
            <span
              key={i} className="absolute" style={{ left: g.x, top: g.y, animation: `label-float ${g.d}s ease-in-out ${g.dl}s infinite` }}
            >
              {g.t}
            </span>
          ))}
        </div>

        {/* Scanline sweep - part of the tilted background */}
        <div
          aria-hidden
          className="absolute inset-x-0 h-12"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(36,186,172,0.18), transparent)',
            mixBlendMode: isLight ? 'multiply' : 'screen',
            animation: 'scanline-sweep 9s ease-in-out infinite',
          }}
        />
      </div>

      {/* ===== LAYER 2 - Network lines (locked, never transformed) ===== */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
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
            stroke={isLight ? '#4aa87e' : 'url(#meshLineG)'}
            strokeWidth={isLight ? '0.28' : '0.14'}
            strokeDasharray="1.2 1.2"
            opacity={isLight ? '0.55' : '0.45'}
          />
        ))}
        {ringEdges.map((e, i) => (
          <motion.circle
            key={`p-${i}`} r={isLight ? '0.75' : '0.45'} fill={isLight ? '#2e9e5e' : '#90eb61'}
            initial={{ cx: e.ax, cy: e.ay }}
            animate={{ cx: [e.ax, e.bx, e.ax], cy: [e.ay, e.by, e.ay] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{ filter: isLight ? 'drop-shadow(0 0 1.5px #24baac)' : 'drop-shadow(0 0 1px #24baac)' }}
          />
        ))}
      </svg>

      {/* ===== LAYER 3 - Service nodes (locked, never transformed) =====
          No rotateX/rotateY, no hover-based motion. Only entry animation
          (opacity/scale once on first viewport entry) + ambient pulse ring. */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center logo - Genufy favicon sits exactly on the convergence point
            of all radial connections. White circular badge matches the
            service nodes, slightly larger so the centre reads as the hub. */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Mobile-only shrink wrapper - scales the badge + halo + glow down
                ~25% below md so the network feels more compact; md+ = scale-100
                (unchanged). The center anchor point doesn't move, so the
                connecting lines and layout stay intact. */}
            <div className="relative scale-[0.75] md:scale-100">
              {/* Outward pulsing halo */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.55, 1], opacity: isLight ? [0.32, 0, 0.32] : [0.55, 0, 0.55] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                style={{ boxShadow: isLight ? '0 0 20px 4px rgba(144,235,97,0.32)' : '0 0 28px 6px rgba(144,235,97,0.6)' }}
              />
              {/* White circular badge - matches the service nodes, slightly larger. */}
              <div
                className="relative grid h-12 w-12 sm:h-14 sm:w-14 md:h-[72px] md:w-[72px] lg:h-[76px] lg:w-[76px] place-items-center rounded-full bg-white ring-1 ring-white/40 p-1.5 sm:p-2 md:p-2.5 lg:p-3"
                style={{
                  boxShadow: isLight
                    ? '0 0 14px -2px rgba(144,235,97,0.35), 0 0 30px -10px rgba(36,186,172,0.25), inset 0 1px 0 rgba(255,255,255,0.9)'
                    : '0 0 26px -2px rgba(144,235,97,0.75), 0 0 60px -10px rgba(36,186,172,0.55), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <img
                  src="/favicon.png"
                  alt="Genufy"
                  loading="lazy"
                  decoding="async"
                  width={72}
                  height={72}
                  className="h-full w-full scale-[1.1] object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service icon nodes - circle's centre is anchored to (s.x, s.y). */}
        {NETWORK_SERVICES.map((s, i) => (
          <div
            key={s.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outward pulse ring - visual only, no positional change */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.45, 1], opacity: isLight ? [0.3, 0, 0.3] : [0.55, 0, 0.55] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                style={{ boxShadow: isLight ? '0 0 16px 3px rgba(144,235,97,0.3)' : '0 0 22px 4px rgba(144,235,97,0.55)' }}
              />
              {/* White circle with the official brand logo - centre sits
                  exactly on (s.x, s.y). Inner padding gives the logo breathing
                  room so it never touches the badge edge. */}
              <div
                className="relative grid h-10 w-10 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px] place-items-center rounded-full bg-white ring-1 ring-white/40 p-1.5 md:p-2 lg:p-[9px]"
                style={{
                  boxShadow: isLight
                    ? '0 0 12px -2px rgba(144,235,97,0.32), 0 0 26px -10px rgba(36,186,172,0.22), inset 0 1px 0 rgba(255,255,255,0.9)'
                    : '0 0 22px -2px rgba(144,235,97,0.6), 0 0 50px -10px rgba(36,186,172,0.45), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <BrandLogo sources={s.sources} alt={s.label} scale={s.scale} />
              </div>
              {/* Label sits below the circle - hidden on mobile (<md) so only
                  the logos show; visible on tablet/desktop. */}
              <div className={`hidden md:block absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] md:text-[11px] lg:text-xs font-medium tracking-tight ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                {s.label}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  });

  return (
    <section
      ref={ref}
      /* No `cv-section` here: content-visibility:auto defers this section's first
         render until it scrolls in, which on mobile produced a visible
         render-pop/scroll-jump right at the hero->Manifesto boundary (the area
         where the desktop robot sits). It renders eagerly so the transition is
         smooth. Heavier lower sections keep cv-section. */
      className="relative py-16 md:py-20 lg:py-28 px-6 md:px-12 overflow-hidden"
    >
      {/* Solid section base (light mode). The hero's ParallaxStage backdrop is
          position:fixed and spans the whole page, so its floating particles and
          rings bleed through any transparent section. This opaque layer blocks
          that bleed-through here, keeping this section's background calm. Dark
          mode is left transparent so its look is unchanged. */}
      {isLight && (
        <div aria-hidden className="absolute inset-0" style={{ background: '#f2faf4' }} />
      )}
      <GlowBackdrop />
      {isLight && <SectionParticles />}

      <div className="relative max-w-7xl mx-auto">
        {/* Heading - top-left */}
        <h2 className="font-display font-bold tracking-tight leading-[1.05] text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.4rem] mb-7 md:mb-9 lg:mb-14 max-w-2xl">
          Built for <span className="text-gradient-gt">Intelligent Growth</span>
        </h2>

        {/* Bottom row - overlap composition mirrors the reference */}
        <div className="relative">
          {/* Right visual - anchored right */}
          <div className="lg:w-[60%] lg:ml-auto">
            <div
              className={`relative aspect-[16/10] lg:aspect-[16/9.5] rounded-[1.65rem] overflow-hidden ${isLight ? 'border border-[rgba(36,186,172,0.18)]' : 'border border-white/10 ring-1 ring-white/5'}`}
              style={{
                boxShadow: isLight
                  ? '0 4px 20px rgba(15,23,42,0.07), 0 0 0 1px rgba(36,186,172,0.12), 0 8px 32px rgba(36,186,172,0.08)'
                  : '0 26px 65px -18px rgba(0,0,0,0.65)',
              }}
            >
              <div className={`absolute inset-0 backdrop-blur-sm ${isLight ? 'bg-gradient-to-b from-[#eaf6f0]/95 to-[#d6ece2]/90' : 'bg-gradient-to-b from-white/[0.04] to-white/[0.01]'}`} />
              <HolographicMesh />
            </div>
          </div>

          {/* Left card - overlaps the right visual's bottom-left corner */}
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
                  {WORDS.map((w, i) => (
                    <Word
                      key={i}
                      word={w}
                      index={i}
                      total={WORDS.length}
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
