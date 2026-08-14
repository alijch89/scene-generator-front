import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  FilterBar,
  FilterSelect,
  Pagination,
  Panel,
  SearchInput,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import { StatusBadge } from '@/components/status-badge';
import { JOB_STATUS, STAGE_ADMIN_LABEL } from '@/lib/admin';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDigits, faElapsed, faNum } from '@/lib/fa';
import type { AdminJobsDto, JobStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'صف تولید' };

const PER_PAGE = 25;
const STATUSES = Object.keys(JOB_STATUS) as JobStatus[];

const time = new Intl.DateTimeFormat('fa-IR', {
  hour: '2-digit',
  minute: '2-digit',
});

/** Server page that retrieves pipeline and job data from validated URL filters. */
export default async function AdminJobsPage({
  searchParams,
}: PageProps<'/admin/jobs'>) {
  await requireAdmin();

  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as JobStatus)
    ? (sp.status as JobStatus)
    : '';
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (status) query.set('status', status);
  if (q) query.set('q', q);

  const data = await sapi.get<AdminJobsDto>(`/admin/jobs?${query}`);
  const filtered = Boolean(status || q);

  const hrefFor = (next: number) => {
    const params = new URLSearchParams({ page: String(next) });
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    return `/admin/jobs?${params}`;
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="صف تولید هوش مصنوعی"
        count={`${faNum(data.total)} کار${filtered ? ' با این فیلتر' : ''}`}
      >
        <FilterBar action="/admin/jobs" filtered={filtered}>
          <SearchInput
            defaultValue={q}
            placeholder="قصه، کاربر یا شمارهٔ کار"
            aria-label="جست‌وجو در کارها"
          />
          <FilterSelect label="وضعیت کار" name="status" defaultValue={status}>
            <option value="">همهٔ وضعیت‌ها</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {JOB_STATUS[value].label}
              </option>
            ))}
          </FilterSelect>
        </FilterBar>
      </AdminHeader>

      {/* «خط تولید» — where the work is sitting right now, stage by stage. */}
      <Panel title="خط تولید" className="mb-3.5">
        <ol className="flex flex-wrap items-stretch gap-2">
          {data.pipeline.map((step, index) => (
            <li key={step.stage} className="flex flex-1 basis-32.5 items-center gap-2">
              <div className="flex-1 rounded-[10px] border border-border bg-elev p-3.25">
                <p className="mb-1.5 text-[11.5px] text-muted">
                  {STAGE_ADMIN_LABEL[step.stage]}
                </p>
                <strong className="text-[19px]">
                  {faNum(step.running + step.queued)}
                </strong>
                {step.queued > 0 ? (
                  <p className="mt-1 text-[11px] text-muted">
                    {faNum(step.queued)} در صف
                  </p>
                ) : null}
              </div>
              {index < data.pipeline.length - 1 ? (
                <span aria-hidden className="text-muted">
                  ←
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Panel>

      <TableCard>
        <table className="w-full min-w-225 border-collapse text-[12.5px]">
          <caption className="sr-only">کارهای خط تولید</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                شمارهٔ کار
              </th>
              <th scope="col" className={thClass}>
                کاربر
              </th>
              <th scope="col" className={thClass}>
                قصه
              </th>
              <th scope="col" className={thClass}>
                مرحله
              </th>
              <th scope="col" className={thClass}>
                وضعیت
              </th>
              <th scope="col" className={thClass}>
                شروع
              </th>
              <th scope="col" className={thClass}>
                مدت
              </th>
              <th scope="col" className={thClass}>
                خطا
              </th>
              <th scope="col" className={thClass}>
                <span className="sr-only">اقدام</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((job) => {
              const badge = JOB_STATUS[job.status];
              return (
                <tr key={job.id}>
                  <td className={`${tdClass} font-mono text-[11.5px]`}>
                    JOB-{job.id.slice(0, 6)}
                  </td>
                  <td className={tdClass}>
                    {job.user ? (
                      <Link href={`/admin/users/${job.user.id}`}>
                        {job.user.fullName}
                      </Link>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {job.storyTitle ?? (
                      <span className="text-muted">بی‌عنوان</span>
                    )}
                  </td>
                  <td className={tdClass}>{STAGE_ADMIN_LABEL[job.stage]}</td>
                  <td className={tdClass}>
                    <StatusBadge
                      tone={badge.tone}
                      icon={badge.icon}
                      className="px-2.25 py-0.75 text-[11px]"
                    >
                      {badge.label}
                      {job.attempts > 1
                        ? ` · تلاش ${faDigits(job.attempts)}`
                        : ''}
                    </StatusBadge>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {job.startedAt ? time.format(new Date(job.startedAt)) : '—'}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {job.durationMs === null ? '—' : faElapsed(job.durationMs)}
                    {job.status === 'RUNNING' ? '…' : ''}
                  </td>
                  <td className={`${tdClass} max-w-60 text-error`}>
                    {job.error ?? <span className="text-muted">—</span>}
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/stories/${job.storyId}/jobs`}
                      className="font-bold whitespace-nowrap"
                    >
                      جزئیات
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {data.items.length === 0 ? (
          <TableEmpty>
            {filtered ? (
              <>
                کاری با این فیلتر پیدا نشد.{' '}
                <Link href="/admin/jobs">همهٔ کارها</Link>
              </>
            ) : (
              'صف تولید خالی است — هیچ کاری اجرا نشده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination
        page={data.page}
        pageCount={data.pageCount}
        href={hrefFor}
      />

      <p className="mt-3 text-[11.5px] leading-[1.9] text-muted">
        «توقف» یک کار در حال اجرا ساخته نشده است: مرحله‌ها با زمان‌سنج تنظیمات
        خودشان تمام می‌شوند و نیمه‌کاره رها کردن یک قصهٔ پرداخت‌شده کار درستی
        نیست. آنچه در دسترس است، اجرای دوبارهٔ قصهٔ ناموفق است.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders live generation-pipeline stage counts and paginated job diagnostics.
 */
