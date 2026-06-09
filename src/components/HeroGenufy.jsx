'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScroll, useTransform, m as motion } from 'framer-motion';
import AuroraBackground from './AuroraBackground.jsx';
import useEnhancedMotion from '../hooks/useEnhancedMotion.js';
import { useContactModal } from '../contexts/ContactModalContext.jsx';

// ==========================================
// 1. Interactive Canvas Particles Component
// ==========================================
function Particles({ density = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: density }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: Math.random() > 0.5 ? '144,235,97' : '36,186,172',
        a: Math.random() * 0.6 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `rgba(${p.c},${p.a})`);
        grd.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    seed();

    // Only run the rAF loop while the hero is actually on screen — once it
    // scrolls out, stop drawing so the main thread is free for the rest of the
    // page (it resumes automatically on scroll-back).
    let visible = true;
    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);
    loop();

    const onResize = () => { resize(); seed(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

// ==========================================
// 2. Parallax Backdrop Stage Component
// ==========================================
function ParallaxStage() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  // Only run the (GPU-heavy) canvas particle field on capable devices.
  const enhanced = useEnhancedMotion();

  const yFar = useTransform(scrollY, [0, 800], [0, -60]);
  const yMid = useTransform(scrollY, [0, 800], [0, -150]);
  const yNear = useTransform(scrollY, [0, 800], [0, -260]);
  const rot = useTransform(scrollY, [0, 1200], [0, 25]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.55]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="fixed inset-0 -z-10 overflow-hidden bg-ink"
      aria-hidden="true"
    >
      {/* Base radial wash */}
      <motion.div style={{ y: yFar }} className="layer absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 30%, rgba(36,186,172,0.18) 0%, rgba(0,0,0,0) 65%), radial-gradient(40% 35% at 70% 70%, rgba(144,235,97,0.14) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      </motion.div>

      {/* Grid */}
      <motion.div style={{ y: yMid }} className="layer absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Glow orbs */}
      <motion.div style={{ y: yMid, rotate: rot }} className="layer absolute inset-0">
        <div
          className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-[120px] opacity-50"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 60%)' }}
        />
        <div
          className="absolute bottom-[-180px] right-[-120px] w-[600px] h-[600px] rounded-full blur-[140px] opacity-45"
          style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 60%)' }}
        />
        <div
          className="absolute top-[40%] left-[55%] w-[380px] h-[380px] rounded-full blur-[120px] opacity-30 animate-hueGlow"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 65%)' }}
        />
      </motion.div>

      {/* Concentric rings */}
      <motion.div style={{ y: yNear }} className="layer absolute inset-0 flex items-center justify-center">
        <div className="relative animate-spinSlow">
          {[420, 600, 820, 1080].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s, height: s,
                top: -s / 2, left: -s / 2,
                borderColor: i % 2 ? 'rgba(144,235,97,0.10)' : 'rgba(36,186,172,0.10)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Scan line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-40 animate-scan"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(144,235,97,0.06), transparent)' }}
        />
      </div>

      {/* Particles - skipped entirely on mobile/low-end (the canvas RAF loop is
          a common cause of freezing there). */}
      {enhanced && (
        <motion.div style={{ y: yNear }} className="layer absolute inset-0">
          <Particles density={70} />
        </motion.div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)' }}
      />
    </motion.div>
  );
}

// ==========================================
// 3. 3D Spline Robot Component
// ==========================================
// Loaded client-only (ssr:false). All @splinetool imports live inside
// SplineRobotClient so the package never enters the server/prerender compile.
const SplineRobot = dynamic(() => import('./SplineRobotClient.jsx'), { ssr: false });

// ==========================================
// 4. Hero HUD Elements & Snapping Hooks
// ==========================================
const ease = [0.22, 1, 0.36, 1];

