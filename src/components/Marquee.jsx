import { useState } from 'react';
import { CLIENTS } from './clientsManifest.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

/* ------------------------------------------------------------------
   Trusted Clients - fully dynamic.

   CLIENTS is generated from public/clients/ by scripts/gen-clients.mjs,
   which runs automatically before `dev` and `build`. There is NO hardcoded
   list: drop a new logo into that folder (png/jpg/jpeg/webp/svg/avif) and it
   appears here automatically - name and order derived from the filename.
------------------------------------------------------------------- */

/* Scroll speed scales with how many logos there are, so the pace stays
   comfortable whether there are 4 logos or 40. */
const SCROLL_DURATION = Math.max(24, CLIENTS.length * 2.6);

function ClientLogo({ src, alt = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-xs font-bold tracking-widest text-ink/50 uppercase text-center px-2">
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={150}
      height={56}
      onError={() => setFailed(true)}
      className="max-h-[56px] max-w-[150px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export default function Marquee() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  // Duplicate the set once so the -50% animation loops seamlessly.
  const loopClients = [...CLIENTS, ...CLIENTS];

  return (
    <section
      className="cv-section relative py-16 overflow-hidden border-y border-white/5"
      style={isLight ? {
        background: '#f2faf8',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderColor: 'rgba(36,186,172,0.15)',
      } : {
        background: 'linear-gradient(135deg, rgba(144,235,97,0.04) 0%, rgba(36,186,172,0.06) 100%)',
      }}
      aria-label="Trusted Clients"
    >
      {/* Subtle background radial ambient wash */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 blur-3xl z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(36,186,172,0.06) 0%, transparent 65%)',
        }}
      />

      {/* Fade masks for smooth left/right edges */}
      <div
        className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-48 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, var(--c-bg), transparent)` }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-48 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, var(--c-bg), transparent)` }}
      />

      {/* Integrated title inside the same marquee container */}
      <div className="relative z-10 flex flex-col items-center mb-8 md:mb-10 px-6 text-center">
        <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-gradient-gt drop-shadow-[0_0_30px_rgba(36,186,172,0.25)]">
          Trusted Clients
        </h2>
      </div>

      {/* Infinite auto-scrolling marquee */}
      <div className="relative z-10 flex w-full">
        <div
          className="flex gap-4 sm:gap-6 whitespace-nowrap"
          style={{ animation: `marquee-scroll ${SCROLL_DURATION}s linear infinite`, willChange: 'transform' }}
        >
          {loopClients.map((c, i) => (
            <div
              key={`${c.label}-${i}`}
              className="group flex items-center justify-center shrink-0 h-[88px] w-[170px] sm:h-[100px] sm:w-[200px] px-5 sm:px-6 rounded-2xl border border-white/10 bg-white/95 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-white hover:border-teal/40 hover:shadow-[0_0_26px_rgba(36,186,172,0.28)] hover:-translate-y-0.5"
            >
              <ClientLogo src={c.src} alt={c.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
