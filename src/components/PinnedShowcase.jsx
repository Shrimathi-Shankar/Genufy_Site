import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  m as motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    code: '01',
    title: 'Meet Our Cera',
    subtitle: 'Your Digital Success Guide',
    paragraphs: [
      'At Genufy, innovation meets inspiration - and Cera is the face of it all. More than just a mascot, Cera is your friendly tech companion on a mission to transform dreams into milestones.',
    ],
  },
  {
    code: '02',
    title: 'Our Vision',
    subtitle: 'A future engineered for everyone',
    paragraphs: [
      'Our vision is to become a global leader in digital innovation - empowering startups, enterprises, and brands to lead with technology, grow fearlessly, and build meaningful user experiences.',
      'We envision a future where every organization harnesses the full power of digital to scale smarter, faster, and better.',
    ],
  },
  {
    code: '03',
    title: 'Our Mission',
    subtitle: 'Where vision becomes execution',
    paragraphs: [
      'At Genufy TechWorks, our mission is to accelerate digital transformation for businesses by delivering custom software solutions, Salesforce expertise, and next-gen digital platforms.',
      'We exist to bridge the gap between vision and execution - turning bold ideas into scalable, efficient, and future-ready technology.',
    ],
  },
];

/* ---------- Premium per-line reveal (word stagger + blur-to-clear) ---------- */

const lineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const wordIn = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
  show: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

function LineReveal({ text, className, delay = 0 }) {
  const words = text.split(/(\s+)/);
  return (
    <motion.span
      variants={lineContainer}
      initial="hidden"
      animate="show"
      transition={{ delayChildren: delay }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            variants={wordIn}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------- Right-side cinematic radar visual ---------- */

function RadarVisual({ progress, step }) {
  const rot = useTransform(progress, [0, 1], [0, 360]);
  const counterRot = useTransform(progress, [0, 1], [0, -180]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.96, 1.04, 0.98]);
  const orbX = useTransform(progress, [0, 1], [-20, 20]);
  const orbY = useTransform(progress, [0, 1], [20, -20]);
  const haloOpacity = useTransform(progress, [0, 0.5, 1], [0.35, 0.55, 0.35]);

  const orbitDots = Array.from({ length: 8 }, (_, i) => i);

  return (
    /* Slightly smaller overall, with a small downward offset so the visual
       centre aligns with the left content's body rather than its title. */
    <div className="relative h-[46vh] lg:h-[60vh] w-full mt-12 lg:mt-20">
      {/* Soft gradient orbs (lower intensity than before) */}
      <motion.div
        style={{ x: orbX, y: orbY, opacity: haloOpacity }}
        aria-hidden
        className="absolute -left-6 top-4 w-[220px] h-[220px] rounded-full blur-[90px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 65%)' }}
        />
      </motion.div>
      <motion.div
        style={{ x: orbX, y: orbY, opacity: haloOpacity }}
        aria-hidden
        className="absolute right-0 bottom-4 w-[260px] h-[260px] rounded-full blur-[100px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 65%)' }}
        />
      </motion.div>

      {/* Concentric rings - fewer, smaller, softer */}
      <motion.div
        style={{ rotate: rot, scale }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative">
          {[180, 260, 360, 460].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                top: -s / 2,
                left: -s / 2,
                borderColor:
                  i % 2 ? 'rgba(144,235,97,0.12)' : 'rgba(36,186,172,0.12)',
                borderStyle: i === 2 ? 'dashed' : 'solid',
              }}
            />
          ))}
          {/* Soft scanning sweep */}
          <div
            className="absolute"
            style={{
              width: 460,
              height: 460,
              top: -230,
              left: -230,
              background:
                'conic-gradient(from 0deg, transparent 78%, rgba(36,186,172,0.22) 90%, transparent 100%)',
              borderRadius: '9999px',
              mask: 'radial-gradient(circle, transparent 0, black 60%)',
              WebkitMask: 'radial-gradient(circle, transparent 0, black 60%)',
            }}
          />
        </div>
      </motion.div>

      {/* Counter-rotating orbit of glow dots - depth + life */}
      <motion.div
        aria-hidden
        style={{ rotate: counterRot }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative" style={{ width: 360, height: 360 }}>
          {orbitDots.map((i) => {
            const a = (i / orbitDots.length) * Math.PI * 2;
            const r = 180;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            const green = i % 2 === 0;
            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: 6,
                  height: 6,
                  transform: `translate(${x - 3}px, ${y - 3}px)`,
                  background: green ? '#90eb61' : '#24baac',
                  boxShadow: `0 0 12px ${green ? 'rgba(144,235,97,0.7)' : 'rgba(36,186,172,0.7)'}`,
                }}
                animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Center medallion - smaller, lighter glow */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          style={{ scale }}
          className="relative h-44 w-44 md:h-52 md:w-52 rounded-full grid place-items-center border border-white/12 backdrop-blur-xl bg-white/[0.03]"
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                '0 0 60px -14px rgba(36,186,172,0.45), inset 0 0 40px rgba(144,235,97,0.08)',
            }}
          />
          {/* Pulsing inner ring */}
          <motion.span
            aria-hidden
            className="absolute inset-2 rounded-full border border-white/10"
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[step].code}
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(12px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-[10px] tracking-[0.5em] uppercase text-white/50">
                Chapter
              </div>
              <div className="mt-2 font-display text-5xl md:text-6xl text-gradient-gt">
                {STEPS[step].code}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Mobile-only faded spiral (decorative background) ---------- */

function MobileSpiral() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="relative opacity-[0.13]"
      >
        {[170, 250, 330, 410].map((s, i) => (
          <div
            key={s}
            className="absolute rounded-full border"
            style={{
              width: s,
              height: s,
              top: -s / 2,
              left: -s / 2,
              borderColor: i % 2 ? 'rgba(144,235,97,0.5)' : 'rgba(36,186,172,0.5)',
              borderStyle: i === 2 ? 'dashed' : 'solid',
            }}
          />
        ))}
        <div
          className="absolute"
          style={{
            width: 410,
            height: 410,
            top: -205,
            left: -205,
            background:
              'conic-gradient(from 0deg, transparent 78%, rgba(36,186,172,0.5) 90%, transparent 100%)',
            borderRadius: '9999px',
            mask: 'radial-gradient(circle, transparent 0, black 60%)',
            WebkitMask: 'radial-gradient(circle, transparent 0, black 60%)',
          }}
        />
      </motion.div>
    </div>
  );
}

