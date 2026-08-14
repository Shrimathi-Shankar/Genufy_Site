/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
import { m as motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/*
  PortalTransition — Early-reveal cinematic parallax
  ════════════════════════════════════════════════════

  SCROLL GEOMETRY (height=160vh, offset ['start 80%','end end'])
    Total scroll range = 140vh.
    progress=0    → section.top at 80% viewport (section entering, previous
                    section still partially on screen).
    progress=0.57 → section.top at viewport.top (sticky pins).
    progress=1.0  → section.bottom at viewport.bottom (sticky releases).

  ENTRY phase  [0 → 0.57]
    Backdrop, blobs, cards and streams fade in as the section rises from below.
    The previous section is still partially visible during this window.

  PINNED phase [0.57 → 1.0]
    Caption sequence plays. All ambient layers are already fully revealed.

  SPRING  stiffness:55 / damping:36 / mass:0.8
    Responsive enough to start the entry reveal immediately (no long lag),
    inertial enough for cinematic caption transitions.

  CAPTION WINDOWS — remapped into pinned region [0.57, 1.0]
    cap1: [0.57, 0.62, 0.70, 0.74]
    cap2: [0.73, 0.77, 0.83, 0.87]
    cap3: [0.85, 0.90, 0.95, 0.99]
*/

const TECH_CARDS = [
  { label: 'AI & Machine Learning', sub: 'Models · Copilots', x: 12, y: 22, depth: 0.7 },
  { label: 'Data Engineering', sub: 'Pipelines · Warehouses', x: 78, y: 18, depth: 1.2 },
  { label: 'Cloud Solutions', sub: 'Scalable Infrastructure', x: 22, y: 62, depth: 0.95 },
  { label: 'Enterprise Integration', sub: 'APIs · Event Streams', x: 72, y: 68, depth: 0.55 },
  { label: 'Workflow Automation', sub: 'Process Orchestration', x: 50, y: 14, depth: 1.4 },
  { label: 'Analytics & Insights', sub: 'Decision Intelligence', x: 58, y: 78, depth: 0.85 },
  { label: 'DevOps & Platform', sub: 'CI/CD · Reliability', x: 86, y: 44, depth: 1.05 },
  { label: 'Digital Transformation', sub: 'End-to-End Modernization', x: 6, y: 44, depth: 1.1 },
];

const STREAM_BANDS = [
  { y: 18, speed: 1, width: 220, opacity: 0.45 },
  { y: 33, speed: -0.7, width: 320, opacity: 0.30 },
  { y: 50, speed: 1.6, width: 180, opacity: 0.55 },
  { y: 66, speed: -1.2, width: 280, opacity: 0.35 },
  { y: 82, speed: 0.9, width: 240, opacity: 0.40 },
];

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  i,
  x: (i * 41) % 100,
  duration: 15 + (i % 8),
  delay: (i * 0.55) % 10,
  size: 0.4 + ((i * 11) % 6) / 10,
  green: i % 2 === 0,
}));

function TechCard({ card, progress }) {
  const tx = useTransform(progress, [0, 1], [card.depth * 16, card.depth * -16]);
  const ty = useTransform(progress, [0, 1], [card.depth * -8, card.depth * 24]);
  const opacity = useTransform(progress, [0.05, 0.22, 0.97, 1.00], [0, 1, 1, 0]);
  const blurPx = useTransform(progress, [0.05, 0.22, 0.97, 1.00], [10, 0, 0, 10]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ left: `${card.x}%`, top: `${card.y}%`, x: tx, y: ty, opacity, filter }}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <div
        className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-4 py-3 md:px-5 md:py-3.5 min-w-[140px] md:min-w-[170px]"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 36px -16px rgba(36,186,172,0.45)' }}
      >
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(144,235,97,0.20), rgba(36,186,172,0.20))',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: 1,
          }}
        />
        <div
          className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase"
          style={{ background: 'linear-gradient(90deg,#90eb61,#24baac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {card.label}
        </div>
        <div className="mt-1 text-[10px] md:text-xs text-white/60">{card.sub}</div>
      </div>
    </motion.div>
  );
}

function StreamBand({ band, progress }) {
  const x = useTransform(
    progress,
    [0, 1],
    [`${band.speed > 0 ? -30 : 130}%`, `${band.speed > 0 ? 130 : -30}%`]
  );
  const opacity = useTransform(progress, [0.05, 0.22, 0.97, 1], [0, band.opacity, band.opacity, 0]);
  return (
    <motion.div style={{ top: `${band.y}%`, x, opacity, width: band.width }} className="absolute h-px pointer-events-none">
      <div
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(144,235,97,0.7), rgba(36,186,172,0.55), transparent)',
          filter: 'blur(0.3px)',
        }}
      />
    </motion.div>
  );
}

