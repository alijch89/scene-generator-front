import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/ui';
import { SettingsForm } from '@/components/admin/settings-form';
import { requireAdmin, sapi } from '@/lib/dal';
import type { AdminSettingsDto } from '@/lib/types';

export const metadata: Metadata = { title: 'تنظیمات سیستم' };

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await sapi.get<AdminSettingsDto>('/admin/settings');

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader title="تنظیمات سیستم" count="هر تغییر در گزارش رخدادها ثبت می‌شود" />
      <SettingsForm initial={settings} />
    </section>
  );
}