function RobotHUD() {
  const cx = 200, cy = 268;

  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 73 % 84)}%`,
    dur: 4.5 + (i * 37 % 32) / 10,
    delay: (i * 53 % 62) / 10,
    color: i % 3 === 0 ? '#90eb61' : '#24baac',
    size: i % 4 === 0 ? 2 : 1.5,
  }));

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Core radial glow */}
      <motion.div
        className="absolute rounded-full blur-[88px]"
        style={{
          inset: '4% 2% 10%',
          background: 'radial-gradient(ellipse at 50% 56%, rgba(36,186,172,0.38) 0%, rgba(36,186,172,0.08) 52%, transparent 72%)',
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Lime secondary bloom */}
      <motion.div
        className="absolute rounded-full blur-[60px]"
        style={{
          inset: '22% 18%',
          background: 'radial-gradient(circle, rgba(144,235,97,0.16), transparent 70%)',
        }}
        animate={{ opacity: [0.3, 0.72, 0.3], scale: [0.95, 1.1, 0.95] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />

      {/* SVG HUD - hidden on small phones where it adds visual noise */}
      <svg
        className="absolute inset-0 w-full h-full hidden sm:block"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="hg1" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="hg2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="28%" stopColor="#24baac" stopOpacity="0.8"/>
            <stop offset="68%" stopColor="#90eb61" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        >
          <ellipse cx={cx} cy={cy} rx={166} ry={53}
            fill="none" stroke="#24baac" strokeWidth={0.85}
            strokeDasharray="9 13" opacity={0.45} filter="url(#hg1)"
          />
          <circle cx={cx + 166} cy={cy} r={3.8} fill="#24baac" filter="url(#hg2)" />
          <circle cx={cx - 120} cy={cy - 38} r={2.2} fill="#90eb61" filter="url(#hg1)" />
        </motion.g>

        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 19, repeat: Infinity, ease: 'linear' }}
        >
          <ellipse cx={cx} cy={cy} rx={112} ry={36}
            fill="none" stroke="#90eb61" strokeWidth={0.65}
            strokeDasharray="5 16" opacity={0.35} filter="url(#hg1)"
          />
          <circle cx={cx + 112} cy={cy} r={2.6} fill="#90eb61" filter="url(#hg2)" />
        </motion.g>

        <motion.circle cx={cx} cy={cy} r={5}
          fill="none" stroke="#24baac" strokeWidth={1} filter="url(#hg1)"
          animate={{ r: [5, 14, 5], opacity: [0.9, 0, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        <circle cx={cx} cy={cy} r={3} fill="#24baac" filter="url(#hg2)" opacity={0.9} />
        <circle cx={cx} cy={cy} r={1.2} fill="white" opacity={0.85} />

        {[
          'M 110,152 L 88,152 L 88,174',
          'M 290,152 L 312,152 L 312,174',
          'M 110,372 L 88,372 L 88,350',
          'M 290,372 L 312,372 L 312,350',
        ].map((d, i) => (
          <motion.path key={i} d={d}
            fill="none" stroke="#24baac" strokeWidth={1.6} filter="url(#hg1)"
            animate={{ opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        <motion.line x1={68} x2={332} stroke="url(#sg)" strokeWidth={1.3} opacity={0.7}
          animate={{ y1: [160, 368], y2: [160, 368] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 2.2 }}
        />

        {[0, 1, 2, 3, 4].map(i => (
          <motion.line key={i}
            y1={190 + i * 30} y2={190 + i * 30}
            stroke={i % 2 === 0 ? '#24baac' : '#90eb61'} strokeWidth={0.7}
            animate={{
              opacity: [0.15, 0.65, 0.15],
              x1: [48, 44, 48],
              x2: [i % 2 === 0 ? 68 : 60, i % 2 === 0 ? 72 : 64, i % 2 === 0 ? 68 : 60],
            }}
            transition={{ duration: 1.6 + i * 0.22, repeat: Infinity, delay: i * 0.38 }}
          />
        ))}

        {[0, 1, 2].map(i => (
          <motion.line key={i}
            y1={210 + i * 38} y2={210 + i * 38}
            stroke="#24baac" strokeWidth={0.6}
            animate={{ opacity: [0.1, 0.5, 0.1], x1: [340, 344, 340], x2: [352, 356, 352] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.5 + 0.8 }}
          />
        ))}
      </svg>

      {/* Rising particles */}
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
          animate={{ y: [0, -520], opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function useHeroSnap() {
  useEffect(() => {
    let snapped = false;
    const heroH = window.innerHeight;
    const threshold = heroH * 0.15;

    const handleScroll = ({ scroll }) => {
      if (!snapped && scroll > threshold && scroll < heroH) {
        snapped = true;
        window.__lenis?.scrollTo(heroH, {
          duration: 1.0,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      }
      if (scroll < 10) snapped = false;
    };

    let lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
      return () => lenis.off('scroll', handleScroll);
    }

    const t = setInterval(() => {
      lenis = window.__lenis;
      if (lenis) {
        lenis.on('scroll', handleScroll);
        clearInterval(t);
      }
    }, 80);
    return () => {
      clearInterval(t);
      window.__lenis?.off('scroll', handleScroll);
    };
  }, []);
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* Deep cool-charcoal base */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #0b0e16 0%, #060810 55%, #020405 100%)' }}
      />
      {/* Aurora animated layer */}
      <AuroraBackground animationSpeed={10} />
      {/* Fine dot grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%)',
        }}
      />
      {/* Top fade for nav */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}

function HeadlineLine({ text, delay = 0, accent = false, dimmed = false }) {
  const words = text.split(' ');
  const colorClass = accent ? 'text-lime' : dimmed ? 'text-white/35' : 'text-white';
  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: 0.18 } },
      }}
      className="block"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { duration: 2.0, ease: [0.455, 0.03, 0.515, 0.955] },
            },
          }}
          className={`inline-block mr-[0.12em] ${colorClass}`}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ==========================================
// 5. Consolidated Exported Hero Component
// ==========================================
export default function HeroGenufy() {
  useHeroSnap();
  const { openContact } = useContactModal();
  // On mobile/low-end, skip the WebGL Spline robot + animated HUD (the biggest
  // freeze culprits) and show a lightweight glow instead.
  const enhanced = useEnhancedMotion();
  return (
    <>
      {/* 3D background / parallax stage layers */}
      <ParallaxStage />

      {/* Main hero section. Use svh (small viewport height) - it is STABLE and
          does NOT change as the mobile URL bar hides on scroll, unlike dvh which
          made the hero resize/reflow during the scroll-out (the stutter near the
          robot area). h-screen (100vh) is the fallback if svh is unsupported. */}
      <section
        className="relative h-screen overflow-hidden isolate"
        style={{ height: '100svh' }}
      >
        <HeroBackdrop />

        {/*
          Mobile: single centred column (robot is hidden on mobile, so a text
          hero — no awkward empty robot area). Desktop: 2-col with the robot.
        */}
        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 grid-rows-1 items-center px-5 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6 lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:items-center lg:pt-16 lg:pb-4">

          {/* Left: text content - z-20 keeps the heading above the (larger) robot
              if they overlap horizontally. */}
          <div className="relative z-20 flex flex-col items-start text-left overflow-hidden min-w-0 pt-3 lg:pt-0">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease }}
              className="mb-0.5 font-brand text-base font-semibold text-white/75 sm:text-xl lg:text-2xl"
            >
              We Build
            </motion.span>

            <h1 className="font-brand font-extrabold leading-none tracking-tight w-full">
              {/* clamp() sets a minimum size so text stays legible on 320px phones */}
              <span className="block text-[clamp(28px,8vw,88px)] sm:text-[7.5vw] lg:text-[5.2vw] xl:text-[4.8vw] mb-2 lg:mb-4">
                <HeadlineLine text="Intelligent" delay={0.2} />
              </span>
              <span className="block text-[clamp(28px,8vw,88px)] sm:text-[7.5vw] lg:text-[5.2vw] xl:text-[4.8vw] mb-2 lg:mb-4">
                <HeadlineLine text="Digital Solutions" delay={0.7} accent />
              </span>
              <span className="block text-[clamp(18px,4.8vw,52px)] sm:text-[4.5vw] lg:text-[3.2vw] xl:text-[3vw]">
                <HeadlineLine text="That Scale." delay={1.35} dimmed />
              </span>
            </h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.9, ease: 'easeOut' }}
              className="mt-3 h-px w-28 origin-left md:w-40 lg:mt-4"
              style={{ background: 'linear-gradient(90deg, #90eb61, transparent)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.75, ease }}
              className="mt-3 max-w-sm text-sm leading-relaxed text-white/50 md:text-[0.93rem] lg:mt-8"
            >
              Genufy transforms ideas into scalable digital ecosystems powered by
              AI, intelligent automation, and deep domain expertise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.75, duration: 0.7 }}
              className="mt-3 flex flex-wrap items-center gap-3 lg:mt-5"
            >
              <a
                href="#services"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
                style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
              >
                Explore Solutions
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <button
                type="button"
                onClick={openContact}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 sm:px-8 sm:py-3.5 text-sm font-medium text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-teal/40 hover:bg-white/[0.05] hover:text-white"
              >
                Talk to Us
              </button>
            </motion.div>
          </div>

          {/* Right: Spline Robot + HUD — DESKTOP ONLY (hidden lg:block). On mobile
              the robot is hidden entirely so the hero is a clean centred text
              layout (no awkward empty robot area). On low-end desktops the
              `enhanced` gate falls back to a lightweight glow instead of WebGL. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease }}
            className="relative z-0 hidden w-full min-w-0 lg:block lg:h-[100vh] lg:min-h-[640px] lg:-mt-[9vh] lg:w-[130%] lg:-ml-[18%]"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 82% 76% at 52% 42%, black 22%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.3) 70%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 82% 76% at 52% 42%, black 22%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            }}
          >
            {enhanced ? (
              <>
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 1.2 }}
                >
                  <RobotHUD />
                </motion.div>
                <SplineRobot />
              </>
            ) : (
              // Lightweight fallback for mobile/low-end - no WebGL, no HUD.
              <div aria-hidden className="absolute inset-0 grid place-items-center">
                <div
                  className="h-56 w-56 rounded-full opacity-50 blur-3xl sm:h-72 sm:w-72"
                  style={{ background: 'radial-gradient(circle, #24baac, #90eb61 55%, transparent 75%)' }}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 sm:bottom-6"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
            className="h-5 w-px bg-gradient-to-b from-white/25 to-transparent"
          />
        </motion.div>
      </section>
    </>
  );
}
