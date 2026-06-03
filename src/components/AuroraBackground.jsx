import { cn } from '../utils/cn.js';

export default function AuroraBackground({ className, animationSpeed = 10 }) {
  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className="aurora-layer"
        style={{ animationDuration: `${animationSpeed}s` }}
      />
    </div>
  );
}
