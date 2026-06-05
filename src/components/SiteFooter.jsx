import { motion } from 'framer-motion';
import { products as ALL_PRODUCTS } from '../views/products/productData.js';

// ─── Data ────────────────────────────────────────────────────────────────────

/* label → service id (matches SERVICES in services/serviceData.js). The id is
   used to deep-link to the matching service experience on the home page. */
const services = [
  { label: 'Salesforce', id: 'salesforce' },
  { label: 'Snowflake', id: 'snowflake' },
  { label: 'Informatica', id: 'informatica' },
  { label: 'MuleSoft', id: 'mulesoft' },
  { label: 'AI Solutions', id: 'ai-ml' },
  { label: 'DevOps', id: 'devops' },
  { label: 'Pega', id: 'pega' },
  { label: 'Web Development', id: 'web' },
];

const products = ALL_PRODUCTS.map((p) => ({ name: p.name, slug: p.slug }));

const contact = {
  emails: ['career@genufy.in', 'info@genufy.in'],
  phones: ['+91 427-2243334', '+91 81100 33344'],
};

const locations = [
  { city: 'Salem', region: 'Tamil Nadu, India' },
  { city: 'Coimbatore', region: 'Tamil Nadu, India' },
  { city: 'Parsippany', region: 'NJ 07054, USA' },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const GRAD = 'linear-gradient(90deg, #90eb61, #24baac)';

const gradText = {
  background: GRAD,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ─── Animation variants ───────────────────────────────────────────────────────

const colVariant = {
  hidden: { y: 18 },
  show: (i) => ({
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 },
  }),
};

// ─── Micro-components ─────────────────────────────────────────────────────────

function ColLabel({ children }) {
  return (
    <p
      className="mb-5 text-[10px] font-black tracking-[0.4em] uppercase text-lime"
      style={{ textShadow: '0 0 12px rgba(144,235,97,0.4)' }}
    >
      {children}
    </p>
  );
}

function FLink({ href = '#', children }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-0 text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 w-fit"
    >
      {/* sliding accent bar */}
      <span
        className="mr-0 h-px w-0 shrink-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out rounded-full"
        style={{ background: GRAD }}
      />
      <span className="group-hover:translate-x-0 transition-transform duration-300">
        {children}
      </span>
    </a>
  );
}

// Minimal inline SVG icons - no external dependency
const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2.5" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6.29 6.29l1.8-1.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Contact chip component ────────────────────────────────────────────────────

function ContactChip({ href, icon, label }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.15] hover:border-white/30 bg-white/[0.05] hover:bg-white/[0.09] transition-all duration-300"
    >
      <span className="text-white/70 group-hover:text-lime transition-colors duration-300 shrink-0">
        {icon}
      </span>
      <span className="text-[12px] font-medium text-white group-hover:text-white transition-colors duration-300 break-all">
        {label}
      </span>
    </a>
  );
}

// ─── Main footer ───────────────────────────────────────────────────────────────

export default function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        // Starts near-black at the TOP so it blends seamlessly into the deep
        // black section above (no hard "box" seam), then the teal glow rises
        // gently from the lower-center - the same deep-space-with-accents look
        // as the rest of the page rather than a flat green panel.
        background:
          'radial-gradient(85% 75% at 50% 115%, rgba(36,186,172,0.22) 0%, transparent 58%),' +
          'radial-gradient(55% 45% at 12% 80%, rgba(144,235,97,0.10) 0%, transparent 60%),' +
          'linear-gradient(180deg, #04090a 0%, #050e0c 45%, #061310 100%)',
      }}
    >

      {/* ── Dot grid texture ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* ── Ghost wordmark - gradient-filled for a touch more presence ──── */}
      <div
        aria-hidden
        className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ lineHeight: 0.82 }}
      >
        <span
          className="font-brand font-black tracking-tighter block"
          style={{
            fontSize: 'clamp(72px, 16vw, 220px)',
            background: 'linear-gradient(180deg, rgba(144,235,97,0.12), rgba(36,186,172,0.06))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            // Fade the wordmark out toward the bottom so it dissolves into the
            // footer's lower edge - top stays visible, bottom disappears.
            maskImage: 'linear-gradient(180deg, black 25%, transparent 92%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 25%, transparent 92%)',
          }}
        >
          GENUFY
        </span>
      </div>

      {/* ── Soft top accent - fades at the edges so there's no hard box seam ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(36,186,172,0.5) 30%, rgba(144,235,97,0.5) 70%, transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-14">

        {/* ── Brand statement row ────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pt-16 md:pt-20 pb-10 md:pb-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start border-b border-white/[0.12]"
        >
          {/* Left: tagline */}
          <div>
            <h2
              className="font-display font-bold leading-[1.1] tracking-tight text-white"
              style={{
                fontSize: 'clamp(24px, 3.5vw, 48px)',
                maxWidth: '30ch',
                textShadow: '0 2px 30px rgba(0,0,0,0.6)',
              }}
            >
              Powering the next era of{' '}
              <span style={gradText}>intelligent</span>{' '}
              transformation.
            </h2>
            {/* Animated accent line */}
            <motion.div
              className="mt-5 h-px w-20 rounded-full"
              style={{ background: GRAD }}
              animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 1.25, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', transformOrigin: 'left' }}
            />
          </div>

          {/* Right: contact chips */}
          <div className="flex flex-col gap-2.5 lg:pt-2 min-w-0">
            <p
              className="text-[10px] font-black tracking-[0.4em] uppercase mb-1 text-lime"
              style={{ textShadow: '0 0 12px rgba(144,235,97,0.4)' }}
            >
              Get in touch
            </p>
            {contact.emails.map((e) => (
              <ContactChip key={e} href={`mailto:${e}`} icon={<IconMail />} label={e} />
            ))}
            {contact.phones.map((p) => (
              <ContactChip key={p} href={`tel:${p.replace(/[^+\d]/g, '')}`} icon={<IconPhone />} label={p} />
            ))}
          </div>
        </motion.div>

        {/* ── Navigation columns ────────────────────────────────────────── */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10">

          {/* Services */}
          <motion.div
            custom={0}
            variants={colVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <ColLabel>Services</ColLabel>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <FLink href={`/?service=${s.id}#services`}>{s.label}</FLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div
            custom={1}
            variants={colVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <ColLabel>Products</ColLabel>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <FLink href={`/products#${p.slug}`}>{p.name}</FLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Locations */}
          <motion.div
            custom={2}
            variants={colVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <ColLabel>Locations</ColLabel>
            <ul className="space-y-5">
              {locations.map((loc, i) => (
                <li key={loc.city}>
                  <motion.div
                    initial={{ x: -8 }}
                    whileInView={{ x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-start gap-2.5"
                  >
                    <span className="mt-0.5 shrink-0 text-white/60 group-hover:text-lime transition-colors duration-300">
                      <IconPin />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-white group-hover:text-lime transition-colors duration-300 leading-tight">
                        {loc.city}
                      </p>
                      <p className="text-[11px] text-white/75 mt-0.5 leading-snug">
                        {loc.region}
                      </p>
                    </div>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            custom={3}
            variants={colVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <ColLabel>Company</ColLabel>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Careers', href: '#' },
                { label: 'Partners', href: '#' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <FLink href={item.href}>{item.label}</FLink>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider - fades to transparent on the right so it doesn't cut across
            the large GENUFY wordmark in the corner. */}
        <div
          className="h-px w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.12) 28%, transparent 46%)',
          }}
        />

        {/* ── Bottom strip ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <span className="text-[11px] font-medium text-white/70 tracking-wide">
            © {new Date().getFullYear()} Genufy TechWorks. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
