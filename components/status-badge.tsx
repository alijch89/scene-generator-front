import type { StatusTone } from '@/lib/orders';
import { cn } from '@/lib/utils';

/**
 * The design's tinted pill: the status colour at a low percentage over the
 * surface, with the full-strength colour as text. Because the tint is mixed
 * from --sh-* at render time, the same component comes out warm in the parent
 * app and cool under [data-surface="admin"].
 */
const TONE: Record<StatusTone, string> = {
  success:
    'text-success bg-[color-mix(in_srgb,var(--sh-success)_14%,var(--sh-surface))]',
  error:
    'text-error bg-[color-mix(in_srgb,var(--sh-error)_13%,var(--sh-surface))]',
  warning:
    'text-warning bg-[color-mix(in_srgb,var(--sh-warning)_15%,var(--sh-surface))]',
  neutral: 'text-muted bg-elev border border-border',
};

export function StatusBadge({
  tone,
  icon,
  children,
  className,
}: {
  tone: StatusTone;
  /** Carried alongside the colour so the status survives a greyscale print. */
  icon?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap',
        TONE[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}
