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
import { STORY_STATUS } from '@/lib/admin';
import { requireAdmin, sapi } from '@/lib/dal';
import { faDateNumeric, faElapsed, faNum } from '@/lib/fa';
import { THEME_LABEL } from '@/lib/story-art';
import type {
  AdminPage,
  AdminStoryRow,
  StoryStatus,
  StoryTheme,
} from '@/lib/types';

export const metadata: Metadata = { title: 'قصه‌ها' };

const PER_PAGE = 25;

const STATUSES = Object.keys(STORY_STATUS) as StoryStatus[];
const THEMES = Object.keys(THEME_LABEL) as StoryTheme[];

export default async function AdminStoriesPage({
  searchParams,
}: PageProps<'/admin/stories'>) {
  await requireAdmin();

  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as StoryStatus)
    ? (sp.status as StoryStatus)
    : '';
  const theme = THEMES.includes(sp.theme as StoryTheme)
    ? (sp.theme as StoryTheme)
    : '';
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);

  const query = new URLSearchParams({
    page: String(page),
    take: String(PER_PAGE),
  });
  if (status) query.set('status', status);
  if (theme) query.set('theme', theme);
  if (q) query.set('q', q);

  const stories = await sapi.get<AdminPage<AdminStoryRow>>(
    `/admin/stories?${query}`,
  );

  const filtered = Boolean(status || theme || q);
  const hrefFor = (next: number) => {
    const params = new URLSearchParams({ page: String(next) });
    if (status) params.set('status', status);
    if (theme) params.set('theme', theme);
    if (q) params.set('q', q);
    return `/admin/stories?${params}`;
  };

  return (
    <section className="animate-[pageIn_.35s_ease_both]">
      <AdminHeader
        title="قصه‌ها"
        count={`${faNum(stories.total)} قصه${filtered ? ' با این فیلتر' : ''}`}
      >
        <FilterBar action="/admin/stories" filtered={filtered}>
          <SearchInput
            defaultValue={q}
            placeholder="عنوان، کاربر، کودک یا شناسه"
            aria-label="جست‌وجو در قصه‌ها"
          />
          <FilterSelect label="وضعیت قصه" name="status" defaultValue={status}>
            <option value="">همهٔ وضعیت‌ها</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {STORY_STATUS[value].label}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="ماجرا" name="theme" defaultValue={theme}>
            <option value="">همهٔ ماجراها</option>
            {THEMES.map((value) => (
              <option key={value} value={value}>
                {THEME_LABEL[value]}
              </option>
            ))}
          </FilterSelect>
        </FilterBar>
      </AdminHeader>

      <TableCard>
        <table className="w-full min-w-225 border-collapse text-[12.5px]">
          <caption className="sr-only">فهرست قصه‌ها</caption>
          <thead className="bg-elev">
            <tr>
              <th scope="col" className={thClass}>
                قصه
              </th>
              <th scope="col" className={thClass}>
                کاربر
              </th>
              <th scope="col" className={thClass}>
                کودک
              </th>
              <th scope="col" className={thClass}>
                ماجرا
              </th>
              <th scope="col" className={thClass}>
                وضعیت
              </th>
              <th scope="col" className={thClass}>
                ساخت
              </th>
              <th scope="col" className={thClass}>
                مدت تولید
              </th>
              <th scope="col" className={thClass}>
                <span className="sr-only">اقدام</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {stories.items.map((story) => {
              const badge = STORY_STATUS[story.status];
              return (
                <tr key={story.id}>
                  <td className={`${tdClass} font-semibold`}>
                    {story.title ?? (
                      <span className="text-muted">بی‌عنوان</span>
                    )}
                    {story.failureReason ? (
                      <span className="block text-[11px] font-normal text-error">
                        {story.failureReason}
                      </span>
                    ) : null}
                  </td>
                  <td className={tdClass}>
                    {story.user ? (
                      <Link href={`/admin/users/${story.user.id}`}>
                        {story.user.fullName}
                      </Link>
                    ) : (
                      <span className="text-muted">— حساب حذف شده</span>
                    )}
                  </td>
                  <td className={tdClass}>{story.childName ?? '—'}</td>
                  <td className={tdClass}>{THEME_LABEL[story.theme]}</td>
                  <td className={tdClass}>
                    <StatusBadge
                      tone={badge.tone}
                      icon={badge.icon}
                      className="px-2.25 py-0.75 text-[11px]"
                    >
                      {badge.label}
                    </StatusBadge>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {faDateNumeric(story.createdAt)}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {story.generationDurationMs
                      ? faElapsed(story.generationDurationMs)
                      : '—'}
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/stories/${story.id}/jobs`}
                      className="font-bold whitespace-nowrap"
                    >
                      {story.status === 'FAILED' ? 'بررسی کار' : 'کارها'}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {stories.items.length === 0 ? (
          <TableEmpty>
            {filtered ? (
              <>
                قصه‌ای با این فیلتر پیدا نشد.{' '}
                <Link href="/admin/stories">همهٔ قصه‌ها</Link>
              </>
            ) : (
              'هنوز هیچ قصه‌ای ساخته نشده است.'
            )}
          </TableEmpty>
        ) : null}
      </TableCard>

      <Pagination
        page={stories.page}
        pageCount={stories.pageCount}
        href={hrefFor}
      />
    </section>
  );
}
