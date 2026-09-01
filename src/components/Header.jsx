'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useContactModal } from '../contexts/ContactModalContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

/* ── Social icons ──────────────────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
/* Direct WhatsApp chat link - replaces the old multi-platform social popover.
   Uses the same phone number shown in the contact section (+91 81100 33444). */
const WHATSAPP_HREF = 'https://wa.me/918110033344';

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-8 w-8 rounded-full grid place-items-center border transition-colors duration-200"
      style={{
        background: hovered ? '#25D366' : 'rgba(37,211,102,0.12)',
        borderColor: 'rgba(37,211,102,0.35)',
        color: hovered ? '#ffffff' : '#25D366',
        filter: hovered ? 'drop-shadow(0 0 8px rgba(37,211,102,0.45))' : 'none',
      }}
    >
      <WhatsAppIcon />
    </motion.a>
  );
}

const INSIGHTS_ITEMS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.7"/>
        <rect x="2" y="6.5" width="9" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="10" width="10.5" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="13.5" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
    label: 'Blog',
    href: '/insights',
    gradient: 'linear-gradient(135deg, #90eb61, #24baac)',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="9" width="2.5" height="5" rx="0.75" fill="currentColor" opacity="0.4"/>
        <rect x="6" y="5.5" width="2.5" height="8.5" rx="0.75" fill="currentColor" opacity="0.6"/>
        <rect x="10" y="2" width="2.5" height="12" rx="0.75" fill="currentColor" opacity="0.8"/>
        <path d="M2 8 L6.5 5 L10.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      </svg>
    ),
    label: 'Case Studies',
    href: '/case-studies',
    gradient: 'linear-gradient(135deg, #24baac, #818cf8)',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 1.5 L9.5 5.5 L13.5 5.5 L10.5 8 L11.5 12 L8 9.5 L4.5 12 L5.5 8 L2.5 5.5 L6.5 5.5 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" opacity="0.85"/>
      </svg>
    ),
    label: 'Success Stories',
    href: '/insights',
    gradient: 'linear-gradient(135deg, #818cf8, #c084fc)',
  },
];

// Hash-based links scroll to homepage sections; path-based links navigate directly.
const links = [
  { label: 'Services',  hash: '#services',  route: '/services'  },
  { label: 'Products',  hash: '#products',  route: '/products'  },
  { label: 'Insights',  hash: '#insights',  route: '/insights'  },
];

