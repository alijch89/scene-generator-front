/**
 * @file ui.tsx
 * @description Provides reusable cards and headings for public marketing and policy pages.
 */

import { ArrowUpLeft, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/** The surface card the marketing pages repeat ~25 times. */
export function Card({
  className,
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        'group/card rounded-[22px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_92%,transparent)] p-[22px] shadow-card',
        'transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--sh-primary)_30%,var(--sh-border))] hover:shadow-card-lg',
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
  eyebrow = 'دنیای قصه‌های شخصی',
}: {
  title: string;
  lead: React.ReactNode;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <header className={cn('motion-hero-reveal relative mb-10', className)}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/75 px-3 py-1.5 text-[11.5px] font-bold text-warm shadow-card backdrop-blur-sm">
        <Sparkles className="size-3.5" strokeWidth={1.8} />
        {eyebrow}
      </div>
      <h1 className="mb-3 font-display text-[clamp(30px,4.8vw,46px)] leading-[1.35]">
        {title}
      </h1>
      <p className="max-w-[58ch] text-[16.5px] leading-[2] text-muted">
        {lead}
      </p>
      <span
        aria-hidden
        className="mt-5 block h-1 w-20 rounded-full bg-[linear-gradient(90deg,var(--sh-primary),var(--sh-accent),var(--sh-gold))]"
      />
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
    <header className="mb-7">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="h-px w-7 bg-warm" />
        <span className="size-1.5 rounded-full bg-warm" />
      </div>
      <h2 className="mb-2.5 font-display text-[clamp(24px,3.4vw,36px)] leading-[1.4]">
        {title}
      </h2>
      {lead ? <p className="text-[15.5px] leading-[1.9] text-muted">{lead}</p> : null}
    </header>
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
    <div className="story-card-shine group relative overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_8px_24px_color-mix(in_srgb,var(--sh-primary)_8%,transparent)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--sh-primary)_34%,var(--sh-border))] hover:shadow-card-lg">
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
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,16,48,.5),transparent_58%)] opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute end-3 top-3 grid size-8 translate-y-1 place-items-center rounded-full border border-white/35 bg-black/20 text-white opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpLeft className="size-4" strokeWidth={1.8} />
        </span>
      </span>
      <span className="block px-4 py-3.5">
        <strong className="mb-0.5 block text-[14.5px]">{title}</strong>
        <span className="block text-xs leading-[1.8] text-muted">{body}</span>
      </span>
    </div>
  );
}
