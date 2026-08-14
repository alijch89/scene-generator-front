import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AdminHeader,
  FilterBar,
  FilterSelect,
  Pagination,
  SearchInput,
  TableCard,
  TableEmpty,
  tdClass,
  thClass,
} from '@/components/admin/ui';
import { StatusBadge } from '@/components/status-badge';
import { ROLE_LABEL, UNVERIFIED, USER_STATUS } from '@/lib/admin';
import { API_URL } from '@/lib/api';
import { requireAdmin, sapi } from '@/lib/dal';
import { faAgo, faDateNumeric, faNum } from '@/lib/fa';
import type { AdminPage, AdminUserRow } from '@/lib/types';

export const metadata: Metadata = { title: 'کاربران' };

const PER_PAGE = 25;

/**
 * The design filtered by «طرح» (رایگان / خانواده / ویژه). Plans are gone with
 * subscriptions, so the filter is by نقش — the only account-level distinction
 * this product has — plus the status filter the design already carried.
 */
const ROLE_FILTER = [
  { value: '', label: 'همهٔ نقش‌ها' },
  { value: 'PARENT', label: 'والد' },
  { value: 'ADMIN', label: 'مدیر' },
];

const STATUS_FILTER = [
  { value: '', label: 'همهٔ وضعیت‌ها' },
  { value: 'ACTIVE', label: 'فعال' },
  { value: 'SUSPENDED', label: 'غیرفعال' },
  { value: 'unverified', label: 'تأیید نشده' },
];

export default async function AdminUsersPage({
  searchParams,
}: PageProps<'/admin/users'>) {
  await requireAdmin();

  const sp = await searchParams;
  const role = ROLE_FILTER.some((r) => r.value === sp.role && r.value)
    ? (sp.role as string)
    : '';
  const status = STATUS_FILTER.some((s) => s.value === sp.status && s.value)
    ? (sp.status as string)
    : '';
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (role) query.set('role', role);
  // «تأیید نشده» is not a UserStatus — it is the absence of a verified date,
  // so it travels as its own flag rather than being squeezed into the enum.
  if (status === 'unverified') query.set('unverified', 'true');
  else if (status) query.set('status', status);
  if (q) query.set('q', q);

  const users = await sapi.get<AdminPage<AdminUserRow>>(
    `/admin/users?${query}`,
  );

  const filtered = Boolean(role || status || q);
  const hrefFor = (next: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '') params.delete(key);
      else params.set(key, String(value));
    });
    const qs = params.toString();
    return qs ? `/admin/users?${qs}` : '/admin/users';
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="کاربران"
        count={`${faNum(users.total)} کاربر${filtered ? ' با این فیلتر' : ''}`}
      >
        <FilterBar action="/admin/users" filtered={filtered}>
          <SearchInput
            defaultValue={q}
            placeholder="نام، ایمیل یا شناسه"
            aria-label="جست‌وجو در کاربران"
          />
          <FilterSelect label="نقش کاربر" name="role" defaultValue={role}>
            {ROLE_FILTER.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="وضعیت حساب" name="status" defaultValue={status}>
            {STATUS_FILTER.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterBar>
        <a
          href={`${API_URL}/admin/export?kind=users`}
          className="rounded-lg border border-border bg-surface px-3.25 py-2 text-[12.5px] font-semibold text-ink hover:no-underline"
        >
          خروجی CSV
        </a>
      </AdminHeader>

      <TableCard>
        <table className="w-full min-w-210 border-collapse text-[12.5px]">
          <caption className="sr-only">فهرست کاربران</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                کاربر
              </th>
              <th scope="col" className={thClass}>
                وضعیت
              </th>
              <th scope="col" className={thClass}>
                نقش
              </th>
              <th scope="col" className={thClass}>
                کودکان
              </th>
              <th scope="col" className={thClass}>
                قصه‌ها
              </th>
              <th scope="col" className={thClass}>
                عضویت
              </th>
              <th scope="col" className={thClass}>
                آخرین فعالیت
              </th>
              <th scope="col" className={thClass}>
                <span className="sr-only">اقدام</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.items.map((user) => {
              // An unverified account is a more useful thing to see than
              // "active", so it wins the badge when both are true.
              const badge =
                user.status === 'ACTIVE' && !user.emailVerified
                  ? UNVERIFIED
                  : USER_STATUS[user.status];

              return (
                <tr key={user.id}>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-semibold"
                    >
                      {user.fullName}
                    </Link>
                    <span className="block text-[11.5px] text-muted">
                      {user.email}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <StatusBadge
                      tone={badge.tone}
                      icon={badge.icon}
                      className="px-2.25 py-0.75 text-[11px]"
                    >
                      {badge.label}
                    </StatusBadge>
                  </td>
                  <td className={tdClass}>{ROLE_LABEL[user.role]}</td>
                  <td className={tdClass}>{faNum(user.childCount)}</td>
                  <td className={tdClass}>{faNum(user.storyCount)}</td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {faDateNumeric(user.createdAt)}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-muted`}>
                    {faAgo(user.lastActiveAt)}
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-bold whitespace-nowrap"
                    >
                      پرونده
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.items.length === 0 ? (
          <TableEmpty>
            {filtered ? (
              <>
                کاربری با این فیلتر پیدا نشد.{' '}
                <Link href="/admin/users">همهٔ کاربران</Link>
              </>
            ) : (
              'هنوز هیچ کاربری ثبت‌نام نکرده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination
        page={users.page}
        pageCount={users.pageCount}
        href={(next) => hrefFor({ page: next })}
      />

      <p className="mt-3 text-[11.5px] leading-[1.9] text-muted">
        اقدام‌های گروهی طرح اولیه (ارسال ایمیل، تغییر طرح، غیرفعال کردن دسته‌ای)
        ساخته نشده‌اند: سامانهٔ ایمیل انبوه نداریم و طرحی هم برای تغییر نیست.
        فعال و غیرفعال کردن در پروندهٔ هر کاربر انجام می‌شود.
      </p>
    </section>
  );
}