/* ---------- Main component (keeps the PinnedShowcase name for Home wiring) ---------- */

export default function PinnedShowcase() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);

  // Framer-motion progress drives the radar visual (smooth, GPU-only).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  });

  // GSAP ScrollTrigger drives the active step + content transitions.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let current = -1;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const idx = Math.min(
          STEPS.length - 1,
          Math.floor(self.progress * STEPS.length * 0.9999)
        );
        if (idx !== current) {
          current = idx;
          setStep(idx);
        }
      },
    });
    return () => trigger.kill();
  }, []);

  const active = STEPS[step];

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: '360vh' }}
      aria-label="Brand storytelling"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Dark base */}
        <div className="absolute inset-0 bg-ink" />

        {/* Grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage:
              'radial-gradient(ellipse at center, black 35%, transparent 85%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          }}
        />

        {/* Tablet + desktop (md+) layout - unchanged */}
        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 hidden md:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT - animated content */}
          <div className="order-2 lg:order-1 relative">

            {/* Step progress dots */}
            <div className="mt-6 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.code}
                  className="relative h-[2px] w-10 overflow-hidden rounded-full bg-white/10"
                >
                  <motion.div
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : i === step ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      transformOrigin: 'left',
                      background:
                        'linear-gradient(90deg, #90eb61, #24baac)',
                    }}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>

            {/* Stage container holds the rotating step content; only one visible at a time */}
            <div className="relative mt-10 min-h-[440px] md:min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.code}
                  initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    scale: 1,
                  }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(14px)', scale: 0.98 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 will-change-transform"
                >
                  {/* Title with line/word reveal */}
                  <h2 className="mt-2 font-display text-4xl font-bold leading-[1.05] tracking-tight">
                    <LineReveal text={active.title} delay={0.15} />
                  </h2>

                  {/* Subtitle */}
                  <div className="mt-3 text-[11px] md:text-xs tracking-[0.4em] uppercase text-white/55">
                    <LineReveal text={active.subtitle} delay={0.35} />
                  </div>

                  {/* Paragraphs - staggered fade-up + blur clear */}
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          delayChildren: 0.55,
                          staggerChildren: 0.18,
                        },
                      },
                    }}
                    className="mt-8 max-w-xl space-y-5"
                  >
                    {active.paragraphs.map((p, i) => (
                      <motion.p
                        key={i}
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 22,
                            filter: 'blur(8px)',
                          },
                          show: {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: {
                              duration: 0.85,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }}
                        className="text-base md:text-lg text-white/75 leading-relaxed"
                      >
                        {p}
                      </motion.p>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT - radar visual */}
          <div className="order-1 lg:order-2 relative">
            <RadarVisual progress={progress} step={step} />
          </div>
        </div>

        {/* Cera video - flush in the very bottom-left corner of the screen,
            borderless, only on chapter 01 (Meet Our Cera). Slides out as soon
            as the story advances. Desktop only. */}
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              key="cera-corner-video"
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -40, y: 20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block absolute bottom-0 left-0 w-80 lg:w-[28rem] xl:w-[30rem] overflow-hidden pointer-events-none"
            >
              {/* Video is wider than its container so the right side is cropped
                  by the overflow-hidden parent. */}
              <video
                src="/cera2.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="block w-[118%] max-w-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile (<md) layout - faded spiral in the background with
            scroll-driven, one-at-a-time content (Cera → Vision → Mission). */}
        <div className="md:hidden absolute inset-0 flex items-center justify-center px-6">
          <MobileSpiral />
          {/* Readability scrim so content stays crisp over the spiral */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/40" />

          <div className="relative z-10 w-full max-w-sm">

            {/* Step progress dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.code}
                  className="relative h-[2px] w-8 overflow-hidden rounded-full bg-white/10"
                >
                  <motion.div
                    initial={false}
                    animate={{ scaleX: i <= step ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      transformOrigin: 'left',
                      background: 'linear-gradient(90deg, #90eb61, #24baac)',
                    }}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>

            {/* One step prominent at a time - fade + subtle scale */}
            <div className="relative mt-8 min-h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.code}
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 text-center"
                >
                  <div className="text-[10px] tracking-[0.5em] uppercase text-white/50">
                    Chapter 0{step + 1}
                  </div>
                  {/* Styled as a div (not a second <h2>) so the step title isn't
                      duplicated in the DOM - the desktop layout already provides
                      the semantic <h2>. Both layouts coexist in the DOM (one is
                      CSS-hidden per viewport), so two <h2>s would be a duplicate
                      heading for crawlers. */}
                  <div className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight">
                    {active.title}
                  </div>
                  <div className="mt-2 text-[11px] tracking-[0.35em] uppercase text-white/55">
                    {active.subtitle}
                  </div>
                  <div className="mt-6 space-y-3 text-left">
                    {active.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm text-white/75 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
