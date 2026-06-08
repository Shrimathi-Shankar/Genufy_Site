'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { m as motion } from 'framer-motion';
import { useContactModal } from '../contexts/ContactModalContext.jsx';

const links = ['Services', 'Products', 'Insights'];

function scrollToHash(hash) {
  const id = hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (!el) return;

  const headerH =
    document.querySelector('header[data-site-header]')?.getBoundingClientRect().height || 0;
  const easing = (t) => 1 - Math.pow(1 - t, 4);
  const lenis = window.__lenis;

  // Single, fast, locked pass straight to the target. Passing the element lets
  // Lenis read its live position at scroll time (accurate across the pinned
  // sections above) and `lock` blocks any interruption mid-flight - no
  // intermediate stop and no delayed re-correction, so it never pauses on the
  // way (e.g. at Manifesto).
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, {
      offset: -(headerH + 12),
      duration: 0.9,
      easing,
      lock: true,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function Logo() {
  return (
    <motion.a
      href="/"
      aria-label="Genufy TechWorks - Home"
      className="group relative flex items-center pl-1"
      initial={{ opacity: 0, x: -8, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src="/logo.png"
        alt="Genufy TechWorks"
        width={905}
        height={276}
        draggable={false}
        decoding="async"
        fetchPriority="high"
        className="h-9 md:h-10 w-auto select-none transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </motion.a>
  );
}

function NavLinkItem({ label, hash, i, isActive, onClick }) {
  return (
    <motion.a
      href={hash}
      onClick={(e) => {
        e.preventDefault();
        onClick(hash);
      }}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative px-4 py-2 text-sm font-medium tracking-tight rounded-full transition-colors duration-300 ${
        isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-gray-900/[0.07] border border-gray-900/10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative">{label}</span>
    </motion.a>
  );
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const headerRef = useRef(null);
  const lastY = useRef(0);
  const router = useRouter();
  const { openContact } = useContactModal();

  useEffect(() => {
    const onScroll = (e) => {
      // Read the scroll position from whatever element actually scrolled - the
      // window on normal pages, or an inner container (e.g. the fullscreen
      // service overlay) when that scrolls instead.
      const t = e?.target;
      const y = t instanceof HTMLElement ? t.scrollTop : window.scrollY;
      if (y > 80 && y > lastY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    // Capture phase catches scroll events from nested scroll containers too
    // (scroll doesn't bubble), so the navbar hides on the service pages as well.
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.toLowerCase());
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;
    const headerH = headerRef.current?.getBoundingClientRect().height || 80;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      {
        rootMargin: `-${headerH + 20}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.4, 0.7, 1],
      }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // On mount: if we arrived with a hash (e.g. navigated from another page via
  // "/#services"), scroll to that section once content + Lenis are ready.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => {
      scrollToHash(hash);
      if (hash === '#services' && window.history?.replaceState) {
        window.history.replaceState(null, '', '/services');
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleNav = (hash) => {
    setOpen(false);
    const id = hash.replace(/^#/, '');
    if (id === 'services') {
      // Stay on the landing page: scroll to the section and reflect /services
      // in the URL (no route change). If the section is not on this page, go
      // home and the on-mount handler scrolls there.
      if (document.getElementById('services')) {
        scrollToHash('#services');
        if (window.history?.replaceState) {
          window.history.replaceState(null, '', '/services');
        }
      } else {
        router.push('/#services');
      }
      return;
    }
    if (id === 'products') {
      router.push('/products');
      return;
    }
    if (id === 'insights') {
      router.push('/insights');
      return;
    }
    // If the target section is on the current page, smooth-scroll to it directly
    // (don't rely on pathname - works on home and any page that has the section).
    if (document.getElementById(id)) {
      scrollToHash(hash);
      if (window.history?.replaceState) window.history.replaceState(null, '', hash);
      return;
    }
    // Otherwise go home to that section; the on-mount handler scrolls after load.
    router.push('/' + hash);
  };

  return (
    <motion.header
      ref={headerRef}
      data-site-header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6 flex justify-center"
    >
      <div className="w-full max-w-5xl">
        <nav className="pointer-events-auto flex items-center justify-between rounded-full px-3 py-2 bg-white border border-gray-200/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]">
          {/* Logo - sits naturally on the white nav */}
          <Logo />

          {/* Nav links */}
          <div className="flex-1 flex justify-center md:pl-8 lg:pl-12">
            <div className="hidden md:flex items-center gap-1">
              {links.map((l, i) => {
                const hash = `#${l.toLowerCase()}`;
                return (
                  <NavLinkItem
                    key={l}
                    label={l}
                    hash={hash}
                    i={i}
                    isActive={activeHash === hash}
                    onClick={handleNav}
                  />
                );
              })}
            </div>
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={openContact}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 rounded-full pl-4 pr-3 md:pl-5 md:pr-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
              style={{
                background: '#90eb61',
                boxShadow: '0 4px 18px -6px rgba(144,235,97,0.5)',
              }}
            >
              <span className="relative">Contact Us</span>
              <span
                aria-hidden
                className="relative grid h-5 w-5 place-items-center rounded-full bg-black/75 text-white text-[10px] transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </motion.button>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-full bg-transparent transition hover:bg-gray-900/[0.06]"
            >
              <span
                className={`block h-[1.5px] w-4 bg-gray-700 transition ${open ? 'translate-y-[3px] rotate-45' : ''}`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-gray-700 mt-1 transition ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto md:hidden mt-2 rounded-3xl border border-gray-200/70 bg-white/95 backdrop-blur-2xl p-3 flex flex-col shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)]"
          >
            {links.map((l) => {
              const hash = `#${l.toLowerCase()}`;
              return (
                <a
                  key={l}
                  href={hash}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(hash);
                  }}
                  className="px-4 py-3 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-900/[0.05] transition"
                >
                  {l}
                </a>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
