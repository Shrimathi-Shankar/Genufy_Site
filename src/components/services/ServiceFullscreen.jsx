import { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import SalesforceExperience from './SalesforceExperience.jsx';
import InformaticaExperience from './InformaticaExperience.jsx';
import SnowflakeExperience from './SnowflakeExperience.jsx';
import AIMLExperience from './AIMLExperience.jsx';
import DevOpsExperience from './DevOpsExperience.jsx';
import MuleSoftExperience from './MuleSoftExperience.jsx';
import PegaExperience from './PegaExperience.jsx';
import WebDevExperience from './WebDevExperience.jsx';
import ServiceExperience from './ServiceExperience.jsx';
import SiteFooter from '../SiteFooter.jsx';

function FloatingGlow({ accent }) {
  const items = [
    { top: '12%', left: '8%', size: 220, dur: 9 },
    { top: '70%', left: '78%', size: 280, dur: 11 },
    { top: '45%', left: '55%', size: 180, dur: 8 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${accent}aa 0%, transparent 70%)`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 14, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function ServiceFullscreen({ service, onClose, idPrefix = 'svc' }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.4 });
  const tx = useTransform(sx, (v) => v * 24);
  const ty = useTransform(sy, (v) => v * 16);

  useEffect(() => {
    const lenis = window.__lenis;
    lenis?.stop?.();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      lenis?.start?.();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const onMouseMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[80] bg-ink overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`svc-h-${service.id}`}
    >
      <motion.div
        layoutId={`${idPrefix}-svc-media-${service.id}`}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <motion.img
          src={service.image}
          alt=""
          aria-hidden
          style={{ x: tx, y: ty, willChange: 'transform' }}
          className="absolute inset-0 h-full w-full object-cover scale-110"
        />
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 70% at 20% 80%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(45% 55% at 80% 20%, ${service.accent}40 0%, transparent 70%)`,
        }}
      />

      <FloatingGlow accent={service.accent} />

      <motion.button
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        onClick={onClose}
        aria-label="Close"
        className="group absolute top-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/40 backdrop-blur-xl text-white/85 hover:bg-black/60 hover:border-white/40 transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="1" y1="1" x2="13" y2="13" />
          <line x1="13" y1="1" x2="1" y2="13" />
        </svg>
      </motion.button>

      <div
        ref={scrollRef}
        data-lenis-prevent
        className="relative z-20 h-full w-full overflow-y-auto overscroll-contain"
      >
        {service.id === 'ai-ml' ? (
          <AIMLExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'salesforce' ? (
          <SalesforceExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'informatica' ? (
          <InformaticaExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'snowflake' ? (
          <SnowflakeExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'devops' ? (
          <DevOpsExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'mulesoft' ? (
          <MuleSoftExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'pega' ? (
          <PegaExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : service.id === 'web' ? (
          <WebDevExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        ) : (
          <ServiceExperience
            service={service}
            onClose={onClose}
            scrollRef={scrollRef}
          />
        )}

        {/* Footer at the bottom of every service page (inside the overlay's
            own scroll area so it shows above the fixed backdrop). */}
        <SiteFooter />
      </div>
    </motion.div>
  );
}
