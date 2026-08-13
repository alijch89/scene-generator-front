import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STORY_PRICE_RIAL } from '@/lib/config';
import { faPrice } from '@/lib/fa';
import { MockPayButtons } from './pay-buttons';

export const metadata: Metadata = { title: 'پرداخت (نمونهٔ توسعه)' };

/**
 * The dev stand-in for the bank. It renders the design's checkout summary and
 * its buttons call the same signed callback a real gateway would — so the whole
 * money path runs end to end with no bank involved.
 *
 * Deliberately unauthenticated: a real gateway page has no session either. It
 * is handed the signed callback URL exactly the way a gateway is, and it can
 * settle nothing on its own — the signature does that.
 */
export default async function MockPaymentPage({
  params,
  searchParams,
}: PageProps<'/pay/mock/[orderId]'>) {
  const { orderId } = await params;
  const { callback, amount } = await searchParams;

  // Off when a real gateway is configured: a page that pays for things must
  // never ship to real users.
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE === 'link') notFound();
  if (typeof callback !== 'string') notFound();

  const rial = Number(amount) || STORY_PRICE_RIAL;

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
            بازگشتِ امضاشده‌ای را صدا می‌زنند که درگاه واقعی صدا می‌زند.
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
              {orderId}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline gap-2.5 border-t border-border pt-4">
          <strong className="text-[15px]">مبلغ قابل پرداخت</strong>
          <strong className="ms-auto font-display text-[22px]">
            {faPrice(rial)}
          </strong>
        </div>

        <MockPayButtons callback={callback} />

        <p className="mt-3 text-center text-[12px] leading-[1.8] text-muted">
          با پرداخت، <a href="/terms">شرایط استفاده</a> را می‌پذیرید.
        </p>
      </div>
    </main>
  );
}
