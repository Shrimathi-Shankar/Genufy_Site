import useMagnetic from '../hooks/useMagnetic.js';
import { cn } from '../utils/cn.js';

export default function MagneticButton({ children, className, as: Tag = 'button', ...props }) {
  const ref = useMagnetic(0.25);
  return (
    <Tag
      ref={ref}
      className={cn('transition-transform duration-300 will-change-transform', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
