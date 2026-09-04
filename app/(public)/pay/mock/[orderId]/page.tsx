import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { request } from '@/lib/api';
import { faPrice } from '@/lib/fa';
import { MockPayButtons } from './pay-buttons';

export const metadata: Metadata = { title: 'پرداخت (نمونهٔ توسعه)' };

/** What the simulator exposes about an order: the amount, and nothing else. */
interface MockOrderSummary {
  id: string;
  amount: number;
  currency: string;
  status: string;
  settled: boolean;
}

/**
 * The dev stand-in for the bank.
 *
 * It behaves the way a gateway does, which is the whole point: it is handed no
 * signed URL, it reads the order from the API, and its buttons ask the API to
 * *authorise* the payment. Only then does a signed return URL exist, and it is
 * minted server-side for that one outcome.
 *
 * The previous version took the signed callback straight off its own query
 * string, which made it both a free-money machine and an open redirect —
 * `?callback=https://phishing.example` rendered a page branded «درگاه نمونه»
 * with a «پرداخت» button pointing at the attacker.
 *
 * Deliberately unauthenticated: a real gateway page has no session either. The
 * API answers here only outside production and only while the simulator is the
 * configured gateway.
 */
export default async function MockPaymentPage({
  params,
}: PageProps<'/pay/mock/[orderId]'>) {
  const { orderId } = await params;

  // Off when a real gateway is configured: a page that pays for things must
  // never ship to real users. The API enforces the same rule independently,
  // so a build made without this flag still cannot settle anything.
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE === 'link') notFound();

  const order = await request<MockOrderSummary>(
    `/payments/mock/${orderId}`,
  ).catch(() => null);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-135 px-5 py-[clamp(24px,4vw,44px)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-[11px] bg-linear-to-br from-brand to-warm text-[15px] text-brand-fg"
        >
          ★
        </span>
        <strong className="font-display text-[16.5px]">درگاه نمونه</strong>
        <span className="ms-auto flex items-center gap-1.75 text-[12.5px] font-semibold text-success">
          <span aria-hidden>🔒</span>پرداخت امن
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5.5 shadow-card-lg">
        <h1 className="mb-4.5 font-display text-[clamp(22px,3.6vw,28px)]">
          تکمیل خرید
        </h1>

        <div
          role="note"
          className="mb-4 rounded-[18px] border border-warning bg-[color-mix(in_srgb,var(--sh-warning)_14%,var(--sh-surface))] px-4.5 py-3.5"
        >
          <p className="text-[13px] leading-[1.9]">
            <span aria-hidden className="me-1.5 font-bold text-warning">
              ⚠
            </span>
            این صفحهٔ نمونهٔ محیط توسعه است و به بانک وصل نیست. دکمه‌ها همان
            مسیری را می‌روند که درگاه واقعی می‌رود: تأیید پرداخت روی سرور ثبت
            می‌شود و بازگشتِ امضاشده تازه پس از آن ساخته می‌شود.
          </p>
        </div>

        <dl className="flex flex-col gap-2.75 text-[13.5px]">
          <div className="flex">
            <dt className="text-muted">شرح</dt>
            <dd className="ms-auto font-semibold">ساخت یک قصهٔ سفارشی</dd>
          </div>
          <div className="flex">
            <dt className="text-muted">شمارهٔ سفارش</dt>
            <dd className="ms-auto text-[12px]" dir="ltr">
              {order.id}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline gap-2.5 border-t border-border pt-4">
          <strong className="text-[15px]">مبلغ قابل پرداخت</strong>
          <strong className="ms-auto font-display text-[22px]">
            {faPrice(order.amount)}
          </strong>
        </div>

        {order.settled ? (
          <p className="mt-4.5 rounded-[14px] border border-border bg-elev p-4 text-center text-[13.5px]">
            این سفارش پیش‌تر تعیین‌تکلیف شده است.
          </p>
        ) : (
          <MockPayButtons orderId={order.id} />
        )}

        <p className="mt-3 text-center text-[12px] leading-[1.8] text-muted">
          با پرداخت، <a href="/terms">شرایط استفاده</a> را می‌پذیرید.
        </p>
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders the development-only payment stand-in from the API's own order summary.
 */
