'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useInView,
} from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import { products } from './products/productData.js';

// === Unified palette (same as Contact CTA) ===
const ACCENT = '#90eb61';   // lime
const ACCENT2 = '#24baac';  // teal
const GRAD = `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`;
const GRAD_SOFT = `linear-gradient(135deg, ${ACCENT}33, ${ACCENT2}22)`;

// ------------------------------------------------------------------
// Split-text reveal (char by char) for cinematic headings
// ------------------------------------------------------------------
function SplitText({ text, className = '', delay = 0, stagger = 0.025 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => {
            const idx = wi * 8 + ci;
            return (
              <motion.span
                key={ci}
                aria-hidden
                className="inline-block"
                initial={{ y: '110%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{
                  duration: 0.9,
                  delay: delay + idx * stagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: 'transform' }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// ------------------------------------------------------------------
// Magnetic / tilt wrapper - listens to mouse, applies smoothed tilt + light glow
// ------------------------------------------------------------------
function TiltCard({ children, className = '', strength = 14 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 120,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 120,
    damping: 18,
  });

  const glowX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${glowX} ${glowY}, ${ACCENT}33, transparent 60%)`;

  const handle = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handle}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-90 mix-blend-screen"
      />
    </motion.div>
  );
}

// ------------------------------------------------------------------
// One product chapter
// ------------------------------------------------------------------
function ProductChapter({ product, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const reverse = index % 2 === 1;
  const yImage = useTransform(scrollYProgress, [0, 1], ['10%', '-18%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['-6%', '8%']);
  const yChips = useTransform(scrollYProgress, [0, 1], ['-2%', '12%']);
  const yChapter = useTransform(scrollYProgress, [0, 1], ['45%', '-45%']);
  const baseRotate = reverse ? 6 : -6;
  const rotate = useTransform(scrollYProgress, [0, 1], [baseRotate, -baseRotate * 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.02, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Sweep mask reveal for the visual
  const maskY = useTransform(scrollYProgress, [0.05, 0.45], ['100%', '0%']);

  // Show the "Visit website" button when the product has a real link, else "Coming soon".
  const isLinked = Boolean(product.href);

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] flex items-center py-0"
    >
      {/* Giant ghost chapter numeral with subtle gradient */}
      <motion.div
        aria-hidden
        style={{ y: yChapter }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="text-[28vw] md:text-[22vw] font-semibold leading-none select-none"
          style={{
            background: `linear-gradient(180deg, ${ACCENT}14, transparent 70%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Thin vertical seam between chapters */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `linear-gradient(180deg, transparent, ${ACCENT2}66, transparent)` }}
        className="absolute left-1/2 -translate-x-1/2 top-0 h-24 w-px origin-top"
      />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto w-full max-w-7xl px-6 md:px-10"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* === Visual === */}
          <div className="relative">
            <motion.div
              style={{ y: yImage, rotate, scale }}
              className="relative w-full max-w-[520px] aspect-[4/5] mx-auto"
            >
              {/* Halo */}
              <motion.div
                aria-hidden
                style={{ opacity: glow }}
                className="absolute -inset-10 rounded-[40%] blur-3xl"
              >
                <div
                  className="w-full h-full rounded-[40%]"
                  style={{
                    background: `radial-gradient(closest-side, ${ACCENT2}55, transparent 70%)`,
                  }}
                />
              </motion.div>

              <TiltCard
                strength={10}
                className="relative w-full h-full rounded-[36px] overflow-hidden border border-white/10 backdrop-blur-xl"
              >
                <div
                  className="absolute inset-0 rounded-[36px]"
                  style={{
                    background: GRAD_SOFT,
                    boxShadow: `0 40px 120px -30px ${ACCENT2}55, inset 0 1px 0 rgba(255,255,255,0.12)`,
                  }}
                />

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                {/* Grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Sweep mask reveal on scroll */}
                <motion.div
                  aria-hidden
                  style={{
                    y: maskY,
                    background: `linear-gradient(180deg, rgba(8,10,14,0.96), rgba(8,10,14,0.4))`,
                  }}
                  className="absolute inset-0 pointer-events-none"
                />

                {/* Scanline shimmer */}
                <motion.div
                  aria-hidden
                  initial={{ y: '-100%' }}
                  whileInView={{ y: '120%' }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 1.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 h-1/3 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent, ${ACCENT}26, transparent)`,
                  }}
                />

                {/* Centerpiece label (used as placeholder when no image) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
                  <div
                    className="text-[10px] tracking-[0.4em] uppercase mb-4"
                    style={{
                      background: GRAD,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {product.tagline}
                  </div>
                  <div className="text-4xl md:text-5xl font-semibold text-white/90 tracking-tight">
                    {product.name}
                  </div>
                </div>

                <div className="absolute bottom-5 right-5 text-[10px] tracking-[0.3em] uppercase text-white/40">
                  {String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* === Text === */}
          <motion.div style={{ y: yText }} className="relative">
            <motion.div
              initial={{ opacity: 0, x: reverse ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] tracking-[0.45em] uppercase mb-6 flex items-center gap-3"
            >
              <span
                className="h-px w-10"
                style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
              />
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {product.tagline}
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.02] overflow-hidden">
              <SplitText text={product.name} />
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-base md:text-lg text-white/65 max-w-xl leading-relaxed"
            >
              {product.blurb}
            </motion.p>

            <motion.ul
              style={{ y: yChips }}
              className="mt-8 flex flex-wrap gap-2.5 max-w-xl"
            >
              {product.pillars.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden px-3.5 py-1.5 rounded-full text-xs text-white/80 border border-white/10 bg-white/[0.03] backdrop-blur transition-colors hover:text-white"
                >
                  <span className="relative z-10">{p}</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: GRAD_SOFT }}
                  />
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex items-center gap-4"
            >
              {isLinked ? (
                <motion.a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 text-sm font-medium text-black overflow-hidden"
                  style={{
                    background: GRAD,
                    boxShadow: `0 14px 38px -12px ${ACCENT2}99, inset 0 1px 0 rgba(255,255,255,0.35)`,
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, #a3f06b, #2cd5c5)`,
                    }}
                  />
                  <span className="relative">Visit website</span>
                  <span className="relative grid h-7 w-7 place-items-center rounded-full bg-black/85 text-white text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </motion.a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest uppercase text-white/55 border border-white/10">
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: ACCENT }}
                  />
                  Coming soon
                </span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ------------------------------------------------------------------
