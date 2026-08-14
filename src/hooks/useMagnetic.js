import { useEffect, useRef } from 'react';

export default function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const onMove = (e) => {
      cancelAnimationFrame(rafId);
      const cx = e.clientX;
      const cy = e.clientY;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = cx - (rect.left + rect.width / 2);
        const y = cy - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(rafId);
      el.style.transform = 'translate(0,0)';
    };

    const onEnter = () => { el.style.willChange = 'transform'; };
    const onLeave = () => { el.style.willChange = ''; };

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [strength]);

  return ref;
}
