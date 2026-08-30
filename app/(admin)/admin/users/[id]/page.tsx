import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/admin/ui';
import { UserPasswordReset } from '@/components/admin/user-password-reset';
import { UserStatusButton } from '@/components/admin/user-status';
import { StatusBadge } from '@/components/status-badge';
import {
  PHOTO_STATUS,
  ROLE_LABEL,
  STORY_STATUS,
  USER_STATUS,
} from '@/lib/admin';
import { ApiError } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faAgo, faDate, faDigits, faNum, faPrice } from '@/lib/fa';
import { THEME_LABEL } from '@/lib/story-art';
import type { AdminUserDetailDto } from '@/lib/types';

export const metadata: Metadata = { title: 'پروندهٔ کاربر' };

/** Displays one account detail as a labelled row. */
function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span className="ms-auto font-semibold">{value}</span>
    </div>
  );
}

/** Server page that retrieves one account using its dynamic identifier. */
export default async function AdminUserDetailPage({
  params,
}: PageProps<'/admin/users/[id]'>) {
  await requireAdmin();
  const { id } = await params;

  const user = await sapi
    .get<AdminUserDetailDto>(`/admin/users/${id}`)
    .catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    });

  const badge = USER_STATUS[user.status];
  const initial = user.fullName.trim().charAt(0) || '؟';

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <Link href="/admin/users" className="mb-3 block text-[12.5px] font-bold">
        → کاربران
      </Link>

      <div className="mb-3.5 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4.5 shadow-card">
        <span
          aria-hidden
          className="grid size-13 place-items-center rounded-full bg-brand text-[20px] text-brand-fg"
        >
          {initial}
        </span>
        <div className="flex-1 basis-55">
          <h1 className="mb-1.25 flex flex-wrap items-center gap-2 text-[18px]">
            {user.fullName}
            <StatusBadge tone={badge.tone} icon={badge.icon}>
              {badge.label}
            </StatusBadge>
          </h1>
          <p className="text-[12.5px] text-muted">
            {user.phone} · {ROLE_LABEL[user.role]} · عضو از{' '}
            {faDate(user.createdAt)}
          </p>
        </div>
        {/* Only a plain user account is suspendable; the API refuses anyone
            holding an admin role and refuses the current session's own
            account, so the button is hidden rather than offered and then
            rejected. */}
        {user.role === 'User' ? <UserStatusButton user={user} /> : null}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-3.5">
        <Panel title="حساب">
          <div className="flex flex-col gap-2.75">
            <Line label="نقش" value={ROLE_LABEL[user.role]} />
            <Line label="وضعیت" value={badge.label} />
            <Line
              label="تأیید شمارهٔ موبایل"
              value={
                user.phoneVerified
                  ? `✓ ${faDate(user.phoneVerifiedAt!)}`
                  : '— انجام نشده'
              }
            />
            <Line label="آخرین فعالیت" value={faAgo(user.lastActiveAt)} />
            <Line label="نشست‌های باز" value={faNum(user.activeSessions)} />
            <Line
              label="مجموع پرداخت"
              value={`${faPrice(user.paidTotal)} · ${faNum(user.paidCount)} تراکنش`}
            />
          </div>
          <UserPasswordReset
            userId={user.id}
            pending={user.mustChangePassword}
          />
        </Panel>

        <Panel title={`پرونده‌های کودکان (${faDigits(user.children.length)})`}>
          {user.children.length === 0 ? (
            <p className="text-[12.5px] text-muted">پرونده‌ای ثبت نشده است.</p>
          ) : (
            <ul className="flex flex-col">
              {user.children.map((child, index) => (
                <li
                  key={child.id}
                  className={
                    index < user.children.length - 1
                      ? 'flex items-center gap-2.5 border-b border-border pb-2.75'
                      : 'flex items-center gap-2.5 pt-2.75'
                  }
                >
                  <span
                    aria-hidden
                    className="size-8 flex-none rounded-full border border-border bg-elev"
                  />
                  <span className="flex-1">
                    <strong className="block text-[12.5px]">
                      {child.firstName} · {faDigits(child.age)} ساله
                    </strong>
                    <span className="text-[11.5px] text-muted">
                      {faNum(child.storyCount)} قصه ·{' '}
                      {PHOTO_STATUS[child.photoStatus]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[11.5px] leading-[1.9] text-muted">
            عکس کودک در این پنل نمایش داده نمی‌شود.
          </p>
        </Panel>

        <Panel title="قصه‌ها">
          <div className="mb-3.5 flex flex-col gap-2.75">
            {(
              [
                'READY',
                'GENERATING',
                'AWAITING_PAYMENT',
                'FAILED',
                'DRAFT',
              ] as const
            ).map((status) => (
              <Line
                key={status}
                label={STORY_STATUS[status].label}
                value={faNum(user.storyStatuses[status])}
              />
            ))}
          </div>
          <Link
            href={`/admin/stories?q=${encodeURIComponent(user.phone ?? '')}`}
            className="text-[12.5px] font-bold"
          >
            همهٔ قصه‌های این خانواده ←
          </Link>
        </Panel>

        <Panel title="فعالیت اخیر">
          {user.recentStories.length === 0 ? (
            <p className="text-[12.5px] text-muted">
              هنوز قصه‌ای ساخته نشده است.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.75 text-[12px]">
              {user.recentStories.map((story) => (
                <li key={story.id} className="leading-[1.9]">
                  <span className="text-muted">
                    {faAgo(story.createdAt)} ·{' '}
                  </span>
                  «{story.title ?? 'قصهٔ بی‌عنوان'}» برای{' '}
                  {story.childName ?? 'کودک حذف‌شده'} —{' '}
                  {THEME_LABEL[story.theme]} ({STORY_STATUS[story.status].label}
                  )
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/admin/audit?q=${encodeURIComponent(user.id)}`}
            className="mt-3.5 block text-[12.5px] font-bold"
          >
            همهٔ رخدادهای این حساب ←
          </Link>
        </Panel>
      </div>

      <p className="mt-3.5 text-[11.5px] leading-[1.9] text-muted">
        باز کردن این صفحه خودش در گزارش رخدادها ثبت شد؛ دسترسی مدیر به دادهٔ یک
        خانواده ردپا می‌گذارد.
      </p>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders an audited administrator view of one account and its operational history.
 */
