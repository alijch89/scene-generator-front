'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/** Sidebar order from Parent App.dc.html, minus the dropped subscription page. */
export const NAV = [
  [
    { href: '/dashboard', label: 'خانه' },
    { href: '/library', label: 'قصه‌های من' },
    { href: '/favorites', label: 'علاقه‌مندی‌ها' },
    { href: '/downloads', label: 'دانلودها' },
    { href: '/children', label: 'کودکان' },
  ],
  [
    { href: '/profile', label: 'پروفایل' },
    { href: '/settings', label: 'تنظیمات' },
    { href: '/transactions', label: 'صورت‌حساب' },
    { href: '/notifications', label: 'اعلان‌ها' },
    { href: '/help', label: 'راهنما' },
  ],
];

const TITLES: Record<string, string> = Object.fromEntries(
  NAV.flat().map((item) => [item.href, item.label]),
);

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function NavList({ compact }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {NAV.map((group, i) => (
        <nav
          key={i}
          className={i > 0 ? 'border-t border-border pt-4' : undefined}
        >
          <ul className="flex flex-col gap-1">
            {group.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-xl px-3 py-2.5 text-right text-[14px] font-semibold hover:no-underline',
                      active
                        ? 'bg-surface text-brand'
                        : 'text-ink hover:bg-elev',
                      compact && 'py-2 text-[13.5px]',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ))}
    </>
  );
}

export function SidebarNav() {
  return <NavList />;
}

/**
 * Mobile disclosure. <details> gives the open/close state, keyboard support
 * and Escape-free simplicity with no JS of our own.
 */
export function MobileNav() {
  return (
    <details className="group relative md:hidden">
      <summary
        aria-label="منو"
        className="grid size-9.5 cursor-pointer list-none place-items-center rounded-xl border border-border bg-surface"
      >
        <span
          aria-hidden
          className="block h-0.5 w-4 bg-current shadow-[0_5px_0_currentColor,0_-5px_0_currentColor]"
        />
      </summary>
      <div className="absolute start-0 top-12 z-30 flex w-56 flex-col gap-3 rounded-2xl border border-border bg-bg2 p-3 shadow-card-lg">
        <NavList compact />
      </div>
    </details>
  );
}

/** The design puts the current page's name in the header bar. */
export function HeaderTitle() {
  const pathname = usePathname();
  const key = Object.keys(TITLES).find((href) => isActive(pathname, href));
  return <strong className="font-display text-[17px]">{key ? TITLES[key] : ''}</strong>;
}
