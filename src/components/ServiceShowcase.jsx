import { useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { SERVICES } from './services/serviceData.js';
import ServiceFullscreen from './services/ServiceFullscreen.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const PREFIX = 'grid';

function ServiceCard({ service, onSelect, isLight }) {
  return (
    <motion.article
      layout
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(service);
        }
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-3xl focus:outline-none transition-shadow duration-300 ${
        isLight
          ? 'border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(14,20,48,0.08),0_8px_28px_-8px_rgba(14,20,48,0.10)] hover:border-teal-200/70 hover:shadow-[0_4px_20px_-4px_rgba(14,20,48,0.12),0_12px_36px_-8px_rgba(36,186,172,0.14)] focus:ring-2 focus:ring-teal-400/30'
          : 'border border-white/10 bg-white/[0.025] focus:ring-2 focus:ring-white/30'
      }`}
      style={{ willChange: 'transform' }}
    >
      <motion.div
        layoutId={`${PREFIX}-svc-media-${service.id}`}
        className="absolute inset-0"
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={service.image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.18]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)',
          }}
        />
        <div
          aria-hidden
          className={`absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-90 ${isLight ? 'mix-blend-multiply' : 'mix-blend-screen'}`}
          style={{
            background: `radial-gradient(80% 60% at 0% 100%, ${service.accent}33, transparent 70%)`,
          }}
        />
      </motion.div>

      <div className="relative h-full w-full p-7 md:p-8 flex flex-col justify-between">
        <motion.div
          layoutId={`${PREFIX}-svc-meta-${service.id}`}
          className="flex items-center justify-between text-[10px] tracking-[0.45em] uppercase text-white/65"
        >
          <span>{service.code}</span>
          <span>{service.tag}</span>
        </motion.div>

        <div>
          <motion.h3
            layoutId={`${PREFIX}-svc-title-${service.id}`}
            className="font-display text-3xl md:text-4xl leading-[1.05] tracking-tight text-white"
          >
            {service.title}
          </motion.h3>
          <p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">
            {service.body}
          </p>
          <div className="mt-5 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white/70">
            <span
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:border-white/60 group-hover:rotate-[-25deg]"
              aria-hidden
            >
              →
            </span>
            <span className="transition-colors group-hover:text-white">Open</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ServiceShowcase() {
  const [selected, setSelected] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section id="services" className="relative px-6 md:px-12 py-32 md:py-40">
      <div className="max-w-7xl mx-auto">
        <div className={`flex items-center gap-3 mb-8 text-[10px] tracking-[0.45em] uppercase ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
          <span className={`h-px w-10 ${isLight ? 'bg-slate-300' : 'bg-white/30'}`} />
          Services · 03
        </div>
        <h2 className={`font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] max-w-4xl ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Six disciplines.{' '}
          <span className="text-gradient-gt">One operating system</span> for ambition.
        </h2>
        <motion.div
          layout
          className="mt-10 md:mt-12 grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} onSelect={setSelected} isLight={isLight} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <ServiceFullscreen
            key={selected.id}
            service={selected}
            onClose={() => setSelected(null)}
            idPrefix={PREFIX}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
