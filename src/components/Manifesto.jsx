import { useRef, useState } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';

const TEXT =
  'Genufy transforms complex business challenges into seamless digital experiences. We design intelligent platforms, automation systems, and AI-driven solutions that help businesses scale efficiently and operate smarter.';

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
        style={{
          background:
            'radial-gradient(circle, rgba(36,186,172,0.14) 0%, rgba(144,235,97,0.05) 45%, transparent 72%)',
        }}
        animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 bottom-10 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(144,235,97,0.12) 0%, rgba(36,186,172,0.05) 45%, transparent 72%)',
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}

function HolographicMesh() {
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
        <div aria-hidden className="absolute inset-0 opacity-70">
          {/* static faint sky-blue centre wash (was the 3rd, non-moving radial) */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(125,211,252,0.18), transparent 80%)' }}
          />
          {/* teal blob */}
          <motion.div
            className="absolute h-[70%] w-[70%] rounded-full"
            style={{
              top: '5%',
              left: '-5%',
              background: 'radial-gradient(circle, rgba(36,186,172,0.55), transparent 70%)',
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
              background: 'radial-gradient(circle, rgba(144,235,97,0.45), transparent 70%)',
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
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
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
            <motion.span
              key={i} className="absolute" style={{ left: g.x, top: g.y }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: g.d, repeat: Infinity, ease: 'easeInOut', delay: g.dl }}
            >
              {g.t}
            </motion.span>
          ))}
        </div>

        {/* Scanline sweep - part of the tilted background */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-12"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(36,186,172,0.18), transparent)', mixBlendMode: 'screen' }}
          animate={{ y: ['-10%', '120%', '-10%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
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
                animate={{ scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                style={{ boxShadow: '0 0 28px 6px rgba(144,235,97,0.6)' }}
              />
              {/* White circular badge - matches the service nodes, slightly larger. */}
              <div
                className="relative grid h-12 w-12 sm:h-14 sm:w-14 md:h-[72px] md:w-[72px] lg:h-[76px] lg:w-[76px] place-items-center rounded-full bg-white ring-1 ring-white/40 p-1.5 sm:p-2 md:p-2.5 lg:p-3"
                style={{
                  boxShadow:
                    '0 0 26px -2px rgba(144,235,97,0.75), 0 0 60px -10px rgba(36,186,172,0.55), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <img
                  src="/favicon.png"
                  alt="Genufy"
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
                animate={{ scale: [1, 1.45, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                style={{ boxShadow: '0 0 22px 4px rgba(144,235,97,0.55)' }}
              />
              {/* White circle with the official brand logo - centre sits
                  exactly on (s.x, s.y). Inner padding gives the logo breathing
                  room so it never touches the badge edge. */}
              <div
                className="relative grid h-10 w-10 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px] place-items-center rounded-full bg-white ring-1 ring-white/40 p-1.5 md:p-2 lg:p-[9px]"
                style={{
                  boxShadow:
                    '0 0 22px -2px rgba(144,235,97,0.6), 0 0 50px -10px rgba(36,186,172,0.45), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <BrandLogo sources={s.sources} alt={s.label} scale={s.scale} />
              </div>
              {/* Label sits below the circle - hidden on mobile (<md) so only
                  the logos show; visible on tablet/desktop. */}
              <div className="hidden md:block absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] md:text-[11px] lg:text-xs font-medium tracking-tight text-white/90">
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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  });
  const words = TEXT.split(' ');

  return (
    <section
      ref={ref}
      className="cv-section relative py-16 md:py-20 lg:py-28 px-6 md:px-12 overflow-hidden"
    >
      <GlowBackdrop />

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
              className="relative aspect-[16/10] lg:aspect-[16/9.5] rounded-[1.65rem] overflow-hidden border border-white/10 ring-1 ring-white/5"
              style={{ boxShadow: '0 26px 65px -18px rgba(0,0,0,0.65)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl" />
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
