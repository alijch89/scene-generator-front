import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  FilterBar,
  Pagination,
  SearchInput,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import { auditEventLabel, auditTargetHref, ROLE_LABEL } from '@/lib/admin';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDateTime, faNum } from '@/lib/fa';
import type { AdminAuditPageDto } from '@/lib/types';

export const metadata: Metadata = { title: 'گزارش رخدادها' };

const PER_PAGE = 40;

/** Server page that retrieves retained audit events using URL-driven filters. */
export default async function AdminAuditPage({
  searchParams,
}: PageProps<'/admin/audit'>) {
  await requireAdmin();

  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (q) query.set('q', q);

  const audit = await sapi.get<AdminAuditPageDto>(`/admin/audit?${query}`);

  const hrefFor = (next: number) => {
    const params = new URLSearchParams({ page: String(next) });
    if (q) params.set('q', q);
    return `/admin/audit?${params}`;
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="گزارش رخدادها"
        count={`نگهداری ${faNum(audit.retentionDays)} روزه · فقط افزودنی`}
      >
        <FilterBar action="/admin/audit" filtered={Boolean(q)}>
          <SearchInput
            defaultValue={q}
            placeholder="رخداد، عامل یا شناسهٔ هدف"
            aria-label="جست‌وجو در رخدادها"
          />
        </FilterBar>
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
                        {row.actor.fullName} ({ROLE_LABEL[row.actor.role]})
                      </Link>
                    ) : (
                      <span className="text-muted">سامانه</span>
                    )}
                  </td>
                  <td className={tdClass}>{auditEventLabel(row.event)}</td>
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
            {q ? (
              <>
                رخدادی با این جست‌وجو پیدا نشد.{' '}
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
        هیچ بخشی از پنل این جدول را ویرایش یا پاک نمی‌کند؛ تنها چیزی که سطر
        برمی‌دارد، همان بازهٔ نگهداری است که در تنظیمات سیستم تعیین می‌شود.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders the searchable, paginated administrator audit trail and retention notice.
 */
