import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * SalesforceCloudsStory — Zig-zag river layout
 *
 * Vertical normal-scroll section (no pinning, no horizontal lock). The 16
 * clouds form a winding "river" that snakes down the page, alternating
 * left and right along a glowing central spine. The spine draws itself as
 * the user scrolls. Compact glassmorphism cards arrive diagonally from
 * their respective side with a soft rotate+blur entry.
 *
 * The four storytelling categories are stamped along the spine as
 * eyebrow markers between groups of 4 clouds.
 *
 * Design goals
 *  • Visually distinct from the Certifications marquee (which is
 *    pinned-horizontal) and from any horizontal slider — this is purely
 *    page-scroll with side-alternating reveals.
 *  • Compact cards (~340px max), premium glass styling, minimal chrome.
 *  • GPU-only transforms: translate / opacity / rotate / scale / filter.
 *  • Lightweight: no measurement loops, no pin math, no large card heights.
 */

const CATEGORIES = [
  { label: 'Business Growth',          tag: 'Sell · Serve · Engage',      color: '#24baac' },
  { label: 'Commerce & Revenue',       tag: 'Storefronts · Pricing · Data', color: '#F59E0B' },
  { label: 'Industry Solutions',       tag: 'Healthcare · Finance · Auto',  color: '#A78BFA' },
  { label: 'Operations & Sustainability', tag: 'Make · Serve · Care · ESG', color: '#90eb61' },
];

const CLOUDS = [
  { id: 'sales',      name: 'Sales Cloud',              tag: 'Pipeline · Forecasting',  desc: 'AI-assisted lead-to-cash with intelligent routing.',     glyph: '◆', from: '#0EA5E9', to: '#24baac', cat: 0 },
  { id: 'service',    name: 'Service Cloud',            tag: 'Cases · Omnichannel',     desc: 'Omnichannel case management with Einstein.',             glyph: '◉', from: '#6366F1', to: '#24baac', cat: 0 },
  { id: 'marketing',  name: 'Marketing Cloud',          tag: 'Journeys · Engagement',   desc: 'Cross-channel journeys and AI personalization.',         glyph: '✺', from: '#EC4899', to: '#F59E0B', cat: 0 },
  { id: 'experience', name: 'Experience Cloud',         tag: 'Portals · Communities',   desc: 'Branded portals and partner communities.',               glyph: '✦', from: '#10B981', to: '#24baac', cat: 0 },
  { id: 'commerce',   name: 'Commerce Cloud',           tag: 'Storefronts · OMS',       desc: 'Composable B2C and B2B commerce at scale.',              glyph: '❖', from: '#F59E0B', to: '#EF4444', cat: 1 },
  { id: 'revenue',    name: 'Revenue Cloud',            tag: 'CPQ · Billing',           desc: 'CPQ, subscriptions, and billing as one engine.',         glyph: '◇', from: '#F59E0B', to: '#90eb61', cat: 1 },
  { id: 'data',       name: 'Data Cloud',               tag: 'CDP · Activation',        desc: 'Real-time customer data activated everywhere.',          glyph: '◈', from: '#06B6D4', to: '#3B82F6', cat: 1 },
  { id: 'pardot',     name: 'Account Engagement',       tag: 'Pardot · B2B Nurture',    desc: 'B2B nurture, scoring, and revenue analytics.',           glyph: '▤', from: '#8B5CF6', to: '#22D3EE', cat: 1 },
  { id: 'health',     name: 'Health Cloud',             tag: 'Patient 360',             desc: 'Connected care across the patient continuum.',           glyph: '✚', from: '#F472B6', to: '#EF4444', cat: 2 },
  { id: 'education',  name: 'Education Cloud',          tag: 'Recruit · Retain',        desc: 'Student journeys from recruitment to alumni.',           glyph: '✧', from: '#22D3EE', to: '#90eb61', cat: 2 },
  { id: 'fsl',        name: 'Financial Services Cloud', tag: 'Banking · Wealth',        desc: 'Compliance-ready workflows for financial services.',     glyph: '❅', from: '#8B5CF6', to: '#10B981', cat: 2 },
  { id: 'automotive', name: 'Automotive Cloud',         tag: 'Dealer · Driver',         desc: 'Connected vehicle data and dealer journeys.',            glyph: '◐', from: '#94A3B8', to: '#EF4444', cat: 2 },
  { id: 'manuf',      name: 'Manufacturing Cloud',      tag: 'Forecast · Run-rate',     desc: 'Account-based forecasting and partner operations.',      glyph: '▣', from: '#F97316', to: '#0EA5E9', cat: 3 },
  { id: 'field',      name: 'Field Service',            tag: 'Dispatch · IoT',          desc: 'Smart dispatch and mobile workforce, anywhere.',         glyph: '⬡', from: '#F59E0B', to: '#3B82F6', cat: 3 },
  { id: 'nonprofit',  name: 'Nonprofit Cloud',          tag: 'Donors · Programs',       desc: 'Fundraising and programs for mission-led teams.',        glyph: '❤', from: '#A78BFA', to: '#EC4899', cat: 3 },
  { id: 'netzero',    name: 'Net Zero Cloud',           tag: 'Carbon · ESG',            desc: 'Emissions tracking across scope 1, 2, and 3.',           glyph: '◍', from: '#10B981', to: '#24baac', cat: 3 },
];

