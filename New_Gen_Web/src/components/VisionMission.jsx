import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2400&q=80';

// Strict, non-overlapping panel windows. Each panel finishes its exit before the
// next panel begins its enter — no stacking, no overlap.
const PANELS = [
  { sel: '[data-panel="intro"]',   enter: 0.06, settle: 0.12, hold: 0.18, exit: 0.24 },
  { sel: '[data-panel="vision"]',  enter: 0.30, settle: 0.36, hold: 0.52, exit: 0.58 },
  { sel: '[data-panel="mission"]', enter: 0.64, settle: 0.70, hold: 0.90, exit: 0.96 },
];

export default function VisionMission() {
  const root = useRef(null);
  const stickyWrap = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial hidden state — every line below frame, fully transparent.
      gsap.set('[data-line]', { yPercent: 60, opacity: 0, filter: 'blur(6px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyWrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // IMAGE — cinematic slow zoom-IN: medium-small at start, grows to full bleed.
      // Entry: soft fade + blur clears. Rest of runway: 0.72 → 1 linear scrub.
      tl.fromTo(
        '[data-image]',
        { scale: 0.7, filter: 'blur(10px) brightness(0.7)', opacity: 0.85, y: 20 },
        { scale: 0.72, filter: 'blur(0px) brightness(1)', opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0
      );
      tl.to('[data-image]', { scale: 1, ease: 'none', duration: 0.88 }, 0.12);

      // Vignette eases in early to keep text legible.
      tl.fromTo(
        '[data-vignette]',
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 0.2 },
        0.04
      );

      // Sequential panels — full enter, hold, full exit before the next begins.
      PANELS.forEach((p) => {
        const lines = `${p.sel} [data-line]`;

        // ENTER
        tl.to(
          lines,
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power3.out',
            duration: p.settle - p.enter,
            stagger: { each: 0.02, from: 'start' },
          },
          p.enter
        );

        // HOLD
        tl.to(lines, { opacity: 1, duration: p.hold - p.settle }, p.settle);

        // EXIT — fully gone before next panel starts.
        tl.to(
          lines,
          {
            yPercent: -40,
            opacity: 0,
            filter: 'blur(6px)',
            ease: 'power2.in',
            duration: p.exit - p.hold,
            stagger: { each: 0.015, from: 'start' },
          },
          p.hold
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ink">
      {/* Tall runway hosts the entire sticky story. */}
      <div ref={stickyWrap} className="relative" style={{ height: '460vh' }}>
        {/* Sticky stage — overflow-hidden prevents content spillover. */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* IMAGE LAYER */}
          <div
            data-image
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }}
            aria-hidden
          />

          {/* OVERLAYS */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-overlay opacity-55 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                'radial-gradient(55% 50% at 30% 30%, rgba(36,186,172,0.45), transparent 60%), radial-gradient(40% 40% at 80% 80%, rgba(144,235,97,0.35), transparent 60%)',
            }}
          />
          <div
            data-vignette
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 3,
              background:
                'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.78) 100%)',
            }}
          />

          {/* PANELS — all stacked, one visible at a time. */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            {/* INTRO */}
            <Panel name="intro">
              <Line>
                <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 backdrop-blur-md px-4 py-1.5 text-[10px] tracking-[0.5em] uppercase text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-hueGlow" />
                  Scene 04 · Why we exist
                </span>
              </Line>
              <Line className="mt-8">
                <h2 className="font-display font-bold tracking-tight leading-[0.95] text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
                  Vision <span className="text-white/40 mx-2">&</span>{' '}
                  <span className="text-gradient-gt">Mission</span>
                </h2>
              </Line>
              <Line className="mt-6">
                <p className="max-w-2xl text-white/80 text-sm md:text-base drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  The principles that shape every system we engineer and every partnership we form.
                </p>
              </Line>
            </Panel>

            {/* VISION — heading + full paragraph + supporting line */}
            <Panel name="vision">
              <Line>
                <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                  <span className="h-px w-8 bg-lime/70" />
                  01 · Vision
                </span>
              </Line>
              <Line className="mt-5">
                <h3 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-gradient-gt drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
                  Vision
                </h3>
              </Line>
              <Line className="mt-6">
                <p className="font-display text-xl md:text-2xl lg:text-[1.75rem] leading-[1.3] tracking-tight text-white max-w-3xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
                  At Genufy TechWorks, our vision is to empower businesses through innovative digital solutions and become a globally trusted leader in technology-driven transformation.
                </p>
              </Line>
              <Line className="mt-4">
                <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-xl mx-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
                  We aim to help brands scale smarter, innovate faster, and create meaningful digital experiences.
                </p>
              </Line>
            </Panel>

            {/* MISSION — heading + full paragraph + supporting line */}
            <Panel name="mission">
              <Line>
                <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                  <span className="h-px w-8 bg-teal/70" />
                  02 · Mission
                </span>
              </Line>
              <Line className="mt-5">
                <h3 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-gradient-gt drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
                  Mission
                </h3>
              </Line>
              <Line className="mt-6">
                <p className="font-display text-xl md:text-2xl lg:text-[1.75rem] leading-[1.3] tracking-tight text-white max-w-3xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
                  At Genufy TechWorks, our mission is to deliver scalable software solutions, Salesforce expertise, and modern digital platforms that turn ideas into impactful business outcomes.
                </p>
              </Line>
              <Line className="mt-4">
                <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-xl mx-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
                  We bridge technology and innovation to help organizations grow with confidence.
                </p>
              </Line>
            </Panel>
          </div>

          {/* Progress dots */}
          <div
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3"
            style={{ zIndex: 20 }}
          >
            {['01', '02', '03'].map((n, i) => (
              <span
                key={n}
                className="text-[10px] tracking-[0.4em] uppercase text-white/50"
                style={{ opacity: 0.4 + i * 0.15 }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ name, children }) {
  return (
    <div
      data-panel={name}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      {children}
    </div>
  );
}

function Line({ children, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span data-line className="block will-change-transform">
        {children}
      </span>
    </span>
  );
}
