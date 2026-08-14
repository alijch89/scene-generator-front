import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  Delta,
  MeterRow,
  Panel,
  RangeTabs,
  StatGrid,
  WeekBars,
} from '@/components/admin/ui';
import { requireAdmin, sapi } from '@/lib/dal';
import {
  faAgo,
  faCompactPrice,
  faDuration,
  faElapsed,
  faNum,
  faRate,
} from '@/lib/fa';
import type { AdminDashboardDto, AdminRange } from '@/lib/types';

export const metadata: Metadata = { title: 'داشبورد عملیات' };

const RANGES: AdminRange[] = ['24h', '7d', '30d'];
const RANGE_LABEL: Record<AdminRange, string> = {
  '24h': '۲۴ ساعت گذشته',
  '7d': '۷ روز گذشته',
  '30d': '۳۰ روز گذشته',
};

/** One card, with the design's label / figure / movement stack. */
function Card({
  label,
  value,
  children,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
  tone?: 'error' | 'warning' | 'success';
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3.75 shadow-card">
      <p className="mb-2 text-[11.5px] font-semibold text-muted">{label}</p>
      <strong
        className={
          tone === 'error'
            ? 'text-[23px] text-error'
            : tone === 'warning'
              ? 'text-[23px] text-warning'
              : 'text-[23px]'
        }
      >
        {value}
      </strong>
      {children ? <p className="mt-1.75">{children}</p> : null}
    </div>
  );
}

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span className="ms-auto font-semibold">{value}</span>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: PageProps<'/admin'>) {
  await requireAdmin();

  const sp = await searchParams;
  const range: AdminRange =
    typeof sp.range === 'string' && RANGES.includes(sp.range as AdminRange)
      ? (sp.range as AdminRange)
      : '7d';

  const data = await sapi.get<AdminDashboardDto>(
    `/admin/dashboard?range=${range}`,
  );
  const { cards, queue, production, attention } = data;

  // Only rows that genuinely need a person. An empty list is the good case and
  // says so, rather than showing four zeroes.
  const actions = [
    attention.pendingModeration > 0 && {
      key: 'moderation',
      tone: 'var(--sh-error)',
      text: `${faNum(attention.pendingModeration)} مورد در صف بازبینی محتواست.`,
      href: '/admin/moderation',
      cta: 'بازبینی',
    },
    attention.failedStories > 0 && {
      key: 'failed',
      tone: 'var(--sh-error)',
      text: `${faNum(attention.failedStories)} قصه ناموفق مانده و ساخته نشده است.`,
      href: '/admin/stories?status=FAILED',
      cta: 'مشاهده',
    },
    attention.failedPayments24h > 0 && {
      key: 'payments',
      tone: 'var(--sh-warning)',
      text: `${faNum(attention.failedPayments24h)} پرداخت ناموفق در ۲۴ ساعت گذشته ثبت شده است.`,
      href: '/admin/payments?status=FAILED',
      cta: 'بررسی',
    },
    attention.longRunningJobs > 0 && {
      key: 'jobs',
      tone: 'var(--sh-info)',
      text: `${faNum(attention.longRunningJobs)} کار تولید بیش از ۱۰ دقیقه در حال اجراست.`,
      href: '/admin/jobs?status=RUNNING',
      cta: 'مشاهده',
    },
  ].filter(Boolean) as {
    key: string;
    tone: string;
    text: string;
    href: string;
    cta: string;
  }[];

  const meter = (n: number, of: number) => (of <= 0 ? 0 : (n / of) * 100);

  return (
    <section className="flex animate-[pageIn_.35s_ease_both] flex-col gap-4.5">
      <AdminHeader
        title="داشبورد عملیات"
        count={`بازهٔ ${RANGE_LABEL[range]} · از ${faAgo(data.since)}`}
      >
        <RangeTabs value={range} hrefFor={(r) => `/admin?range=${r}`} />
      </AdminHeader>

      <StatGrid>
        <Card label="کاربران کل" value={faNum(cards.userTotal)}>
          <Delta value={cards.userDelta} suffix=" کاربر تازه" />
        </Card>
        <Card label="کاربران فعال" value={faNum(cards.activeUsers)}>
          <Delta value={cards.activeDelta} />
        </Card>
        <Card label="قصهٔ ساخته‌شده" value={faNum(cards.storiesCreated)}>
          <Delta value={cards.storiesDelta} />
        </Card>
        <Card
          label="نرخ موفقیت تولید"
          value={faRate(cards.successRate)}
          tone={cards.successRate < 90 ? 'warning' : undefined}
        >
          {cards.failedStories > 0 ? (
            <span className="text-[11.5px] font-semibold text-error">
              {faNum(cards.failedStories)} کار ناموفق در این بازه
            </span>
          ) : (
            <span className="text-[11.5px] text-muted">بدون کار ناموفق</span>
          )}
        </Card>
        <Card label="درآمد بازه" value={faCompactPrice(cards.revenue)}>
          <Delta value={cards.revenueDelta} />
        </Card>
        <Card label="قصه‌های آماده" value={faNum(cards.storiesReady)}>
          <span className="text-[11.5px] text-muted">
            در کل کتابخانهٔ خانواده‌ها
          </span>
        </Card>
      </StatGrid>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-3.5">
        <Panel>
          <WeekBars data={data.daily} />
        </Panel>

        <Panel title="وضعیت صف تولید">
          <div className="flex flex-col gap-3.25">
            <MeterRow
              label="در حال اجرا"
              value={`${faNum(queue.running)} از ${faNum(queue.maxConcurrent)}`}
              share={meter(queue.running, queue.maxConcurrent)}
              color="var(--sh-info)"
            />
            <MeterRow
              label="در صف"
              value={`${faNum(queue.queued)} کار`}
              share={meter(queue.queued, Math.max(1, queue.maxConcurrent))}
              color="var(--sh-warning)"
            />
            <MeterRow
              label="ناموفق (۲۴ ساعت)"
              value={`${faNum(queue.failed24h)} کار`}
              share={meter(
                queue.failed24h,
                Math.max(queue.failed24h, queue.maxConcurrent),
              )}
              color="var(--sh-error)"
            />
          </div>

          {queue.illustrationNearCap ? (
            <div className="mt-4 rounded-[10px] border border-border bg-elev px-3.5 py-3">
              <p className="mb-1.25 text-[12px] font-bold text-warning">
                ⚠ هشدار ظرفیت
              </p>
              <p className="text-[12px] leading-[1.8] text-muted">
                {faNum(queue.illustrationRunning)} کار تصویرسازی هم‌زمان در حال
                اجراست و سقف تنظیم‌شده {faNum(queue.illustrationCap)} است.
              </p>
            </div>
          ) : null}

          <Link
            href="/admin/jobs"
            className="mt-3.5 block text-[12.5px] font-bold"
          >
            رفتن به صف تولید ←
          </Link>
        </Panel>

        <Panel title="تولید در این بازه">
          <div className="flex flex-col gap-3">
            <Line label="قصهٔ تحویل‌شده" value={faNum(production.storiesReady)} />
            <Line label="صفحهٔ نوشته‌شده" value={faNum(production.pagesWritten)} />
            <Line
              label="روایت ضبط‌شده"
              value={faDuration(production.narrationSec)}
            />
            <Line
              label="میانگین زمان ساخت"
              value={
                production.avgGenerationMs > 0
                  ? faElapsed(production.avgGenerationMs)
                  : '—'
              }
            />
          </div>
          <p className="mt-4 text-[11.5px] leading-[1.9] text-muted">
            هزینهٔ مدل‌ها اینجا نیست: سرویس بیرونی ریز مصرف را به ما برنمی‌گرداند،
            پس آنچه شمرده می‌شود همان چیزی است که خودمان تولید و ذخیره کرده‌ایم.
          </p>
        </Panel>

        <Panel title="نیازمند توجه">
          {actions.length === 0 ? (
            <p className="text-[12.5px] leading-[1.9] text-muted">
              چیزی در انتظار رسیدگی نیست — صف بازبینی خالی است، پرداخت ناموفق
              تازه‌ای ثبت نشده و هیچ کاری بیش از حد طول نکشیده است.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {actions.map((action) => (
                <li key={action.key} className="flex items-start gap-2.25">
                  <span
                    aria-hidden
                    className="mt-1.5 size-2 flex-none rounded-full"
                    style={{ background: action.tone }}
                  />
                  <span className="flex-1 text-[12.5px] leading-[1.9]">
                    {action.text}
                    <Link
                      href={action.href}
                      className="mt-1 block text-[12.5px] font-bold"
                    >
                      {action.cta} ←
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </section>
  );
}
