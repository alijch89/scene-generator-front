import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/admin/ui';
import { StatusBadge } from '@/components/status-badge';
import { ApiError } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDateNumeric, faDateTime, faDigits, faPrice } from '@/lib/fa';
import { getOrderStatus, PAYMENT_EVENT_LABEL } from '@/lib/orders';
import type { AdminPaymentDetailDto } from '@/lib/types';

export const metadata: Metadata = { title: 'جزئیات تراکنش' };

const STORY_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'پیش‌نویس',
  AWAITING_PAYMENT: 'در انتظار پرداخت',
  GENERATING: 'در حال ساخت',
  READY: 'آماده',
  FAILED: 'ناموفق',
};

/** Displays one labelled value in the transaction detail grid. */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-border py-2.5 text-[12.5px] last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="ms-auto text-left font-semibold">{value}</span>
    </div>
  );
}

/**
 * One transaction in full. This single page answers all three of the design's
 * row actions — فاکتور, پیگیری and جزئیات خطا were three labels for "show me
 * everything about this payment", and the honest version of each is the same
 * record plus the audit trail the callback left.
 */
/** Server page that retrieves one transaction by its dynamic order identifier. */
export default async function AdminPaymentDetailPage({
  params,
}: PageProps<'/admin/payments/[orderId]'>) {
  await requireAdmin();
  const { orderId } = await params;

  const payment = await sapi
    .get<AdminPaymentDetailDto>(`/admin/payments/${orderId}`)
    .catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    });

  if (!payment) notFound();

  const status = getOrderStatus(payment.status);

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Link href="/admin/payments" className="text-[12.5px] font-bold">
          ← پرداخت‌ها
        </Link>
        <h1 className="font-mono text-[16px] font-bold">
          {payment.paymentRef ?? payment.id.slice(0, 8)}
        </h1>
        <StatusBadge tone={status.tone} icon={status.icon}>
          {status.admin}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-3.5">
        <Panel title="تراکنش">
          <Field label="مبلغ" value={faPrice(payment.amount)} />
          <Field label="واحد" value={payment.currency} />
          <Field
            label="شمارهٔ پیگیری بانک"
            value={
              payment.paymentRef ? (
                <span className="font-mono">
                  {faDigits(payment.paymentRef)}
                </span>
              ) : (
                <span className="text-muted">— ثبت نشده</span>
              )
            }
          />
          <Field label="ثبت سفارش" value={faDateNumeric(payment.createdAt)} />
          <Field
            label="تأیید پرداخت"
            value={
              payment.paidAt ? (
                faDateNumeric(payment.paidAt)
              ) : (
                <span className="text-muted">— پرداخت نشده</span>
              )
            }
          />
          <Field
            label="شناسهٔ سفارش"
            value={
              <span className="font-mono text-[11.5px]">{payment.id}</span>
            }
          />
        </Panel>

        <Panel title="خریدار و قصه">
          {payment.user ? (
            <>
              <Field
                label="کاربر"
                value={
                  <Link href={`/admin/users/${payment.user.id}`}>
                    {payment.user.fullName}
                  </Link>
                }
              />
              <Field label="شمارهٔ موبایل" value={payment.user.phone ?? '—'} />
            </>
          ) : (
            <Field
              label="کاربر"
              value={<span className="text-muted">— حساب حذف شده</span>}
            />
          )}
          <Field
            label="قصه"
            value={
              payment.storyTitle ?? (
                <span className="text-muted">— هنوز بی‌نام</span>
              )
            }
          />
          <Field
            label="کودک"
            value={payment.childName ?? <span className="text-muted">—</span>}
          />
          <Field
            label="وضعیت ساخت"
            value={
              payment.storyStatus
                ? STORY_STATUS_LABEL[payment.storyStatus]
                : '—'
            }
          />
        </Panel>

        {/* Money taken and no story to show for it — the one failure worth
            putting in front of an admin without being asked. */}
        {payment.status === 'PAID' && payment.storyStatus === 'FAILED' ? (
          <Panel
            title="ساخت قصه پس از پرداخت شکست خورد"
            className="border-error"
          >
            <p role="alert" className="text-[12.5px] leading-[1.9] text-muted">
              {payment.failureReason ??
                'دلیلی ثبت نشده است. صف تولید را بررسی کنید.'}
            </p>
            <Link
              href="/admin/jobs"
              className="mt-3 inline-block text-[12.5px] font-bold"
            >
              رفتن به صف تولید ←
            </Link>
          </Panel>
        ) : null}

        <Panel title="رد رخدادها">
          {payment.events.length === 0 ? (
            <p className="text-[12.5px] text-muted">
              هنوز رخدادی ثبت نشده است — درگاه پرداخت بازگشتی نداشته است.
            </p>
          ) : (
            <ol className="flex flex-col gap-3">
              {payment.events.map((event) => (
                <li key={event.id} className="flex gap-2.5 text-[12.5px]">
                  <span
                    aria-hidden
                    className="mt-1.75 size-1.75 flex-none rounded-full bg-[var(--sh-primary)]"
                  />
                  <span className="flex-1">
                    <strong className="block font-semibold">
                      {PAYMENT_EVENT_LABEL[event.event] ?? event.event}
                    </strong>
                    <span className="text-[11.5px] text-muted">
                      {faDateTime(event.createdAt)}
                      {event.ip ? ` · از ${event.ip}` : ''}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders one transaction with payer, story, payment, failure, and callback-audit details.
 */
