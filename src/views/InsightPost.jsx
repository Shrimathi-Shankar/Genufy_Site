'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { POSTS } from '../components/insightsData.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ease = [0.22, 1, 0.36, 1];

// ─── Reading progress bar ─────────────────────────────────────────────────────
function ReadingProgress({ accentColor }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 z-[200] h-[3px]"
      style={{ background: 'var(--c-surface-hi)' }}
      aria-hidden
    >
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, #90eb61, ${accentColor}, #24baac)`,
          transition: 'width 80ms linear',
        }}
      />
    </div>
  );
}

// ─── Share buttons ────────────────────────────────────────────────────────────
function ShareButtons({ title, accentColor, isLight }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnStyle = {
    background: 'var(--c-surface-md)',
    border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
    color: isLight ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.50)',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] uppercase tracking-widest mr-1 ${isLight ? 'text-slate-400' : 'text-white/25'}`}>Share</span>

      {/* X / Twitter */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] transition-all duration-200 hover:scale-105"
        style={btnStyle}
        aria-label="Share on X"
      >
        𝕏
      </a>

      {/* LinkedIn */}
      <a
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={btnStyle}
        aria-label="Share on LinkedIn"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="h-8 px-3 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all duration-200 hover:scale-105"
        style={copied
          ? { background: '#90eb6120', border: '1px solid #90eb6140', color: '#90eb61' }
          : btnStyle
        }
        aria-label="Copy link"
      >
        {copied ? (
          <><span>✓</span> Copied</>
        ) : (
          <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
        )}
      </button>
    </div>
  );
}