/* ---------------- Compact card ---------------- */

function CompactCard({ cloud, side }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: side === 'left' ? -56 : 56,
        rotate: side === 'left' ? -2.5 : 2.5,
        filter: 'blur(6px)',
      }}
      whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group relative w-full max-w-[340px] rounded-2xl border border-white/12 bg-white/[0.025] backdrop-blur-xl overflow-hidden p-5"
      style={{
        boxShadow: `0 22px 50px -28px ${cloud.from}66, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* corner halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-95"
        style={{ background: `radial-gradient(circle, ${cloud.from}aa, transparent 70%)` }}
      />
      {/* subtle inner grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative flex items-start gap-3.5">
        <div
          className="grid h-11 w-11 flex-none place-items-center rounded-xl font-display text-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${cloud.from}, ${cloud.to})`,
            boxShadow: `0 10px 22px -10px ${cloud.from}, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        >
          {cloud.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] tracking-[0.45em] uppercase text-white/45">
            Salesforce
          </div>
          <div className="mt-0.5 font-display text-base md:text-lg text-white leading-snug">
            {cloud.name}
          </div>
          <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-white/55">
            {cloud.tag}
          </div>
        </div>
      </div>

      <p className="relative mt-3 text-xs md:text-sm text-white/65 leading-relaxed">
        {cloud.desc}
      </p>

      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${cloud.from}, ${cloud.to})` }}
      />
    </motion.div>
  );
}

/* ---------------- Category marker (sits on the spine) ---------------- */

