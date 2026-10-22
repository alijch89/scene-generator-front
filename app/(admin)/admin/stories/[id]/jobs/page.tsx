import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Panel, Pagination } from '@/components/admin/ui';
import {
  GenerationApiCalls,
  GenerationJson,
} from '@/components/admin/generation-api-calls';
import { RefreshGenerationButton } from '@/components/admin/refresh-generation';
import { RetryStoryButton } from '@/components/admin/retry-story';
import { StatusBadge } from '@/components/status-badge';
import { JOB_STATUS, STAGE_ADMIN_LABEL, STORY_STATUS } from '@/lib/admin';
import { ApiError } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDate, faDateTime, faDigits, faElapsed, faPrice } from '@/lib/fa';
import { getOrderStatus } from '@/lib/orders';
import { LENGTH_SHORT_LABEL, THEME_LABEL } from '@/lib/story-art';
import type {
  AdminGenerationApiCall,
  AdminPage,
  AdminStoryJobsDto,
} from '@/lib/types';

export const metadata: Metadata = { title: 'جزئیات تولید و ارتباط با سرویس' };

/**
 * The design's «جزئیات کار ناموفق» panel, generalised: every attempt at one
 * story, whatever the outcome. The stage that broke, how many tries it had and
 * what the service actually said — the three things an operator needs before
 * deciding whether re-running is worth it.
 */
