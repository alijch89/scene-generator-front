import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LogoutButton } from '@/components/logout-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { AdminNav } from '@/components/admin/nav';
import { requireAdmin, sapi } from '@/lib/dal';

/** Server layout that validates the administrator session before rendering admin routes. */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const user = await requireAdmin();

  // The sidebar badge is a real count, so an operator can see work arriving
  // without opening the page. A queue that cannot be read is not a queue.
  const { pending } = await sapi
    .get<{ pending: number }>('/admin/moderation/count')
    .catch(() => ({ pending: 0 }));

  return (
    // data-surface swaps the whole palette — including every shadcn component
    // rendered inside — to the admin visual language. No aurora here.
    <div
      data-surface="admin"
      className="grid min-h-full grid-cols-1 bg-bg text-ink md:grid-cols-[218px_minmax(0,1fr)]"
    >
      <aside className="sticky top-0 hidden h-screen flex-col gap-1 overflow-y-auto border-e border-border bg-surface px-3 py-5 md:flex">
        <div className="mb-2 flex items-center gap-2.25 px-2">
          <Logo className="size-7 rounded-lg" />
          <span className="flex flex-col">
            <strong className="text-[14px]">پنل مدیریت</strong>
            <span className="text-[11px] text-muted">شهرزاد قصه‌گو</span>
          </span>
        </div>

        <AdminNav pendingModeration={pending} />

        <Link
          href="/dashboard"
          className="mt-auto rounded-lg border border-border bg-elev px-3 py-2.5 text-center text-[12.5px] font-semibold text-ink hover:no-underline"
        >
          نمای والدین ←
        </Link>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-surface px-5 py-2.5">
          <span className="rounded-md border border-border bg-elev px-2.25 py-0.75 text-[11px] text-muted">
            محیط عملیاتی
          </span>
          <span className="ms-auto text-[12px] font-semibold">
            {user.fullName} · مدیر
          </span>
          <ThemeToggle className="size-8.5 rounded-lg" />
          <LogoutButton />
        </header>
        <main className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
/**
 * @file layout.tsx
 * @description Enforces administrator access and renders the cool-palette admin shell and navigation.
 */
