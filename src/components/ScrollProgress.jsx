import { m as motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX: x, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
      aria-hidden
    >
      <div
        className="h-full w-full"
        style={{ background: 'linear-gradient(90deg,#90eb61,#24baac)' }}
      />
    </motion.div>
  );
}
