import { useRef, useState, useCallback, useEffect } from 'react';
import {
  m as motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRouter } from 'next/navigation';
import MagneticButton from './MagneticButton.jsx';
import { SERVICES } from './services/serviceData.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const PREFIX = 'carousel';

/* ---------- Premium futuristic capability card ---------- */

function AnimatedGlyph({ accent }) {
  const { theme } = useTheme();
  const glyphRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!glyphRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSpinning(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(glyphRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={glyphRef} className="relative h-12 w-12">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, ${accent}, #90eb61, ${accent})`,
          animation: spinning ? 'spin-cw 8s linear infinite' : 'none',
          willChange: spinning ? 'transform' : 'auto',
        }}
      />
      {/* Keep inner panel dark in both themes — glowing icon widget is a design accent */}
      <div
        className="absolute inset-[2px] rounded-[14px] grid place-items-center"
        style={{ background: theme === 'light' ? 'rgba(10,15,35,0.90)' : 'rgba(0,0,0,0.90)' }}
      >
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
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const total = SERVICES.length;
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  const scrollScale = useTransform(progress, [start - 0.1, mid, end + 0.1], [0.94, 1, 0.94]);
  const scrollOpacity = 1;

  // Mouse-follow light (soft spotlight only - no tilt/shake)
  const ref = useRef(null);
  const [light, setLight] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setLight({ x: x * 100, y: y * 100, opacity: 1 });
  }, []);
  const onLeave = useCallback(() => {
    setLight((s) => ({ ...s, opacity: 0 }));
  }, []);

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 * index }}
      style={{
        scale: scrollScale,
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

      {/* Panel — no backdrop-blur: each card already sits on its own image +
          heavy dark gradient, so blurring the (dark) section behind it was
          invisible but forced a per-frame backdrop re-blur on all 8 cards while
          the track slid — the cause of the sliding lag. */}
      <div
        className={`relative h-full w-full overflow-hidden rounded-3xl border ${isLight ? 'border-[rgba(36,186,172,0.22)] bg-white' : 'border-white/10 bg-black'}`}
        style={isLight ? {
          boxShadow: '0 12px 40px rgba(36,186,172,0.16), 0 0 0 1px rgba(36,186,172,0.18), 0 0 50px rgba(144,235,97,0.08)'
        } : undefined}
      >
        {/* Image (shared layout target - morphs to fullscreen) */}
        <motion.div
          layoutId={`${PREFIX}-svc-media-${service.id}`}
          className="absolute inset-0"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <picture>
            <source
              media="(pointer: coarse)"
              type="image/webp"
              srcSet={service.image.replace(/\.webp$/, '-sm.webp')}
            />
            <img
              src={service.image}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover opacity-100 scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.18] group-hover:opacity-100"
            />
          </picture>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.70) 100%)',
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
            <div className="flex flex-col items-end text-[10px] tracking-[0.45em] uppercase" style={{ color: 'rgba(255,255,255,0.80)' }}>
              <span>{service.code}</span>
              <span className="mt-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{service.tag}</span>
            </div>
          </motion.div>

          <div className="flex-1" />

          <motion.h3
            layoutId={`${PREFIX}-svc-title-${service.id}`}
            className="font-display text-3xl md:text-4xl font-bold leading-[1.05] tracking-tight"
            style={{ color: '#ffffff' }}
          >
            {service.title}
          </motion.h3>
          <p className="mt-3 max-w-sm text-sm md:text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
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
              className={`group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full border pl-5 pr-2 py-2 text-xs md:text-sm font-medium transition-colors ${isLight
                ? 'border-[rgba(36,186,172,0.30)] bg-white text-slate-800 hover:border-[rgba(36,186,172,0.55)] hover:bg-[#f0fdf8]'
                : 'border-white/15 bg-white/[0.04] text-white/90 hover:border-white/30 backdrop-blur'
                }`}
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
                <span style={{ display: 'inline-block', animation: 'arrow-nudge 1.6s ease-in-out infinite' }}>
                  →
                </span>
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
  const router = useRouter();

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  // Stiffer spring = cards respond almost instantly to scroll, no lag
  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 45, mass: 0.1 });

  // Horizontal translation across viewport
  const x = useTransform(smooth, [0, 1], ['6%', '-82%']);
  const indicator = useTransform(smooth, [0, 1], [0, 1]);

  // Each card navigates to its dedicated route (/services/<id>).
  // Scroll position is saved so the Home page can restore it on Back navigation.
  const openService = (svc) => {
    try { sessionStorage.setItem('__restore_home_scroll', String(window.scrollY)); } catch { }
    router.push(`/services/${svc.id}`);
  };

  // Arrow button scrolls the section by one card's worth of scroll distance
  const scrollByCard = useCallback((dir) => {
    if (!ref.current) return;
    const { top, height } = ref.current.getBoundingClientRect();
    const sectionTop = window.scrollY + top;
    const step = height / SERVICES.length;
    window.scrollBy({ top: dir * step, behavior: 'smooth' });
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      className="relative"
      style={{ height: '250vh' }}
      aria-label="Services"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className={`absolute inset-0 ${isLight ? '' : 'bg-ink'}`}
          style={isLight ? { background: '#f2faf4' } : undefined}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 60%, rgba(36,186,172,0.30), transparent 70%), radial-gradient(50% 40% at 80% 30%, rgba(144,235,97,0.28), transparent 70%)',
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
          <div className="pt-28 md:pt-20 pb-10 md:pb-8 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="mt-5 font-display text-4xl md:text-4.5xl tracking-tight leading-[1.05]" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
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
                  onSelect={openService}
                />
              ))}
              <div className="w-[10vw] shrink-0" aria-hidden />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
