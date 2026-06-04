'use client';

import { ContactModalProvider } from '../src/contexts/ContactModalContext.jsx';
import useLenis from '../src/hooks/useLenis.js';

/* Client-side app shell: starts Lenis smooth scroll (global) and provides the
   shared contact modal so any trigger opens the same popup. Mounted once in the
   root layout. */
export default function Providers({ children }) {
  useLenis();
  return <ContactModalProvider>{children}</ContactModalProvider>;
}
