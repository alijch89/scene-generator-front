import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState, PageTitle, PrimaryLink } from '@/components/app/ui';
import { StatusBadge } from '@/components/status-badge';
import { sapi } from '@/lib/dal';
import { faDate, faDigits, faPrice } from '@/lib/fa';
import { ORDER_STATUS, orderAction } from '@/lib/orders';
import type { TransactionsDto } from '@/lib/types';

export const metadata: Metadata = { title: 'صورت‌حساب' };

/**
 * The design's billing page, repurposed as transaction history — its table
 * already had the right columns (تاریخ / شرح / مبلغ / وضعیت / action).
 *
 * The stored payment-method card above it is gone: nothing is ever charged
 * again, so there is no card to keep. Every row here is one story that was
 * bought once, at the price on the day it was bought.
 */
export default async function TransactionsPage() {
  const { items, summary } = await sapi.get<TransactionsDto>('/orders');

  return (
    <section className="max-w-225 animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="صورت‌حساب"
        lead="هر قصه یک‌بار خریداری می‌شود؛ اشتراک و پرداخت دوره‌ای در کار نیست."
      />

      {items.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="هنوز تراکنشی ندارید."
          action={<PrimaryLink href="/wizard">ساخت قصهٔ تازه</PrimaryLink>}
        >
          وقتی اولین قصه‌تان را بسازید، رسید پرداخت همین‌جا نگه داشته می‌شود.
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="min-w-45 flex-1 rounded-[22px] border border-border bg-surface p-5.5 shadow-card">
              <p className="mb-1.5 text-[12.5px] font-bold text-muted">
                مجموع پرداخت‌ها
              </p>
              <strong className="font-display text-[26px]">
                {faPrice(summary.paidTotal)}
              </strong>
            </div>
            <div className="min-w-45 flex-1 rounded-[22px] border border-border bg-surface p-5.5 shadow-card">
              <p className="mb-1.5 text-[12.5px] font-bold text-muted">
                قصه‌های خریداری‌شده
              </p>
              <strong className="font-display text-[26px]">
                {faDigits(summary.paidCount)}
              </strong>
            </div>
          </div>

          {/* The five columns need room to stay readable; on a narrow phone
              the table scrolls sideways rather than folding into ambiguity. */}
          <div className="overflow-x-auto rounded-[22px] border border-border bg-surface shadow-card">
            <table className="w-full min-w-140 border-collapse text-[13.5px]">
              <caption className="sr-only">
                تاریخچهٔ تراکنش‌های حساب شما
              </caption>
              <thead className="bg-elev">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-right font-bold">
                    تاریخ
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right font-bold">
                    شرح
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right font-bold">
                    مبلغ
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right font-bold">
                    وضعیت
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    <span className="sr-only">اقدام</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((order) => {
                  const status = ORDER_STATUS[order.status];
                  const action = orderAction(order.status);

                  return (
                    <tr key={order.id} className="border-t border-border">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {faDate(order.paidAt ?? order.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        {order.storyTitle
                          ? `قصهٔ «${order.storyTitle}»`
                          : 'ساخت یک قصه'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {faPrice(order.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge tone={status.tone} icon={status.icon}>
                          {status.parent}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3.5 text-left">
                        <Link
                          href={
                            action.kind === 'invoice'
                              ? `/transactions/${order.id}/invoice`
                              : `/stories/${order.storyId}/pay`
                          }
                          className="text-[12.5px] font-bold whitespace-nowrap"
                        >
                          {action.label}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[12.5px] text-muted">
            برای پیگیری یک پرداخت، شمارهٔ پیگیری روی فاکتور را به پشتیبانی
            بدهید. <Link href="/help">راهنما و پشتیبانی</Link>
          </p>
        </>
      )}
    </section>
  );
}
