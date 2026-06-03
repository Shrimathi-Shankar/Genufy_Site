import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton.jsx';
import { cn } from '../utils/cn.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-4 inset-x-0 z-50 mx-auto max-w-7xl px-4',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500',
          scrolled ? 'glass-strong' : 'glass'
        )}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-accent2 shadow-[0_0_25px_rgba(124,92,255,0.55)]" />
          <span className="h-display text-lg tracking-tight">
            New<span className="gradient-text">Gen</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-sm rounded-full transition',
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton className="btn-primary text-sm py-2 px-5">Get Started</MagneticButton>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-white/10"
        >
          <span className={cn('block h-[1.5px] w-4 bg-white transition', open && 'translate-y-[3px] rotate-45')} />
          <span className={cn('block h-[1.5px] w-4 bg-white mt-1 transition', open && '-translate-y-[3px] -rotate-45')} />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass mt-2 rounded-2xl p-4 flex flex-col gap-2"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn('px-4 py-2 rounded-xl text-sm', isActive ? 'bg-white/10 text-white' : 'text-white/70')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
