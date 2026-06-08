import { m as motion } from 'framer-motion';

/**
 * SalesforceCloudsStory - "Cloud Ecosystem" bento mosaic
 *
 * The 16 Salesforce Clouds are presented as a modern asymmetric bento grid
 * instead of a uniform card row. Each cloud owns its brand gradient (glow,
 * glyph chip, accent bar) so every tile reads distinctly. The lead cloud of
 * each of the four ecosystem categories is promoted to a wide "anchor" tile
 * that carries the category label + a one-line description, giving the grid a
 * deliberate, editorial rhythm while staying fully responsive.
 */

const CATEGORIES = [
  { label: 'Business Growth', color: '#24baac' },
  { label: 'Commerce & Revenue', color: '#F59E0B' },
  { label: 'Industry Solutions', color: '#A78BFA' },
  { label: 'Operations & Sustainability', color: '#90eb61' },
];

const CLOUDS = [
  { id: 'sales', name: 'Sales Cloud', tag: 'Pipeline · Forecasting', desc: 'AI-assisted lead-to-cash with intelligent routing.', glyph: '◆', from: '#0EA5E9', to: '#24baac', cat: 0 },
  { id: 'service', name: 'Service Cloud', tag: 'Cases · Omnichannel', desc: 'Omnichannel case management with Einstein.', glyph: '◉', from: '#6366F1', to: '#24baac', cat: 0 },
  { id: 'marketing', name: 'Marketing Cloud', tag: 'Journeys · Engagement', desc: 'Cross-channel journeys and AI personalization.', glyph: '✺', from: '#EC4899', to: '#F59E0B', cat: 0 },
  { id: 'experience', name: 'Experience Cloud', tag: 'Portals · Communities', desc: 'Branded portals and partner communities.', glyph: '✦', from: '#10B981', to: '#24baac', cat: 0 },
  { id: 'commerce', name: 'Commerce Cloud', tag: 'Storefronts · OMS', desc: 'Composable B2C and B2B commerce at scale.', glyph: '❖', from: '#F59E0B', to: '#EF4444', cat: 1 },
  { id: 'revenue', name: 'Revenue Cloud', tag: 'CPQ · Billing', desc: 'CPQ, subscriptions, and billing as one engine.', glyph: '◇', from: '#F59E0B', to: '#90eb61', cat: 1 },
  { id: 'data', name: 'Data Cloud', tag: 'CDP · Activation', desc: 'Real-time customer data activated everywhere.', glyph: '◈', from: '#06B6D4', to: '#3B82F6', cat: 1 },
  { id: 'pardot', name: 'Account Engagement', tag: 'Pardot · B2B Nurture', desc: 'B2B nurture, scoring, and revenue analytics.', glyph: '▤', from: '#8B5CF6', to: '#22D3EE', cat: 1 },
  { id: 'health', name: 'Health Cloud', tag: 'Patient 360', desc: 'Connected care across the patient continuum.', glyph: '✚', from: '#F472B6', to: '#EF4444', cat: 2 },
  { id: 'education', name: 'Education Cloud', tag: 'Recruit · Retain', desc: 'Student journeys from recruitment to alumni.', glyph: '✧', from: '#22D3EE', to: '#90eb61', cat: 2 },
  { id: 'fsl', name: 'Financial Services Cloud', tag: 'Banking · Wealth', desc: 'Compliance-ready workflows for financial services.', glyph: '❅', from: '#8B5CF6', to: '#10B981', cat: 2 },
  { id: 'automotive', name: 'Automotive Cloud', tag: 'Dealer · Driver', desc: 'Connected vehicle data and dealer journeys.', glyph: '◐', from: '#94A3B8', to: '#EF4444', cat: 2 },
  { id: 'manuf', name: 'Manufacturing Cloud', tag: 'Forecast · Run-rate', desc: 'Account-based forecasting and partner operations.', glyph: '▣', from: '#F97316', to: '#0EA5E9', cat: 3 },
  { id: 'field', name: 'Field Service', tag: 'Dispatch · IoT', desc: 'Smart dispatch and mobile workforce, anywhere.', glyph: '⬡', from: '#F59E0B', to: '#3B82F6', cat: 3 },
  { id: 'nonprofit', name: 'Nonprofit Cloud', tag: 'Donors · Programs', desc: 'Fundraising and programs for mission-led teams.', glyph: '❤', from: '#A78BFA', to: '#EC4899', cat: 3 },
  { id: 'netzero', name: 'Net Zero Cloud', tag: 'Carbon · ESG', desc: 'Emissions tracking across scope 1, 2, and 3.', glyph: '◍', from: '#10B981', to: '#24baac', cat: 3 },
];

