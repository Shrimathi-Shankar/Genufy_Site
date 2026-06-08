import { useScroll, useTransform, m as motion } from 'framer-motion';
import { useRef } from 'react';
import Particles from './Particles.jsx';

export default function ParallaxStage() {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const yFar = useTransform(scrollY, [0, 800], [0, -60]);
  const yMid = useTransform(scrollY, [0, 800], [0, -150]);
  const yNear = useTransform(scrollY, [0, 800], [0, -260]);
  const rot = useTransform(scrollY, [0, 1200], [0, 25]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.55]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="fixed inset-0 -z-10 overflow-hidden bg-ink"
      aria-hidden="true"
    >
      {/* Base radial wash */}
      <motion.div
        style={{ y: yFar }}
        className="layer absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 30%, rgba(36,186,172,0.18) 0%, rgba(0,0,0,0) 65%), radial-gradient(40% 35% at 70% 70%, rgba(144,235,97,0.14) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      </motion.div>

      {/* Grid */}
      <motion.div style={{ y: yMid }} className="layer absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Glow orbs */}
      <motion.div style={{ y: yMid, rotate: rot }} className="layer absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-[120px] opacity-50"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 60%)' }} />
        <div className="absolute bottom-[-180px] right-[-120px] w-[600px] h-[600px] rounded-full blur-[140px] opacity-45"
          style={{ background: 'radial-gradient(circle, #90eb61 0%, transparent 60%)' }} />
        <div className="absolute top-[40%] left-[55%] w-[380px] h-[380px] rounded-full blur-[120px] opacity-30 animate-hueGlow"
          style={{ background: 'radial-gradient(circle, #24baac 0%, transparent 65%)' }} />
      </motion.div>

      {/* Concentric rings */}
      <motion.div style={{ y: yNear }} className="layer absolute inset-0 flex items-center justify-center">
        <div className="relative animate-spinSlow">
          {[420, 600, 820, 1080].map((s, i) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s, height: s,
                top: -s / 2, left: -s / 2,
                borderColor: i % 2 ? 'rgba(144,235,97,0.10)' : 'rgba(36,186,172,0.10)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Scan line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-40 animate-scan"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(144,235,97,0.06), transparent)' }}
        />
      </div>

      {/* Particles */}
      <motion.div style={{ y: yNear }} className="layer absolute inset-0">
        <Particles density={70} />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)' }}
      />
    </motion.div>
  );
}