export default function PortalTransition({ height = '300vh' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // Preload HorizontalCapabilities while the user is still scrolling this section.
  useEffect(() => { window.__loadServicesSection?.(); }, []);

  // height=300vh, offset ['start 80%','end end'] → total range 280vh.
  // Sticky pins at progress=0.29 (80/280). Pinned region 0.29→1.0 = 200vh.
  // Each caption gets ~67vh of scroll ≈ one distinct scroll gesture.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end end'],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 36, mass: 0.8 });

  // Canvas exit using RAW scrollYProgress (not spring).
  // Spring lags ~0.08 behind raw at normal speed — if we used spring here the
  // canvas would still be partially opaque when sticky physically releases at
  // raw=1.0, causing a black flash. Raw guarantees opacity=0 before release.
  // marginBottom:'-100vh' on the section pulls Services.top to section.top+200vh,
  // exactly matching the sticky release point, so there is zero document-flow gap.
  // Cross-fade window: raw [0.86, 1.00].
  // Canvas fades over 14% of total progress (~39vh) while Services rises beneath.
  // At raw=0.93 the canvas is at 50% — caption still clearly readable, Services
  // already half-visible. Both sections overlap for the full fade duration.
  // TWO-PHASE exit — movement and fade are decoupled:
  // Phase 1  raw [0.84→0.93] (~25vh): canvas rises while staying fully opaque.
  //   Services is hidden. cap3 exits naturally upward before anything else appears.
  // Phase 2  raw [0.93→1.00] (~20vh): canvas fades to 0 while continuing to rise.
  //   Services fades in simultaneously. At raw=0.965 both sit at ~50% opacity.
  const stickyOp = useTransform(
    scrollYProgress,
    [0.90, 1.00],
    [1, 0]
  );

  const stickyY = useTransform(
    scrollYProgress,
    [0.90, 1.00],
    ['0%', '-22%']
  );

  // Blobs fade in during entry phase, fully visible by the time sticky pins.
  const blobOp1 = useTransform(progress, [0, 0.22], [0, 0.50]);
  const blobOp2 = useTransform(progress, [0, 0.22], [0, 0.45]);
  const blobX1 = useTransform(progress, [0, 1], ['-8%', '8%']);
  const blobX2 = useTransform(progress, [0, 1], ['8%', '-8%']);

  // Three equal caption windows inside the pinned region [0.29, 1.0].
  // Each window spans ~0.237 of total progress (~67vh of scroll).
  // cap3 intentionally holds until stickyOp fades the whole canvas — no need
  // for a separate cap3 fade-out because stickyOp multiplies the canvas opacity.
  const cap1Op = useTransform(progress, [0.29, 0.32, 0.50, 0.53], [0, 1, 1, 0]);
  const cap2Op = useTransform(progress, [0.53, 0.56, 0.74, 0.77], [0, 1, 1, 0]);
  // cap3 holds at full opacity through the entire cross-fade. stickyOp fades
  // the whole canvas including cap3, so no separate fade-out is needed here.
  const cap3Op = useTransform(progress, [0.77, 0.80, 1.00, 1.00], [0, 1, 1, 0]);

  if (reduce) return <div className="h-[40vh] bg-black pt-canvas" aria-hidden />;

  return (
    <section
      ref={ref}
      aria-label="Parallax transition"
      className="relative bg-black pt-canvas"
      style={{ height, marginBottom: '-60vh' }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden bg-black pt-canvas"
        style={{
          opacity: stickyOp,
          y: stickyY,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >

        {/* Glow blobs */}
        <motion.div
          aria-hidden
          style={{ x: blobX1, opacity: blobOp1 }}
          className="absolute left-[12%] top-[20%] h-[420px] w-[520px] rounded-full blur-[140px] pointer-events-none"
        >
          <div className="h-full w-full" style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.45), transparent 70%)' }} />
        </motion.div>
        <motion.div
          aria-hidden
          style={{ x: blobX2, opacity: blobOp2 }}
          className="absolute right-[10%] bottom-[16%] h-[460px] w-[560px] rounded-full blur-[160px] pointer-events-none"
        >
          <div className="h-full w-full" style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.40), transparent 70%)' }} />
        </motion.div>

        <div className="hidden md:block" aria-hidden>
          {/* Layer 2 — data streams */}
          {STREAM_BANDS.map((band, i) => (
            <StreamBand key={i} band={band} progress={progress} />
          ))}

          {/* Layer 3 — floating cards */}
          {TECH_CARDS.map((c, i) => (
            <TechCard key={i} card={c} progress={progress} />
          ))}

          {/* Layer 4 — particles */}
          {PARTICLES.map((p) => (
            <motion.span
              key={p.i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: '-2%',
                width: p.size * 4,
                height: p.size * 4,
                background: p.green ? 'rgba(144,235,97,0.85)' : 'rgba(36,186,172,0.85)',
                boxShadow: '0 0 8px rgba(144,235,97,0.45)',
              }}
              animate={{ top: ['-2%', '102%'], opacity: [0, 0.85, 0.85, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
            />
          ))}
        </div>

        {/* Layer 5 — caption sequence (pinned region 0.57 → 1.0) */}
        <motion.div
          style={{ opacity: cap1Op }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none px-6"
        >
          <Caption
            eyebrow="Certified · Trusted · Proven"
            title="We are an Official"
            accent="Salesforce Partner"
            sub="A trusted partnership built on certified expertise and measurable outcomes."
          />
        </motion.div>
        <motion.div
          style={{ opacity: cap2Op }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none px-6"
        >
          <Caption
            eyebrow="Enterprise · Scale"
            accent="Enterprise Transformation"
            sub="From legacy migrations to multi-cloud orchestration - engineered to grow with you."
          />
        </motion.div>
        <motion.div
          style={{ opacity: cap3Op }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none px-6"
        >
          <Caption
            eyebrow="AI · Intelligence"
            accent="Intelligent Digital Solutions"
            sub="Automation, copilots and data-driven journeys engineered as one fabric."
          />
        </motion.div>

      </motion.div>
    </section>
  );
}

function Caption({ eyebrow, title, accent, sub }) {
  return (
    <>
      <div className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-white/55">
        {eyebrow}
      </div>
      <div className="mt-3 text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] max-w-3xl mx-auto">
        <span className="block text-white">{title}</span>
        {accent && (
          <span
            className="block mt-1 pb-2 text-3xl md:text-5xl lg:text-6xl font-bold"
            style={{
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 22px rgba(36,186,172,0.30))',
            }}
          >
            {accent}
          </span>
        )}
      </div>
      {sub && (
        <div className="mt-4 text-sm md:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
          {sub}
        </div>
      )}
    </>
  );
}
