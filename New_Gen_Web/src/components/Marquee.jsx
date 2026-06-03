import { useState } from 'react';
import { motion } from 'framer-motion';

const SI = (slug, color = 'FFFFFF') => `https://cdn.simpleicons.org/${slug}/${color}`;
const CB = (domain) => `https://logo.clearbit.com/${domain}`;

const PARTNERS = [
  { label: 'Salesforce', sources: [SI('salesforce', '00A1E0'), CB('salesforce.com')] },
  { label: 'MuleSoft', sources: [SI('mulesoft', '00A0DF'), CB('mulesoft.com')] },
  { label: 'Snowflake', sources: [SI('snowflake', '29B5E8'), CB('snowflake.com')] },
  { label: 'Informatica', sources: [SI('informatica', 'F36523'), CB('informatica.com')] },
  { label: 'Pega', sources: [SI('pega', '0070F2'), CB('pega.com')] },
  { label: 'AWS', sources: [SI('amazonwebservices', 'FF9900'), CB('aws.amazon.com'), CB('amazon.com')] },
  { label: 'Azure', sources: [SI('microsoftazure', '0078D4'), CB('azure.microsoft.com'), CB('microsoft.com')] },
  { label: 'Google Cloud', sources: [SI('googlecloud', '4285F4'), CB('cloud.google.com'), CB('google.com')] },
  { label: 'OpenAI', sources: [SI('openai', '74AA9C'), CB('openai.com')] },
];

function PartnerLogo({ sources = [], alt = '' }) {
  const [idx, setIdx] = useState(0);

  if (idx >= sources.length) {
    const initials = (alt || '?')
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return (
      <span className="text-sm font-bold tracking-widest text-white/50 uppercase">
        {initials}
      </span>
    );
  }

  return (
    <img
      src={sources[idx]}
      alt={alt}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className="h-10 w-auto max-w-[120px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 filter brightness-100"
    />
  );
}

export default function Marquee() {
  const doubledPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="relative py-16 overflow-hidden bg-[#020406]/60 border-y border-white/5" aria-label="Trusted Partners">
      {/* Subtle background radial ambient wash */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 blur-3xl z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(36,186,172,0.08) 0%, transparent 65%)'
        }}
      />

      {/* Fade masks for smooth left/right edges */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Integrated Header label inside the same container */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase text-white/40">
          Trusted Partners
        </span>
      </div>

      {/* Infinite scrolling container */}
      <div className="relative z-10 flex w-full">
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {doubledPartners.map((p, i) => (
            <div
              key={`${p.label}-${i}`}
              className="group flex items-center justify-center shrink-0 h-[100px] w-[200px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:border-teal/30 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(36,186,172,0.15)]"
            >
              <PartnerLogo sources={p.sources} alt={p.label} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
