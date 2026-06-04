'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { pageTransition } from '../src/animations/variants.js';
import SiteFooter from '../src/components/SiteFooter.jsx';

export default function NotFound() {
  return (
    <motion.div {...pageTransition}>
      <section className="section pt-40 text-center">
        <h1 className="h-display text-7xl md:text-9xl gradient-text">404</h1>
        <p className="text-white/70 mt-4">This page drifted into the void.</p>
        <Link href="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
      </section>

      <SiteFooter />
    </motion.div>
  );
}
