import { motion } from 'framer-motion';
import { products as ALL_PRODUCTS } from '../pages/products/productData.js';

const services = [
  'Salesforce',
  'Snowflake',
  'Informatica',
  'MuleSoft',
  'AI Solutions',
  'DevOps',
  'Pega',
  'Web Development',
];

/* Products dynamically sourced from the Products page so the footer stays
   in sync as new products are added/removed. */
const products = ALL_PRODUCTS.map((p) => ({ name: p.name, slug: p.slug }));

const emails = ['career@genufy.in', 'info@genufy.in'];
const phones = ['+91 427-2243334', '+91 81100 33344'];
const locations = [
  'Salem, Tamil Nadu, India',
  'Coimbatore, Tamil Nadu, India',
  'Parsippany, NJ 07054, USA',
];

/* Entry animation — only translates vertically. We deliberately keep opacity
   at 1 in both states so footer content is never rendered faded, even if the
   whileInView intersection misfires or the user lands directly inside the
   footer (no fade-in race). */
const enter = {
  hidden: { y: 18, opacity: 1 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* Premium enterprise gradient — Salesforce Blue → Purple → Cyan */
/* Same gradient used on the "Salesforce Partner" heading — keeps the footer
   visually aligned with the rest of the site's brand accents. */
const HEADING_GRADIENT = 'linear-gradient(90deg,#90eb61,#24baac)';

const headingStyle = {
  background: HEADING_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

function ColumnTitle({ children, size = 'md' }) {
  const cls =
    size === 'sm'
      ? 'text-[11px] tracking-[0.3em] uppercase mb-1.5 font-bold'
      : 'text-[11px] tracking-[0.4em] uppercase mb-3.5 font-bold';
  return (
    <div className={cls} style={headingStyle}>
      {children}
    </div>
  );
}

function FooterLink({ href = '#', children, className = '' }) {
  return (
    <a
      href={href}
      className={`footer-link relative inline-block text-sm font-semibold text-white hover:text-white transition ${className}`}
      style={{ color: '#FFFFFF' }}
    >
      {children}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="relative overflow-hidden isolate"
      style={{
        background: '#000000',
        boxShadow: '0 -20px 80px rgba(0,0,0,0.95)',
      }}
    >
      {/* Content surface kept transparent so the footer's strong background shows
          through uniformly (stacking opaque layers would raise it back to ~100%). */}
      <div className="relative" style={{ background: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-12 md:py-14 lg:py-16">
          {/* 5-column grid on lg, 2-row stack on md, single column on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-8 md:gap-y-10">
            {/* === Company === */}
            <motion.div variants={enter} className="col-span-2 md:col-span-12 lg:col-span-3">
              <ColumnTitle>Company</ColumnTitle>
              <a href="/" className="inline-flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Genufy"
                  className="h-10 md:h-11 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 0 14px rgba(0,161,224,0.30))' }}
                />
              </a>
              <p className="mt-3 text-sm font-semibold text-white max-w-xs leading-relaxed" style={{ color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.25)' }}>
                Powering the next era of intelligent transformation — Salesforce expertise, AI automation, and enterprise-grade engineering for ambitious teams.
              </p>
              <motion.div
                className="mt-4 h-px w-24 rounded-full"
                style={{ background: HEADING_GRADIENT }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* === Services === */}
            <motion.div variants={enter} className="col-span-2 md:col-span-4 lg:col-span-2">
              <ColumnTitle>Services</ColumnTitle>
              <ul className="space-y-2">
                {services.map((s) => (
                  <li key={s}><FooterLink>{s}</FooterLink></li>
                ))}
              </ul>
            </motion.div>

            {/* === Products (dynamic) === */}
            <motion.div variants={enter} className="col-span-2 md:col-span-4 lg:col-span-2">
              <ColumnTitle>Products</ColumnTitle>
              <ul className="space-y-2">
                {products.map((p) => (
                  <li key={p.slug}>
                    <FooterLink href={`/products#${p.slug}`}>{p.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* === Contact === */}
            <motion.div variants={enter} className="col-span-1 md:col-span-4 lg:col-span-3">
              <ColumnTitle>Contact</ColumnTitle>
              <div className="space-y-3 text-sm">
                <div>
                  <ColumnTitle size="sm">Email</ColumnTitle>
                  <ul className="space-y-1.5">
                    {emails.map((e) => (
                      <li key={e}>
                        <FooterLink href={`mailto:${e}`} className="break-all">{e}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <ColumnTitle size="sm">Phone</ColumnTitle>
                  <ul className="space-y-1.5">
                    {phones.map((p) => (
                      <li key={p}>
                        <FooterLink href={`tel:${p.replace(/[^+\d]/g, '')}`}>{p}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* === Locations === */}
            <motion.div variants={enter} className="col-span-1 md:col-span-12 lg:col-span-2">
              <ColumnTitle>Locations</ColumnTitle>
              <ul className="space-y-2 text-sm font-semibold text-white" style={{ color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.25)' }}>
                {locations.map((loc) => (
                  <li key={loc} className="flex items-start gap-2 leading-relaxed group">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150"
                      style={{
                        background: HEADING_GRADIENT,
                        boxShadow: '0 0 8px rgba(124,58,237,0.55)',
                      }}
                    />
                    {loc}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t " style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: 'transparent',
        }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-white" style={{ color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.25)' }}>
            <span>© {new Date().getFullYear()} Genufy TechWorks. All rights reserved.</span>
            {/* <span className="tracking-[0.3em] uppercase">Engineered with motion</span> */}
          </div>
        </div>
      </div>


    </motion.footer>
  );
}
