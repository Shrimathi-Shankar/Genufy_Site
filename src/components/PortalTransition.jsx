import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/* ============================================================
   PortalTransition (Parallax edition)
   A multi-layer sticky parallax stage that bridges Manifesto
   → Salesforce Partnership. Layers drift at different speeds
   (some horizontal, some vertical) to create depth and motion.
   No expanding circle.

   Layers, back to front:
     1. Abstract grid + glow blobs        (slowest, soft drift)
     2. Long horizontal "data streams"    (slow horizontal motion)
     3. Floating tech / service cards     (medium parallax, mixed XY)
     4. Vertical particle streams         (fast downward drift)
     5. Captions fade through the journey
============================================================ */

/* ------------ data — Genufy capabilities, platform-agnostic ------------ */
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
  x: ((i * 41) % 100),
  duration: 5 + (i % 5),
  delay: (i * 0.27) % 6,
  size: 0.4 + ((i * 11) % 6) / 10,
  green: i % 2 === 0,
}));

/* ------------ sub-components ------------ */
function TechCard({ card, scrollYProgress }) {
  // Each card drifts a little based on its `depth` (parallax factor).
  const tx = useTransform(scrollYProgress, [0, 1], [card.depth * 60, card.depth * -60]);
  const ty = useTransform(scrollYProgress, [0, 1], [card.depth * -30, card.depth * 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 0.95], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.78, 0.95], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{
        left: `${card.x}%`,
        top: `${card.y}%`,
        x: tx,
        y: ty,
        opacity,
        filter,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <div
        className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-4 py-3 md:px-5 md:py-3.5 min-w-[140px] md:min-w-[170px]"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 36px -16px rgba(36,186,172,0.45)',
        }}
      >
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl opacity-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(144,235,97,0.20), rgba(36,186,172,0.20))',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: 1,
          }}
        />
        <div
          className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase"
          style={{
            background: 'linear-gradient(90deg,#90eb61,#24baac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {card.label}
        </div>
        <div className="mt-1 text-[10px] md:text-xs text-white/60">{card.sub}</div>
      </div>
    </motion.div>
  );
}

function StreamBand({ band, scrollYProgress }) {
  // Translate horizontally across the section based on scroll, modulated by `speed`.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [`${band.speed > 0 ? -30 : 130}%`, `${band.speed > 0 ? 130 : -30}%`]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, band.opacity, band.opacity, 0]);
  return (
    <motion.div
      style={{
        top: `${band.y}%`,
        x,
        opacity,
        width: band.width,
      }}
      className="absolute h-px pointer-events-none"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(144,235,97,0.7), rgba(36,186,172,0.55), transparent)',
          filter: 'blur(0.3px)',
        }}
      />
    </motion.div>
  );
}

/* ------------ main component ------------ */
export default function PortalTransition({ height = '260vh' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /* Backdrop layers drift slowly */
  const blobX1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const blobX2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  /* Caption rotation */
  const cap1Op = useTransform(scrollYProgress, [0.00, 0.10, 0.28, 0.36], [0, 1, 1, 0]);
  const cap2Op = useTransform(scrollYProgress, [0.32, 0.42, 0.58, 0.66], [0, 1, 1, 0]);
  const cap3Op = useTransform(scrollYProgress, [0.62, 0.72, 0.84, 0.92], [0, 1, 1, 0]);

  if (reduce) {
    return <div className="h-[40vh] bg-black" aria-hidden />;
  }

  return (
    <section
      ref={ref}
      aria-label="Parallax transition"
      className="relative bg-black"
      style={{ height }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === Layer 1 — abstract backdrop ============================ */}
        {/* Slow-drifting grid */}
        <motion.div
          aria-hidden
          style={{ y: gridY }}
          className="absolute inset-x-0 -top-1/4 h-[150%] opacity-[0.06] pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
            }}
          />
        </motion.div>

        {/* Soft glow blobs */}
        <motion.div
          aria-hidden
          style={{ x: blobX1 }}
          className="absolute left-[12%] top-[20%] h-[420px] w-[520px] rounded-full blur-[140px] opacity-50 pointer-events-none"
        >
          <div
            className="h-full w-full"
            style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.45), transparent 70%)' }}
          />
        </motion.div>
        <motion.div
          aria-hidden
          style={{ x: blobX2 }}
          className="absolute right-[10%] bottom-[16%] h-[460px] w-[560px] rounded-full blur-[160px] opacity-45 pointer-events-none"
        >
          <div
            className="h-full w-full"
            style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.40), transparent 70%)' }}
          />
        </motion.div>

        {/* Floating / drifting decorative layers (data streams, tech cards,
            particles) — hidden on mobile (<md) so the Salesforce Partner
            content stays stable and easy to read; tablet + desktop unchanged. */}
        <div className="hidden md:block" aria-hidden>
          {/* === Layer 2 — horizontal data streams ===================== */}
          {STREAM_BANDS.map((band, i) => (
            <StreamBand key={i} band={band} scrollYProgress={scrollYProgress} />
          ))}

          {/* === Layer 3 — floating tech cards with mixed parallax ==== */}
          {TECH_CARDS.map((c, i) => (
            <TechCard key={i} card={c} scrollYProgress={scrollYProgress} />
          ))}

          {/* === Layer 4 — vertical particle streams ================== */}
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
              animate={{
                top: ['-2%', '102%'],
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeIn',
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* === Layer 5 — Salesforce Partner caption sequence ============ */}
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
            sub="From legacy migrations to multi-cloud orchestration — engineered to grow with you."
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
      </div>
    </section>
  );
}

/* Caption shared between the three rotation slots.
   `title` is rendered white by default. Pass `accent` to wrap to a new line
   and render that portion with the brand gradient. */
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
