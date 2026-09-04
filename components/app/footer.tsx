/**
 * @file footer.tsx
 * @description Renders the compact trust and navigation footer for parent pages.
 */

import { Heart, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const FOOTER_LINKS = [
  { href: '/help', label: 'راهنما' },
  { href: '/contact', label: 'پشتیبانی' },
  { href: '/privacy', label: 'حریم خصوصی' },
  { href: '/terms', label: 'شرایط استفاده' },
] as const;

/** A quiet end-cap for authenticated pages that stays useful on small screens. */
export function ParentFooter() {
  return (
    <footer className="relative z-10 mx-auto mt-auto w-full max-w-295 px-4 pb-5 sm:px-6 print:hidden">
      <div className="relative isolate overflow-hidden rounded-[24px] border border-[color-mix(in_srgb,var(--sh-border)_86%,white)] bg-[linear-gradient(125deg,color-mix(in_srgb,var(--sh-surface)_94%,transparent),color-mix(in_srgb,var(--sh-elev)_78%,transparent))] shadow-card backdrop-blur-md dark:border-white/8">
        <span
          aria-hidden
          className="absolute -end-12 -top-20 -z-10 size-52 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_12%,transparent)] blur-2xl"
        />
        <span
          aria-hidden
          className="absolute -bottom-20 start-[32%] -z-10 size-44 rounded-full bg-[color-mix(in_srgb,var(--sh-accent)_10%,transparent)] blur-2xl"
        />

        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center">
          <Link
            href="/dashboard"
            className="group flex w-fit items-center gap-3 text-ink hover:no-underline"
          >
            <Logo className="size-9 rounded-xl shadow-card transition-transform duration-300 group-hover:rotate-3" />
            <span>
              <strong className="block font-display text-[15px] leading-5">
                شهرزاد قصه‌گو
              </strong>
              <span className="text-[10.5px] text-muted">
                خانهٔ قصه‌های خانوادهٔ شما
              </span>
            </span>
          </Link>

          <nav
            aria-label="پیوندهای پایین صفحه"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-muted lg:ms-auto"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-brand hover:no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border/75 bg-[color-mix(in_srgb,var(--sh-elev)_40%,transparent)] px-5 py-3 text-[10.5px] text-muted sm:flex-row sm:items-center sm:px-6">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden className="size-3.5 text-teal" />
            عکس‌ها و قصه‌های شما خصوصی می‌مانند.
          </span>
          <span className="inline-flex items-center gap-1.5 sm:ms-auto">
            <Heart aria-hidden className="size-3.5 text-pink" />
            ساخته‌شده برای لحظه‌های خانوادگی
          </span>
          <span className="hidden items-center gap-1.5 xl:inline-flex">
            <HelpCircle aria-hidden className="size-3.5 text-brand" />
            همیشه می‌توانید از بخش راهنما کمک بگیرید.
          </span>
          <Sparkles aria-hidden className="hidden size-3.5 text-gold sm:block" />
        </div>
      </div>
    </footer>
  );
}
