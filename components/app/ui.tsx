import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import { AVATAR_GRADIENT } from '@/lib/story-art';
import { cn } from '@/lib/utils';

/** The surface card the whole parent app is built out of. */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-[22px] border border-border bg-surface p-[22px] shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  lead,
  action,
  meta,
}: {
  title: string;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-center gap-3">
      <div className="flex-1">
        <h1 className="font-display text-[clamp(23px,3.4vw,32px)]">{title}</h1>
        {lead ? (
          <p className="mt-1.5 text-[15px] text-muted">{lead}</p>
        ) : null}
      </div>
      {meta ? <span className="text-[13px] text-muted">{meta}</span> : null}
      {action}
    </header>
  );
}

/** The design's filled call to action — gradient, lifts on hover. */
export function PrimaryLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        'inline-block rounded-[14px] bg-linear-to-br from-brand to-warm px-5 py-3 text-center',
        'text-[14px] font-bold text-brand-fg shadow-card hover:no-underline',
        'transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
    />
  );
}

export function SecondaryLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        'inline-block rounded-xl border border-border bg-elev px-4 py-2.5 text-center',
        'text-[13px] font-semibold text-ink hover:no-underline',
        className,
      )}
    />
  );
}

/** Pill row used by the library filters and the child-detail tabs. */
export function PillLink({
  active,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { active?: boolean }) {
  return (
    <Link
      {...props}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-full border border-border px-4 py-2.5 text-[13px] font-semibold hover:no-underline',
        active ? 'bg-surface text-brand' : 'bg-transparent text-ink',
        className,
      )}
    />
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
  tone = 'neutral',
}: {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'neutral' | 'error';
}) {
  return (
    <div
      {...(tone === 'error' ? { role: 'alert' } : {})}
      className={cn(
        'rounded-[26px] border bg-surface px-5 py-14 text-center',
        tone === 'error' ? 'border-error' : 'border-border shadow-card',
      )}
    >
      {icon ? (
        <span aria-hidden className="mb-5 block text-[34px]">
          {icon}
        </span>
      ) : null}
      <h2 className="mb-2.5 font-display text-[21px]">{title}</h2>
      {children ? (
        <p className="mx-auto mb-6 max-w-[46ch] text-[14.5px] text-muted">
          {children}
        </p>
      ) : null}
      {action}
    </div>
  );
}

/** A child's photo, or the gradient initial the design falls back to. */
export function ChildAvatar({
  child,
  size = 54,
  className,
}: {
  child: { id: string; firstName: string; hasPhoto: boolean };
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size };

  if (child.hasPhoto) {
    return (
      // Served by the API behind an ownership check, so it is credentialed and
      // never a public URL — which rules out next/image here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${API_URL}/children/${child.id}/photo`}
        alt={`عکس ${child.firstName}`}
        crossOrigin="use-credentials"
        style={style}
        className={cn(
          'flex-none rounded-full border border-border object-cover',
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ ...style, backgroundImage: AVATAR_GRADIENT }}
      className={cn(
        'grid flex-none place-items-center rounded-full font-display text-brand-fg',
        className,
      )}
    >
      <span style={{ fontSize: size * 0.42 }}>{child.firstName.slice(0, 1)}</span>
    </span>
  );
}

/** Shimmer block for the loading states. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        'block rounded-[20px] bg-[linear-gradient(90deg,var(--sh-elev)_25%,var(--sh-border)_37%,var(--sh-elev)_63%)]',
        'bg-[length:400%_100%] animate-[shimmer_1.4s_linear_infinite]',
        className,
      )}
    />
  );
}

export function InterestChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-elev px-2.5 py-1.5 text-[11.5px]">
      {children}
    </span>
  );
}

/** «۷ ساله · ۴ قصه» */
export const childMeta = (child: { age: number; storyCount: number }) =>
  `${faDigits(child.age)} ساله · ${faDigits(child.storyCount)} قصه`;
