import type { Metadata } from 'next';
import { AdminHeader, MeterRow, Panel } from '@/components/admin/ui';
import { API_URL } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDigits, faHourBand, faNum, faRate } from '@/lib/fa';
import { THEME_LABEL } from '@/lib/story-art';
import type { AdminReportsDto } from '@/lib/types';

export const metadata: Metadata = { title: 'گزارش‌ها' };

/**
 * The design offered CSV, XLSX and PDF. All four are CSV: every one of them is
 * a table, and a real XLSX or PDF writer is a dependency bought for formatting
 * alone. A plain link, not a fetch — the session cookie rides along and the
 * file lands in Downloads.
 */
const EXPORTS = [
  { kind: 'stories', label: 'گزارش قصه‌ها و تولید (CSV)' },
  { kind: 'orders', label: 'گزارش مالی و سفارش‌ها (CSV)' },
  { kind: 'users', label: 'گزارش کاربران (CSV)' },
  { kind: 'moderation', label: 'گزارش بازبینی محتوا (CSV)' },
];

/** Displays one report metric as a labelled row. */
function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span className="ms-auto font-semibold">{value}</span>
    </div>
  );
}

/** Server page that retrieves and renders aggregate product reports. */
export default async function AdminReportsPage() {
  await requireAdmin();

  const { themes, behaviour, storyTotal } =
    await sapi.get<AdminReportsDto>('/admin/reports');

  const oneDecimal = (n: number) =>
    faDigits(n.toLocaleString('en-US', { maximumFractionDigits: 1 }));

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader title="گزارش‌ها" count={`بر پایهٔ ${faNum(storyTotal)} قصه`} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-start gap-3.5">
        <Panel title="محبوب‌ترین ماجراها">
          {storyTotal === 0 ? (
            <p className="text-[12.5px] text-muted">
              هنوز قصه‌ای ساخته نشده است.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Only the adventures anyone has actually chosen; a list of
                  nine zeroes says less than a list of four real numbers. */}
              {themes
                .filter((row) => row.count > 0)
                .slice(0, 6)
                .map((row) => (
                  <MeterRow
                    key={row.theme}
                    label={THEME_LABEL[row.theme]}
                    value={faRate(row.share)}
                    share={row.share}
                  />
                ))}
            </div>
          )}
        </Panel>

        <Panel title="رفتار خانواده‌ها">
          <div className="flex flex-col gap-3">
            <Line
              label="میانگین قصه در هر خانه"
              value={oneDecimal(behaviour.storiesPerFamily)}
            />
            <Line
              label="اوج ساخت قصه"
              value={
                behaviour.peakHour === null
                  ? '—'
                  : faHourBand(behaviour.peakHour)
              }
            />
            <Line
              label="قصه‌های خوانده‌شده"
              value={faRate(behaviour.openedShare)}
            />
            <Line
              label="میانگین دفعات خواندن"
              value={`${oneDecimal(behaviour.rereadRate)} بار`}
            />
            <Line
              label="میانگین سن کودکان"
              value={`${oneDecimal(behaviour.averageChildAge)} سال`}
            />
            <Line
              label="خانواده‌های قصه‌ساز"
              value={faNum(behaviour.familyCount)}
            />
          </div>
          <p className="mt-4 text-[11.5px] leading-[1.9] text-muted">
            «نرخ گوش دادن به روایت» در طرح اولیه بود اما اندازه‌گیری نمی‌شود؛
            پخش ویدیو رویدادی به سرور نمی‌فرستد. آنچه می‌دانیم باز شدن کتاب است.
          </p>
        </Panel>

        <Panel title="خروجی گزارش">
          <div className="flex flex-col gap-2.25">
            {EXPORTS.map((item) => (
              <a
                key={item.kind}
                href={`${API_URL}/admin/export?kind=${item.kind}`}
                className="rounded-[9px] border border-border bg-elev px-3.25 py-2.75 text-right text-[12.5px] font-semibold text-ink hover:no-underline"
              >
                ⤓ {item.label}
              </a>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] leading-[1.9] text-muted">
            هر خروجی تا ۵٬۰۰۰ سطر تازه‌ترین داده را می‌آورد و با کدگذاری UTF-8
            در اکسل فارسی باز می‌شود.
          </p>
        </Panel>
      </div>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders story-theme distribution, family behavior metrics, and report export links.
 */
