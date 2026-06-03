import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import MagneticButton from './MagneticButton.jsx';
import { SERVICES } from './services/serviceData.js';
import ServiceFullscreen from './services/ServiceFullscreen.jsx';

const PREFIX = 'carousel';

/* ---------- Premium futuristic capability card ---------- */

function AnimatedGlyph({ accent }) {
  return (
    <div className="relative h-12 w-12">
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[2px] rounded-[14px] bg-black/85 backdrop-blur-xl grid place-items-center">
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="h-3 w-3 rounded-full"
          style={{
            background: `linear-gradient(135deg, #90eb61, ${accent})`,
            boxShadow: `0 0 18px ${accent}aa`,
          }}
        />
      </div>
    </div>
  );
}

function CapabilityCard({ service, index, progress, onSelect }) {
  const total = SERVICES.length;
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  const scrollScale = useTransform(progress, [start - 0.1, mid, end + 0.1], [0.94, 1, 0.94]);
  const scrollOpacity = useTransform(progress, [start - 0.15, mid, end + 0.15], [0.55, 1, 0.55]);

  // Mouse-follow light & tilt
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 120, damping: 14 });
  const [light, setLight] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x);
    my.set(y);
    setLight({ x: x * 100, y: y * 100, opacity: 1 });
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setLight((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(service);
        }
      }}
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 * index }}
      style={{
        scale: scrollScale,
        opacity: scrollOpacity,
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1200,
        willChange: 'transform',
      }}
      className="group relative w-[82vw] sm:w-[44vw] lg:w-[28vw] xl:w-[26vw] shrink-0 aspect-[4/5] cursor-pointer rounded-3xl focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      {/* Gradient border on hover */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${service.accent}, #90eb61 50%, transparent 90%)`,
          padding: 1,
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Glassmorphism panel */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-xl">
        {/* Image (shared layout target — morphs to fullscreen) */}
        <motion.div
          layoutId={`${PREFIX}-svc-media-${service.id}`}
          className="absolute inset-0"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={service.image}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-50 scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.18] group-hover:opacity-65"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.92) 100%)',
            }}
          />
        </motion.div>

        {/* Accent corner glow */}
        <div
          aria-hidden
          className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-80"
          style={{ background: `radial-gradient(circle, ${service.accent}66, transparent 70%)` }}
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.55), transparent 70%)' }}
        />

        {/* Hover glow ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 80px -20px ${service.accent}55, 0 0 60px -10px ${service.accent}55`,
          }}
        />

        {/* Mouse-follow light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            opacity: light.opacity,
            background: `radial-gradient(280px circle at ${light.x}% ${light.y}%, ${service.accent}25, transparent 60%)`,
          }}
        />

        {/* Grid micro-pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative h-full w-full p-7 md:p-8 flex flex-col">
          <motion.div
            layoutId={`${PREFIX}-svc-meta-${service.id}`}
            className="flex items-center justify-between"
          >
            <AnimatedGlyph accent={service.accent} />
            <div className="flex flex-col items-end text-[10px] tracking-[0.45em] uppercase text-white/55">
              <span>{service.code}</span>
              <span className="mt-1 text-[9px] text-white/45">{service.tag}</span>
            </div>
          </motion.div>

          <div className="flex-1" />

          <motion.h3
            layoutId={`${PREFIX}-svc-title-${service.id}`}
            className="font-display text-3xl md:text-4xl font-bold leading-[1.05] tracking-tight text-white"
          >
            {service.title}
          </motion.h3>
          <p className="mt-3 max-w-sm text-sm md:text-[15px] text-white/70 leading-relaxed">
            {service.body}
          </p>

          {/* View More */}
          <div
            className="mt-6"
            onClick={(e) => {
              // Let the inner button handle its own click without bubbling to card
              e.stopPropagation();
            }}
          >
            <MagneticButton
              as="button"
              onClick={() => onSelect(service)}
              aria-label={`View more about ${service.title}`}
              className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] pl-5 pr-2 py-2 text-xs md:text-sm font-medium text-white/90 backdrop-blur transition-colors hover:border-white/30"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover/btn:translate-x-0"
                style={{
                  background: `linear-gradient(90deg, ${service.accent}40, transparent)`,
                }}
              />
              <span className="relative">View More</span>
              <span
                className="relative grid h-7 w-7 place-items-center rounded-full text-black transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
                style={{
                  background: `linear-gradient(135deg, #90eb61, ${service.accent})`,
                  boxShadow: `0 0 20px -2px ${service.accent}aa`,
                }}
              >
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Main section ---------- */

export default function HorizontalCapabilities() {
  const ref = useRef(null);
  const [selected, setSelected] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.3 });

  // Horizontal translation across viewport
  const x = useTransform(smooth, [0, 1], ['6%', '-82%']);
  const indicator = useTransform(smooth, [0, 1], [0, 1]);

  // Pause Lenis scroll while the fullscreen overlay is open
  useEffect(() => {
    if (!selected) return;
    // ServiceFullscreen already stops Lenis; nothing to do here.
  }, [selected]);

  return (
    <section
      id="services"
      ref={ref}
      className="relative"
      style={{ height: '420vh' }}
      aria-label="Services"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-ink" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 60%, rgba(36,186,172,0.18), transparent 70%), radial-gradient(50% 40% at 80% 30%, rgba(144,235,97,0.16), transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          }}
        />

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="pt-28 md:pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/40">
              <span className="h-px w-10 bg-white/30" />
              Services · 02
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
              A platform of <span className="text-gradient-gt">services</span>
              <br />
              engineered as one.
            </h2>
          </div>

          {/* Horizontal track */}
          <div className="flex-1 flex items-center">
            <motion.div
              style={{ x }}
              className="flex gap-6 md:gap-8 pl-6 md:pl-12 will-change-transform"
            >
              {SERVICES.map((s, i) => (
                <CapabilityCard
                  key={s.id}
                  service={s}
                  index={i}
                  progress={smooth}
                  onSelect={setSelected}
                />
              ))}
              <div className="w-[10vw] shrink-0" aria-hidden />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="px-6 md:px-12 pb-10">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">
                Scroll →
              </span>
              <div className="relative flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  style={{ scaleX: indicator, transformOrigin: 'left' }}
                  className="absolute inset-0"
                >
                  <div
                    className="h-full w-full"
                    style={{ background: 'linear-gradient(90deg,#90eb61,#24baac)' }}
                  />
                </motion.div>
              </div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">
                {String(SERVICES.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ServiceFullscreen
            key={selected.id}
            service={selected}
            onClose={() => setSelected(null)}
            idPrefix={PREFIX}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
