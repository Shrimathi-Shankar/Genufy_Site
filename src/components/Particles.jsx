import { useEffect, useRef } from 'react';

export default function Particles({ density = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip the canvas animation on phones (< 768px): the continuous rAF loop is
    // pure battery/GPU/memory cost on the memory-constrained devices that need
    // relief most. The canvas is also hidden via `hidden md:block` below, so
    // nothing is drawn or shown on mobile. Desktop is unaffected.
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: density }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: Math.random() > 0.5 ? '144,235,97' : '36,186,172',
        a: Math.random() * 0.6 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `rgba(${p.c},${p.a})`);
        grd.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();
    const onResize = () => { resize(); seed(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="hidden md:block absolute inset-0 w-full h-full" aria-hidden="true" />;
}
