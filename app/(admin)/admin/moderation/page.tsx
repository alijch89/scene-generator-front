import type { Metadata } from 'next';
import Link from 'next/link';
import { ModerationDecision } from '@/components/admin/moderation-decision';
import { StatusBadge } from '@/components/status-badge';
import { AdminHeader } from '@/components/admin/ui';
import { MODERATION_STATUS, moderationReason } from '@/lib/admin';
import { requireAdmin, sapi } from '@/lib/dal';
import { faAgo, faDate, faDigits, faNum } from '@/lib/fa';
import { THEME_LABEL } from '@/lib/story-art';
import type {
  AdminModerationDetail,
  AdminModerationQueueDto,
  ModerationStatus,
} from '@/lib/types';

export const metadata: Metadata = { title: 'بازبینی محتوا' };

const FILTERS: { value: string; label: string }[] = [
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'APPROVED', label: 'تأیید شده' },
  { value: 'REJECTED', label: 'رد شده' },
  { value: '', label: 'همه' },
];

/**
 * The design's two-column review desk: the queue on one side, the item under
 * review on the other. Which item is open lives in the URL, so a reviewer can
 * send a colleague the exact card they are looking at.
 */
/** Server page that lists moderation items and optionally loads one selected detail. */
export default async function AdminModerationPage({
  searchParams,
}: PageProps<'/admin/moderation'>) {
  await requireAdmin();

  const sp = await searchParams;
  const status = FILTERS.some((f) => f.value === sp.status && f.value)
    ? (sp.status as ModerationStatus)
    : 'PENDING';
  const openId = typeof sp.item === 'string' ? sp.item : null;

  const queue = await sapi.get<AdminModerationQueueDto>(
    `/admin/moderation${status ? `?status=${status}` : ''}`,
  );

  // Default to the front of the queue — a reviewer opening this page should
  // land on work, not on an empty panel.
  const selectedId =
    openId && queue.items.some((item) => item.id === openId)
      ? openId
      : (queue.items[0]?.id ?? null);

  const selected = selectedId
    ? await sapi.get<AdminModerationDetail>(`/admin/moderation/${selectedId}`)
    : null;

  const hrefFor = (next: { status?: string; item?: string }) => {
    const params = new URLSearchParams();
    const nextStatus = next.status ?? status;
    if (nextStatus) params.set('status', nextStatus);
    if (next.item) params.set('item', next.item);
    const qs = params.toString();
    return qs ? `/admin/moderation?${qs}` : '/admin/moderation';
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader title="بازبینی محتوا">
        <StatusBadge
          tone={queue.pending > 0 ? 'error' : 'success'}
          icon={queue.pending > 0 ? '⏳' : '✓'}
        >
          {queue.pending > 0
            ? `${faNum(queue.pending)} مورد در صف`
            : 'صف خالی است'}
        </StatusBadge>
        <div className="inline-flex rounded-lg border border-border bg-elev p-0.75">
          {FILTERS.map((filter) => (
            <Link
              key={filter.value || 'all'}
              href={hrefFor({ status: filter.value })}
              aria-current={filter.value === status ? 'true' : undefined}
              className={
                filter.value === status
                  ? 'rounded-md bg-surface px-3 py-1.75 text-[12px] font-semibold text-ink shadow-card hover:no-underline'
                  : 'rounded-md px-3 py-1.75 text-[12px] font-semibold text-ink hover:no-underline'
              }
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </AdminHeader>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-3.5">
        <ul className="flex flex-col gap-3">
          {queue.items.map((item) => {
            const reason = moderationReason(item.reason);
            const active = item.id === selectedId;

            return (
              <li key={item.id}>
                <Link
                  href={hrefFor({ item: item.id })}
                  aria-current={active ? 'true' : undefined}
                  className={
                    active
                      ? 'block rounded-xl border-2 border-brand bg-surface p-3.75 text-ink shadow-card hover:no-underline'
                      : 'block rounded-xl border border-border bg-surface p-3.75 text-ink shadow-card hover:no-underline'
                  }
                >
                  <span className="mb-2 flex flex-wrap items-center gap-2.25">
                    <StatusBadge
                      tone={reason.tone}
                      className="px-2 py-0.75 text-[10.5px]"
                    >
                      {reason.label}
                    </StatusBadge>
                    <span className="text-[11px] text-muted">
                      {faAgo(item.createdAt)}
                    </span>
                    {item.status !== 'PENDING' ? (
                      <span className="ms-auto text-[11px] text-muted">
                        {MODERATION_STATUS[item.status].label}
                      </span>
                    ) : null}
                  </span>
                  <strong className="mb-1.25 block text-[13.5px]">
                    {item.title}
                  </strong>
                  <span className="block text-[12px] leading-[1.8] text-muted">
                    {item.missing
                      ? 'این محتوا پیش از بازبینی حذف شده است.'
                      : reason.detail}
                  </span>
                </Link>
              </li>
            );
          })}

          {queue.items.length === 0 ? (
            <li className="rounded-xl border border-border bg-surface p-8 text-center text-[13px] text-muted shadow-card">
              {status === 'PENDING'
                ? 'صف بازبینی خالی است — چیزی منتظر تصمیم نیست.'
                : 'موردی با این فیلتر ثبت نشده است.'}
            </li>
          ) : null}
        </ul>

        {selected ? (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="border-b border-border px-4.5 py-4">
              <p className="mb-1.25 text-[11.5px] font-semibold text-muted">
                {selected.status === 'PENDING' ? 'در حال بازبینی' : 'بازبینی‌شده'}
              </p>
              <strong className="text-[15px]">{selected.title}</strong>
              <p className="mt-1.75 text-[12px] text-muted">
                {selected.user ? (
                  <Link href={`/admin/users/${selected.user.id}`}>
                    {selected.user.fullName}
                  </Link>
                ) : (
                  'حساب حذف شده'
                )}
                {selected.childName
                  ? ` · ${selected.childName}، ${faDigits(selected.childAge ?? 0)} ساله`
                  : ''}
                {selected.theme ? ` · موضوع: ${THEME_LABEL[selected.theme]}` : ''}{' '}
                · {faDate(selected.createdAt)}
              </p>
            </div>

            <div className="border-b border-border px-4.5 py-4">
              <p className="mb-2 text-[12px] font-bold text-error">دلیل پرچم</p>
              <p className="text-[12.5px] leading-[1.9] text-muted">
                {moderationReason(selected.reason).detail}
              </p>
              {selected.matchedWords && selected.matchedWords.length > 0 ? (
                <p className="mt-2.5 text-[12.5px] leading-[1.9]">
                  واژه‌های مطابق فهرست:{' '}
                  {selected.matchedWords.map((word) => (
                    <span
                      key={word}
                      className="me-1.5 inline-block rounded-md border border-border bg-elev px-1.75 py-0.5 text-[12px]"
                    >
                      {word}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>

            {selected.ownIdea ? (
              <div className="border-b border-border px-4.5 py-4">
                <p className="mb-2.5 text-[12px] font-bold">ایدهٔ والد</p>
                <p className="text-[12.5px] leading-[1.95] text-muted">
                  «{selected.ownIdea}»
                </p>
              </div>
            ) : null}

            {selected.excerpt && selected.excerpt.length > 0 ? (
              <div className="border-b border-border px-4.5 py-4">
                <p className="mb-2.5 text-[12px] font-bold">
                  آغاز قصه ({faDigits(selected.excerpt.length)} صفحهٔ نخست)
                </p>
                <div className="flex flex-col gap-2.5">
                  {selected.excerpt.map((page) => (
                    <p
                      key={page.index}
                      className="text-[12.5px] leading-[1.95] text-muted"
                    >
                      <span className="font-bold text-ink">
                        صفحهٔ {faDigits(page.index + 1)}:{' '}
                      </span>
                      {page.text}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {selected.targetType === 'CHILD_PHOTO' ? (
              <div className="border-b border-border px-4.5 py-4">
                <p className="text-[12.5px] leading-[1.9] text-muted">
                  عکس در این پنل نمایش داده نمی‌شود. تصمیم بر پایهٔ بافت پرونده
                  گرفته می‌شود: {selected.childName ?? 'کودک'}،{' '}
                  {faDigits(selected.childAge ?? 0)} ساله
                  {selected.interests && selected.interests.length > 0
                    ? ` · علاقه‌ها: ${selected.interests.join('، ')}`
                    : ''}
                  .
                </p>
              </div>
            ) : null}

            <div className="px-4.5 py-4">
              {selected.missing ? (
                <p className="text-[12.5px] leading-[1.9] text-muted">
                  محتوای این مورد دیگر وجود ندارد؛ والد پیش از بازبینی آن را پاک
                  کرده است. تأیید کردنش فقط صف را خالی می‌کند.
                </p>
              ) : null}
              <ModerationDecision item={selected} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders the administrator moderation queue, review context, and decision controls.
 */