// Hero
// ------------------------------------------------------------------
function ProductsHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(8px)']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Cursor-following spotlight
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.4);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${useTransform(
    sx,
    (v) => `${v * 100}%`
  )} ${useTransform(sy, (v) => `${v * 100}%`)}, ${ACCENT}1a, transparent 60%)`;

  useEffect(() => {
    const handle = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mx, my]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Drifting ambient orbs (unified palette) */}
      <motion.div aria-hidden style={{ y }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[8%] h-[40vmax] w-[40vmax] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(closest-side, ${ACCENT2}66, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-[5%] h-[36vmax] w-[36vmax] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(closest-side, ${ACCENT}55, transparent 70%)` }}
        />
      </motion.div>

      <motion.div
        style={{ filter: blur, opacity }}
        className="relative mx-auto max-w-6xl px-6 md:px-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.02] overflow-hidden">
          <span className="block">
            <SplitText text="Every product." />
          </span>
          <motion.span
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="block mt-2"
            style={{
              backgroundImage: GRAD,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            One quiet obsession.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed"
        >
          Each one engineered to remove a particular kind of friction. Scroll to walk
          through the chapters - every product tells its own short story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-3 text-white/40"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-px"
            style={{
              background: `linear-gradient(180deg, ${ACCENT}, transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ------------------------------------------------------------------
// Left vertical rail showing scroll progress + product dots
// ------------------------------------------------------------------
function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const height = useTransform(smooth, [0, 1], ['0%', '100%']);
  const [active, setActive] = useState(0);

  useEffect(() => {
    return smooth.on('change', (v) => {
      const i = Math.min(
        products.length - 1,
        Math.max(0, Math.round(v * (products.length + 0.4) - 0.6))
      );
      setActive(i);
    });
  }, [smooth]);

  return (
    <div className="pointer-events-none fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
      <div className="text-[9px] tracking-[0.4em] uppercase text-white/40 [writing-mode:vertical-rl] rotate-180">
        Products
      </div>
      <div className="relative h-48 w-px bg-white/10 overflow-hidden">
        <motion.div
          style={{ height, background: GRAD }}
          className="absolute top-0 left-0 w-full"
        />
      </div>
      <div className="flex flex-col gap-3">
        {products.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              scale: active === i ? 1.6 : 1,
              opacity: active === i ? 1 : 0.35,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: active === i ? ACCENT : '#ffffff80' }}
          />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
export default function Products() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <ChapterRail />

      <main className="relative z-10 overflow-hidden">
        <ProductsHero />

        {products.map((p, i) => (
          <ProductChapter key={p.slug} product={p} index={i} />
        ))}

        {/* Closing line */}
        <section className="relative py-40 text-center px-6 overflow-hidden">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto h-px max-w-sm mb-14 origin-center"
            style={{
              background: `linear-gradient(90deg, transparent, ${ACCENT2}, transparent)`,
            }}
          />
          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl mx-auto leading-tight overflow-hidden">
            <SplitText text="More chapters in the making." />
          </h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-5 text-white/55 max-w-xl mx-auto"
          >
            We ship slowly, deliberately, and only when it earns the Genufy name.
          </motion.p>
        </section>

        <SiteFooter />
      </main>

      <div className="noise" aria-hidden />
    </>
  );
}
