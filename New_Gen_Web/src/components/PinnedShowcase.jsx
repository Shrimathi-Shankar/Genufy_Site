import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
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
      'At Genufy, innovation meets inspiration — and Cera is the face of it all. More than just a mascot, Cera is your friendly tech companion on a mission to transform dreams into milestones.',
      'With a heart full of curiosity, a head packed with knowledge, and a spirit that embodies growth, guidance, and grit, Cera champions our core values: Empowerment, Innovation, and Connection.',
      'Follow #CeraTheGuide and join us on a journey to smarter solutions, stronger communities, and future-ready possibilities.',
    ],
  },
  {
    code: '02',
    title: 'Our Vision',
    subtitle: 'A future engineered for everyone',
    paragraphs: [
      'Our vision is to become a global leader in digital innovation — empowering startups, enterprises, and brands to lead with technology, grow fearlessly, and build meaningful user experiences.',
      'We envision a future where every organization harnesses the full power of digital to scale smarter, faster, and better.',
    ],
  },
  {
    code: '03',
    title: 'Our Mission',
    subtitle: 'Where vision becomes execution',
    paragraphs: [
      'At Genufy TechWorks, our mission is to accelerate digital transformation for businesses by delivering custom software solutions, Salesforce expertise, and next-gen digital platforms.',
      'We exist to bridge the gap between vision and execution — turning bold ideas into scalable, efficient, and future-ready technology.',
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
  const scale = useTransform(progress, [0, 0.5, 1], [0.95, 1.06, 0.98]);
  const orbX = useTransform(progress, [0, 1], [-30, 30]);
  const orbY = useTransform(progress, [0, 1], [30, -30]);
  const haloOpacity = useTransform(progress, [0, 0.5, 1], [0.5, 0.85, 0.55]);

  return (
    <div className="relative h-[58vh] lg:h-[78vh] w-full">
      {/* Gradient orbs (parallax) */}
      <motion.div
        style={{ x: orbX, y: orbY, opacity: haloOpacity }}
        aria-hidden
        className="absolute -left-10 top-6 w-[420px] h-[420px] rounded-full blur-[110px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 60%)' }}
        />
      </motion.div>
      <motion.div
        style={{ x: orbX, y: orbY, opacity: haloOpacity }}
        aria-hidden
        className="absolute right-0 bottom-0 w-[480px] h-[480px] rounded-full blur-[120px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 60%)' }}
        />
      </motion.div>

      {/* Concentric rotating rings */}
      <motion.div
        style={{ rotate: rot, scale }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative">
          {[220, 320, 440, 580, 720].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                top: -s / 2,
                left: -s / 2,
                borderColor:
                  i % 2 ? 'rgba(144,235,97,0.18)' : 'rgba(36,186,172,0.18)',
              }}
            />
          ))}
          {/* Scanning sweep */}
          <div
            className="absolute"
            style={{
              width: 720,
              height: 720,
              top: -360,
              left: -360,
              background:
                'conic-gradient(from 0deg, transparent 70%, rgba(36,186,172,0.35) 85%, transparent 100%)',
              borderRadius: '9999px',
              mask: 'radial-gradient(circle, transparent 0, black 60%)',
              WebkitMask: 'radial-gradient(circle, transparent 0, black 60%)',
            }}
          />
        </div>
      </motion.div>

      {/* Center medallion — current step number */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div
          style={{ scale }}
          className="relative h-60 w-60 md:h-72 md:w-72 rounded-full grid place-items-center border border-white/15 backdrop-blur-xl bg-white/[0.03]"
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                '0 0 80px -10px rgba(36,186,172,0.55), inset 0 0 60px rgba(144,235,97,0.08)',
            }}
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
                Step
              </div>
              <div className="mt-3 font-display text-6xl md:text-7xl text-gradient-gt">
                {STEPS[step].code}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
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

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — animated content */}
          <div className="order-2 lg:order-1 relative">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/40">
              <span className="h-px w-10 bg-white/30" />
              Story · 0{step + 1} of 0{STEPS.length}
            </div>

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
                  <h2 className="mt-2 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                    <LineReveal text={active.title} delay={0.15} />
                  </h2>

                  {/* Subtitle */}
                  <div className="mt-3 text-[11px] md:text-xs tracking-[0.4em] uppercase text-white/55">
                    <LineReveal text={active.subtitle} delay={0.35} />
                  </div>

                  {/* Paragraphs — staggered fade-up + blur clear */}
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

          {/* RIGHT — radar visual */}
          <div className="order-1 lg:order-2 relative">
            <RadarVisual progress={progress} step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