// ─── Article body blocks ──────────────────────────────────────────────────────
function BodyBlock({ block, accentColor, isLight }) {
  switch (block.type) {
    case 'lead':
      return (
        <p className={`mb-8 text-lg font-medium leading-relaxed md:text-xl ${isLight ? 'text-slate-600' : 'text-white/72'}`}>
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className={`mb-4 mt-12 font-display text-xl font-bold tracking-tight md:text-2xl ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className={`mb-6 text-base leading-[1.88] ${isLight ? 'text-slate-500' : 'text-white/58'}`}>
          {block.text}
        </p>
      );
    case 'callout':
      return (
        <blockquote
          className="relative my-8 rounded-2xl py-6 pl-8 pr-6"
          style={{
            background: accentColor + '0d',
            borderLeft: `3px solid ${accentColor}`,
          }}
        >
          <div
            className="absolute left-5 top-4 text-4xl font-serif leading-none opacity-20 select-none"
            style={{ color: accentColor }}
            aria-hidden
          >"</div>
          <p className={`relative text-base font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
            {block.text}
          </p>
        </blockquote>
      );
    default:
      return null;
  }
}

// ─── Related article card ─────────────────────────────────────────────────────
function RelatedCard({ post, isLight }) {
  return (
    <Link href={`/insights/${post.slug}`}>
      <div
        className="group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        style={{
          background: 'var(--c-surface)',
          border: `1px solid ${post.accentColor}22`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 0 1px ${post.accentColor}38` }}
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <span className="mt-0.5 text-xl shrink-0">{post.icon}</span>
          <div>
            <p className={`text-xs font-semibold leading-snug transition-colors duration-200 line-clamp-2 ${isLight ? 'text-slate-600 group-hover:text-slate-900' : 'text-white/75 group-hover:text-white'}`}>
              {post.title}
            </p>
            <p className={`mt-1 text-[10px] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{post.readTime} · {post.category}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function InsightPost({ slug }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const post = POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <Header />
        <main className={`flex min-h-screen items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#05070a]'}`}>
          <div className="text-center">
            <p className="text-5xl">✦</p>
            <h1 className={`mt-6 font-display text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Article not found</h1>
            <Link
              href="/insights"
              className="mt-8 inline-block rounded-full px-8 py-3 text-sm font-bold text-black"
              style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
            >
              ← Back to Insights
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Related: same category first, fall back to recent posts from other categories
  const sameCat = POSTS.filter(p => p.id !== post.id && p.category === post.category);
  const recent  = POSTS.filter(p => p.id !== post.id && p.category !== post.category)
    .sort((a, b) => b.id - a.id);
  const related = [...sameCat, ...recent].slice(0, 3);

  return (
    <>
      <ReadingProgress accentColor={post.accentColor} />
      <Header />

      <main className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#05070a]'}`}>

        {/* Ambience */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          background: `radial-gradient(60% 40% at 60% 10%, ${post.accentColor}12 0%, transparent 60%),
            radial-gradient(40% 30% at 20% 80%, rgba(144,235,97,0.06) 0%, transparent 60%)`,
        }} />

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${post.accentColor}14 0%, ${isLight ? 'rgba(248,250,252,0)' : 'rgba(5,7,10,0)'} 55%)` }}
        >
          <div className="mx-auto max-w-4xl px-6 pb-12 pt-32">

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
                style={{ color: post.accentColor }}
              >
                ← All Insights
              </Link>
            </motion.div>

            {/* Category + tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="mt-6 flex items-center gap-3 flex-wrap"
            >
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: post.accentColor + '22', color: post.accentColor, border: `1px solid ${post.accentColor}44` }}
              >
                {post.category}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{post.tag}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className={`mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {post.title}
            </motion.h1>

            {/* Author meta + share */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.22 }}
              className="mt-6 flex items-center gap-4 flex-wrap"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #90eb61, #24baac)', color: '#05070a' }}
              >G</div>
              <div>
                <p className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{post.author}</p>
                <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-white/35'}`}>{post.date} · {post.readTime}</p>
              </div>
              <div className="ml-auto">
                <ShareButtons title={post.title} accentColor={post.accentColor} isLight={isLight} />
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
              className="mt-8 h-px origin-left rounded-full"
              style={{ background: `linear-gradient(90deg, ${post.accentColor}, transparent)` }}
            />
          </div>

          {/* Floating ghost icon */}
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            className="pointer-events-none absolute right-10 top-20 select-none text-[160px] md:text-[220px] leading-none"
            aria-hidden
          >
            {post.icon}
          </motion.span>
        </div>

        {/* ── Article body ── */}
        <div className="mx-auto max-w-4xl px-6 pb-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_240px]">

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.35 }}
              className="min-w-0 pt-10"
            >
              {post.body.map((block, i) => (
                <BodyBlock key={i} block={block} accentColor={post.accentColor} isLight={isLight} />
              ))}

              {/* End-of-article CTA */}
              <div
                className="mt-14 rounded-2xl p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${post.accentColor}10 0%, rgba(144,235,97,0.06) 100%)`,
                  border: `1px solid ${post.accentColor}25`,
                }}
              >
                <p className={`text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-white/55'}`}>
                  Want to apply this to your organisation?
                </p>
                <p className={`mt-1 font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Talk to the Genufy team.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-black transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
                >
                  Get in touch →
                </Link>
              </div>

              {/* Bottom share row */}
              <div className={`mt-10 flex items-center justify-between border-t pt-8 ${isLight ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
                  style={{ color: post.accentColor }}
                >
                  ← All Insights
                </Link>
                <ShareButtons title={post.title} accentColor={post.accentColor} isLight={isLight} />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.45 }}
              className="hidden lg:block"
            >
              <div className="sticky top-28 space-y-6">

                {/* Article info card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
                >
                  <p className={`mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                    Article Info
                  </p>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Category',  value: post.category  },
                      { label: 'Published', value: post.date      },
                      { label: 'Read time', value: post.readTime  },
                      { label: 'Author',    value: post.author    },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className={isLight ? 'text-slate-400' : 'text-white/30'}>{label}</span>
                        <span className={`font-semibold text-right ${isLight ? 'text-slate-600' : 'text-white/65'}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related articles — falls back to recent if no same-category */}
                {related.length > 0 && (
                  <div>
                    <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                      {sameCat.length > 0 ? 'Related' : 'More Articles'}
                    </p>
                    <div className="space-y-2.5">
                      {related.map(r => (
                        <RelatedCard key={r.id} post={r} isLight={isLight} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Back link */}
                <Link
                  href="/insights"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
                  style={{ color: post.accentColor }}
                >
                  ← All Insights
                </Link>

              </div>
            </motion.aside>

          </div>
        </div>

      </main>

      <SiteFooter />
    </>
  );
}