function scrollToHash(hash) {
  const id = hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (!el) return;

  const headerH =
    document.querySelector('header[data-site-header]')?.getBoundingClientRect().height || 0;
  const easing = (t) => 1 - Math.pow(1 - t, 4);
  const lenis = window.__lenis;

  // The services section is sticky-pinned and its own top padding already clears
  // the fixed nav, so land it near the very top with only a small gap. Using the
  // full -(headerH + 12) offset there double-counted the nav clearance and left
  // a large empty gap above the heading. Other sections keep the nav offset.
  const offset = id === 'services' ? -8 : -(headerH + 12);

  // Single, fast, locked pass straight to the target. Passing the element lets
  // Lenis read its live position at scroll time (accurate across the pinned
  // sections above) and `lock` blocks any interruption mid-flight - no
  // intermediate stop and no delayed re-correction, so it never pauses on the
  // way (e.g. at Manifesto).
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, {
      offset,
      duration: 0.9,
      easing,
      lock: true,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
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
        src="/logo.webp"
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

function MobileInsightsAccordion({ onNavigate, router }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-900/[0.05] transition"
      >
        <span>Insights</span>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className="opacity-40"
          aria-hidden
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-1 flex flex-col gap-0.5">
              {INSIGHTS_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => { onNavigate(); router.push(item.href); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-900/[0.05] transition text-left"
                >
                  <span className="h-6 w-6 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightsDropdown({ i, isActive, onNavigate }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const router = useRouter();

  const openMenu  = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpen(false), 140); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      {/* Trigger button */}
      <motion.button
        type="button"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-tight rounded-full transition-colors duration-300 ${
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
        <span>Insights</span>
        {/* Caret — rotates when open */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className="opacity-45 mt-px"
          aria-hidden
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            role="menu"
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-50"
            style={{
              borderRadius: 16,
              background: 'var(--c-dropdown-bg)',
              border: '1px solid var(--c-dropdown-border)',
              boxShadow: 'var(--c-dropdown-shadow)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Top shimmer line */}
            <div
              aria-hidden
              className="absolute top-0 inset-x-4 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)' }}
            />

            <div className="p-2">
              {INSIGHTS_ITEMS.map((item) => (
                <button
                  key={item.label}
                  role="menuitem"
                  onClick={() => { setOpen(false); router.push(item.href); onNavigate(); }}
                  className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--c-dropdown-item-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onFocus={e => e.currentTarget.style.background = 'var(--c-dropdown-item-hover)'}
                  onBlur={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Gradient icon tile */}
                  <span
                    className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center"
                    style={{ background: item.gradient, color: '#000', opacity: 0.9 }}
                  >
                    {item.icon}
                  </span>
                  {/* Gradient label */}
                  <span
                    className="text-[13px] font-semibold leading-tight"
                    style={{
                      backgroundImage: item.gradient,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Bottom accent */}
            <div
              aria-hidden
              className="mx-3 mb-2.5 mt-0.5 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(144,235,97,0.15), rgba(36,186,172,0.15), transparent)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLinkItem({ label, hash, i, isActive, onClick }) {
  return (
    <motion.a
      href={hash}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative px-4 py-2 text-sm font-medium tracking-tight rounded-full transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
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

function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  if (!mounted) return <div className="h-8 w-8" aria-hidden />;
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="h-8 w-8 rounded-full grid place-items-center bg-gray-100 hover:bg-gray-200 border border-gray-200/80 transition-colors duration-200 text-gray-600 hover:text-gray-900"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -25, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 25, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const headerRef = useRef(null);
  const lastY = useRef(0);
  const rafId = useRef(null);
  const router = useRouter();
  const { openContact } = useContactModal();

  // Close mobile menu when user clicks/taps outside the header
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = (e) => {
      // Skip if a frame is already queued — fires at most once per rAF tick.
      if (rafId.current) return;
      const t = e?.target;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const y = t instanceof HTMLElement ? t.scrollTop : window.scrollY;
        const shouldHide = y > 80 && y > lastY.current;
        setHidden((prev) => (prev === shouldHide ? prev : shouldHide));
        lastY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const ids = links.filter((l) => l.hash).map((l) => l.hash.replace(/^#/, ''));
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

  // On mount: if the URL has a hash (e.g. someone typed /#services directly),
  // scroll to that section once content + Lenis are ready. Retries until the
  // element exists (handles lazy-loaded sections).
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace(/^#/, '');
    let timer;
    let attempts = 0;
    const tryScroll = () => {
      if (document.getElementById(id)) { scrollToHash(hash); return; }
      if (++attempts < 20) timer = setTimeout(tryScroll, 150);
    };
    timer = setTimeout(tryScroll, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = (item) => {
    setOpen(false);
    // Path-only links (About Us, Careers) — navigate directly.
    if (!item.hash) {
      router.push(item.route);
      return;
    }
    const id = item.hash.replace(/^#/, '');
    if (id === 'services') {
      if (document.getElementById('services')) {
        // Element in DOM: smooth-scroll to it directly (user is on home and has
        // scrolled far enough that HorizontalCapabilities has already mounted).
        scrollToHash('#services');
      } else if (typeof window.__loadServicesSection === 'function') {
        // On home page but HorizontalCapabilities not mounted yet (user is near
        // the top). Force-mount it, then poll until #services is in the DOM.
        window.__loadServicesSection();
        let n = 0;
        const poll = () => {
          const el = document.getElementById('services');
          if (el) { scrollToHash('#services'); return; }
          if (++n < 25) setTimeout(poll, 150);
        };
        setTimeout(poll, 100);
      } else {
        // On a different page: navigate to /services which renders the full home
        // view with intentSection="services" — HorizontalCapabilities force-mounts
        // and the mount effect scrolls to #services once the dynamic import resolves.
        router.push('/services');
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
    // If the target section is on the current page, smooth-scroll to it directly.
    if (document.getElementById(id)) {
      scrollToHash(item.hash);
      return;
    }
    // Otherwise go home to that section; the on-mount handler scrolls after load.
    router.push('/' + item.hash);
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
              {links.map((item, i) =>
                // item.label === 'Insights' ? (
                //   <InsightsDropdown
                //     key="Insights"
                //     i={i}
                //     isActive={activeHash === item.hash}
                //     onNavigate={() => setOpen(false)}
                //   />
                // ) : (
                  <NavLinkItem
                    key={item.label}
                    label={item.label}
                    hash={item.hash || item.route}
                    i={i}
                    isActive={item.hash ? activeHash === item.hash : false}
                    onClick={() => handleNav(item)}
                  />
                // )
              )}
            </div>
          </div>

          {/* CTA + theme toggle + mobile menu */}
          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}
            <WhatsAppButton />
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
              className="md:hidden h-10 w-10 grid place-items-center rounded-full transition"
              style={{
                background: '#0a0f0d',
                boxShadow: '0 0 0 6px rgba(144,235,97,0.12), 0 4px 14px -4px rgba(0,0,0,0.4)',
              }}
            >
              <span className="flex flex-col gap-[3px]">
                <span
                  className={`block h-[1.5px] w-4 bg-white transition ${open ? 'translate-y-[4.5px] rotate-45' : ''}`}
                />
                <span
                  className={`block h-[1.5px] w-4 bg-white transition ${open ? 'opacity-0' : ''}`}
                />
                <span
                  className={`block h-[1.5px] w-4 bg-white transition ${open ? '-translate-y-[4.5px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Full-screen backdrop — tap anywhere outside the menu to close it */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[-1] md:hidden"
              style={{ cursor: 'default' }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
          )}
        </AnimatePresence>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto md:hidden mt-2 rounded-2xl border border-gray-200/60 flex flex-col shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
              style={{
                background: '#ffffff',
              }}
            >
              {links.map((item, i) =>
                // item.label === 'Insights' ? (
                //   <MobileInsightsAccordion key="Insights" onNavigate={() => setOpen(false)} router={router} />
                // ) : (
                  <a
                    key={item.label}
                    href={item.hash || item.route}
                    onClick={(e) => { e.preventDefault(); handleNav(item); }}
                    className={`px-6 py-4 text-base font-medium text-gray-800 transition-colors duration-200 hover:text-[#1a7a3a] ${i > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    {item.label}
                  </a>
                // )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
