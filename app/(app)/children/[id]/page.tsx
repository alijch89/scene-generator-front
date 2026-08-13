import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChildInterestsEditor,
  ChildPrefsForm,
  DeleteChildButton,
  DeletePhotoButton,
} from '@/components/app/child-actions';
import { EditChildButton } from '@/components/app/child-form';
import { StoryCardCompact } from '@/components/app/story-card';
import {
  ChildAvatar,
  EmptyState,
  InterestChip,
  PillLink,
  PrimaryLink,
} from '@/components/app/ui';
import { API_URL, ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';
import { faDate, faDigits } from '@/lib/fa';
import type { ChildDto, StoryDto } from '@/lib/types';

const TABS = [
  { id: 'stories', label: 'قصه‌ها' },
  { id: 'interests', label: 'علاقه‌ها' },
  { id: 'prefs', label: 'ترجیح‌های قصه' },
  { id: 'privacy', label: 'داده و حریم خصوصی' },
] as const;

type Tab = (typeof TABS)[number]['id'];

export const metadata: Metadata = { title: 'پروندهٔ کودک' };

export default async function ChildPage({
  params,
  searchParams,
}: PageProps<'/children/[id]'>) {
  const { id } = await params;
  const { tab } = await searchParams;
  const active = (
    TABS.some((t) => t.id === tab) ? tab : 'stories'
  ) as Tab;

  const child = await sapi.get<ChildDto>(`/children/${id}`).catch((err) => {
    // 404 covers both "gone" and "someone else's" — the API never says which.
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  const { items: stories } =
    active === 'stories'
      ? await sapi.get<{ items: StoryDto[] }>(`/stories?childId=${id}`)
      : { items: [] };

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <Link
        href="/children"
        className="mb-4 inline-block text-[13.5px] font-bold text-brand"
      >
        → کودکان
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-5 rounded-[26px] border border-border bg-surface p-[22px] shadow-card">
        <ChildAvatar child={child} size={96} />

        <div className="flex-1 basis-50">
          <h1 className="mb-1.5 font-display text-[28px]">{child.firstName}</h1>
          <p className="mb-2.5 text-[14px] text-muted">
            {faDigits(child.age)} ساله · عضو خانه از {faDate(child.createdAt)} ·{' '}
            {faDigits(child.storyCount)} قصه
          </p>
          <div className="flex flex-wrap gap-1.5">
            {child.interests.map((interest) => (
              <InterestChip key={interest}>{interest}</InterestChip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <PrimaryLink href={`/wizard?child=${child.id}`}>
            ساخت قصه برای {child.firstName}
          </PrimaryLink>
          <EditChildButton child={child} />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <PillLink
            key={t.id}
            href={`/children/${child.id}?tab=${t.id}`}
            active={t.id === active}
            scroll={false}
          >
            {t.label}
          </PillLink>
        ))}
      </div>

      {active === 'stories' ? (
        stories.length > 0 ? (
          <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
            {stories.map((story) => (
              <StoryCardCompact key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="✦"
            title={`هنوز قصه‌ای برای ${child.firstName} ساخته نشده.`}
            action={
              <PrimaryLink href={`/wizard?child=${child.id}`}>
                ساخت اولین قصه
              </PrimaryLink>
            }
          >
            علاقه‌ها و ترجیح‌های این پرونده به قصه شکل می‌دهند.
          </EmptyState>
        )
      ) : null}

      {active === 'interests' ? <ChildInterestsEditor child={child} /> : null}

      {active === 'prefs' ? <ChildPrefsForm child={child} /> : null}

      {active === 'privacy' ? (
        <div className="flex max-w-160 flex-col gap-3">
          <div className="flex gap-3 rounded-[18px] border border-border bg-elev px-4.5 py-4">
            <span aria-hidden className="text-success">
              🛡
            </span>
            <p className="text-[13.5px] leading-[1.9] text-muted">
              عکس {child.firstName} خصوصی است، عمومی نمی‌شود و برای آموزش
              مدل‌ها به کار نمی‌رود.
            </p>
          </div>

          <DeletePhotoButton child={child} />

          <a
            href={`${API_URL}/children/${child.id}/export`}
            className="rounded-2xl border border-border bg-surface px-4.5 py-4 text-right text-[14px] font-semibold text-ink hover:no-underline"
          >
            دریافت داده‌های {child.firstName}
          </a>

          <DeleteChildButton
            child={child}
            redirectTo="/children"
            triggerLabel={`پاک کردن کامل پروندهٔ ${child.firstName}`}
            triggerClassName="rounded-2xl border-error bg-surface px-4.5 py-4 text-right text-[14px] font-semibold"
          />
        </div>
      ) : null}
    </section>
  );
}
