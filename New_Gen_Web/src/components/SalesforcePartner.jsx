import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const scenes = [
  {
    eyebrow: 'Certified · Trusted · Proven',
    title: 'We are an Official Salesforce Partner',
    body:
      'A trusted partnership built on certified expertise and measurable outcomes. We help ambitious teams design, ship, and scale Salesforce ecosystems that move the business forward.',
    chips: ['Certified Consultants', 'CRM · Sales · Service', 'Industry Cloud'],
  },
  {
    eyebrow: 'Enterprise · Scale',
    title: 'Enterprise Transformation',
    body:
      'From legacy migrations to multi-cloud orchestration — we architect resilient Salesforce platforms that grow with your business and stay quietly out of the way of your teams.',
    chips: ['Migrations', 'Multi-Cloud', 'Governance', 'Integrations'],
  },
  {
    eyebrow: 'AI · Intelligence',
    title: 'Intelligent Digital Solutions',
    body:
      'Automation, AI copilots, and data-driven journeys engineered as one fabric. We turn workflows into intelligent experiences that compound value across every touchpoint.',
    chips: ['Einstein AI', 'Flow Automation', 'Data Cloud', 'Agentforce'],
  },
];

function Scene({ data, range, scrollYProgress }) {
  const [start, end] = range;
  const mid = (start + end) / 2;
  const enter = start + (end - start) * 0.18;
  const settle = start + (end - start) * 0.45;
  const fade = start + (end - start) * 0.78;

  const opacity = useTransform(scrollYProgress, [start, enter, settle, fade, end], [0, 1, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, settle, end], [80, 0, -80]);
  const scale = useTransform(scrollYProgress, [start, mid, end], [0.94, 1, 1.04]);
  const blur = useTransform(
    scrollYProgress,
    [start, enter, fade, end],
    ['12px', '0px', '0px', '10px']
  );
  const filter = useTransform(blur, (b) => `blur(${b})`);

  return (
    <motion.div
      style={{ opacity, y, scale, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="relative max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] tracking-[0.4em] uppercase text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
          {data.eyebrow}
        </div>

        <h2 className="mt-8 font-display font-bold leading-[1.02] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {data.title.split(' ').map((word, i) => {
            const isAccent = ['Salesforce', 'Transformation', 'Solutions'].includes(word.replace(/[.,]/g, ''));
            return (
              <span key={i} className={isAccent ? 'text-gradient-gt mx-2 inline-block' : 'mx-1 inline-block'}>
                {word}
              </span>
            );
          })}
        </h2>

        <p className="mt-7 mx-auto max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
          {data.body}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {data.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-1.5 text-xs text-white/80"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SalesforcePartner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  // Parallax decor
  const orb1Y = useTransform(smooth, [0, 1], [0, -260]);
  const orb2Y = useTransform(smooth, [0, 1], [0, 220]);
  const orb1X = useTransform(smooth, [0, 1], [0, 80]);
  const orb2X = useTransform(smooth, [0, 1], [0, -120]);
  const ringRot = useTransform(smooth, [0, 1], [0, 60]);
  const gridY = useTransform(smooth, [0, 1], [0, -120]);
  const beamScale = useTransform(smooth, [0, 0.5, 1], [0.6, 1.2, 0.7]);

  // Active scene progress for indicator
  const indicatorScale = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: '360vh' }}
      aria-label="Official Salesforce Partner storytelling"
    >
      {/* Pinned canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop layers */}
        <div className="absolute inset-0 bg-ink" />

        {/* Vertical gradient beams */}
        <motion.div
          style={{ scaleY: beamScale }}
          className="absolute inset-y-0 left-1/4 w-px origin-center opacity-50"
          aria-hidden
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(144,235,97,0.35), transparent)',
            }}
          />
        </motion.div>
        <motion.div
          style={{ scaleY: beamScale }}
          className="absolute inset-y-0 right-1/4 w-px origin-center opacity-50"
          aria-hidden
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(36,186,172,0.35), transparent)',
            }}
          />
        </motion.div>

        {/* Parallax grid */}
        <motion.div style={{ y: gridY }} className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            }}
          />
        </motion.div>

        {/* Glow orbs */}
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute -top-32 -left-24 w-[560px] h-[560px] rounded-full blur-[120px] opacity-50"
          aria-hidden
        >
          <div className="w-full h-full rounded-full"
            style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 60%)' }} />
        </motion.div>
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute -bottom-40 -right-24 w-[620px] h-[620px] rounded-full blur-[140px] opacity-45"
          aria-hidden
        >
          <div className="w-full h-full rounded-full"
            style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 60%)' }} />
        </motion.div>

        {/* Rotating concentric rings */}
        <motion.div
          style={{ rotate: ringRot }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div className="relative">
            {[360, 540, 760, 1000, 1280].map((s, i) => (
              <div
                key={s}
                className="absolute rounded-full border"
                style={{
                  width: s,
                  height: s,
                  top: -s / 2,
                  left: -s / 2,
                  borderColor: i % 2 ? 'rgba(144,235,97,0.08)' : 'rgba(36,186,172,0.08)',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)',
          }}
          aria-hidden
        />

        {/* Scenes */}
        <Scene data={scenes[0]} range={[0.00, 0.36]} scrollYProgress={smooth} />
        <Scene data={scenes[1]} range={[0.34, 0.68]} scrollYProgress={smooth} />
        <Scene data={scenes[2]} range={[0.66, 1.00]} scrollYProgress={smooth} />

        {/* Progress rail */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/40 [writing-mode:vertical-rl] rotate-180">
            Story
          </span>
          <div className="relative h-44 w-[2px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              style={{ scaleY: indicatorScale, transformOrigin: 'top' }}
              className="absolute inset-0"
            >
              <div
                className="h-full w-full"
                style={{ background: 'linear-gradient(180deg,#90eb61,#24baac)' }}
              />
            </motion.div>
          </div>
          <div className="flex flex-col gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <span>01</span>
            <span>02</span>
            <span>03</span>
          </div>
        </div>

        {/* Corner labels */}
        <div className="absolute left-6 md:left-12 top-8 text-[10px] tracking-[0.45em] uppercase text-white/40">
          Genufy × Salesforce
        </div>
        <div className="absolute right-6 md:right-12 top-8 text-[10px] tracking-[0.45em] uppercase text-white/40 md:opacity-0">
          Story
        </div>
        <div className="absolute left-6 md:left-12 bottom-8 text-[10px] tracking-[0.45em] uppercase text-white/40">
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
