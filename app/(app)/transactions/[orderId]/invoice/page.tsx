import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmptyState, PrimaryLink, SecondaryLink } from '@/components/app/ui';
import { Logo } from '@/components/logo';
import { StatusBadge } from '@/components/status-badge';
import { ApiError } from '@/lib/api';
import { sapi, verifySession } from '@/lib/dal';
import { faDate, faDigits, faPrice } from '@/lib/fa';
import { getOrderStatus } from '@/lib/orders';
import type { OrderDto } from '@/lib/types';
import { PrintButton } from './print-button';

export const metadata: Metadata = { title: 'فاکتور' };

/** Displays one labelled invoice value. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-border py-2.5 text-[13.5px] last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="ms-auto text-left font-semibold">{value}</span>
    </div>
  );
}

/**
 * «دریافت فاکتور». Ownership is the API's call — /orders/:id is scoped by the
 * session's userId, so another parent's invoice is a 404 here, not a page with
 * someone else's name on it.
 */
/** Server page that loads a dynamic owned order for invoice rendering. */
export default async function InvoicePage({
  params,
}: PageProps<'/transactions/[orderId]/invoice'>) {
  const { orderId } = await params;

  const [user, order] = await Promise.all([
    verifySession(),
    sapi.get<OrderDto>(`/orders/${orderId}`).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
  ]);

  if (!order) notFound();

  // An unpaid order has no invoice to give — say so, and offer the thing the
  // parent actually wants next.
  if (order.status !== 'PAID') {
    const status = getOrderStatus(order.status);
    const canRetryPayment =
      order.status === 'PENDING' ||
      order.status === 'FAILED' ||
      order.status === 'CANCELLED';
    return (
      <section className="mx-auto max-w-130 py-[5vh]">
        <EmptyState
          icon={status.icon}
          title="برای این سفارش هنوز فاکتوری صادر نشده است."
          action={
            <div className="flex flex-wrap justify-center gap-2.75">
              {canRetryPayment ? (
                <PrimaryLink href={`/stories/${order.storyId}/pay`}>
                  {order.status === 'PENDING'
                    ? 'ادامهٔ پرداخت'
                    : 'پرداخت دوباره'}
                </PrimaryLink>
              ) : null}
              <SecondaryLink href="/transactions">صورت‌حساب</SecondaryLink>
            </div>
          }
        >
          وضعیت این سفارش «{status.parent}» است. فاکتور فقط پس از تأیید پرداخت
          صادر می‌شود.
        </EmptyState>
      </section>
    );
  }

  const status = getOrderStatus(order.status);

  return (
    <section className="mx-auto max-w-160 animate-[pageIn_.4s_ease_both]">
      <div className="mb-4 flex flex-wrap items-center gap-2.5 print:hidden">
        <Link href="/transactions" className="text-[13px] font-bold">
          ← بازگشت به صورت‌حساب
        </Link>
        <PrintButton className="ms-auto rounded-xl border border-border bg-elev px-4 py-2.5 text-[13px] font-semibold text-ink" />
      </div>

      <article className="rounded-[22px] border border-border bg-surface p-6.5 shadow-card print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="mb-6 flex flex-wrap items-start gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-2.5">
            <Logo className="size-9" />
            <div>
              <strong className="block font-display text-[17px]">
                شهرزاد قصه‌گو
              </strong>
              <span className="text-[12px] text-muted">
                کتاب‌های صوتی‌تصویری کودکان
              </span>
            </div>
          </div>
          <div className="ms-auto text-left">
            <strong className="block font-display text-[19px]">فاکتور</strong>
            <StatusBadge tone={status.tone} icon={status.icon} className="mt-1">
              {status.parent}
            </StatusBadge>
          </div>
        </header>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-bold text-muted">خریدار</p>
            <strong className="block text-[14px]">{user.fullName}</strong>
            <span className="text-[12.5px] text-muted">{user.phone}</span>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-bold text-muted">
              مشخصات فاکتور
            </p>
            {/* The order id is the invoice number — there is exactly one of
                each per story, so a second numbering scheme would only be
                another thing to keep in step. */}
            <strong className="block font-mono text-[13px] break-all">
              {order.id}
            </strong>
            <span className="text-[12.5px] text-muted">
              {faDate(order.paidAt ?? order.createdAt)}
            </span>
          </div>
        </div>

        <table className="mb-6 w-full border-collapse text-[13.5px]">
          <thead className="bg-elev print:bg-transparent">
            <tr>
              <th
                scope="col"
                className="rounded-s-xl px-4 py-3 text-right font-bold"
              >
                شرح
              </th>
              <th
                scope="col"
                className="rounded-e-xl px-4 py-3 text-left font-bold"
              >
                مبلغ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3.5">
                ساخت قصهٔ سفارشی
                {order.storyTitle ? ` — «${order.storyTitle}»` : ''}
              </td>
              <td className="px-4 py-3.5 text-left whitespace-nowrap">
                {faPrice(order.amount)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3.5 font-bold">مبلغ کل</td>
              <td className="px-4 py-3.5 text-left font-display text-[17px] whitespace-nowrap">
                {faPrice(order.amount)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="rounded-[18px] border border-border bg-elev px-4.5 py-3 print:bg-transparent">
          <Row
            label="تاریخ پرداخت"
            value={faDate(order.paidAt ?? order.createdAt)}
          />
          {order.paymentRef ? (
            <Row
              label="شمارهٔ پیگیری بانک"
              value={
                <span className="font-mono">{faDigits(order.paymentRef)}</span>
              }
            />
          ) : null}
          <Row label="روش پرداخت" value="درگاه پرداخت اینترنتی" />
        </div>

        <p className="mt-5 text-[11.5px] leading-[2] text-muted">
          این فاکتور به‌صورت خودکار صادر شده و بدون مهر و امضا معتبر است. برای
          هر پرسشی دربارهٔ این پرداخت، شمارهٔ پیگیری بالا را به پشتیبانی بدهید.
        </p>
      </article>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders a print-friendly invoice for one payment order owned by the parent.
 */
