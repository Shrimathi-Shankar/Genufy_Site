'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  m as motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { POSTS } from '../components/insightsData.js';

// ─── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Salesforce', 'Snowflake', 'MuleSoft', 'AI / ML', 'Informatica', 'DevOps', 'Pega'];
const SPRING = { stiffness: 160, damping: 28, mass: 0.6 };
const EASE = [0.22, 1, 0.36, 1];

// ─── Shared animation presets ──────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, ease: EASE, delay },
});

const clipReveal = (delay = 0) => ({
  initial: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  whileInView: { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: EASE, delay },
});

// ─── 3-D tilt wrapper ──────────────────────────────────────────────────────────
function Tilt({ children, className, style, intensity = 10 }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING);
  const sry = useSpring(ry, SPRING);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -intensity);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * intensity);
  }
  function onLeave() { rx.set(0); ry.set(0); }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-word stagger reveal ───────────────────────────────────────────────
function SplitReveal({ text, className, delay = 0, stagger = 0.06 }) {
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <motion.p {...fadeUp()} className="mb-4 text-[10px] font-bold uppercase tracking-[0.5em] text-lime">
      {children}
    </motion.p>
  );
}

// ─── Category pill ─────────────────────────────────────────────────────────────
function CategoryPill({ label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300"
      style={{
        background: active ? 'linear-gradient(110deg,#90eb61,#24baac)' : 'rgba(255,255,255,0.05)',
        color: active ? '#040508' : 'rgba(255,255,255,0.45)',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.09)',
        boxShadow: active ? '0 4px 22px rgba(36,186,172,0.35)' : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Featured story card ───────────────────────────────────────────────────────
function FeaturedCard({ post }) {
  return (
    <motion.div {...fadeUp(0.1)}>
      <Tilt intensity={6}>
        <Link href={`/insights/${post.slug}`} className="block">
          <div
            className="group relative overflow-hidden rounded-[2rem]"
            style={{
              background: `radial-gradient(ellipse 80% 70% at 20% 40%, ${post.accentColor}18, transparent 55%),
                           radial-gradient(ellipse 60% 80% at 80% 60%, rgba(144,235,97,0.07), transparent 60%),
                           rgba(255,255,255,0.025)`,
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px ${post.accentColor}20`,
            }}
          >
            {/* Top shimmer line */}
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${post.accentColor}80, transparent)` }} />

            <div className="grid gap-0 md:grid-cols-[1fr_380px]">
              {/* Left — text */}
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ background: post.accentColor + '22', color: post.accentColor, border: `1px solid ${post.accentColor}44` }}
                  >
                    {post.category}
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white/25">
                    Featured Story
                  </span>
                </div>

                <h2 className="mt-6 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-[2.6rem]">
                  {post.title}
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/55">
                  {post.excerpt}
                </p>

                <div className="mt-8 flex items-center gap-5">
                  <motion.span
                    whileHover={{ gap: '14px' }}
                    className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-black"
                    style={{ background: 'linear-gradient(110deg,#90eb61,#24baac)' }}
                  >
                    Read article <span>→</span>
                  </motion.span>
                  <span className="text-xs text-white/30">{post.readTime}</span>
                </div>

                <div className="mt-10 flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#90eb61,#24baac)', color: '#040508' }}
                  >G</div>
                  <span className="text-xs text-white/40">{post.author} · {post.date}</span>
                </div>
              </div>

              {/* Right — visual */}
              <div
                className="relative flex items-center justify-center overflow-hidden border-t border-white/[0.05] md:border-l md:border-t-0"
                style={{ background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${post.accentColor}10, transparent 70%)`, minHeight: '280px' }}
              >
                <motion.span
                  animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="select-none text-[120px] md:text-[150px]"
                  style={{ filter: `drop-shadow(0 0 60px ${post.accentColor}60)`, opacity: 0.55 }}
                  aria-hidden
                >
                  {post.icon}
                </motion.span>

                {/* Glow rings */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${post.accentColor}14, transparent)` }}
                />
              </div>
            </div>

            {/* Bottom glow on hover */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${post.accentColor}, transparent)` }}
            />
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}

// ─── Editorial blog card ───────────────────────────────────────────────────────
function BlogCard({ post, index, size = 'normal' }) {
  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.08 }}
      className="h-full"
    >
      <Tilt intensity={isLarge ? 5 : 8} className="h-full">
        <Link href={`/insights/${post.slug}`} className="block h-full">
          <motion.article
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Top visual band */}
            <div
              className="relative overflow-hidden"
              style={{
                height: isLarge ? '200px' : '148px',
                background: `radial-gradient(ellipse 90% 90% at 30% 40%, ${post.accentColor}1a, rgba(4,5,8,0.6) 65%)`,
              }}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'1\'/></svg>")',
                }}
              />

              {/* Icon */}
              <motion.span
                className="absolute right-6 top-5 select-none"
                style={{ fontSize: isLarge ? '64px' : '52px', opacity: 0.22, filter: `drop-shadow(0 0 20px ${post.accentColor})` }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden
              >
                {post.icon}
              </motion.span>

              {/* Category pill */}
              <span
                className="absolute bottom-4 left-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                style={{ background: post.accentColor + '22', color: post.accentColor, border: `1px solid ${post.accentColor}40` }}
              >
                {post.category}
              </span>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${post.accentColor}12, transparent)` }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <span className="text-[11px] font-semibold" style={{ color: post.accentColor }}>{post.tag}</span>
              <h3
                className="mt-2 font-display font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-white/90"
                style={{ fontSize: isLarge ? '1.2rem' : '1rem' }}
              >
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">{post.excerpt}</p>

              <div
                className="mt-5 flex items-center justify-between border-t pt-4"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className="text-[10px] text-white/30">{post.date} · {post.readTime}</span>
                <motion.span
                  className="flex items-center gap-1.5 text-[11px] font-semibold"
                  style={{ color: post.accentColor }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  Read <span>→</span>
                </motion.span>
              </div>
            </div>

            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
              style={{ background: `linear-gradient(180deg, ${post.accentColor}, transparent)` }}
            />
          </motion.article>
        </Link>
      </Tilt>
    </motion.div>
  );
}