/** Server page that retrieves generation diagnostics for a dynamic story identifier. */
export default async function AdminStoryJobsPage({
  params,
  searchParams,
}: PageProps<'/admin/stories/[id]/jobs'>) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const requestedPage = Number(typeof sp.apiPage === 'string' ? sp.apiPage : 1);
  const apiPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [data, calls] = await Promise.all([
    sapi.get<AdminStoryJobsDto>(`/admin/stories/${id}/jobs`),
    sapi.get<AdminPage<AdminGenerationApiCall>>(
      `/admin/stories/${id}/api-calls?page=${apiPage}&take=10`,
    ),
  ]).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  const { story, order, jobs } = data;
  const badge = STORY_STATUS[story.status];
  const paid = order?.status === 'PAID';

  // The rules the API enforces, said in words before the click rather than as
  // an error afterwards.
  const cannotRetry =
    story.status === 'GENERATING'
      ? 'این قصه همین حالا در حال ساخت است.'
      : story.status === 'READY'
        ? 'این قصه ساخته شده و در کتابخانهٔ خانواده است.'
        : !paid
          ? 'تا وقتی پرداخت این سفارش تأیید نشده، ساخت دوباره در کار نیست.'
          : undefined;

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <Link href="/admin/jobs" className="mb-3 block text-[12.5px] font-bold">
        → صف تولید
      </Link>

      <div className="mb-3.5 rounded-xl border border-border bg-surface p-4.5 shadow-card">
        <div className="mb-3 flex justify-end">
          <RefreshGenerationButton />
        </div>
        <h1 className="mb-1.5 flex flex-wrap items-center gap-2 text-[18px]">
          {story.title ?? 'قصهٔ بی‌عنوان'}
          <StatusBadge tone={badge.tone} icon={badge.icon}>
            {badge.label}
          </StatusBadge>
        </h1>
        <p className="text-[12.5px] text-muted">
          {story.user ? (
            <Link href={`/admin/users/${story.user.id}`}>
              {story.user.fullName}
            </Link>
          ) : (
            'حساب حذف شده'
          )}{' '}
          · {story.childName ?? 'کودک حذف‌شده'} · {THEME_LABEL[story.theme]} ·{' '}
          {LENGTH_SHORT_LABEL[story.length]} · {faDate(story.createdAt)}
        </p>

        {story.failureReason ? (
          <div className="mt-3 rounded-[9px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_10%,var(--sh-surface))] px-3.25 py-2.5 text-[12.5px] text-error">
            <p className="mb-2 font-bold">جزئیات فنی توقف ساخت (ویژهٔ مدیر)</p>
            <pre
              dir="ltr"
              className="max-h-72 overflow-auto text-left font-mono text-[11.5px] leading-[1.9] whitespace-pre-wrap break-all"
            >
              {story.failureReason}
            </pre>
          </div>
        ) : null}
      </div>

      <div className="mb-3.5 grid gap-3.5 lg:grid-cols-2">
        <Panel title="کاربر و کودک">
          <dl className="space-y-2 text-[12.5px]">
            <div>
              <dt className="text-muted">نام و موبایل کاربر</dt>
              <dd>
                {story.user ? (
                  <>
                    <Link href={`/admin/users/${story.user.id}`}>
                      {story.user.fullName}
                    </Link>{' '}
                    · <span dir="ltr">{story.user.phone ?? '—'}</span>
                  </>
                ) : (
                  'حساب حذف شده'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted">کودک</dt>
              <dd>
                {story.child
                  ? `${story.child.firstName} · ${faDigits(story.child.age)} سال`
                  : 'کودک حذف شده'}
              </dd>
            </div>
            <div>
              <dt className="text-muted">شناسهٔ کودک</dt>
              <dd dir="ltr" className="break-all font-mono text-[11.5px]">
                {story.child?.id ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted">شناسهٔ قصه</dt>
              <dd dir="ltr" className="break-all font-mono text-[11.5px]">
                {story.id}
              </dd>
            </div>
          </dl>
        </Panel>
        <Panel title="تراکنش بانکی مرتبط">
          {order ? (
            <dl className="space-y-2 text-[12.5px]">
              <div>
                <dt className="text-muted">سفارش و وضعیت پرداخت</dt>
                <dd>
                  <Link href={`/admin/payments/${order.id}`}>
                    {getOrderStatus(order.status).admin} ·{' '}
                    <span className="break-all font-mono">{order.id}</span>
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-muted">مبلغ</dt>
                <dd>
                  {faPrice(order.amount)} ({order.currency})
                </dd>
              </div>
              <div>
                <dt className="text-muted">شمارهٔ پیگیری بانک</dt>
                <dd dir="ltr" className="font-mono">
                  {order.paymentRef ?? 'ثبت نشده'}
                </dd>
              </div>
              <div>
                <dt className="text-muted">زمان پرداخت</dt>
                <dd>
                  {order.paidAt ? faDateTime(order.paidAt) : 'پرداخت نشده'}
                </dd>
              </div>
              {order.refundedAt || order.refundRef ? (
                <div>
                  <dt className="text-muted">بازگشت وجه</dt>
                  <dd>
                    {order.refundedAt ? faDateTime(order.refundedAt) : '—'} ·{' '}
                    {order.refundRef ?? '—'}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-[12.5px] text-muted">
              هنوز تراکنشی ثبت نشده است.
            </p>
          )}
        </Panel>
      </div>

      <Panel title="درخواست‌ها و پاسخ‌های سرویس خارجی" className="mb-3.5">
        <p className="mb-3 text-[12.5px] leading-[1.9] text-muted">
          {faDigits(calls.total)} ارتباط ثبت شده؛ جدیدترین مورد ابتدا نمایش داده
          می‌شود. متن درخواست و پاسخ اصلی ذخیره می‌شود؛ عکس‌ها با نام، نوع، حجم
          و اثرانگشت فایل ثبت می‌شوند.
        </p>
        {calls.total > 0 && calls.items.length === 0 ? (
          <p className="text-[12.5px] text-muted">
            در این صفحه رکوردی نیست.{' '}
            <Link href={`/admin/stories/${id}/jobs`}>
              بازگشت به جدیدترین ارتباط‌ها
            </Link>
          </p>
        ) : (
          <GenerationApiCalls calls={calls.items} />
        )}
        <Pagination
          page={calls.page}
          pageCount={calls.pageCount}
          total={calls.total}
          href={(page) => `/admin/stories/${id}/jobs?apiPage=${page}`}
        />
      </Panel>

      <Panel title="انتخاب‌های ثبت‌شدهٔ کاربر برای این قصه" className="mb-3.5">
        <GenerationJson value={story.input} />
      </Panel>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-3.5">
        <Panel title="مرحله‌ها" className="lg:col-span-2">
          {jobs.length === 0 ? (
            <p className="text-[12.5px] text-muted">
              هنوز هیچ کاری برای این قصه اجرا نشده است. ساخت تنها پس از تأیید
              پرداخت شروع می‌شود.
            </p>
          ) : (
            <ol className="flex flex-col gap-2.5">
              {jobs.map((job) => {
                const jobBadge = JOB_STATUS[job.status];
                const duration =
                  job.startedAt && job.endedAt
                    ? new Date(job.endedAt).getTime() -
                      new Date(job.startedAt).getTime()
                    : null;

                return (
                  <li
                    key={job.id}
                    className="rounded-[10px] border border-border bg-elev px-3.5 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <strong className="text-[12.5px]">
                        {STAGE_ADMIN_LABEL[job.stage]}
                      </strong>
                      <StatusBadge
                        tone={jobBadge.tone}
                        icon={jobBadge.icon}
                        className="px-2.25 py-0.75 text-[11px]"
                      >
                        {jobBadge.label}
                      </StatusBadge>
                      <span className="ms-auto text-[11.5px] text-muted">
                        تلاش {faDigits(job.attempts)}
                        {duration !== null ? ` · ${faElapsed(duration)}` : ''}
                      </span>
                    </div>
                    {job.error ? (
                      <pre
                        dir="ltr"
                        className="mt-2.5 overflow-x-auto rounded-[7px] border border-border bg-surface px-3 py-2.5 text-left font-mono text-[11.5px] leading-[1.9] text-error"
                      >
                        {job.error}
                      </pre>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <Panel title="اقدام">
          <div className="mb-3.5 flex flex-col gap-2.75 text-[12.5px]">
            <div className="flex">
              <span className="text-muted">سفارش</span>
              <span className="ms-auto font-semibold">
                {order ? (
                  <Link href={`/admin/payments/${order.id}`}>
                    {getOrderStatus(order.status).admin}
                  </Link>
                ) : (
                  'ثبت نشده'
                )}
              </span>
            </div>
            <div className="flex">
              <span className="text-muted">مدت کل ساخت</span>
              <span className="ms-auto font-semibold">
                {story.generationDurationMs
                  ? faElapsed(story.generationDurationMs)
                  : '—'}
              </span>
            </div>
          </div>

          <RetryStoryButton storyId={story.id} disabledReason={cannotRetry} />

          <p className="mt-3.5 text-[11.5px] leading-[1.9] text-muted">
            اجرای دوباره از ابتدای خط تولید شروع می‌شود و در گزارش رخدادها با
            نام شما ثبت می‌شود. هزینهٔ تازه‌ای از خانواده گرفته نمی‌شود.
          </p>
        </Panel>
      </div>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders one story's complete generation history, payment eligibility, failures, and retry action.
 */
