import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  FilterSelect,
  Pagination,
  StatCard,
  StatGrid,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import { StatusBadge } from '@/components/status-badge';
import { requireAdmin, sapi } from '@/lib/dal';
import {
  faAmount,
  faCompactPrice,
  faDateNumeric,
  faNum,
  faRate,
  jalaliMonthStart,
} from '@/lib/fa';
import { getOrderStatus } from '@/lib/orders';
import type {
  AdminPaymentStatsDto,
  AdminPaymentsPageDto,
  OrderStatus,
} from '@/lib/types';

export const metadata: Metadata = { title: 'پرداخت‌ها' };

const STATUS_FILTER: { value: string; label: string }[] = [
  { value: '', label: 'همهٔ وضعیت‌ها' },
  { value: 'PAID', label: 'موفق' },
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'FAILED', label: 'ناموفق' },
  { value: 'CANCELLED', label: 'لغو شده' },
  { value: 'REFUND_PENDING', label: 'در انتظار بازپرداخت' },
  { value: 'REFUNDED', label: 'بازپرداخت‌شده' },
];

/** Narrows arbitrary URL text to a supported payment status. */
const isStatus = (v: string): v is OrderStatus =>
  STATUS_FILTER.some((s) => s.value === v && v !== '');

const PER_PAGE = 25;

/** Server page that combines month statistics with URL-filtered transactions. */
export default async function AdminPaymentsPage({
  searchParams,
}: PageProps<'/admin/payments'>) {
  await requireAdmin();

  const sp = await searchParams;
  const status =
    typeof sp.status === 'string' && isStatus(sp.status) ? sp.status : '';
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(
    1,
    Number(typeof sp.page === 'string' ? sp.page : 1) || 1,
  );

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (status) query.set('status', status);
  if (q) query.set('q', q);

  // The month boundary is Jalali, and only this side owns a Persian calendar —
  // so the cards' window is computed here and sent as a plain instant.
  const monthStart = jalaliMonthStart().toISOString();

  const [stats, payments] = await Promise.all([
    sapi.get<AdminPaymentStatsDto>(
      `/admin/payments/stats?from=${encodeURIComponent(monthStart)}`,
    ),
    sapi.get<AdminPaymentsPageDto>(`/admin/payments?${query}`),
  ]);

  const hrefFor = (next: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '') params.delete(key);
      else params.set(key, String(value));
    });
    const qs = params.toString();
    return qs ? `/admin/payments?${qs}` : '/admin/payments';
  };

  const filtered = Boolean(status || q);

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="پرداخت‌ها"
        count={`${faNum(payments.total)} تراکنش${filtered ? ' با این فیلتر' : ''}`}
      >
        {/* A plain GET form: filters live in the URL, so a row an admin found
            can be sent to a colleague as a link. */}
        <form action="/admin/payments" className="flex flex-wrap gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="نام، شمارهٔ موبایل، شمارهٔ پیگیری یا شناسه"
            aria-label="جست‌وجو در تراکنش‌ها"
            className="w-56 rounded-lg border border-border bg-surface px-2.75 py-2 text-[12.5px] text-ink"
          />
          <FilterSelect
            label="وضعیت تراکنش"
            name="status"
            defaultValue={status}
          >
            {STATUS_FILTER.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
          <button
            type="submit"
            className="rounded-lg border border-border bg-surface px-3.25 py-2 text-[12.5px] font-semibold"
          >
            اعمال
          </button>
          {filtered ? (
            <Link
              href="/admin/payments"
              className="rounded-lg border border-border bg-surface px-3.25 py-2 text-[12.5px] font-semibold text-ink hover:no-underline"
            >
              پاک کردن
            </Link>
          ) : null}
        </form>
      </AdminHeader>

      <StatGrid>
        <StatCard label="درآمد ماه" value={faCompactPrice(stats.revenue)} />
        <StatCard label="تراکنش موفق" value={faNum(stats.paidCount)} />
        <StatCard
          label="ناموفق"
          value={faNum(stats.failedCount)}
          tone={stats.failedCount > 0 ? 'error' : undefined}
          note={`نرخ ${faRate(stats.failureRate)}`}
        />
        <StatCard
          label="در انتظار"
          value={faNum(stats.pendingCount)}
          tone={stats.pendingCount > 0 ? 'warning' : undefined}
          note={faCompactPrice(stats.pendingAmount)}
        />
      </StatGrid>

      <TableCard>
        <table className="w-full min-w-205 border-collapse text-[12.5px]">
          <caption className="sr-only">فهرست تراکنش‌های پرداخت</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                شمارهٔ تراکنش
              </th>
              <th scope="col" className={thClass}>
                کاربر
              </th>
              <th scope="col" className={thClass}>
                مبلغ
              </th>
              <th scope="col" className={thClass}>
                واحد
              </th>
              <th scope="col" className={thClass}>
                وضعیت
              </th>
              <th scope="col" className={thClass}>
                تاریخ
              </th>
              <th scope="col" className={thClass}>
                <span className="sr-only">اقدام</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.items.map((payment) => {
              const status = getOrderStatus(payment.status);
              return (
                <tr key={payment.id}>
                  <td className={`${tdClass} font-mono`}>
                    <Link href={`/admin/payments/${payment.id}`}>
                      {payment.paymentRef ?? payment.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    {payment.user ? (
                      <>
                        <strong className="block font-semibold">
                          {payment.user.fullName}
                        </strong>
                        <span className="text-[11.5px] text-muted">
                          {payment.user.phone}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">— حساب حذف شده</span>
                    )}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {faAmount(payment.amount)}
                  </td>
                  <td className={tdClass}>تومان</td>
                  <td className={tdClass}>
                    <StatusBadge
                      tone={status.tone}
                      icon={status.icon}
                      className="px-2.25 py-0.75 text-[11px]"
                    >
                      {status.admin}
                    </StatusBadge>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {faDateNumeric(payment.paidAt ?? payment.createdAt)}
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/payments/${payment.id}`}
                      className="font-bold whitespace-nowrap"
                    >
                      {payment.status === 'FAILED'
                        ? 'جزئیات خطا'
                        : payment.status === 'PAID'
                          ? 'فاکتور'
                          : 'پیگیری'}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {payments.items.length === 0 ? (
          <TableEmpty>
            {filtered ? (
              <>
                تراکنشی با این فیلتر پیدا نشد.{' '}
                <Link href="/admin/payments">همهٔ تراکنش‌ها</Link>
              </>
            ) : (
              'هنوز هیچ تراکنشی ثبت نشده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination
        page={payments.page}
        pageCount={payments.pageCount}
        href={(next) => hrefFor({ page: next })}
      />

      <p className="mt-3 text-[11.5px] text-muted">
        ارقام کارت‌ها از ابتدای ماه شمسی جاری محاسبه می‌شود و فیلترهای جدول روی
        آن‌ها اثری ندارد.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders payment statistics and the searchable, filterable administrator transaction table.
 */
