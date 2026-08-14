/**
 * @file ui.tsx
 * @description Provides reusable cards and headings for public marketing and policy pages.
 */

import { cn } from '@/lib/utils';

/** The surface card the marketing pages repeat ~25 times. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-[22px] border border-border bg-surface p-[22px] shadow-card',
        'transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Title + lead paragraph, identical on every inner page of the public site. */
export function PageHeader({
  title,
  lead,
  className,
}: {
  title: string;
  lead: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-8', className)}>
      <h1 className="mb-3 font-display text-[clamp(28px,4.6vw,42px)] leading-tight">
        {title}
      </h1>
      <p className="max-w-[56ch] text-[16.5px] leading-[1.9] text-muted">
        {lead}
      </p>
    </header>
  );
}

/** The heading pair used inside landing sections. */
export function SectionHeading({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <>
      <h2 className="mb-2.5 font-display text-[clamp(23px,3.4vw,34px)]">
        {title}
      </h2>
      {lead ? <p className="mb-7 text-[15.5px] text-muted">{lead}</p> : null}
    </>
  );
}
