import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminHeader, MeterRow, Panel, StatGrid } from '@/components/admin/ui';
import { requireAdmin, sapi } from '@/lib/dal';
import { faCompactPrice, faNum, faPrice, faRate } from '@/lib/fa';
import { ORDER_STATUS } from '@/lib/orders';
import type {
  AdminOrdersOverviewDto,
  OrderStatus,
  StoryStatus,
} from '@/lib/types';

export const metadata: Metadata = { title: 'سفارش‌ها' };

/** The order of the lifecycle, not the enum. */
const STATUS_ORDER: OrderStatus[] = ['PAID', 'PENDING', 'FAILED', 'CANCELLED'];

const STATUS_COLOR: Record<OrderStatus, string> = {
  PAID: 'var(--sh-success)',
  PENDING: 'var(--sh-warning)',
  FAILED: 'var(--sh-error)',
  CANCELLED: 'var(--sh-muted)',
};

/** A story's whole journey, in the order it travels it. */
const STORY_FLOW: { status: StoryStatus; label: string; color: string }[] = [
  { status: 'DRAFT', label: 'پیش‌نویس جادوگر', color: 'var(--sh-muted)' },
  {
    status: 'AWAITING_PAYMENT',
    label: 'در انتظار پرداخت',
    color: 'var(--sh-warning)',
  },
  { status: 'GENERATING', label: 'در حال ساخت', color: 'var(--sh-info)' },
  { status: 'READY', label: 'آماده', color: 'var(--sh-success)' },
  { status: 'FAILED', label: 'ناموفق', color: 'var(--sh-error)' },
];

