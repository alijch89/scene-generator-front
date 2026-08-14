/**
 * @file ui.tsx
 * @description Provides dense administrator headers, panels, tables, filters, pagination, charts, and metrics.
 */

import Link from 'next/link';
import {
  faDateNumeric,
  faDigits,
  faNum,
  faRate,
  faWeekdayShort,
} from '@/lib/fa';
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

/** Displays one administrator metric with optional supporting text. */
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

/** Lays out responsive administrator statistic cards. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      {children}
    </div>
  );
}

/** Renders a bordered administrator content panel. */
export function Panel({
  title,
  children,
  className,
}: {
  /** Omitted when the panel's content carries its own heading. */
  title?: string;
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
      {title ? (
        <strong className="mb-4 block text-[13px]">{title}</strong>
      ) : null}
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

/**
 * «▲ ۳٫۲٪ نسبت به دورهٔ قبل». The arrow carries the direction so the figure
 * still reads without colour, and `invert` is for the measures where up is bad.
 */
export function Delta({
  value,
  suffix,
  invert,
}: {
  value: number;
  suffix?: string;
  /** Set on failure counts and the like, where a rise is the bad news. */
  invert?: boolean;
}) {
  // Under a tenth of a percent the arrow would be noise dressed as signal.
  if (Math.abs(value) < 0.05) {
    return (
      <span className="text-[11.5px] text-muted">بدون تغییر محسوس{suffix}</span>
    );
  }

  const up = value > 0;
  const good = invert ? !up : up;

  return (
    <span
      className={cn(
        'text-[11.5px] font-semibold',
        good ? 'text-success' : 'text-error',
      )}
    >
      <span aria-hidden>{up ? '▲' : '▼'}</span>{' '}
      <span className="sr-only">{up ? 'افزایش' : 'کاهش'} </span>
      {faRate(Math.abs(value))}
      {suffix}
    </span>
  );
}

/**
 * The dashboard's ۲۴ ساعت / ۷ روز / ۳۰ روز control. Links, not buttons: the
 * range lives in the URL, so a view an operator is looking at can be sent to
 * someone else and survives a reload.
 */
export function RangeTabs({
  value,
  hrefFor,
}: {
  value: string;
  hrefFor: (range: string) => string;
}) {
  const RANGES = [
    { id: '24h', label: '۲۴ ساعت' },
    { id: '7d', label: '۷ روز' },
    { id: '30d', label: '۳۰ روز' },
  ];

  return (
    <div className="ms-auto inline-flex rounded-lg border border-border bg-elev p-0.75">
      {RANGES.map((range) => (
        <Link
          key={range.id}
          href={hrefFor(range.id)}
          aria-current={range.id === value ? 'true' : undefined}
          className={cn(
            'rounded-md px-3.25 py-1.75 text-[12px] font-semibold text-ink hover:no-underline',
            range.id === value && 'bg-surface shadow-card',
          )}
        >
          {range.label}
        </Link>
      ))}
    </div>
  );
}

/**
 * «قصه‌های ساخته‌شده در هفته». Seven bars against the tallest, labelled with
 * the Jalali weekday — a sparkline with a real axis rather than a chart
 * library pulled in for one panel.
 */
export function WeekBars({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const peak = Math.max(1, ...data.map((d) => d.count));
  const peakDay = data.reduce((a, b) => (b.count > a.count ? b : a), data[0]);

  return (
    <>
      <div className="mb-2 flex items-center gap-2.5">
        <strong className="text-[13.5px]">قصه‌های ساخته‌شده در هفته</strong>
        {peakDay && peakDay.count > 0 ? (
          <span className="ms-auto text-[11.5px] text-muted">
            اوج: {faWeekdayShort(peakDay.date)} · {faNum(peakDay.count)}
          </span>
        ) : null}
      </div>

      <ul className="flex h-37.5 items-end gap-2.5">
        {data.map((day) => (
          <li key={day.date} className="flex h-full flex-1 items-end">
            <span
              className={cn(
                'block w-full rounded-t-md bg-brand',
                day.count < peak && 'opacity-75',
              )}
              // A zero-count day still needs a hairline, or the week reads as
              // six days long.
              style={{ height: `${Math.max(2, (day.count / peak) * 100)}%` }}
            >
              <span className="sr-only">
                {faDateNumeric(day.date)}: {faNum(day.count)} قصه
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div aria-hidden className="mt-2.25 flex gap-2.5">
        {data.map((day) => (
          <span
            key={day.date}
            className="flex-1 text-center text-[11px] text-muted"
          >
            {faWeekdayShort(day.date)}
          </span>
        ))}
      </div>
    </>
  );
}

/**
 * The filter row every admin table carries. A plain GET form, so the filters
 * end up in the URL and a row an operator found can be sent as a link.
 */
export function FilterBar({
  action,
  filtered,
  children,
}: {
  action: string;
  /** Shows «پاک کردن» only when something is actually filtered. */
  filtered: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="flex flex-wrap gap-2">
      {children}
      <button
        type="submit"
        className="rounded-lg border border-border bg-surface px-3.25 py-2 text-[12.5px] font-semibold"
      >
        اعمال
      </button>
      {filtered ? (
        <Link
          href={action}
          className="rounded-lg border border-border bg-surface px-3.25 py-2 text-[12.5px] font-semibold text-ink hover:no-underline"
        >
          پاک کردن
        </Link>
      ) : null}
    </form>
  );
}

/** Renders the shared administrator search field used in GET filter forms. */
export function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      type="search"
      name="q"
      {...props}
      className="w-56 rounded-lg border border-border bg-surface px-2.75 py-2 text-[12.5px] text-ink"
    />
  );
}
