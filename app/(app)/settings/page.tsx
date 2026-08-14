import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DeleteAccountButton,
  DisplaySettings,
  NotificationPrefsForm,
} from '@/components/app/account-forms';
import { Card, PageTitle } from '@/components/app/ui';
import { API_URL } from '@/lib/api';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = { title: 'تنظیمات' };

/** Server page that loads current account preferences for client-side settings forms. */
export default async function SettingsPage() {
  const user = await verifySession();

  return (
    <section className="max-w-180 animate-[pageIn_.4s_ease_both]">
      <PageTitle title="تنظیمات" />

      <Card className="mb-3.5">
        <h2 className="mb-2 text-[16px] font-bold">اعلان‌ها</h2>
        <NotificationPrefsForm prefs={user.prefs} />
      </Card>

      <Card className="mb-3.5">
        <h2 className="mb-4 text-[16px] font-bold">نمایش و زبان</h2>
        <DisplaySettings />
      </Card>

      <Card>
        <h2 className="mb-2 text-[16px] font-bold">حریم خصوصی و داده‌ها</h2>
        <p className="mb-4 text-[13.5px] leading-[1.9] text-muted">
          داده‌های کودکان در اختیار شماست. هر کدام از این کارها بازگشت‌ناپذیر
          است.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/children"
            className="rounded-[14px] border border-border bg-elev px-4 py-3.5 text-right text-[14px] font-semibold text-ink hover:no-underline"
          >
            مدیریت داده‌های کودکان
          </Link>
          <a
            href={`${API_URL}/auth/me/export`}
            className="rounded-[14px] border border-border bg-elev px-4 py-3.5 text-right text-[14px] font-semibold text-ink hover:no-underline"
          >
            دریافت نسخهٔ داده‌هایم
          </a>
          <DeleteAccountButton />
        </div>
      </Card>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders notification, display, data-export, and account-deletion settings.
 */