/* ---------------- Ambient backdrop ---------------- */

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
    </>
  );
}

/* ---------------- Bento tile ---------------- */

function CloudTile({ cloud, i, wide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (i % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5 ${wide ? 'col-span-2' : 'col-span-1'
        }`}
      style={{ boxShadow: `0 22px 50px -30px ${cloud.from}77, inset 0 1px 0 rgba(255,255,255,0.05)` }}
    >
      {/* Unique brand corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-95"
        style={{ background: `radial-gradient(circle, ${cloud.from}, transparent 70%)` }}
      />
      {/* Gradient border on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${cloud.from}, ${cloud.to})`,
          padding: 1,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div
            className="grid h-11 w-11 flex-none place-items-center rounded-xl font-display text-lg text-white transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${cloud.from}, ${cloud.to})`,
              boxShadow: `0 10px 22px -10px ${cloud.from}, inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
          >
            {cloud.glyph}
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-auto pt-4">
          {wide && (
            <div
              className="mb-1.5 text-[9px] font-semibold tracking-[0.35em] uppercase"
              style={{ color: cloud.from }}
            >
              {CATEGORIES[cloud.cat].label}
            </div>
          )}
          <div className="font-display text-base md:text-lg text-white leading-snug">
            {cloud.name}
          </div>
          <div className="mt-1 text-[9px] tracking-[0.3em] uppercase text-white/45">
            {cloud.tag}
          </div>
          {/* {wide && (
            <p className="mt-2 max-w-md text-xs text-white/55 leading-relaxed line-clamp-2">
              {cloud.desc}
            </p>
          )} */}
        </div>
      </div>

      {/* Brand accent bar */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${cloud.from}, ${cloud.to})` }}
      />
    </motion.div>
  );
}

/* ---------------- Main ---------------- */

export default function SalesforceCloudsStory() {
  return (
    <section
      aria-label="Salesforce Clouds - ecosystem mosaic"
      className="relative px-6 md:px-12 py-24 md:py-36 overflow-hidden"
    >
      <AmbientDecor />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-14 md:mb-20 text-center">
          <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-white/55 mb-5">
            <span className="h-px w-10 bg-white/30" />
            The Cloud Ecosystem
            <span className="h-px w-10 bg-white/30" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient-gt">16 clouds.</span>{' '}
            <span className="text-white/85">One connected ecosystem.</span>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/65 leading-relaxed">
            Every Salesforce Cloud, mapped as one fabric - each tile carries its own
            identity, grouped into four currents that power growth, commerce, industry, and operations.
          </p>

          {/* Category legend */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {CATEGORIES.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/50">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bento mosaic - wide anchor tile per category, dense flow fills the rest */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 grid-flow-dense auto-rows-[164px] sm:auto-rows-[182px]">
          {CLOUDS.map((c, i) => {
            const wide = i === 0 || c.cat !== CLOUDS[i - 1].cat;
            return <CloudTile key={c.id} cloud={c} i={i} wide={wide} />;
          })}
        </div>

        {/* Footer line */}
        <div className="mt-16 md:mt-20 text-center">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto h-px max-w-sm mb-6 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(36,186,172,0.7), transparent)' }}
          />
          <div className="text-[10px] tracking-[0.5em] uppercase text-white/45">
            16 clouds · 4 currents · one Salesforce
          </div>
        </div>
      </div>
    </section>
  );
}
