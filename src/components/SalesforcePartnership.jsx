import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SCENES = [
  {
    eyebrow: 'Certified · Trusted · Proven',
    title: 'We are an Official Salesforce Partner',
    accent: ['Salesforce'],
    body:
      'A trusted partnership built on certified expertise and measurable outcomes. We help ambitious teams design, ship, and scale Salesforce ecosystems that move the business forward.',
    chips: ['Certified Consultants', 'CRM · Sales · Service', 'Industry Cloud'],
  },
  {
    eyebrow: 'Enterprise · Scale',
    title: 'Enterprise Transformation',
    accent: ['Transformation'],
    body:
      'From legacy migrations to multi-cloud orchestration — we architect resilient Salesforce platforms that grow with your business and stay quietly out of the way of your teams.',
    chips: ['Migrations', 'Multi-Cloud', 'Governance', 'Integrations'],
  },
  {
    eyebrow: 'AI · Intelligence',
    title: 'Intelligent Digital Solutions',
    accent: ['Solutions'],
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
  const blur = useTransform(scrollYProgress, [start, enter, fade, end], ['12px', '0px', '0px', '10px']);
  const filter = useTransform(blur, (b) => `blur(${b})`);

  return (
    <motion.div
      style={{ opacity, y, scale, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="relative max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] tracking-[0.4em] uppercase text-white/70">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: '#90eb61',
              boxShadow: '0 0 10px #90eb61, 0 0 22px rgba(36,186,172,0.65)',
            }}
          />
          {data.eyebrow}
        </div>

        <h2 className="mt-8 font-display font-bold leading-[1.02] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {data.title.split(' ').map((word, i) => {
            const isAccent = data.accent.includes(word.replace(/[.,]/g, ''));
            return (
              <span
                key={i}
                className={isAccent ? 'mx-2 inline-block' : 'mx-1 inline-block'}
                style={
                  isAccent
                    ? {
                      background: 'linear-gradient(90deg,#90eb61,#24baac)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 20px rgba(36,186,172,0.35))',
                    }
                    : undefined
                }
              >
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

function Pip({ range, scrollYProgress }) {
  const [a, b] = range;
  const opacity = useTransform(scrollYProgress, [a, (a + b) / 2, b], [0.3, 1, 0.3]);
  return (
    <motion.span
      className="h-1.5 w-8 rounded-full"
      style={{ opacity, background: 'linear-gradient(90deg,#90eb61,#24baac)' }}
    />
  );
}

export default function SalesforcePartnership() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /* Each scene gets a non-overlapping slice of scroll progress. */
  const ranges = [
    [0.00, 0.34],
    [0.34, 0.68],
    [0.68, 1.00],
  ];

  /* Aurora pulses subtly as we scroll through */
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.55, 0.35]);
  const auroraX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  /* Progress bar at top */
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* Section background opacity — transparent during the early overlap
     (so the portal stays visible behind), then solidifies before scene 1
     fully settles. Driven by section scrollYProgress: 0 means we just
     entered (portal still on top), ~0.06 means we're past the overlap. */
  const sectionBgOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12], [0, 0.55, 1]);

  return (
    <section
      ref={ref}
      aria-label="Salesforce Partnership"
      className="relative text-white"
      /* Negative top margin pulls this section UP so it overlaps the last
         ~100vh of the portal's scroll. While the portal is still expanding
         (its sticky still pinned) this section's sticky also begins pinning
         and its content fades in over the portal — overlapping transition. */
      style={{ height: '320vh', marginTop: '-100vh', zIndex: 1 }}
    >
      {/* Black backdrop that fades in across the overlap — keeps the portal
          visible underneath while the partnership content is fading in,
          then solidifies as the partnership takes over. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: sectionBgOpacity }}
      />

      {/* Subtle green/teal afterglow at the top — feels like emerging from
          the portal's ring; black underneath so there is no flash or color tint. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(144,235,97,0.10), rgba(36,186,172,0.06) 40%, transparent 80%)',
        }}
      />

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Aurora */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: auroraOpacity }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] rounded-full blur-[160px]"
            style={{
              x: auroraX,
              background:
                'radial-gradient(60% 50% at 25% 50%, rgba(36,186,172,0.45), transparent 70%),' +
                'radial-gradient(60% 50% at 75% 50%, rgba(144,235,97,0.40), transparent 70%)',
            }}
          />
        </motion.div>

        {/* Faint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          }}
        />

        {/* Gradient hairlines top + bottom */}
        {/* <div
          aria-hidden
          className="pointer-events-none absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #90eb61, #24baac, transparent)' }}
        /> */}
        {/* <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #90eb61, #24baac, transparent)' }}
        /> */}

        {/* Scroll progress bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/5">
          <motion.div
            className="h-full"
            style={{
              width: barWidth,
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              boxShadow: '0 0 12px rgba(144,235,97,0.6)',
            }}
          />
        </div>

        {/* Corner labels */}
        <div className="absolute left-6 md:left-12 top-8 text-[10px] tracking-[0.45em] uppercase text-white/40">
          Partnership
        </div>
        <div className="absolute right-6 md:right-12 top-8 text-[10px] tracking-[0.45em] uppercase text-white/40">
          Story
        </div>

        {/* Scenes — only the active one is opaque, others fade in/out */}
        {SCENES.map((data, i) => (
          <Scene key={i} data={data} range={ranges[i]} scrollYProgress={scrollYProgress} />
        ))}

        {/* Scene index pips */}
        {/* <div className="absolute bottom-10 inset-x-0 flex justify-center gap-3">
          {ranges.map((r, i) => (
            <Pip key={i} range={r} scrollYProgress={scrollYProgress} />
          ))}
        </div> */}
      </div>
    </section>
  );
}
