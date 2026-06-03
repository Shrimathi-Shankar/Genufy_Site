import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition } from '../animations/variants.js';
import SEO from '../components/SEO.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function NotFound() {
  return (
    <motion.div {...pageTransition}>
      <SEO title="404" description="Page not found." path="/404" />
      <section className="section pt-40 text-center">
        <h1 className="h-display text-7xl md:text-9xl gradient-text">404</h1>
        <p className="text-white/70 mt-4">This page drifted into the void.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
      </section>

      <SiteFooter />
    </motion.div>
  );
}
