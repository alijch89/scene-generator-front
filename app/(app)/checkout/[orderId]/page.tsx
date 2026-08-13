import type { Metadata } from 'next';
import Link from 'next/link';
import { PrimaryLink, SecondaryLink } from '@/components/app/ui';
import { ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';
import { faDate, faDigits, faPrice } from '@/lib/fa';
import type { OrderDto } from '@/lib/types';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'نتیجهٔ پرداخت' };

/** The design's centred result panel — one shape, five outcomes. */
function Panel({
  icon,
  tone,
  title,
  lead,
  children,
  actions,
}: {
  icon: string;
  tone: 'success' | 'error' | 'warning' | 'neutral';
  title: string;
  lead: string;
  children?: React.ReactNode;
  actions: React.ReactNode;
}) {
  const badge = {
    success:
      'border-success text-success bg-[color-mix(in_srgb,var(--sh-success)_16%,var(--sh-surface))]',
    error:
      'border-error text-error bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))]',
    warning:
      'border-warning text-warning bg-[color-mix(in_srgb,var(--sh-warning)_14%,var(--sh-surface))]',
    neutral: 'border-border text-muted bg-elev',
  }[tone];

  return (
    <section
      // A failed payment is an alert; a success is just a result.
      {...(tone === 'error' ? { role: 'alert' } : {})}
      className="mx-auto max-w-130 animate-[pageIn_.5s_ease_both] py-[5vh] text-center"
    >
      <span
        aria-hidden
        className={cn(
          'mx-auto mb-5.5 grid size-16.5 place-items-center rounded-[20px] border text-[26px]',
          badge,
        )}
      >
        {icon}
      </span>
      <h1 className="mb-2.5 font-display text-[clamp(23px,4vw,28px)]">{title}</h1>
      <p className="mb-5.5 text-[15px] leading-[1.95] text-muted">{lead}</p>
      {children}
      <div className="flex flex-wrap justify-center gap-2.75">{actions}</div>
    </section>
  );
}

/** «شمارهٔ پیگیری / مبلغ / تاریخ» — the design's receipt strip. */
function Receipt({ order }: { order: OrderDto }) {
  const rows = [
    order.paymentRef ? ['شمارهٔ پیگیری', faDigits(order.paymentRef)] : null,
    ['مبلغ', faPrice(order.amount)],
    [order.paidAt ? 'تاریخ پرداخت' : 'تاریخ ثبت', faDate(order.paidAt ?? order.createdAt)],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mb-5.5 rounded-[20px] border border-border bg-surface p-4.5 text-right shadow-card">
      {rows.map(([label, value]) => (
        <div key={label} className="flex py-1.75 text-[13.5px]">
          <span className="text-muted">{label}</span>
          <span className="ms-auto font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default async function CheckoutPage({
  params,
}: PageProps<'/checkout/[orderId]'>) {
  const { orderId } = await params;

  // The callback sends forged and unknown orders here alike, so this page must
  // not assume the id is real — and must not say which of the two it was.
  const order =
    orderId === 'invalid'
      ? null
      : await sapi.get<OrderDto>(`/orders/${orderId}`).catch((err) => {
          if (err instanceof ApiError && err.status === 404) return null;
          throw err;
        });

  if (!order) {
    return (
      <Panel
        icon="✕"
        tone="error"
        title="این پرداخت شناسایی نشد."
        lead="لینک بازگشت معتبر نبود یا منقضی شده است. اگر مبلغی کم شده، تا نیم ساعت به حساب شما برمی‌گردد."
        actions={
          <>
            <PrimaryLink href="/library">قصه‌های من</PrimaryLink>
            <SecondaryLink href="/help">تماس با پشتیبانی</SecondaryLink>
          </>
        }
      />
    );
  }

  if (order.status === 'PAID') {
    return (
      <Panel
        icon="✓"
        tone="success"
        title="پرداخت انجام شد!"
        lead="ساخت قصه همین حالا شروع شد. می‌توانید تماشا کنید یا صفحه را ببندید — وقتی آماده شد خبرتان می‌کنیم."
        actions={
          <>
            <PrimaryLink href={`/stories/${order.storyId}/generating`}>
              دیدن ساخت قصه
            </PrimaryLink>
            <SecondaryLink href="/library">قصه‌های من</SecondaryLink>
          </>
        }
      >
        <Receipt order={order} />
      </Panel>
    );
  }

  if (order.status === 'FAILED') {
    return (
      <Panel
        icon="✕"
        tone="error"
        title="پرداخت شما کامل نشد."
        lead="بانک تراکنش را تأیید نکرد. مبلغی از حساب شما کم نشده است و قصه‌ای هم ساخته نشد."
        actions={
          <>
            <PrimaryLink href={`/stories/${order.storyId}/pay`}>
              تلاش دوباره
            </PrimaryLink>
            <SecondaryLink href="/help">تماس با پشتیبانی</SecondaryLink>
          </>
        }
      >
        <div className="mb-5.5 rounded-[18px] border border-border bg-elev px-4.5 py-4 text-right">
          <p className="mb-2 text-[13px] font-bold">چه کاری کمک می‌کند؟</p>
          <ul className="list-disc ps-5 text-[13px] leading-[2] text-muted">
            <li>موجودی و سقف خرید اینترنتی کارت را بررسی کنید</li>
            <li>کارت دیگری امتحان کنید</li>
            <li>یا چند دقیقه بعد دوباره تلاش کنید</li>
          </ul>
        </div>
      </Panel>
    );
  }

  if (order.status === 'CANCELLED') {
    return (
      <Panel
        icon="↺"
        tone="neutral"
        title="پرداخت لغو شد"
        lead="هیچ مبلغی کم نشد و قصه‌ای ساخته نشد. هر وقت خواستید می‌توانید ادامه دهید."
        actions={
          <>
            <PrimaryLink href={`/stories/${order.storyId}/pay`}>
              بازگشت به پرداخت
            </PrimaryLink>
            <SecondaryLink href="/dashboard">بازگشت به خانه</SecondaryLink>
          </>
        }
      />
    );
  }

  // PENDING — either the parent came back without paying, or the bank has not
  // answered yet. The design's «در انتظار» panel covers both.
  return (
    <Panel
      icon="⏳"
      tone="warning"
      title="این پرداخت هنوز تکمیل نشده است"
      lead="اگر پرداخت کرده‌اید، تأیید بانک تا چند دقیقه طول می‌کشد و نتیجه را ایمیل می‌کنیم. در غیر این صورت می‌توانید همین حالا ادامه دهید."
      actions={
        <>
          <PrimaryLink href={`/stories/${order.storyId}/pay`}>
            ادامهٔ پرداخت
          </PrimaryLink>
          <SecondaryLink href="/dashboard">بازگشت به خانه</SecondaryLink>
        </>
      }
    >
      <Receipt order={order} />
      <p className="mb-5.5 text-[12.5px] text-muted">
        وضعیت این صفحه با هر بار باز کردن به‌روز می‌شود.{' '}
        <Link href={`/checkout/${order.id}`}>بررسی دوباره</Link>
      </p>
    </Panel>
  );
}
