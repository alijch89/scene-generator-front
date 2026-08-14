import type { Metadata } from 'next';
import {
  ChangePasswordForm,
  ProfileForm,
  SessionList,
} from '@/components/app/account-forms';
import { Card, PageTitle } from '@/components/app/ui';
import { sapi, verifySession } from '@/lib/dal';
import type { SessionDto } from '@/lib/types';

export const metadata: Metadata = { title: 'پروفایل' };

/** Server page that loads the current account and active session metadata. */
export default async function ProfilePage() {
  const [user, sessions] = await Promise.all([
    verifySession(),
    sapi.get<SessionDto[]>('/auth/sessions'),
  ]);

  return (
    <section className="max-w-180 animate-[pageIn_.4s_ease_both]">
      <PageTitle title="پروفایل" />

      <Card className="mb-3.5">
        <h2 className="mb-4.5 text-[16px] font-bold">اطلاعات شخصی</h2>
        <div className="mb-4.5 flex items-center gap-4">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-full bg-linear-to-br from-brand to-warm text-[23px] text-brand-fg"
          >
            {user.fullName.slice(0, 1)}
          </span>
          <p className="text-[13px] text-muted">
            تصویر پروفایل از حرف اول نامتان ساخته می‌شود.
          </p>
        </div>
        <ProfileForm user={user} />
      </Card>

      <Card>
        <h2 className="mb-4 text-[16px] font-bold">امنیت</h2>
        <div className="flex flex-col gap-3">
          <ChangePasswordForm />
          <SessionList sessions={sessions} />
        </div>
      </Card>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders parent profile editing, password changes, and active-session management.
 */
