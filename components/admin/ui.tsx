import Link from 'next/link';
import { faDigits } from '@/lib/fa';
import { cn } from '@/lib/utils';

/**
 * The admin panel's shared furniture. Tighter than the parent app's — 12px
 * radii, 1px shadows, 12.5px type — because it is a dense operations tool, not
 * a storybook. All of it reads the same --sh-* tokens, which the (admin)
 * layout's data-surface has already swapped to the cool palette.
 */

export function AdminHeader({
  title,
  count,
  children,
}: {
  title: string;
  /** The «۲۴٬۸۱۹ کاربر» line the design puts beside every table heading. */
  count?: React.ReactNode;
  /** Filters and actions; pushed to the far end. */
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
      <h1 className="text-[19px] font-bold">{title}</h1>
      {count ? <span className="text-[12px] text-muted">{count}</span> : null}
      {children ? (
        <div className="ms-auto flex flex-wrap gap-2">{children}</div>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  tone?: 'error' | 'warning' | 'success';
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
      <p className="mb-2 text-[11.5px] font-semibold text-muted">{label}</p>
      <strong
        className={cn(
          'text-[21px]',
          tone === 'error' && 'text-error',
          tone === 'warning' && 'text-warning',
          tone === 'success' && 'text-success',
        )}
      >
        {value}
      </strong>
      {note ? <p className="mt-1.75 text-[11.5px] text-muted">{note}</p> : null}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface p-4.5 shadow-card',
        className,
      )}
    >
      <strong className="mb-4 block text-[13px]">{title}</strong>
      {children}
    </section>
  );
}

/** The scroll container every admin table lives in. */
export function TableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-border bg-surface shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

export const thClass = 'px-3.5 py-2.75 text-right font-bold whitespace-nowrap';
export const tdClass = 'border-t border-border px-3.5 py-3';

/** The design's select control, used for every table filter. */
export function FilterSelect({
  label,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <select
      {...props}
      aria-label={label}
      className={cn(
        'rounded-lg border border-border bg-surface px-2.75 py-2 text-[12.5px] text-ink',
        className,
      )}
    />
  );
}

/** The labelled bar the design draws for distributions. */
export function MeterRow({
  label,
  value,
  share,
  color = 'var(--sh-primary)',
}: {
  label: string;
  value: React.ReactNode;
  /** 0–100. */
  share: number;
  color?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 flex text-[12.5px]">
        <span>{label}</span>
        <span className="ms-auto text-muted">{value}</span>
      </p>
      <span className="block h-1.75 overflow-hidden rounded-sm bg-border">
        <span
          className="block h-full"
          style={{
            width: `${Math.max(0, Math.min(100, share))}%`,
            background: color,
          }}
        />
      </span>
    </div>
  );
}

/**
 * Page links, not buttons: the URL carries the page number, so a paginated
 * table is shareable and survives a reload. The design has no pagination of
 * its own, so this is built on its select and button shapes.
 */
export function Pagination({
  page,
  pageCount,
  href,
}: {
  page: number;
  pageCount: number;
  /** Builds the URL for a given page, keeping the current filters. */
  href: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const step =
    'rounded-lg border border-border bg-surface px-3 py-2 text-[12.5px] font-semibold text-ink hover:no-underline';
  const disabled = 'pointer-events-none opacity-45';

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-3 flex items-center justify-center gap-2.5"
    >
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={cn(step, page <= 1 && disabled)}
      >
        قبلی
      </Link>
      <span aria-current="page" className="text-[12.5px] text-muted">
        صفحهٔ {faDigits(page)} از {faDigits(pageCount)}
      </span>
      <Link
        href={href(page + 1)}
        aria-disabled={page >= pageCount}
        className={cn(step, page >= pageCount && disabled)}
      >
        بعدی
      </Link>
    </nav>
  );
}

/** What an admin table shows when a filter matches nothing. */
export function TableEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-t border-border px-3.5 py-10 text-center text-[13px] text-muted">
      {children}
    </p>
  );
}