// ─── Marquee text strip ────────────────────────────────────────────────────────
function MarqueeStrip() {
  const tags = ['Salesforce', 'AgentForce', 'Snowflake', 'Cortex AI', 'MuleSoft', 'API Design', 'MLOps', 'Informatica', 'Platform Eng', 'Pega NBA', 'Data Cloud', 'DevOps'];
  const doubled = [...tags, ...tags];
  return (
    <div className="relative my-20 overflow-hidden border-y border-white/[0.05] py-5">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {doubled.map((t, i) => (
          <span key={i} className="mx-8 text-xs font-bold uppercase tracking-[0.3em] text-white/18">
            {t} <span className="mx-6 text-white/10">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');
  const heroRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '22%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);
  const orbY1 = useTransform(heroScroll, [0, 1], ['0%', '35%']);
  const orbY2 = useTransform(heroScroll, [0, 1], ['0%', '-20%']);

  const featuredPost = POSTS.find((p) => p.featured);
  const gridPosts =
    activeCategory === 'All'
      ? POSTS.filter((p) => !p.featured)
      : POSTS.filter((p) => p.category === activeCategory);

  // Asymmetric editorial layout: [big, small, small] then [3-col]
  const firstBig = gridPosts[0];
  const firstStack = gridPosts.slice(1, 3);
  const remaining = gridPosts.slice(3);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-[#040508]">

        {/* Global grain */}
        <div className="noise" aria-hidden />

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">

          {/* Parallax orbs */}
          <motion.div style={{ y: orbY1 }}
            className="pointer-events-none absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full opacity-25 blur-[120px]"
            aria-hidden
            style={{ background: 'radial-gradient(circle, #24baac, transparent 70%)', y: orbY1 }}
          />
          <motion.div style={{ y: orbY2 }}
            className="pointer-events-none absolute right-[8%] bottom-[20%] h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]"
            aria-hidden
            style={{ background: 'radial-gradient(circle, #90eb61, transparent 70%)', y: orbY2 }}
          />

          {/* Fine grid */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.028]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1.2, ease: EASE }}
              className="mb-8 text-[10px] font-bold uppercase text-teal"
            >
              Genufy Insights
            </motion.p>

            {/* Main headline — clip reveal */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                className="font-display text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white"
              >
                <span className="text-gradient-gt">Ideas.</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.25 }}
                className="font-display text-[clamp(3.5rem,12vw,9rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white/85"
              >
                Perspectives.
              </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/45 md:text-lg"
            >
              Engineering depth on AI, data platforms, and the infrastructure of the next enterprise.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
              className="mx-auto mt-12 flex max-w-xs items-center justify-center gap-8"
            >
              {[['8', 'Articles'], ['7', 'Topics'], ['1', 'Team']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl font-bold text-white">{num}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mx-auto mt-16 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="h-8 w-[1px]"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)' }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── CONTENT ───────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32">

          {/* Manifesto text */}
          <div className="py-24 text-center">
            <p
              className="mx-auto max-w-4xl font-display text-2xl font-bold leading-relaxed tracking-tight text-white/30 md:text-4xl"
            >
              <SplitReveal
                text="We write about the technology reshaping enterprise — with the depth only practitioners can offer."
                stagger={0.04}
              />
            </p>
          </div>

          {/* ── CATEGORY FILTER ── */}
          <motion.div {...fadeUp()} className="mb-14 flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
            ))}
          </motion.div>

          {/* ── FEATURED STORY (All view only) ── */}
          <AnimatePresence mode="wait">
            {activeCategory === 'All' && featuredPost && (
              <motion.div key="featured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} className="mb-16"
              >
                <SectionLabel>Featured Story</SectionLabel>
                <FeaturedCard post={featuredPost} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── EDITORIAL GRID ── */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {gridPosts.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-3xl opacity-20">✦</p>
                  <p className="mt-5 text-sm text-white/35">No articles in this category yet — check back soon.</p>
                </div>
              ) : (
                <>
                  <SectionLabel>
                    {activeCategory === 'All' ? 'Latest Articles' : activeCategory}
                  </SectionLabel>

                  {/* Row 1: big + two stacked */}
                  {firstBig && (
                    <div className="mb-5 grid gap-5 md:grid-cols-[1.45fr_1fr]">
                      <BlogCard post={firstBig} index={0} size="large" />
                      <div className="flex flex-col gap-5">
                        {firstStack.map((p, i) => (
                          <BlogCard key={p.id} post={p} index={i + 1} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Row 2+: 3-column grid */}
                  {remaining.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {remaining.map((p, i) => (
                        <BlogCard key={p.id} post={p} index={i} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── MARQUEE ── */}
          <MarqueeStrip />

          {/* ── NEWSLETTER ── */}
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-[2rem]"
            style={{
              background: `radial-gradient(ellipse 80% 90% at 20% 50%, rgba(36,186,172,0.12), transparent 55%),
                           radial-gradient(ellipse 60% 70% at 80% 50%, rgba(144,235,97,0.08), transparent 55%),
                           rgba(255,255,255,0.025)`,
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(36,186,172,0.6), transparent)' }} />

            <div className="px-10 py-16 text-center md:px-20">
              <motion.p {...fadeUp(0.05)} className="text-[10px] font-bold uppercase tracking-[0.45em] text-teal">
                Stay Ahead
              </motion.p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                <SplitReveal text="The best insights, straight to you." delay={0.05} />
              </h2>
              <motion.p {...fadeUp(0.15)} className="mx-auto mt-5 max-w-md text-base text-white/45">
                Engineering deep-dives, product launches, and case studies — no noise, no cadence pressure.
              </motion.p>
              <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full max-w-[280px] rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-colors duration-200 focus:border-teal"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl px-8 py-3.5 text-sm font-bold text-black"
                  style={{ background: 'linear-gradient(110deg,#90eb61,#24baac)' }}
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
