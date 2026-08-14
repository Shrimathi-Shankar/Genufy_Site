import { m as motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          className="h-16 w-16 rounded-full border-2 border-white/10 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