function Line({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'success' | 'warning' | 'error';
}) {
  return (
    <div className="flex text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span
        className={
          tone === 'error'
            ? 'ms-auto font-semibold text-error'
            : tone === 'warning'
              ? 'ms-auto font-semibold text-warning'
              : tone === 'success'
                ? 'ms-auto font-semibold text-success'
                : 'ms-auto font-semibold'
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The design's اشتراک‌ها screen, rebuilt. It measured plan mix, MRR and churn —
 * none of which exist once monetization is one static price per story. What
 * does exist is a lifecycle: a story is drafted, an order is raised, a bank
 * either settles it or does not, and generation either delivers or does not.
 * That is what this page measures.
 */
export default async function AdminOrdersPage() {
  await requireAdmin();

  const overview = await sapi.get<AdminOrdersOverviewDto>('/admin/orders');
  const { statuses, stories, needsAction, orderTotal } = overview;

  const paid = statuses.PAID;
  const averageOrder = paid.count === 0 ? 0 : paid.amount / paid.count;
  const storyTotal = Object.values(stories).reduce((sum, n) => sum + n, 0);

  const share = (n: number, of: number) => (of === 0 ? 0 : (n / of) * 100);

  const actions = [
    needsAction.paidButFailed > 0 && {
      tone: 'var(--sh-error)',
      text: `${faNum(needsAction.paidButFailed)} قصه با وجود پرداخت موفق ساخته نشد.`,
      href: '/admin/payments?status=PAID',
      cta: 'بررسی پرداخت‌های موفق ←',
    },
    needsAction.stalePending > 0 && {
      tone: 'var(--sh-warning)',
      text: `${faNum(needsAction.stalePending)} سفارش بیش از ۲۴ ساعت در انتظار پرداخت مانده است.`,
      href: '/admin/payments?status=PENDING',
      cta: 'دیدن سفارش‌های معلق ←',
    },
    needsAction.recentFailed > 0 && {
      tone: 'var(--sh-info)',
      text: `${faNum(needsAction.recentFailed)} پرداخت ناموفق در هفت روز گذشته ثبت شده است.`,
      href: '/admin/payments?status=FAILED',
      cta: 'رفتن به پرداخت‌ها ←',
    },
  ].filter(Boolean) as {
    tone: string;
    text: string;
    href: string;
    cta: string;
  }[];

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader title="سفارش‌ها" count={`${faNum(orderTotal)} سفارش`} />

      <StatGrid>
        <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
          <p className="mb-2 text-[11.5px] font-semibold text-muted">
            درآمد کل
          </p>
          <strong className="text-[21px]">{faCompactPrice(paid.amount)}</strong>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
          <p className="mb-2 text-[11.5px] font-semibold text-muted">
            نرخ تبدیل به پرداخت
          </p>
          <strong className="text-[21px]">{faRate(overview.conversion)}</strong>
          <p className="mt-1.75 text-[11.5px] text-muted">
            {faNum(paid.count)} از {faNum(orderTotal)} سفارش
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
          <p className="mb-2 text-[11.5px] font-semibold text-muted">
            میانگین ارزش سفارش
          </p>
          <strong className="text-[21px]">{faPrice(averageOrder)}</strong>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
          <p className="mb-2 text-[11.5px] font-semibold text-muted">
            قصه‌های تحویل‌شده
          </p>
          <strong className="text-[21px]">{faNum(stories.READY)}</strong>
        </div>
      </StatGrid>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-3.5">
        <Panel title="توزیع وضعیت سفارش‌ها">
          <div className="flex flex-col gap-3.5">
            {STATUS_ORDER.map((status) => (
              <MeterRow
                key={status}
                label={ORDER_STATUS[status].admin}
                value={`${faNum(statuses[status].count)} · ${faRate(
                  share(statuses[status].count, orderTotal),
                )}`}
                share={share(statuses[status].count, orderTotal)}
                color={STATUS_COLOR[status]}
              />
            ))}
          </div>
        </Panel>

        <Panel title="مسیر قصه‌ها">
          <div className="flex flex-col gap-3.5">
            {STORY_FLOW.map((stage) => (
              <MeterRow
                key={stage.status}
                label={stage.label}
                value={`${faNum(stories[stage.status])} · ${faRate(
                  share(stories[stage.status], storyTotal),
                )}`}
                share={share(stories[stage.status], storyTotal)}
                color={stage.color}
              />
            ))}
          </div>
          <p className="mt-4 text-[11.5px] leading-[1.9] text-muted">
            پیش‌نویس‌ها هنوز به مرحلهٔ پرداخت نرسیده‌اند و هزینه‌ای ندارند؛ ساخت
            فقط پس از تأیید بانک شروع می‌شود.
          </p>
        </Panel>

        <Panel title="سلامت درآمد">
          <div className="flex flex-col gap-2.75">
            <Line label="درآمد تأییدشده" value={faPrice(paid.amount)} />
            <Line
              label="در انتظار وصول"
              value={faPrice(statuses.PENDING.amount)}
              tone={statuses.PENDING.count > 0 ? 'warning' : undefined}
            />
            <Line
              label="از دست‌رفته (ناموفق)"
              value={faPrice(statuses.FAILED.amount)}
              tone={statuses.FAILED.count > 0 ? 'error' : undefined}
            />
            <Line
              label="لغوشده توسط کاربر"
              value={faPrice(statuses.CANCELLED.amount)}
            />
            <Line
              label="قصه‌های آمادهٔ تحویل‌شده"
              value={faNum(stories.READY)}
              tone={stories.READY > 0 ? 'success' : undefined}
            />
          </div>
        </Panel>

        <Panel title="نیازمند اقدام">
          {actions.length === 0 ? (
            <p className="text-[12.5px] leading-[1.9] text-muted">
              چیزی در انتظار رسیدگی نیست — هیچ سفارش معلق قدیمی، پرداخت ناموفق
              تازه یا قصهٔ پرداخت‌شدهٔ شکست‌خورده‌ای وجود ندارد.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {actions.map((action) => (
                <div key={action.href} className="flex items-start gap-2.25">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.75 flex-none rounded-full"
                    style={{ background: action.tone }}
                  />
                  <span className="flex-1 text-[12.5px] leading-[1.9]">
                    {action.text}
                    <Link
                      href={action.href}
                      className="mt-1 block text-[12.5px] font-bold"
                    >
                      {action.cta}
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </section>
  );
}
