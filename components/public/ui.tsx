/**
 * @file ui.tsx
 * @description Provides reusable cards and headings for public marketing and policy pages.
 */

import Image from 'next/image';
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

/** One adventure tile: cover photo over its title and one-line pitch. */
export function TopicCard({
  image,
  title,
  body,
}: {
  image: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group overflow-hidden rounded-[18px] border border-border bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* The topic artwork is 1408×768, so the box keeps 11/6 and nothing
          is cropped at any column width. */}
      <span
        aria-hidden
        className="relative block aspect-[11/6] overflow-hidden bg-elev"
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width:1180px) 240px, (min-width:640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="block px-3.5 py-3">
        <strong className="block text-[14.5px]">{title}</strong>
        <span className="text-xs leading-[1.7] text-muted">{body}</span>
      </span>
    </div>
  );
}
