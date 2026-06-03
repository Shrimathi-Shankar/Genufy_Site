export default function GradientBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 bg-grad-hero" />
      <div className="absolute inset-0 opacity-[0.35] bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="blob bg-accent w-[520px] h-[520px] -top-32 -left-32 animate-pulseGlow" />
      <div className="blob bg-accent2 w-[460px] h-[460px] top-1/2 -right-32 animate-pulseGlow" />
      <div className="blob bg-fuchsia-500 w-[380px] h-[380px] bottom-0 left-1/3 opacity-30 animate-pulseGlow" />
    </div>
  );
}
