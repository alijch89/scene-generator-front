import { requireAdmin, serverCookieHeader } from '@/lib/dal';
import { api } from '@/lib/api';
import { faDate, faNum } from '@/lib/fa';
import type { UserDto } from '@/lib/session';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const { total, items } = await api.get<{ total: number; items: UserDto[] }>(
    '/admin/users',
    { cookie: await serverCookieHeader() },
  );

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl">داشبورد عملیات</h1>
        <p className="text-sm text-muted">
          صفحه‌های کامل مدیریت در مرحلهٔ هفت ساخته می‌شوند.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-xs font-bold text-muted">کاربران</p>
        <strong className="font-display text-3xl">{faNum(total)}</strong>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-card">
        <table className="w-full min-w-[520px] text-right text-[13.5px]">
          <thead className="bg-elev">
            <tr>
              <th className="px-4 py-3 font-bold">کاربر</th>
              <th className="px-4 py-3 font-bold">نقش</th>
              <th className="px-4 py-3 font-bold">تأیید ایمیل</th>
              <th className="px-4 py-3 font-bold">عضویت</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <strong className="block">{u.fullName}</strong>
                  <span className="text-[11.5px] text-muted">{u.email}</span>
                </td>
                <td className="px-4 py-3">
                  {u.role === 'ADMIN' ? 'مدیر' : 'والد'}
                </td>
                <td className="px-4 py-3">
                  {u.emailVerified ? '✓ تأیید شده' : '— در انتظار'}
                </td>
                <td className="px-4 py-3">{faDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
