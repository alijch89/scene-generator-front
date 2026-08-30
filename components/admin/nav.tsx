/**
 * @file nav.tsx
 * @description Defines the grouped administrator navigation and live moderation badge.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { faNum } from '@/lib/fa';
import { cn } from '@/lib/utils';

/**
 * The sidebar, in the design's four groups. اشتراک‌ها is repurposed as
 * سفارش‌ها — with one-time per-length pricing there are no plans to manage,
 * only the lifecycle of an order.
 *
 * A client component solely so the current section can be marked; the count it
 * shows is fetched once by the layout on the server.
 */
const GROUPS: {
  title: string;
  items: { href: string; label: string; badge?: 'moderation' }[];
}[] = [
  {
    title: 'مرور',
    items: [
      { href: '/admin', label: 'داشبورد' },
      { href: '/admin/reports', label: 'گزارش‌ها' },
    ],
  },
  {
    title: 'کاربران و محتوا',
    items: [
      { href: '/admin/users', label: 'کاربران' },
      { href: '/admin/children', label: 'پرونده‌های کودکان' },
      { href: '/admin/stories', label: 'قصه‌ها' },
      { href: '/admin/moderation', label: 'بازبینی محتوا', badge: 'moderation' },
    ],
  },
  {
    title: 'هوش مصنوعی',
    items: [
      { href: '/admin/jobs', label: 'صف تولید' },
      { href: '/admin/usage', label: 'مصرف مدل‌ها' },
    ],
  },
  {
    title: 'مالی و سیستم',
    items: [
      { href: '/admin/payments', label: 'پرداخت‌ها' },
      { href: '/admin/orders', label: 'سفارش‌ها' },
      { href: '/admin/audit', label: 'گزارش رخدادها' },
      { href: '/admin/settings', label: 'تنظیمات سیستم' },
    ],
  },
];

/** Renders grouped administrator links and the live moderation badge. */
export function AdminNav({
  pendingModeration,
}: {
  pendingModeration: number;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="بخش‌های پنل مدیریت">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mt-3.5 mb-1.5 px-2 text-[10.5px] font-bold tracking-[.5px] text-muted">
            {group.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              // /admin is the dashboard, not a prefix for everything under it.
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center rounded-lg px-2.75 py-2.25 text-[13px] font-semibold hover:bg-elev hover:no-underline',
                      active ? 'bg-elev text-brand' : 'text-ink',
                    )}
                  >
                    {item.label}
                    {item.badge === 'moderation' && pendingModeration > 0 ? (
                      <span className="ms-auto rounded-full bg-error px-1.75 py-0.25 text-[10.5px] font-bold text-white">
                        {faNum(pendingModeration)}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
