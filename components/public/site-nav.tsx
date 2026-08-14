/**
 * @file site-nav.tsx
 * @description Defines public-site navigation and highlights the current marketing route.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    // Below sm the header wraps; a full-width centred row beats a ragged one.
    <nav className="flex flex-wrap justify-center gap-1 max-sm:w-full sm:ms-auto">
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
