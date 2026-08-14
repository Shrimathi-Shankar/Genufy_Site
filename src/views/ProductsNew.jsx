'use client';

import React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  m as motion,
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
import { useTheme } from '../contexts/ThemeContext.jsx';
import { products } from './products/productData.js';

const LIME = '#90eb61';
const TEAL = '#24baac';

// ─────────────────────────────────────────────────────────────────────────────
// SplitText — char-by-char cinematic reveal (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function SplitText({ text, className = '', delay = 0, stagger = 0.025 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });
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
                transition={{ duration: 0.85, delay: delay + idx * stagger, ease: [0.22, 1, 0.36, 1] }}
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

// ─────────────────────────────────────────────────────────────────────────────
// Section divider — animated gradient line between products
// ─────────────────────────────────────────────────────────────────────────────
function SignalDivider({ fromColor, toColor }) {
  return (
    <div className="relative h-24 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute h-px w-full max-w-2xl origin-center"
        style={{ background: `linear-gradient(90deg, transparent, ${fromColor}55, ${toColor}55, transparent)` }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 h-2 w-2 rounded-full"
        style={{ background: `linear-gradient(135deg, ${fromColor}, ${toColor})`, boxShadow: `0 0 12px ${toColor}` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero — "The Index"
// Left-aligned editorial headline + compact product index on the right
// ─────────────────────────────────────────────────────────────────────────────
function ProductsHero() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.4);
  const sx = useSpring(mx, { stiffness: 55, damping: 22 });
  const sy = useSpring(my, { stiffness: 55, damping: 22 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${useTransform(sx, v => `${v * 100}%`)} ${useTransform(sy, v => `${v * 100}%`)}, ${LIME}0d, transparent 55%)`;

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
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-24">

      {/* Subtle dot-grid texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 90%)',
      }} />

      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-3xl" style={{
          background: `radial-gradient(closest-side, ${TEAL}55, transparent 70%)`,
          width: '56vmax', height: '56vmax', top: '10%', left: '-8%', opacity: 0.28,
        }} />
        <div className="absolute rounded-full blur-3xl" style={{
          background: `radial-gradient(closest-side, #8B5CF655, transparent 70%)`,
          width: '44vmax', height: '44vmax', top: '50%', right: '-4%', opacity: 0.22,
        }} />
        <div className="absolute rounded-full blur-3xl" style={{
          background: `radial-gradient(closest-side, ${LIME}33, transparent 70%)`,
          width: '38vmax', height: '38vmax', top: '20%', right: '22%', opacity: 0.18,
        }} />
      </div>

      {/* Cursor spotlight */}
      <motion.div aria-hidden style={{ background: spotlight }} className="absolute inset-0 pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 lg:gap-20 items-end">

          {/* Left: headline */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 mb-10"
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] tracking-[0.5em] uppercase font-medium"
                style={{ borderColor: `${LIME}30`, background: `${LIME}0a`, color: `${LIME}cc` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME, boxShadow: `0 0 8px ${LIME}` }} />
                Genufy Products
              </span>
            </motion.div>

            {/* Headline — "last." uses color + glow instead of broken background-clip.
                SplitText renders child spans so WebkitBackgroundClip:text has no text
                nodes to clip to and renders as a rectangle. color: LIME is inherited
                correctly by all child spans and produces the correct gradient text. */}
            <h1
              className={`font-display font-bold tracking-tight leading-[0.9] ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ fontSize: 'clamp(3.8rem, 9.5vw, 9rem)' }}
            >
              <span className="block overflow-hidden">
                <SplitText text="Built" delay={0.1} />
              </span>
              <span className="block overflow-hidden">
                <SplitText text="to" delay={0.2} />
                &nbsp;
                <span style={{
                  color: LIME,
                  filter: `drop-shadow(0 0 32px ${LIME}70) drop-shadow(0 0 64px ${LIME}30)`,
                }}>
                  <SplitText text="last." delay={0.26} />
                </span>
              </span>
            </h1>

            {/* Thin accent line under headline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 h-px w-full max-w-sm origin-left"
              style={{ background: `linear-gradient(90deg, ${LIME}60, ${TEAL}30, transparent)` }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-7 text-base md:text-[17px] ${isLight ? 'text-slate-500' : 'text-white/55'} max-w-md leading-relaxed`}
            >
              Each product ships when it earns the name. No roadmap theatre,
              no vapourware — just software that removes a specific kind of friction.
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-14 flex items-center gap-4"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-8 origin-left"
                style={{ background: `linear-gradient(90deg, ${LIME}, transparent)` }}
              />
              <span className={`text-[9px] tracking-[0.5em] uppercase ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Scroll to explore</span>
            </motion.div>
          </div>

          {/* Right: product index */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-[8px] tracking-[0.6em] uppercase ${isLight ? 'text-slate-400' : 'text-white/25'}`}>Index</span>
              <div className="flex-1 h-px" style={{ background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)' }} />
              <span className={`text-[8px] font-mono ${isLight ? 'text-slate-300' : 'text-white/18'}`}>{String(products.length).padStart(2,'0')}</span>
            </div>
            <div>
              {products.map((p, i) => (
                <div
                  key={p.slug}
                  className={`group flex items-center gap-4 py-3.5 border-b ${isLight ? 'border-slate-200' : 'border-white/[0.055]'} last:border-0 transition-colors duration-300 hover:bg-white/[0.025] -mx-3 px-3 rounded-lg`}
                >
                  <span className={`text-[9px] tracking-widest ${isLight ? 'text-slate-300' : 'text-white/20'} font-mono shrink-0 w-5 text-right`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-medium ${isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-white/55 group-hover:text-white/90'} transition-colors duration-300 truncate leading-tight`}>
                      {p.name}
                    </p>
                    <p className={`text-[10px] ${isLight ? 'text-slate-300' : 'text-white/22'} mt-0.5 truncate`}>{p.tagline}</p>
                  </div>
                  <span
                    className="shrink-0 h-1.5 w-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: p.accent, boxShadow: `0 0 6px ${p.accent}` }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product section: GFY Books — "The Ledger"
// Browser mockup frame, editorial typography, faint ledger-grid background
// ─────────────────────────────────────────────────────────────────────────────
function GFYBooksSection({ product }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yText    = useTransform(scrollYProgress, [0, 1], ['-4%', '5%']);
  const yMockup  = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const AC = product.accent;   // #7CC4FF
  const AC2 = product.accent2; // #3B82F6

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-24">
      {/* Faint ledger grid background */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${TEAL}80 1px, transparent 1px), linear-gradient(90deg, ${TEAL}80 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        <div
          className="absolute -left-1/4 top-0 bottom-0 w-3/4 blur-3xl opacity-14"
          style={{ background: `radial-gradient(ellipse at 30% 55%, ${TEAL}55, transparent 60%)` }}
        />
      </motion.div>

      <motion.div style={{ opacity }} className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Text */}
          <motion.div style={{ y: yText }}>
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] tracking-[0.45em] uppercase font-medium border mb-6"
              style={{ color: TEAL, borderColor: `${TEAL}44`, background: `${TEAL}12` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} />
              Chapter 01
            </motion.span>

            <div className="overflow-hidden mb-3">
              <h2
                className={`font-display font-bold tracking-tight leading-[0.88] ${isLight ? 'text-slate-900' : 'text-white'}`}
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
              >
                <SplitText text={product.name} stagger={0.03} />
              </h2>
            </div>

            <p className="text-[10px] tracking-[0.45em] uppercase font-medium mb-7" style={{ color: TEAL }}>
              {product.tagline}
            </p>

            <p className={`text-base md:text-[17px] ${isLight ? 'text-slate-500' : 'text-white/55'} max-w-[420px] leading-relaxed mb-9`}>
              {product.blurb}
            </p>

            {/* Pillars as metric tiles */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="grid grid-cols-3 gap-2.5 mb-9 max-w-[400px]"
            >
              {product.pillars.map((p, i) => (
                <div
                  key={p}
                  className="px-3 py-3 rounded-xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm"
                >
                  <div className="text-[8px] tracking-[0.3em] uppercase mb-1" style={{ color: `${TEAL}88` }}>
                    0{i + 1}
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-white/65'} leading-snug`}>{p}</div>
                </div>
              ))}
            </motion.div>

            <motion.a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 text-sm font-semibold text-black overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${LIME}, ${TEAL})`,
                boxShadow: `0 14px 38px -12px ${TEAL}88`,
              }}
            >
              <span>Visit website</span>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLight ? 'bg-slate-800 text-white' : 'bg-black/80 text-white'}`}>
                ↗
              </span>
            </motion.a>
          </motion.div>

          {/* Browser mockup */}
          <motion.div style={{ y: yMockup }} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden border border-white/10"
              style={{
                background: 'rgba(6, 10, 20, 0.9)',
                boxShadow: `0 40px 100px -20px ${TEAL}44, 0 0 0 1px rgba(255,255,255,0.05)`,
              }}
            >
              {/* Browser chrome */}
              <div className={`flex items-center gap-2 px-4 py-3 border-b ${isLight ? 'border-slate-200' : 'border-white/[0.07]'}`} style={{ background: 'rgba(255,255,255,0.025)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div
                  className={`flex-1 mx-3 px-3 h-5 rounded-md flex items-center text-[10px] ${isLight ? 'text-slate-400' : 'text-white/25'}`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  gfybooks.com
                </div>
              </div>
              {/* Screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={e => (e.currentTarget.style.display = 'none')}
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(6,10,20,0.75) 100%)' }}
                />
                {/* Scanline sweep */}
                <motion.div
                  aria-hidden
                  initial={{ y: '-100%' }}
                  whileInView={{ y: '120%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 h-1/3 pointer-events-none"
                  style={{ background: `linear-gradient(180deg, transparent, ${TEAL}28, transparent)` }}
                />
              </div>
            </motion.div>
            {/* Ambient glow behind mockup */}
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-3xl opacity-25 blur-2xl"
              style={{ background: `radial-gradient(closest-side, ${TEAL}66, transparent 70%)` }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product section: Dev Inspector — "The Observatory"
// Open-space layout, ghost chapter numeral, corner-bracket showcase frame,
// premium numbered feature rows with fill-bar hover, shimmer CTA.
// ─────────────────────────────────────────────────────────────────────────────
function DevInspectorSection({ product }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yText   = useTransform(scrollYProgress, [0, 1], ['-5%', '6%']);
  const yImage  = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const yGhost  = useTransform(scrollYProgress, [0, 1], ['-3%', '5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  const PURPLE  = '#8B5CF6';
  const PURPLE2 = '#C084FC';
  const PDARK   = '#4C1D95';

  // Corner bracket positions: [outer class, border sides]
  const CORNERS = [
    { pos: 'top-4 left-4',   borders: 'border-l-2 border-t-2' },
    { pos: 'top-4 right-4',  borders: 'border-r-2 border-t-2' },
    { pos: 'bottom-4 left-4',  borders: 'border-l-2 border-b-2' },
    { pos: 'bottom-4 right-4', borders: 'border-r-2 border-b-2' },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-28">
      {/* Separator */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${PURPLE}44, transparent)` }}
      />

      {/* ── BACKGROUND ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary diagonal glow */}
        <div
          className="absolute inset-0 blur-3xl"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 72% 48%, ${PURPLE}38, transparent 65%)`,
          }}
        />
        {/* Secondary accent — top-left corner */}
        <div
          className="absolute -top-40 -left-40 w-[55vmax] h-[55vmax] rounded-full blur-3xl opacity-[0.07]"
          style={{ background: `radial-gradient(closest-side, ${PDARK}99, transparent 70%)` }}
        />
        {/* Dot-grid — modern precision aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, ${PURPLE2}99 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        {/* Ghost "02" numeral — depth background element */}
        <motion.div
          aria-hidden
          style={{
            y: yGhost,
            position: 'absolute',
            top: '50%',
            right: '-1vw',
            transform: 'translateY(-52%)',
            fontSize: 'clamp(160px, 28vw, 380px)',
            fontWeight: 900,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `1.5px ${PURPLE}20`,
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          02
        </motion.div>
      </div>

      {/* ── CONTENT ── */}
      <motion.div style={{ opacity }} className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-14 lg:gap-16 xl:gap-24 items-center">

          {/* LEFT — text */}
          <motion.div style={{ y: yText }} className="relative z-10">

            {/* Chapter row */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-8 flex-wrap"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-px w-8"
                  style={{ background: `linear-gradient(90deg, ${PURPLE}, transparent)` }}
                />
                <span
                  className="text-[9px] tracking-[0.55em] uppercase font-medium"
                  style={{ color: PURPLE2 }}
                >
                  Chapter 02
                </span>
              </div>
              <span
                className="px-2.5 py-0.5 rounded text-[8px] tracking-[0.3em] uppercase border"
                style={{ color: PURPLE2, borderColor: `${PURPLE}44`, background: `${PURPLE}14` }}
              >
                Chrome Extension
              </span>
            </motion.div>

            {/* Product name */}
            <div className="overflow-hidden mb-4">
              <h2
                className={`font-display font-bold tracking-tight leading-[0.87] ${isLight ? 'text-slate-900' : 'text-white'}`}
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
              >
                <SplitText text={product.name} stagger={0.028} />
              </h2>
            </div>

            {/* Tagline */}
            <p
              className="text-[10px] tracking-[0.5em] uppercase font-mono mb-6"
              style={{ color: PURPLE2 }}
            >
              {product.tagline}
            </p>

            {/* Ruled separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-px max-w-sm mb-8 origin-left"
              style={{ background: `linear-gradient(90deg, ${PURPLE}55, transparent)` }}
            />

            {/* Body */}
            <p className={`text-base md:text-[17px] ${isLight ? 'text-slate-500' : 'text-white/52'} max-w-[400px] leading-relaxed mb-10`}>
              {product.blurb}
            </p>

            {/* ── Feature tiles — GFY-Books pillars style ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 gap-2.5 mb-10 max-w-[420px]"
            >
              {[
                { num: '01', title: 'Inline Metadata',  desc: 'Field labels, API names and types — visible on every record, instantly.' },
                { num: '02', title: 'Live Debug Logs',  desc: 'Stream Apex output in real time without leaving the page you are testing.' },
                { num: '03', title: 'Query Workbench',  desc: 'Write and run SOQL from any Salesforce page, with instant result export.' },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group px-3 py-3 rounded-xl cursor-default transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    border: `1px solid ${PURPLE}2e`,
                    background: `linear-gradient(135deg, ${PURPLE}0f 0%, ${PDARK}18 100%)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Hover glow */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${PURPLE}18, transparent 70%)`, borderRadius: 'inherit' }}
                  />
                  <div className="relative z-10">
                    <div
                      className="text-[8px] tracking-[0.3em] uppercase mb-2.5 font-mono"
                      style={{ color: `${PURPLE2}88` }}
                    >
                      {item.num}
                    </div>
                    <div
                      className={`text-[12px] font-semibold leading-snug mb-2 ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-white/75 group-hover:text-white/95'} transition-colors duration-300`}
                    >
                      {item.title}
                    </div>
                    <div
                      className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-400 group-hover:text-slate-500' : 'text-white/30 group-hover:text-white/50'} transition-colors duration-300`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA — shimmer sweep button */}
            <motion.a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.6 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2.5 text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white'} overflow-hidden border`}
              style={{
                borderColor: `${PURPLE}66`,
                background: `linear-gradient(135deg, ${PURPLE}30, ${PDARK}28)`,
                boxShadow: `0 12px 38px -12px ${PURPLE}66, inset 0 1px 0 rgba(255,255,255,0.07)`,
              }}
            >
              {/* Diagonal shimmer sweep */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${PURPLE2}35, transparent)` }}
              />
              <span className="relative">Install extension</span>
              <span
                className="relative grid h-7 w-7 place-items-center rounded-full text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE2})`,
                  color: 'white',
                  boxShadow: `0 4px 14px -4px ${PURPLE}99`,
                }}
              >
                ↗
              </span>
            </motion.a>
          </motion.div>

          {/* RIGHT — product showcase */}
          <motion.div style={{ y: yImage }} className="relative">
            {/* Diffused glow behind the frame */}
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 pointer-events-none rounded-3xl"
              style={{
                background: `radial-gradient(ellipse at center, ${PURPLE}35, transparent 65%)`,
                filter: 'blur(40px)',
              }}
            />

            {/* Main showcase frame */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${PURPLE}35`,
                boxShadow: `0 32px 80px -20px ${PURPLE}50, 0 0 0 1px ${PURPLE}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              {/* Top-edge purple tint strip */}
              <div
                className="absolute top-0 inset-x-0 h-16 z-10 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${PURPLE}18, transparent)` }}
              />

              {/* Screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: '#0a0614' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={e => (e.currentTarget.style.display = 'none')}
                  className="w-full h-full object-cover opacity-88 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                {/* Multi-directional vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to bottom, transparent 55%, rgba(10,6,20,0.72) 100%),
                      linear-gradient(to right,  rgba(10,6,20,0.32) 0%, transparent 18%, transparent 82%, rgba(10,6,20,0.32) 100%)
                    `,
                  }}
                />
                {/* Entrance scan sweep */}
                <motion.div
                  aria-hidden
                  initial={{ y: '-100%' }}
                  whileInView={{ y: '130%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 h-2/5 pointer-events-none"
                  style={{ background: `linear-gradient(180deg, transparent, ${PURPLE}30, transparent)` }}
                />
              </div>

              {/* Corner measurement brackets */}
              {CORNERS.map(({ pos, borders }, i) => (
                <motion.div
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.85 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute h-5 w-5 ${pos} ${borders} transition-all duration-500 group-hover:opacity-100`}
                  style={{ borderColor: `${PURPLE2}70` }}
                />
              ))}

              {/* Hover border glow — inset ring that appears on hover */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px -12px ${PURPLE}50` }}
              />
            </motion.div>

            {/* Floating badge — "Salesforce Chrome Extension" */}
            <motion.div
              initial={{ opacity: 0, y: 14, x: 10 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 right-4 sm:right-8 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl border"
              style={{
                background: `linear-gradient(135deg, rgba(10,6,20,0.88), ${PURPLE}22)`,
                borderColor: `${PURPLE}33`,
                boxShadow: `0 10px 36px -8px ${PURPLE}55`,
              }}
            >
              <div
                className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE2})`, boxShadow: `0 4px 14px -4px ${PURPLE}88` }}
              >
                <svg viewBox="0 0 16 16" className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="5.5" />
                  <path d="M8 5v3.5L10 10" />
                </svg>
              </div>
              <div>
                <p className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-white/80'} leading-tight`}>Salesforce</p>
                <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-white/38'} tracking-wide`}>Chrome Extension</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product section: Humora — "Human Signal"
// Warmer palette, organic image frame, floating label badge
// ─────────────────────────────────────────────────────────────────────────────
function HumoraSection({ product }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yLeft   = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const yRight  = useTransform(scrollYProgress, [0, 1], ['-4%', '5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const ROSE  = '#FB7185';
  const AMBER = '#F59E0B';

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-24">
      <div aria-hidden className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ROSE}44, transparent)` }} />

      {/* Background atmosphere */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/4 top-1/3 w-[65vmax] h-[65vmax] rounded-full blur-3xl opacity-12 -translate-x-1/2 -translate-y-1/2"
          style={{ background: `radial-gradient(closest-side, ${ROSE}55, transparent 60%)` }}
        />
        <div
          className="absolute right-1/4 bottom-1/3 w-[45vmax] h-[45vmax] rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"
          style={{ background: `radial-gradient(closest-side, ${AMBER}44, transparent 60%)` }}
        />
      </div>

      <motion.div style={{ opacity }} className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20 items-center">

          {/* Left: image */}
          <motion.div style={{ y: yLeft }} className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border"
              style={{
                borderColor: `${ROSE}20`,
                background: `${ROSE}0a`,
                boxShadow: `0 50px 120px -30px ${ROSE}44`,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={e => (e.currentTarget.style.display = 'none')}
                className="w-full h-full object-cover"
                style={{ opacity: 0.82 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, transparent 50%, rgba(8,10,14,0.55) 100%)` }}
              />
              {/* Diagonal shimmer */}
              <motion.div
                aria-hidden
                initial={{ x: '-130%' }}
                whileInView={{ x: '130%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 w-1/3 pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${ROSE}28, transparent)`, transform: 'skewX(-8deg)' }}
              />
            </motion.div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, x: 8 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="absolute -bottom-4 -right-4 sm:right-4 px-4 py-2 rounded-2xl text-xs font-medium backdrop-blur-md border"
              style={{ background: 'rgba(8,10,14,0.75)', borderColor: `${ROSE}33`, color: ROSE }}
            >
              Human-first design
            </motion.div>
          </motion.div>

          {/* Right: text */}
          <motion.div style={{ y: yRight }} className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] tracking-[0.45em] uppercase font-medium border mb-6"
              style={{ color: ROSE, borderColor: `${ROSE}44`, background: `${ROSE}12` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: ROSE }} />
              Chapter 03
            </motion.span>

            <div className="overflow-hidden mb-3">
              <h2
                className={`font-display font-bold tracking-tight leading-[0.88] ${isLight ? 'text-slate-900' : 'text-white'}`}
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
              >
                <SplitText text={product.name} stagger={0.03} />
              </h2>
            </div>

            <p className="text-[10px] tracking-[0.45em] uppercase font-medium mb-7" style={{ color: ROSE }}>
              {product.tagline}
            </p>

            <p className={`text-base md:text-[17px] ${isLight ? 'text-slate-500' : 'text-white/55'} max-w-[420px] leading-relaxed mb-8`}>
              {product.blurb}
            </p>

            <div className="flex flex-wrap gap-2 mb-9">
              {product.pillars.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="px-3.5 py-1.5 rounded-full text-xs border"
                  style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.6)', borderColor: `${ROSE}30`, background: `${ROSE}0c` }}
                >
                  {p}
                </motion.span>
              ))}
            </div>

            <motion.a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.55 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`group inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white'} border`}
              style={{ borderColor: `${ROSE}55`, background: `${ROSE}18`, boxShadow: `0 8px 28px -10px ${ROSE}77` }}
            >
              <span>Visit Humora</span>
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ background: ROSE, color: 'white' }}
              >
                ↗
              </span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic product section — for any additional products added to productData
// ─────────────────────────────────────────────────────────────────────────────
function GenericProductSection({ product, index }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const reverse  = index % 2 === 0;
  const yImage   = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const yText    = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const AC = product.accent;
  const chapterNum = String(index + 1).padStart(2, '0');

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden py-24">
      <div aria-hidden className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${AC}44, transparent)` }} />

      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute ${reverse ? 'left-0' : 'right-0'} top-0 bottom-0 w-2/3 blur-3xl opacity-12`}
          style={{ background: `radial-gradient(ellipse at ${reverse ? '20%' : '80%'} 50%, ${AC}55, transparent 55%)` }}
        />
      </div>

      <motion.div style={{ opacity }} className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${reverse ? '' : 'lg:[&>*:first-child]:order-2'}`}>

          {/* Visual */}
          <motion.div style={{ y: yImage }} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08]"
              style={{ background: `${AC}0a`, boxShadow: `0 40px 100px -20px ${AC}44` }}
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={e => (e.currentTarget.style.display = 'none')}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(8,10,14,0.7) 100%)' }} />
              <motion.div
                aria-hidden
                initial={{ y: '-100%' }}
                whileInView={{ y: '120%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.4 }}
                className="absolute inset-x-0 h-1/3 pointer-events-none"
                style={{ background: `linear-gradient(180deg, transparent, ${AC}26, transparent)` }}
              />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div style={{ y: yText }}>
            <motion.span
              initial={{ opacity: 0, x: reverse ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] tracking-[0.45em] uppercase font-medium border mb-6"
              style={{ color: AC, borderColor: `${AC}44`, background: `${AC}12` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: AC }} />
              Chapter {chapterNum}
            </motion.span>

            <div className="overflow-hidden mb-3">
              <h2
                className={`font-display font-bold tracking-tight leading-[0.88] ${isLight ? 'text-slate-900' : 'text-white'}`}
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
              >
                <SplitText text={product.name} stagger={0.03} />
              </h2>
            </div>

            <p className="text-[10px] tracking-[0.45em] uppercase font-medium mb-7" style={{ color: AC }}>
              {product.tagline}
            </p>

            <p className={`text-base md:text-[17px] ${isLight ? 'text-slate-500' : 'text-white/55'} max-w-[420px] leading-relaxed mb-8`}>
              {product.blurb}
            </p>

            <div className="flex flex-wrap gap-2 mb-9">
              {product.pillars.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="px-3.5 py-1.5 rounded-full text-xs border"
                  style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.6)', borderColor: `${AC}30`, background: `${AC}0c` }}
                >
                  {p}
                </motion.span>
              ))}
            </div>

            {product.href ? (
              <motion.a
                href={product.href}
                target={product.external ? '_blank' : undefined}
                rel={product.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.55 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`group inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white'} border`}
                style={{ borderColor: `${AC}55`, background: `${AC}18`, boxShadow: `0 8px 28px -10px ${AC}77` }}
              >
                <span>Visit website</span>
                <span className="grid h-7 w-7 place-items-center rounded-full text-xs transition-transform duration-300 group-hover:translate-x-0.5" style={{ background: AC, color: 'white' }}>↗</span>
              </motion.a>
            ) : (
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest uppercase ${isLight ? 'text-slate-400' : 'text-white/45'} border ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: AC }} />
                Coming soon
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch: pick the right section component per product slug
// ─────────────────────────────────────────────────────────────────────────────
function ProductSection({ product, index }) {
  if (product.slug === 'gfy-books')     return <GFYBooksSection     product={product} />;
  if (product.slug === 'dev-inspector') return <DevInspectorSection product={product} />;
  if (product.slug === 'humora')        return <HumoraSection       product={product} />;
  return <GenericProductSection product={product} index={index} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// "The Lab" — closing section with locked upcoming product tiles
// ─────────────────────────────────────────────────────────────────────────────
const UPCOMING = [
  { code: 'PHX-01', label: 'Pharma Stock',    status: 'In development' },
  { code: 'QMS-02', label: 'Quality Systems', status: 'In development' },
  { code: 'EXP-03', label: 'Expense Manager', status: 'In development' },
];

function TheLab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <section className="relative py-40 overflow-hidden">
      {/* Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 inset-x-0 h-px max-w-xl mx-auto origin-center"
        style={{ background: `linear-gradient(90deg, transparent, ${LIME}55, ${TEAL}55, transparent)` }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full"
              style={{ background: LIME, boxShadow: `0 0 8px ${LIME}` }}
            />
            <span className={`text-[9px] tracking-[0.55em] uppercase ${isLight ? 'text-slate-500' : 'text-white/35'}`}>Signals incoming</span>
          </motion.div>

          <h3
            className={`font-display font-bold tracking-tight leading-[0.9] ${isLight ? 'text-slate-900' : 'text-white'} overflow-hidden`}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            <SplitText text="Three more" delay={0} stagger={0.03} />
            <br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${LIME}, ${TEAL})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
              <SplitText text="in the making." delay={0.3} stagger={0.03} />
            </span>
          </h3>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className={`mt-5 ${isLight ? 'text-slate-400' : 'text-white/45'} max-w-md mx-auto text-sm leading-relaxed`}
          >
            We ship slowly, deliberately, and only when it earns the Genufy name.
          </motion.p>
        </div>

        {/* Locked product tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {UPCOMING.map((u, i) => (
            <motion.div
              key={u.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-2xl overflow-hidden border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.07] bg-white/[0.02]'} px-6 py-8 backdrop-blur-sm`}
            >
              {/* Corner glow on hover */}
              <div
                className="absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                style={{ background: `radial-gradient(closest-side, ${LIME}88, transparent 70%)` }}
              />

              <div className={`font-mono text-[9px] tracking-[0.4em] uppercase ${isLight ? 'text-slate-300' : 'text-white/22'} mb-4`}>
                {u.code}
              </div>
              {/* Redacted name */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block text-base font-bold ${isLight ? 'text-slate-200' : 'text-white/10'} rounded select-none`}
                  style={{ letterSpacing: '0.08em', filter: 'blur(4px)' }}
                >
                  {u.label}
                </span>
                <svg className={`w-3 h-3 ${isLight ? 'text-slate-300' : 'text-white/18'} shrink-0`} fill="none" viewBox="0 0 16 16" aria-hidden>
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 7h2v5H7V7zm0-3h2v2H7V4z" fill="currentColor" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: LIME }} />
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/28'} tracking-wide`}>{u.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter rail — left sidebar with scroll progress + product dots + hover names
// ─────────────────────────────────────────────────────────────────────────────
function ChapterRail() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const height = useTransform(smooth, [0, 1], ['0%', '100%']);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

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
    <div className="pointer-events-none fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
      <div className={`text-[8px] tracking-[0.5em] uppercase ${isLight ? 'text-slate-400' : 'text-white/25'} [writing-mode:vertical-rl] rotate-180 mb-1`}>
        Products
      </div>
      <div className={`relative h-40 w-px ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'} overflow-hidden`}>
        <motion.div style={{ height, background: `linear-gradient(180deg, ${LIME}, ${TEAL})` }} className="absolute top-0 left-0 w-full" />
      </div>
      <div className="flex flex-col gap-3 pointer-events-auto">
        {products.map((p, i) => (
          <div
            key={i}
            className="relative flex items-center gap-2"
            onMouseEnter={() => setHovered(i)}
            nMouseLeave={() => setHovered(null)}
          >
            <motion.div
              animate={{
                scale: active === i ? 1.4 : 1,
                opacity: active === i ? 1 : 0.35,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="h-1.5 w-1.5 rounded-full shrink-0 cursor-pointer"
              style={{ background: active === i ? p.accent : isLight ? '#94a3b8' : 'rgba(255,255,255,0.5)' }}
            />
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute left-5 whitespace-nowrap text-[10px] font-medium pointer-events-none ${isLight ? 'text-slate-600' : 'text-white/70'}`}
                >
                  {p.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page root
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductsNew() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <>
      <ScrollProgress />
      <Header />
      <ChapterRail />

      <main className={`relative z-10 overflow-hidden${isLight ? ' bg-slate-50' : ''}`}>
        <ProductsHero />

        {products.map((p, i) => (
          <React.Fragment key={p.slug}>
            <ProductSection product={p} index={i} />
            {i < products.length - 1 && (
              <SignalDivider fromColor={p.accent} toColor={products[i + 1].accent} />
            )}
          </React.Fragment>
        ))}

        <TheLab />
      </main>

      <SiteFooter />
    </>
  );
}
