import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  FilterBar,
  FilterSelect,
  Pagination,
  SearchInput,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import {
  auditEventLabel,
  auditTargetHref,
  AUDIT_CATEGORY_LABEL,
  AUDIT_TARGET_TYPE_LABEL,
  ROLE_LABEL,
} from '@/lib/admin';
import { API_URL } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDateTime, faNum } from '@/lib/fa';
import type { AdminAuditFacetsDto, AdminAuditPageDto } from '@/lib/types';

export const metadata: Metadata = { title: 'گزارش رخدادها' };

const PER_PAGE = 40;

/** Reads one string search param, or '' when it is absent or repeated. */
const one = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

/**
 * `<input type="date">` submits `YYYY-MM-DD`; the API takes ISO instants.
 * The bound is widened to the whole local day so that «تا» includes it.
 */
const dayBound = (value: string, edge: 'start' | 'end') => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const time = edge === 'start' ? '00:00:00.000' : '23:59:59.999';
  const at = new Date(`${value}T${time}`);
  return Number.isNaN(at.getTime()) ? '' : at.toISOString();
};

/** Server page that retrieves retained audit events using URL-driven filters. */
export default async function AdminAuditPage({
  searchParams,
}: PageProps<'/admin/audit'>) {
  await requireAdmin();

  const sp = await searchParams;
  const q = one(sp.q);
  const category = one(sp.category);
  const event = one(sp.event);
  const targetType = one(sp.targetType);
  const actorId = one(sp.actorId);
  const ip = one(sp.ip);
  const from = one(sp.from);
  const to = one(sp.to);
  const page = Math.max(1, Number(one(sp.page)) || 1);

  // Only the values the API declares are forwarded; it rejects anything else
  // outright rather than ignoring it.
  const filters: Record<string, string> = {};
  if (q) filters.q = q;
  if (category && category in AUDIT_CATEGORY_LABEL) filters.category = category;
  if (event) filters.event = event;
  if (targetType && targetType in AUDIT_TARGET_TYPE_LABEL) {
    filters.targetType = targetType;
  }
  if (actorId) filters.actorId = actorId;
  if (ip) filters.ip = ip;
  if (dayBound(from, 'start')) filters.from = dayBound(from, 'start');
  if (dayBound(to, 'end')) filters.to = dayBound(to, 'end');

  const query = new URLSearchParams({
    ...filters,
    page: String(page),
    take: String(PER_PAGE),
  });

  const [audit, facets] = await Promise.all([
    sapi.get<AdminAuditPageDto>(`/admin/audit?${query}`),
    sapi.get<AdminAuditFacetsDto>('/admin/audit/facets'),
  ]);

  const filtered = Object.keys(filters).length > 0;

  // Carries every active filter into the page links, so paging does not
  // silently drop back to the unfiltered trail.
  const hrefFor = (next: number) => {
    const params = new URLSearchParams(filters);
    // The date inputs round-trip as they were typed, not as ISO instants.
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (next > 1) params.set('page', String(next));
    const qs = params.toString();
    return qs ? `/admin/audit?${qs}` : '/admin/audit';
  };

  const exportHref = `${API_URL}/admin/audit/export?${new URLSearchParams(filters)}`;

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="گزارش رخدادها"
        count={`نگهداری ${faNum(audit.retentionDays)} روزه · فقط افزودنی`}
      >
        <FilterBar action="/admin/audit" filtered={filtered}>
          <SearchInput
            defaultValue={q}
            placeholder="رخداد، عامل یا شناسهٔ هدف"
            aria-label="جست‌وجو در رخدادها"
          />
          <FilterSelect
            name="category"
            label="دسته"
            defaultValue={category}
            key={`category-${category}`}
          >
            <option value="">همهٔ دسته‌ها</option>
            {facets.categories
              .filter((c) => c.count > 0)
              .map((c) => (
                <option key={c.value} value={c.value}>
                  {AUDIT_CATEGORY_LABEL[c.value] ?? c.value} ({faNum(c.count)})
                </option>
              ))}
          </FilterSelect>
          <FilterSelect
            name="event"
            label="رخداد"
            defaultValue={event}
            key={`event-${event}`}
          >
            <option value="">همهٔ رخدادها</option>
            {facets.events.map((e) => (
              <option key={e.value} value={e.value}>
                {auditEventLabel(e.value)} ({faNum(e.count)})
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            name="targetType"
            label="نوع هدف"
            defaultValue={targetType}
            key={`target-${targetType}`}
          >
            <option value="">همهٔ هدف‌ها</option>
            {facets.targetTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {AUDIT_TARGET_TYPE_LABEL[t.value] ?? t.value} ({faNum(t.count)})
              </option>
            ))}
          </FilterSelect>
          <input
            type="date"
            name="from"
            defaultValue={from}
            aria-label="از تاریخ"
            className="rounded-lg border border-border bg-surface px-2.75 py-2 text-[12.5px] text-ink"
          />
          <input
            type="date"
            name="to"
            defaultValue={to}
            aria-label="تا تاریخ"
            className="rounded-lg border border-border bg-surface px-2.75 py-2 text-[12.5px] text-ink"
          />
          {/* Set by the «همهٔ رخدادهای این حساب» link, not by an operator. */}
          {actorId ? (
            <input type="hidden" name="actorId" value={actorId} />
          ) : null}
          {ip ? <input type="hidden" name="ip" value={ip} /> : null}
        </FilterBar>
        <a
          href={exportHref}
          className="rounded-lg border border-border px-3 py-2 text-[12.5px]"
        >
          خروجی CSV
        </a>
      </AdminHeader>

      <TableCard>
        <table className="w-full min-w-205 border-collapse text-[12.5px]">
          <caption className="sr-only">گزارش رخدادهای سامانه</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                زمان
              </th>
              <th scope="col" className={thClass}>
                عامل
              </th>
              <th scope="col" className={thClass}>
                رخداد
              </th>
              <th scope="col" className={thClass}>
                هدف
              </th>
              <th scope="col" className={thClass}>
                نشانی
              </th>
            </tr>
          </thead>
          <tbody>
            {audit.items.map((row) => {
              const href = auditTargetHref(row.targetType, row.targetId);
              return (
                <tr key={row.id}>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {faDateTime(row.createdAt)}
                  </td>
                  <td className={tdClass}>
                    {row.actor ? (
                      <Link href={`/admin/users/${row.actor.id}`}>
                        {row.actor.fullName ?? row.actor.id.slice(0, 8)}
                        {row.actor.role
                          ? ` (${ROLE_LABEL[row.actor.role]})`
                          : ''}
                      </Link>
                    ) : (
                      <span className="text-muted">سامانه</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {auditEventLabel(row.event)}
                    {row.meta ? (
                      <span
                        className="ms-1.5 font-mono text-[11px] text-muted"
                        title={JSON.stringify(row.meta)}
                      >
                        ⓘ
                      </span>
                    ) : null}
                  </td>
                  <td className={`${tdClass} font-mono text-[11.5px]`}>
                    {row.targetId ? (
                      href ? (
                        <Link href={href}>{row.targetId.slice(0, 8)}</Link>
                      ) : (
                        row.targetId.slice(0, 24)
                      )
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className={`${tdClass} font-mono text-[11.5px] text-muted`}>
                    {row.ip ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {audit.items.length === 0 ? (
          <TableEmpty>
            {filtered ? (
              <>
                رخدادی با این فیلترها پیدا نشد.{' '}
                <Link href="/admin/audit">همهٔ رخدادها</Link>
              </>
            ) : (
              'هنوز رخدادی ثبت نشده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination page={audit.page} pageCount={audit.pageCount} href={hrefFor} />

      <p className="mt-3 text-[11.5px] leading-[1.9] text-muted">
        این گزارش روی یک دیتابیس جدا نگهداری می‌شود و هیچ بخشی از پنل آن را
        ویرایش یا پاک نمی‌کند؛ تنها چیزی که سطر برمی‌دارد، همان بازهٔ نگهداری
        است که در تنظیمات سیستم تعیین می‌شود. نام و شمارهٔ عامل، همان چیزی است
        که در لحظهٔ رخداد ثبت شده.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders the filterable, paginated administrator audit trail and retention notice.
 */
