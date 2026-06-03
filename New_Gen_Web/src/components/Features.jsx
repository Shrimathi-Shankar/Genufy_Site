import Reveal from './Reveal.jsx';

const items = [
  { title: 'Smooth Scroll', desc: 'Lenis-powered inertia scrolling for a buttery feel.' },
  { title: 'Glassmorphism', desc: 'Layered, frosted UI with subtle borders and depth.' },
  { title: 'Magnetic UI', desc: 'Interactive elements that respond to your cursor.' },
  { title: 'Motion First', desc: 'Cinematic entrances, page transitions and reveals.' },
  { title: 'Optimized', desc: 'Code-split bundles, lazy routes, and tuned assets.' },
  { title: 'SEO Ready', desc: 'Helmet-based meta with semantic, accessible markup.' },
];

export default function Features() {
  return (
    <section className="section">
      <Reveal>
        <h2 className="h-display text-4xl md:text-5xl tracking-tight">
          Built for the <span className="gradient-text">future</span>.
        </h2>
        <p className="text-white/65 mt-4 max-w-xl">
          A clean, scalable architecture with modular pieces you can compose into rich product experiences.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i}>
            <div className="group glass rounded-2xl p-6 h-full hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent2 mb-5 shadow-[0_0_25px_rgba(124,92,255,0.45)]" />
              <h3 className="h-display text-xl">{it.title}</h3>
              <p className="text-white/65 mt-2 text-sm leading-relaxed">{it.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
