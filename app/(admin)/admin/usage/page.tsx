import type { Metadata } from 'next';
import {
  AdminHeader,
  RangeTabs,
  StatCard,
  StatGrid,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDigits, faElapsed, faNum, faRate } from '@/lib/fa';
import { STAGE_ADMIN_LABEL } from '@/lib/admin';
import type { AdminRange, AdminUsageDto } from '@/lib/types';

export const metadata: Metadata = { title: 'مصرف مدل‌ها' };

const RANGES: AdminRange[] = ['24h', '7d', '30d'];

/** Formats a numeric seconds value for the Persian administrator UI. */
const seconds = (value: number) =>
  `${faDigits(value.toLocaleString('en-US', { maximumFractionDigits: 1 }))} ثانیه`;

/**
 * The design measured spend per model — tokens, images, minutes of speech, a
 * cost column and a quota bar. We buy one external service and it does not
 * itemise any of that, so this measures the thing we can actually see and act
 * on: how each stage of our own pipeline behaves.
 */
/** Server page that retrieves pipeline usage metrics for a selected URL range. */
export default async function AdminUsagePage({
  searchParams,
}: PageProps<'/admin/usage'>) {
  await requireAdmin();

  const sp = await searchParams;
  const range: AdminRange =
    typeof sp.range === 'string' && RANGES.includes(sp.range as AdminRange)
      ? (sp.range as AdminRange)
      : '30d';

  const { stages, totals } = await sapi.get<AdminUsageDto>(
    `/admin/usage?range=${range}`,
  );

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader title="مصرف مدل‌ها">
        <RangeTabs value={range} hrefFor={(r) => `/admin/usage?range=${r}`} />
      </AdminHeader>

      <StatGrid>
        <StatCard
          label="کارهای اجراشده"
          value={faNum(totals.jobs)}
          note={`${faNum(totals.stories)} قصهٔ تحویل‌شده`}
        />
        <StatCard
          label="میانگین زمان هر قصه"
          value={totals.avgStoryMs > 0 ? faElapsed(totals.avgStoryMs) : '—'}
        />
        <StatCard
          label="نرخ خطای مراحل"
          value={faRate(totals.errorRate)}
          tone={totals.errorRate > 2 ? 'error' : 'success'}
          note={`${faNum(totals.retries)} تلاش دوباره`}
        />
        <StatCard
          label="کندترین مرحله"
          value={
            totals.slowestStage
              ? STAGE_ADMIN_LABEL[totals.slowestStage]
              : '—'
          }
          note={
            totals.slowestStage ? seconds(totals.slowestAvgSec) : undefined
          }
        />
      </StatGrid>

      <TableCard>
        <table className="w-full min-w-175 border-collapse text-[12.5px]">
          <caption className="sr-only">
            رفتار مرحله‌های خط تولید در بازهٔ انتخاب‌شده
          </caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                مرحله
              </th>
              <th scope="col" className={thClass}>
                تعداد کار
              </th>
              <th scope="col" className={thClass}>
                میانگین زمان
              </th>
              <th scope="col" className={thClass}>
                نرخ خطا
              </th>
              <th scope="col" className={thClass}>
                تلاش دوباره
              </th>
              <th scope="col" className={thClass}>
                سهم از کارها
              </th>
            </tr>
          </thead>
          <tbody>
            {stages.map((row) => (
              <tr key={row.stage}>
                <td className={`${tdClass} font-semibold`}>
                  {STAGE_ADMIN_LABEL[row.stage]}
                </td>
                <td className={tdClass}>{faNum(row.count)}</td>
                <td
                  className={`${tdClass} ${
                    row.avgSec > 45 ? 'text-warning' : ''
                  }`}
                >
                  {row.count === 0 ? '—' : seconds(row.avgSec)}
                </td>
                <td
                  className={`${tdClass} ${
                    row.errorRate > 2
                      ? 'text-error'
                      : row.count > 0
                        ? 'text-success'
                        : ''
                  }`}
                >
                  {row.count === 0 ? '—' : faRate(row.errorRate)}
                </td>
                <td className={tdClass}>
                  {faNum(Math.max(0, row.attempts - row.count))}
                </td>
                <td className={tdClass}>
                  <span className="block h-1.5 w-25 overflow-hidden rounded-sm bg-border">
                    <span
                      className="block h-full bg-brand"
                      style={{ width: `${row.share}%` }}
                    />
                  </span>
                  <span className="sr-only">{faRate(row.share)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totals.jobs === 0 ? (
          <TableEmpty>در این بازه هیچ کاری اجرا نشده است.</TableEmpty>
        ) : null}
      </TableCard>

      <p className="mt-3 text-[11.5px] leading-[1.9] text-muted">
        ستون هزینه در این جدول نیست: ساخت قصه از یک سرویس بیرونی خریداری می‌شود
        که ریز مصرف توکن، تصویر و گفتار را به ما گزارش نمی‌کند. اگر روزی گزارش
        کند، جدول <code className="font-mono">model_usage</code> برای همان
        ساخته شده است.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders generation-pipeline volume, latency, failure, retry, and slow-stage metrics.
 */
