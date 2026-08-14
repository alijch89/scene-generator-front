import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';
import { HeaderTitle, MobileNav, SidebarNav } from '@/components/app/nav';
import { LogoutButton } from '@/components/logout-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { requireParent, sapi } from '@/lib/dal';
import { faDigits } from '@/lib/fa';

export default async function ParentLayout({ children }: LayoutProps<'/'>) {
  // The real gate. proxy.ts already bounced anonymous and admin traffic, but
  // that was only a cookie read — this validates against the API.
  const user = await requireParent();

  // A bare count, so the bell costs one cheap query and no rows.
  const { count } = await sapi
    .get<{ count: number }>('/notifications/unread')
    .catch((err) => {
      // Do not turn a redirect caused by an expired session into a 0 badge.
      unstable_rethrow(err);
      return { count: 0 };
    });

  return (
    <div className="aurora grid min-h-full grid-cols-1 md:grid-cols-[232px_minmax(0,1fr)]">
      {/* print:hidden throughout — the only printable page in here is the
          invoice, and it should come out as a document, not a screenshot. */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-4 overflow-y-auto border-e border-border bg-bg2 px-3.5 py-5 md:flex print:hidden">
        <Link
          href="/"
          className="mb-2 flex items-center gap-2.5 text-ink hover:no-underline"
        >
          <span className="grid size-8.5 place-items-center rounded-xl bg-linear-to-br from-brand to-warm text-brand-fg">
            ★
          </span>
          <strong className="font-display">شهرزاد قصه‌گو</strong>
        </Link>

        <Link
          href="/wizard"
          className="rounded-2xl bg-linear-to-br from-brand to-warm p-3 text-center font-bold text-brand-fg hover:no-underline"
        >
          + ساخت قصهٔ تازه
        </Link>

        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-[color-mix(in_srgb,var(--sh-bg)_90%,transparent)] px-5 py-3.5 backdrop-blur-md print:hidden">
          <MobileNav />
          <HeaderTitle />

          <div className="ms-auto flex items-center gap-2.5">
            <ThemeToggle />

            <Link
              href="/notifications"
              aria-label={
                count > 0 ? `اعلان‌ها، ${faDigits(count)} خوانده‌نشده` : 'اعلان‌ها'
              }
              className="relative grid size-10 place-items-center rounded-[13px] border border-border bg-surface text-[15px] text-ink hover:no-underline"
            >
              ✦
              {count > 0 ? (
                <span
                  aria-hidden
                  className="absolute end-1.5 top-1.5 size-2 rounded-full bg-warm"
                />
              ) : null}
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pe-1 ps-3 text-ink hover:no-underline"
            >
              <span className="hidden text-[13px] font-semibold sm:inline">
                {user.fullName}
              </span>
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full bg-linear-to-br from-brand to-warm text-[12px] text-brand-fg"
              >
                {user.fullName.slice(0, 1)}
              </span>
            </Link>

            <LogoutButton className="hidden sm:block" />
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-295 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
