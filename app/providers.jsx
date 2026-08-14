'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import { ContactModalProvider } from '../src/contexts/ContactModalContext.jsx';
import { ThemeProvider } from '../src/contexts/ThemeContext.jsx';
import useLenis from '../src/hooks/useLenis.js';

/* Framer Motion features are loaded lazily (after hydration) and code-split into
   their own chunk, so the heavy projection/animation runtime stays out of the
   initial bundle. Every component imports the lightweight `m` component aliased
   as `motion`, so usage is unchanged. */
const loadMotionFeatures = () =>
  import('./motion-features.js').then((mod) => mod.default);

/* Client-side app shell: starts Lenis smooth scroll (global) and provides the
   shared contact modal so any trigger opens the same popup. Mounted once in the
   root layout. */
export default function Providers({ children }) {
  useLenis();
  return (
    <LazyMotion features={loadMotionFeatures}>
      {/* reducedMotion="user" makes every motion component honor the OS
          "reduce motion" setting (transforms/layout animations are skipped). */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </ThemeProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
