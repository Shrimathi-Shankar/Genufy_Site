'use client';

import Link from 'next/link';
import { m as motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { POSTS } from '../components/insightsData.js';

const ease = [0.22, 1, 0.36, 1];

function BodyBlock({ block, accentColor }) {
  switch (block.type) {
    case 'lead':
      return (
        <p className="mb-8 text-lg font-medium leading-relaxed text-white/75 md:text-xl">
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className="mb-4 mt-12 font-display text-xl font-bold tracking-tight text-white md:text-2xl first:mt-0">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className="mb-6 text-base leading-[1.85] text-white/60">
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
            className="absolute left-5 top-4 text-4xl font-serif leading-none opacity-20"
            style={{ color: accentColor }}
          >"</div>
          <p className="relative text-base font-medium leading-relaxed text-white/80">
            {block.text}
          </p>
        </blockquote>
      );
    default:
      return null;
  }
}

export default function InsightPost({ slug }) {
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#05070a]">
          <div className="text-center">
            <p className="text-5xl">✦</p>
            <h1 className="mt-6 font-display text-3xl font-bold text-white">Article not found</h1>
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

  const related = POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden bg-[#05070a]">

        {/* Ambience */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 40% at 60% 10%, ${post.accentColor}12 0%, transparent 60%),
              radial-gradient(40% 30% at 20% 80%, rgba(144,235,97,0.06) 0%, transparent 60%)`,
          }}
        />

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${post.accentColor}15 0%, rgba(5,7,10,0) 50%)` }}
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
                <span>←</span> All Insights
              </Link>
            </motion.div>

            {/* Category + tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="mt-6 flex items-center gap-3"
            >
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: post.accentColor + '22', color: post.accentColor, border: `1px solid ${post.accentColor}44` }}
              >
                {post.category}
              </span>
              <span className="text-[10px] font-semibold text-white/35 uppercase tracking-widest">{post.tag}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className="mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl"
            >
              {post.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.22 }}
              className="mt-6 flex items-center gap-4"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #90eb61, #24baac)', color: '#05070a' }}
              >G</div>
              <div>
                <p className="text-sm font-semibold text-white/80">{post.author}</p>
                <p className="text-xs text-white/35">{post.date} · {post.readTime}</p>
              </div>
              <div className="ml-auto hidden h-px flex-1 sm:block"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }}
              />
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="mt-8 h-px origin-left rounded-full"
              style={{ background: `linear-gradient(90deg, ${post.accentColor}, transparent)` }}
            />
          </div>

          {/* Floating icon */}
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.07, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            className="pointer-events-none absolute right-12 top-20 select-none text-[180px] md:text-[240px]"
            aria-hidden
          >
            {post.icon}
          </motion.span>
        </div>

        {/* ── Article body ── */}
        <div className="mx-auto max-w-4xl px-6 pb-24">
          <div className="grid gap-16 lg:grid-cols-[1fr_240px]">

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.35 }}
              className="min-w-0 pt-10"
            >
              {post.body.map((block, i) => (
                <BodyBlock key={i} block={block} accentColor={post.accentColor} />
              ))}

              {/* CTA at end of article */}
              <div
                className="mt-14 rounded-2xl p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${post.accentColor}10 0%, rgba(144,235,97,0.06) 100%)`,
                  border: `1px solid ${post.accentColor}25`,
                }}
              >
                <p className="text-sm font-semibold text-white/60">
                  Want to apply this to your organisation?
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white">
                  Talk to the Genufy team.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-black transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
                >
                  Get in touch →
                </Link>
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
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Article Info</p>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Category', value: post.category },
                      { label: 'Published', value: post.date },
                      { label: 'Read time', value: post.readTime },
                      { label: 'Author', value: post.author },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="text-white/35">{label}</span>
                        <span className="font-semibold text-white/70 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related articles */}
                {related.length > 0 && (
                  <div>
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Related</p>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.id} href={`/insights/${r.slug}`}>
                          <div
                            className="group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                              background: 'rgba(255,255,255,0.025)',
                              border: `1px solid ${r.accentColor}22`,
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 text-2xl">{r.icon}</span>
                              <div>
                                <p className="text-xs font-semibold leading-snug text-white/75 group-hover:text-white transition-colors">
                                  {r.title}
                                </p>
                                <p className="mt-1 text-[10px] text-white/35">{r.readTime}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
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
