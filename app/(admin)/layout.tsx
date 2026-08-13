import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { requireAdmin } from '@/lib/dal';

/** Sidebar order from Admin.dc.html, with اشتراک‌ها repurposed as سفارش‌ها. */
const NAV = [
  { href: '/admin', label: 'داشبورد' },
  { href: '/admin/reports', label: 'گزارش‌ها' },
  { href: '/admin/users', label: 'کاربران' },
  { href: '/admin/children', label: 'پرونده‌های کودکان' },
  { href: '/admin/stories', label: 'قصه‌ها' },
  { href: '/admin/moderation', label: 'بازبینی محتوا' },
  { href: '/admin/jobs', label: 'صف تولید' },
  { href: '/admin/usage', label: 'مصرف مدل‌ها' },
  { href: '/admin/payments', label: 'پرداخت‌ها' },
  { href: '/admin/orders', label: 'سفارش‌ها' },
  { href: '/admin/audit', label: 'گزارش رخدادها' },
  { href: '/admin/settings', label: 'تنظیمات سیستم' },
];

export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const user = await requireAdmin();

  return (
    // data-surface swaps the whole palette — including every shadcn component
    // rendered inside — to the admin visual language. No aurora here.
    <div
      data-surface="admin"
      className="grid min-h-full grid-cols-1 bg-bg text-ink md:grid-cols-[218px_minmax(0,1fr)]"
    >
      <aside className="sticky top-0 hidden h-screen flex-col gap-3 overflow-y-auto border-e border-border bg-surface px-3 py-5 md:flex">
        <div className="mb-2 px-2">
          <strong className="block font-display text-[15px]">پنل مدیریت</strong>
          <span className="text-[11px] text-muted">شهرزاد قصه‌گو</span>
        </div>
        <nav>
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-right text-[13.5px] text-ink hover:bg-elev hover:no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
          <span className="ms-auto text-[13px] text-muted">{user.fullName}</span>
          <ThemeToggle className="size-9 rounded-lg" />
          <LogoutButton />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
