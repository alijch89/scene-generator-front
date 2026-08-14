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
import { PHOTO_STATUS } from '@/lib/admin';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDateNumeric, faDigits, faNum } from '@/lib/fa';
import type { AdminChildRow, AdminPage } from '@/lib/types';

export const metadata: Metadata = { title: 'پرونده‌های کودکان' };

const PER_PAGE = 25;

/** Server page that retrieves and renders the searchable child-profile table. */
export default async function AdminChildrenPage({
  searchParams,
}: PageProps<'/admin/children'>) {
  await requireAdmin();

  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (q) query.set('q', q);

  const children = await sapi.get<AdminPage<AdminChildRow>>(
    `/admin/children?${query}`,
  );

  const hrefFor = (next: number) => {
    const params = new URLSearchParams({ page: String(next) });
    if (q) params.set('q', q);
    return `/admin/children?${params}`;
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="پرونده‌های کودکان"
        count={`${faNum(children.total)} پرونده${q ? ' با این فیلتر' : ''}`}
      >
        <FilterBar action="/admin/children" filtered={Boolean(q)}>
          <SearchInput
            defaultValue={q}
            placeholder="نام کودک، والد یا شناسه"
            aria-label="جست‌وجو در پرونده‌ها"
          />
        </FilterBar>
      </AdminHeader>

      {/* The promise this page makes, made where it is checkable: the photo
          key never reaches the browser, because the API never sends it. */}
      <div className="mb-3.5 flex gap-3 rounded-[10px] border border-border bg-elev px-3.75 py-3.25">
        <span aria-hidden className="text-info">
          ⓘ
        </span>
        <p className="text-[12.5px] leading-[1.85] text-muted">
          عکس کودکان در این پنل نمایش داده نمی‌شود و در پاسخ سرور هم نمی‌آید.
          تنها وضعیت عکس دیده می‌شود؛ حذف یک عکس فقط از مسیر بازبینی محتوا و با
          ثبت در گزارش رخدادها ممکن است.
        </p>
      </div>

      <TableCard>
        <table className="w-full min-w-190 border-collapse text-[12.5px]">
          <caption className="sr-only">فهرست پرونده‌های کودکان</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                شناسه
              </th>
              <th scope="col" className={thClass}>
                نام کوچک
              </th>
              <th scope="col" className={thClass}>
                سن
              </th>
              <th scope="col" className={thClass}>
                والد
              </th>
              <th scope="col" className={thClass}>
                قصه‌ها
              </th>
              <th scope="col" className={thClass}>
                وضعیت عکس
              </th>
              <th scope="col" className={thClass}>
                ساخت
              </th>
            </tr>
          </thead>
          <tbody>
            {children.items.map((child) => (
              <tr key={child.id}>
                <td className={`${tdClass} font-mono text-[11.5px]`}>
                  {child.id.slice(0, 8)}
                </td>
                <td className={`${tdClass} font-semibold`}>
                  {child.firstName}
                </td>
                <td className={tdClass}>{faDigits(child.age)}</td>
                <td className={tdClass}>
                  {child.user ? (
                    <Link href={`/admin/users/${child.user.id}`}>
                      {child.user.fullName}
                    </Link>
                  ) : (
                    <span className="text-muted">— حساب حذف شده</span>
                  )}
                </td>
                <td className={tdClass}>{faNum(child.storyCount)}</td>
                <td className={tdClass}>
                  <span className="inline-block rounded-full border border-border bg-elev px-2.25 py-0.75 text-[11px] font-bold whitespace-nowrap">
                    {PHOTO_STATUS[child.photoStatus]}
                  </span>
                </td>
                <td className={`${tdClass} whitespace-nowrap`}>
                  {faDateNumeric(child.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {children.items.length === 0 ? (
          <TableEmpty>
            {q ? (
              <>
                پرونده‌ای با این جست‌وجو پیدا نشد.{' '}
                <Link href="/admin/children">همهٔ پرونده‌ها</Link>
              </>
            ) : (
              'هنوز هیچ پرونده‌ای ساخته نشده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination
        page={children.page}
        pageCount={children.pageCount}
        href={hrefFor}
      />
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders privacy-limited child-profile metadata across parent accounts.
 */
