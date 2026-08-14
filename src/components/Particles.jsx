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

    // Pre-bake a glow sprite per color once — avoids creating a new radial
    // gradient object for every particle every frame (~60 allocations/sec).
    // drawImage is GPU-blitted so it's effectively free per particle.
    const makeSprite = (color) => {
      const oc = document.createElement('canvas');
      oc.width = oc.height = 64;
      const octx = oc.getContext('2d');
      const grd = octx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, `rgba(${color},1)`);
      grd.addColorStop(1, `rgba(${color},0)`);
      octx.fillStyle = grd;
      octx.fillRect(0, 0, 64, 64);
      return oc;
    };
    const sprites = {
      '144,235,97': makeSprite('144,235,97'),
      '36,186,172': makeSprite('36,186,172'),
    };

    const seed = () => {
      particles = Array.from({ length: density }).map(() => {
        const r = Math.random() * 1.6 + 0.4;
        const c = Math.random() > 0.5 ? '144,235,97' : '36,186,172';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          half: r * 16,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          c,
          a: Math.random() * 0.6 + 0.2,
        };
      });
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

        ctx.globalAlpha = p.a;
        ctx.drawImage(sprites[p.c], p.x - p.half, p.y - p.half, p.half * 2, p.half * 2);
      }
      ctx.globalAlpha = 1;
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
