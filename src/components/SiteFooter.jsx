import { m as motion } from 'framer-motion';
import { products as ALL_PRODUCTS } from '../views/products/productData.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

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

function FLink({ href = '#', children, isLight }) {
  return (
    <a
      href={href}
      className={`group flex items-center gap-0 text-[13px] font-medium transition-colors duration-300 w-fit ${isLight ? 'text-slate-700 hover:text-slate-900' : 'text-white/90 hover:text-white'}`}
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

const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z" />
  </svg>
);

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const IconTwitter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.9 2H22l-7.2 8.24L23.2 22h-6.7l-5.24-6.86L5.2 22H2.08l7.7-8.8L1 2h6.86l4.74 6.27L18.9 2zm-1.18 18.2h1.86L7.36 3.7H5.36l12.36 16.5z" />
  </svg>
);

const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/genufy/posts/?feedView=all', icon: <IconLinkedIn /> },
  { label: 'Instagram', href: 'https://www.instagram.com/genufy_techworks/?hl=en', icon: <IconInstagram /> },
  { label: 'Twitter / X', href: 'https://x.com/GenufyTW?lang=bn', icon: <IconTwitter /> },
  { label: 'Facebook', href: 'https://www.facebook.com/p/Genufy-TechWorks-61566770444657/', icon: <IconFacebook /> },
];

// ─── Contact chip component ────────────────────────────────────────────────────

function ContactChip({ href, icon, label }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <a
      href={href}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${isLight ? 'bg-white hover:bg-[#f2faf8]' : 'border-white/[0.15] hover:border-white/30 bg-white/[0.05] hover:bg-white/[0.09]'}`}
      style={isLight ? { borderColor: 'rgba(36,186,172,0.20)', boxShadow: '0 1px 4px rgba(36,186,172,0.08)' } : undefined}
    >
      <span className={`group-hover:text-lime transition-colors duration-300 shrink-0 ${isLight ? 'text-[#24baac]' : 'text-white/70'}`}>
        {icon}
      </span>
      <span className={`text-[12px] font-medium transition-colors duration-300 break-all ${isLight ? 'text-slate-800 group-hover:text-slate-900' : 'text-white group-hover:text-white'}`}>
        {label}
      </span>
    </a>
  );
}

// ─── Main footer ───────────────────────────────────────────────────────────────

export default function SiteFooter() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <footer
      className="cv-section relative overflow-hidden"
      style={{ background: 'var(--c-bg-footer)' }}
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
            // Light theme: dark slate fill so the wordmark reads with real contrast
            // on the mint footer. Dark theme: brighter lime/teal ghost so it stays
            // clearly visible against the near-black background.
            background: isLight
              ? 'linear-gradient(180deg, rgba(15,23,42,0.45), rgba(15,23,42,0.18))'
              : 'linear-gradient(180deg, rgba(144,235,97,0.32), rgba(36,186,172,0.16))',
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


      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-14">

        {/* ── Brand statement row ────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`pt-16 md:pt-20 pb-10 md:pb-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start border-b ${isLight ? 'border-[#c8e8e3]' : 'border-white/[0.12]'}`}
        >
          {/* Left: tagline */}
          <div>
            <h2
              className={`font-display font-bold leading-[1.1] tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{
                fontSize: 'clamp(24px, 3.5vw, 48px)',
                maxWidth: '30ch',
                // No shadow in the white theme (the dark blur looked muddy on the
                // mint bg); keep the subtle lift only for the dark theme.
                textShadow: isLight ? 'none' : '0 2px 30px rgba(0,0,0,0.6)',
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
                  <FLink href={`/services/${s.id}`} isLight={isLight}>{s.label}</FLink>
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
                  <FLink href={`/products#${p.slug}`} isLight={isLight}>{p.name}</FLink>
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
                    <span className={`mt-0.5 shrink-0 group-hover:text-lime transition-colors duration-300 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                      <IconPin />
                    </span>
                    <div>
                      <p className={`text-[13px] font-semibold group-hover:text-lime transition-colors duration-300 leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        {loc.city}
                      </p>
                      <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600' : 'text-white/75'}`}>
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
                { label: 'About Us', href: '/about-us' },
                { label: 'Careers', href: '/careers' },
              ].map((item) => (
                <li key={item.label}>
                  <FLink href={item.href} isLight={isLight}>{item.label}</FLink>
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
          <span className={`text-[11px] font-medium tracking-wide ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            © {new Date().getFullYear()} Genufy TechWorks. All rights reserved.
          </span>

          {/* Social links - commented out for now, re-enable when needed
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`group flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${isLight ? 'border-[rgba(36,186,172,0.20)] bg-white text-[#24baac] hover:bg-[#f2faf8]' : 'border-white/[0.15] bg-white/[0.05] text-white/70 hover:border-white/30 hover:bg-white/[0.09] hover:text-lime'}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
          */}
        </div>

      </div>
    </footer>
  );
}
