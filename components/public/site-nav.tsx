/**
 * @file site-nav.tsx
 * @description Defines public-site navigation, its mobile hamburger menu, and the current-route highlight.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDismissDetails } from '@/lib/use-dismiss';
import { cn } from '@/lib/utils';

/** Ordered marketing links displayed in the public header. */
export const PUBLIC_NAV = [
  { href: '/features', label: 'ویژگی‌ها' },
  { href: '/how', label: 'چطور کار می‌کند' },
  { href: '/pricing', label: 'قیمت' },
  { href: '/faq', label: 'پرسش‌ها' },
  { href: '/contact', label: 'تماس' },
] as const;

/**
 * The design tints the current page's nav item with --primary. That needs the
 * pathname, which is the only reason this strip is a client component.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    // Below sm this would wrap into a ragged second row; SiteMobileNav carries
    // the same links behind a hamburger at those widths instead.
    <nav className="ms-auto hidden flex-wrap justify-center gap-1 sm:flex">
      {PUBLIC_NAV.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold hover:bg-elev hover:no-underline ${
              active ? 'text-brand' : 'text-ink'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The same links behind a hamburger, for the widths where the strip above is
 * hidden. <details> supplies the open state and keyboard support; the hook
 * closes it as soon as a pointer goes down anywhere else on the page.
 */
/** Renders the mobile navigation menu shared by public and authentication pages. */
export function SiteMobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { ref, close } = useDismissDetails();

  return (
    <details ref={ref} className={cn('relative sm:hidden', className)}>
      <summary
        aria-label="منو"
        className="grid size-[38px] cursor-pointer list-none place-items-center rounded-xl border border-border bg-surface text-ink"
      >
        <span
          aria-hidden
          className="block h-0.5 w-4 bg-current shadow-[0_5px_0_currentColor,0_-5px_0_currentColor]"
        />
      </summary>

      {/* Closing on click rather than pointerdown leaves the link alive long
          enough to actually navigate. */}
      <div
        onClick={close}
        className="absolute end-0 top-12 z-40 flex w-56 flex-col gap-1 rounded-2xl border border-border bg-bg2 p-3 shadow-card-lg"
      >
        {PUBLIC_NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={cn(
              'rounded-[11px] px-3 py-2.5 text-[13.5px] font-semibold hover:bg-elev hover:no-underline',
              pathname === href ? 'text-brand' : 'text-ink',
            )}
          >
            {label}
          </Link>
        ))}

        <div className="mt-1 flex flex-col gap-2 border-t border-border pt-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2.5 text-center text-[13.5px] font-semibold text-ink hover:bg-elev hover:no-underline"
          >
            ورود
          </Link>
          <Link
            href="/wizard"
            className="gradient-brand rounded-[13px] px-3 py-[11px] text-center text-sm font-bold text-white shadow-card hover:no-underline"
          >
            ساخت قصه
          </Link>
        </div>
      </div>
    </details>
  );
}
