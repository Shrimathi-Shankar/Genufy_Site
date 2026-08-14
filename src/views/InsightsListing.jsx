'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { m as motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { POSTS } from '../components/insightsData.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ease = [0.22, 1, 0.36, 1];
const LIME = '#90eb61';
const TEAL = '#24baac';

const ALL_CATS = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];

// ─── Category pill ────────────────────────────────────────────────────────────
function CategoryPill({ label, active, onClick }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
      style={
        active
          ? { background: `linear-gradient(135deg, ${LIME}, ${TEAL})`, color: '#05070a' }
          : isLight
          ? {
              background: 'rgba(255,255,255,0.70)',
              border: '1px solid rgba(14,20,48,0.10)',
              color: '#3d4a68',
              backdropFilter: 'blur(8px)',
            }
          : {
              background: 'var(--c-surface-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.50)',
            }
      }
    >
      {label}
    </button>
  );
}

// ─── Featured hero card ────────────────────────────────────────────────────────
function FeaturedCard({ post }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease }}
    >
      <Link href={`/insights/${post.slug}`} className="group block">
        <div
          className="relative overflow-hidden rounded-3xl transition-all duration-500 group-hover:-translate-y-0.5"
          style={{
            background: isLight
              ? `linear-gradient(145deg, ${post.accentColor}18 0%, rgba(255,255,255,0.82) 55%)`
              : `linear-gradient(145deg, ${post.accentColor}12 0%, rgba(5,7,10,0.92) 55%)`,
            border: `1px solid ${post.accentColor}${isLight ? '28' : '30'}`,
            boxShadow: isLight
              ? `0 0 0 1px rgba(255,255,255,0.90), 0 20px 48px -12px ${post.accentColor}20`
              : `0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px -16px ${post.accentColor}25`,
            backdropFilter: isLight ? 'blur(16px)' : undefined,
          }}
        >
          {/* Hover border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 0 1px ${post.accentColor}45` }}
            aria-hidden
          />

          {/* Ghost icon — decorative */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[clamp(100px,14vw,180px)] leading-none"
            style={{ opacity: 0.06 }}
          >
            {post.icon}
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 p-8 md:p-12">
            {/* Left */}
            <div>
              {/* Featured badge + category */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.3em]"
                  style={{
                    background: `linear-gradient(135deg, ${LIME}, ${TEAL})`,
                    color: '#05070a',
                  }}
                >
                  Featured
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.3em]"
                  style={{
                    background: `${post.accentColor}18`,
                    border: `1px solid ${post.accentColor}38`,
                    color: post.accentColor,
                  }}
                >
                  {post.category}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/25'}`}>{post.tag}</span>
              </div>

              {/* Title */}
              <h2 className={`font-display text-2xl md:text-[2.2rem] font-extrabold leading-[1.1] tracking-tight mb-4 max-w-2xl transition-colors duration-300 ${isLight ? 'text-slate-900 group-hover:text-slate-700' : 'text-white group-hover:text-white/90'}`}>
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className={`text-base leading-relaxed max-w-xl mb-8 ${isLight ? 'text-slate-500' : 'text-white/52'}`}>
                {post.excerpt}
              </p>

              {/* Meta + CTA row */}
              <div className="flex flex-wrap items-center gap-5">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `linear-gradient(135deg, ${LIME}, ${TEAL})`, color: '#05070a' }}
                  >
                    G
                  </div>
                  <div>
                    <p className={`text-xs font-semibold leading-none ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{post.author}</p>
                    <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/35'}`}>{post.date} · {post.readTime}</p>
                  </div>
                </div>

                {/* CTA */}
                <span
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 group-hover:translate-x-0.5"
                  style={{
                    background: `${post.accentColor}1a`,
                    border: `1px solid ${post.accentColor}44`,
                    color: post.accentColor,
                  }}
                >
                  Read Article <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ post, i }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: i * 0.07, ease }}
    >
      <Link href={`/insights/${post.slug}`} className="group block h-full">
        <div
          className="group relative h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'var(--c-surface)',
            border: `1px solid var(--c-border)`,
          }}
        >
          {/* Accent top strip */}
          <div
            className="h-[2px] w-full shrink-0"
            style={{ background: `linear-gradient(90deg, ${post.accentColor}, transparent)` }}
          />

          {/* Hover border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ boxShadow: `inset 0 0 0 1px ${post.accentColor}35` }}
            aria-hidden
          />

          <div className="flex flex-col flex-1 p-6">
            {/* Icon + category row */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: `${post.accentColor}15`,
                  border: `1px solid ${post.accentColor}30`,
                }}
              >
                {post.icon}
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.25em]"
                style={{
                  background: `${post.accentColor}15`,
                  border: `1px solid ${post.accentColor}30`,
                  color: post.accentColor,
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h3 className={`font-display text-[15px] font-bold leading-snug tracking-tight transition-colors duration-300 mb-3 line-clamp-3 ${isLight ? 'text-slate-800 group-hover:text-slate-900' : 'text-white/85 group-hover:text-white'}`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-[13px] leading-relaxed line-clamp-3 flex-1 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className={`mt-5 pt-4 border-t flex items-center justify-between gap-2 ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{post.date}</span>
                <span className={isLight ? 'text-slate-300' : 'text-white/15'}>·</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{post.readTime}</span>
              </div>
              <span
                className="text-[11px] font-semibold -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1"
                style={{ color: post.accentColor }}
              >
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main listing view ────────────────────────────────────────────────────────
export default function InsightsListing() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const featured = useMemo(() => POSTS.find(p => p.featured), []);
  const rest      = useMemo(() => POSTS.filter(p => !p.featured), []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return rest;
    return POSTS.filter(p => p.category === activeCategory);
  }, [activeCategory, rest]);

  const showFeatured = activeCategory === 'All' && featured;

  return (
    <>
      <Header />

      <main className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#05070a]'}`}>
        {/* Ambient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `radial-gradient(60% 40% at 30% 10%, ${TEAL}10 0%, transparent 60%),` +
              `radial-gradient(50% 35% at 75% 5%, ${LIME}08 0%, transparent 60%)`,
          }}
        />
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 80%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10 pb-32 pt-32">

          {/* ── Page hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="h-px w-8"
                style={{ background: `linear-gradient(90deg, ${LIME}, transparent)` }}
              />
              <span className="text-[10px] tracking-[0.5em] uppercase font-semibold" style={{ color: LIME }}>
                Genufy Insights
              </span>
            </div>
            <h1 className={`font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Perspectives on Salesforce,<br className="hidden md:block" /> AI &amp; enterprise tech.
            </h1>
            <p className={`text-base md:text-lg max-w-xl leading-relaxed ${isLight ? 'text-slate-400' : 'text-white/45'}`}>
              Deep-dives, implementation guides, and hard-won lessons from the field.
            </p>
          </motion.div>

          {/* ── Category filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {ALL_CATS.map(cat => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </motion.div>

          {/* ── Featured article ── */}
          <AnimatePresence mode="wait">
            {showFeatured && (
              <motion.div
                key="featured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <FeaturedCard post={featured} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Article grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredPosts.map((post, i) => (
                <ArticleCard key={post.slug} post={post} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
