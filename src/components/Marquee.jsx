import { useState } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------
   Trusted Clients — the only data the marquee renders.

   1) Save each logo file in:  public/clients/
   2) Point each entry's `src` at it via an absolute path
      (everything under public/ is served from the site root).

   These are real brand logos (dark marks on light backgrounds), so the
   cards use a light "logo chip" background for legibility. Logos are
   object-contain with padding — never stretched.
------------------------------------------------------------------- */
const CLIENTS = [
  { label: 'WillScot', src: '/clients/Willscot.png' },
  { label: 'AbbVie', src: '/clients/abbvie.jpg' },
  { label: 'Cedars-Sinai', src: '/clients/Cedars.png' },
  { label: 'Enquo', src: '/clients/enquo.jpg' },
];

function ClientLogo({ src, alt = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-sm font-bold tracking-widest text-ink/40 uppercase">
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="max-h-[60px] max-w-[150px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export default function Marquee() {
  // Repeat the client set so the row stays full and loops seamlessly at -50%.
  const loopClients = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section
      className="relative py-16 overflow-hidden border-y border-white/5"
      style={{
        background:
          'linear-gradient(135deg, rgba(144,235,97,0.04) 0%, rgba(36,186,172,0.06) 100%)',
      }}
      aria-label="Trusted Clients"
    >
      {/* Subtle background radial ambient wash */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 blur-3xl z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(36,186,172,0.06) 0%, transparent 65%)'
        }}
      />

      {/* Fade masks for smooth left/right edges */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Integrated title inside the same marquee container */}
      <div className="relative z-10 flex flex-col items-center mb-8 md:mb-10 px-6 text-center">
        <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-gradient-gt drop-shadow-[0_0_30px_rgba(36,186,172,0.25)]">
          Trusted Clients
        </h2>
      </div>

      {/* Infinite scrolling container */}
      <div className="relative z-10 flex w-full">
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {loopClients.map((c, i) => (
            <div
              key={`${c.label}-${i}`}
              className="group flex items-center justify-center shrink-0 h-[100px] w-[200px] px-6 rounded-2xl border border-white/[0.06] backdrop-blur-md transition-all duration-500 hover:border-teal/30 hover:shadow-[0_0_24px_rgba(36,186,172,0.16)] hover:-translate-y-0.5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(144,235,97,0.03) 0%, rgba(36,186,172,0.05) 100%)',
              }}
            >
              <ClientLogo src={c.src} alt={c.label} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