function CategoryMarker({ cat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 self-center flex flex-col items-center my-2 md:my-4"
    >
      <div
        className="rounded-full px-5 py-2 border backdrop-blur-md text-[10px] tracking-[0.5em] uppercase font-medium"
        style={{
          borderColor: `${cat.color}55`,
          background: `linear-gradient(135deg, ${cat.color}1a, rgba(0,0,0,0.4))`,
          color: '#fff',
          boxShadow: `0 0 24px -6px ${cat.color}88`,
        }}
      >
        <span style={{ color: cat.color }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="mx-2 text-white/30">·</span>
        <span>{cat.label}</span>
      </div>
      <div className="mt-1.5 text-[9px] tracking-[0.4em] uppercase text-white/45">
        {cat.tag}
      </div>
    </motion.div>
  );
}

/* ---------------- Ambient backdrop (light) ---------------- */

function AmbientDecor() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 65%)' }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 65%)' }}
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[360px] w-[360px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

/* ---------------- Main ---------------- */

export default function SalesforceCloudsStory({ scrollContainer }) {
  const sectionRef = useRef(null);

  // Only the spine line uses scroll progress — light, single useTransform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const spineFill = useTransform(smooth, [0.08, 0.92], [0, 1]);

  // Build the interleaved sequence: insert a category marker each time we cross a cat boundary
  const items = [];
  CLOUDS.forEach((c, i) => {
    const isBoundary = i === 0 || c.cat !== CLOUDS[i - 1].cat;
    if (isBoundary) {
      items.push({ kind: 'marker', cat: CATEGORIES[c.cat], catIndex: c.cat });
    }
    items.push({ kind: 'card', cloud: c, sideIndex: i });
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Salesforce Clouds — zig-zag storytelling"
      className="relative px-6 md:px-12 py-24 md:py-36 overflow-hidden"
    >
      <AmbientDecor />

      {/* Heading */}
      <div className="relative max-w-7xl mx-auto mb-16 md:mb-24 text-center">
        <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/55 mb-5">
          <span className="h-px w-10 bg-white/30" />
          The Cloud Ecosystem
          <span className="h-px w-10 bg-white/30" />
        </div>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          <span className="text-gradient-gt">16 clouds.</span>{' '}
          <span className="text-white/85">One winding story.</span>
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/65 leading-relaxed">
          Follow the river — each cloud drifts in from its own side as you scroll, grouped into four storytelling currents.
        </p>
      </div>

      {/* River */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central spine (md+) */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px hidden md:block"
        >
          {/* Background hairline */}
          <div className="absolute inset-0 bg-white/8" />
          {/* Scroll-drawn fill */}
          <motion.div
            style={{ scaleY: spineFill, transformOrigin: 'top' }}
            className="absolute inset-0"
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(180deg, rgba(144,235,97,0.9), rgba(36,186,172,0.9) 40%, rgba(167,139,250,0.7) 75%, rgba(144,235,97,0.6))',
                boxShadow: '0 0 18px rgba(36,186,172,0.45)',
              }}
            />
          </motion.div>
          {/* Pulse beads */}
          {[0.10, 0.30, 0.50, 0.70, 0.90].map((p, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 -translate-x-1/2 h-2 w-2 rounded-full"
              style={{
                top: `${p * 100}%`,
                background: 'linear-gradient(135deg, #90eb61, #24baac)',
                boxShadow: '0 0 16px #90eb61',
              }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.55, 1, 0.55] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35,
              }}
            />
          ))}
        </div>

        {/* 2-column CSS grid — left/right groups cluster near the spine without crossing it */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 md:gap-y-12">
          {items.map((it) => {
            if (it.kind === 'marker') {
              return (
                <div
                  key={`m-${it.catIndex}`}
                  className="md:col-span-2 flex justify-center"
                >
                  <CategoryMarker cat={it.cat} index={it.catIndex} />
                </div>
              );
            }
            // Side is determined by category — entire group stays on one side
            const side = it.cloud.cat % 2 === 0 ? 'left' : 'right';
            // Intra-group index (0..3) drives a subtle mini zig-zag inside the column
            const k = it.sideIndex % 4;
            const pushedOut = k % 2 === 0; // cards 1 & 3 (1-indexed) sit further from the spine
            const colClass =
              side === 'left'
                ? 'md:col-start-1 md:justify-self-end'
                : 'md:col-start-2 md:justify-self-start';
            const offsetClass = pushedOut
              ? side === 'left'
                ? 'md:-translate-x-6 lg:-translate-x-10'
                : 'md:translate-x-6 lg:translate-x-10'
              : '';
            return (
              <div
                key={it.cloud.id}
                className={`w-full flex justify-center md:block ${colClass} ${offsetClass}`}
              >
                <CompactCard cloud={it.cloud} side={side} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer line */}
      <div className="relative max-w-3xl mx-auto mt-20 md:mt-28 text-center">
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto h-px max-w-sm mb-6 origin-center"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(36,186,172,0.7), transparent)',
          }}
        />
        <div className="text-[10px] tracking-[0.5em] uppercase text-white/45">
          16 clouds · 4 currents · one Salesforce
        </div>
      </div>
    </section>
  );
}
