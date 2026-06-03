import Reveal from './Reveal.jsx';
import MagneticButton from './MagneticButton.jsx';

export default function CTA() {
  return (
    <section className="section">
      <Reveal>
        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 md:p-16 text-center">
          <div className="absolute -top-24 -left-16 blob bg-accent w-[300px] h-[300px]" />
          <div className="absolute -bottom-24 -right-16 blob bg-accent2 w-[300px] h-[300px]" />
          <h2 className="relative h-display text-4xl md:text-5xl tracking-tight">
            Ready to ship something <span className="gradient-text">extraordinary?</span>
          </h2>
          <p className="relative text-white/70 mt-4 max-w-xl mx-auto">
            Start with a foundation engineered for performance, design, and delight.
          </p>
          <div className="relative mt-8 flex items-center justify-center gap-4">
            <MagneticButton className="btn-primary">Get Started</MagneticButton>
            <MagneticButton className="btn-ghost">Read Docs</MagneticButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
