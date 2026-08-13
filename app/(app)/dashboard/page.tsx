import Link from 'next/link';
import { StoryCardCompact } from '@/components/app/story-card';
import {
  Card,
  ChildAvatar,
  EmptyState,
  PrimaryLink,
  childMeta,
} from '@/components/app/ui';
import { AddChildButton } from '@/components/app/child-form';
import { sapi, verifySession } from '@/lib/dal';
import { faDigits } from '@/lib/fa';
import { THEME_LABEL, VOICE_LABEL, coverFor } from '@/lib/story-art';
import type { ChildDto, StoryDto } from '@/lib/types';

/** «عصر بخیر» / «صبح بخیر» — the design greets by time of day. */
function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Tehran',
    }).format(new Date()),
  );
  if (hour < 12) return 'صبح بخیر';
  if (hour < 17) return 'ظهر بخیر';
  if (hour < 21) return 'عصر بخیر';
  return 'شب بخیر';
}

export default async function DashboardPage() {
  const [user, children, { items: stories }, reading] = await Promise.all([
    verifySession(),
    sapi.get<ChildDto[]>('/children'),
    sapi.get<{ items: StoryDto[] }>('/stories?take=4'),
    sapi.get<StoryDto | null>('/stories/continue'),
  ]);

  // «پیشنهاد برای آوا» — built from what the first child actually likes.
  const suggestFor = children[0];
  const suggestions = (suggestFor?.interests ?? []).slice(0, 2);

  return (
    <section className="flex animate-[pageIn_.4s_ease_both] flex-col gap-7.5">
      <div className="flex flex-wrap items-end gap-5">
        <div className="flex-1 basis-75">
          <h1 className="mb-2 font-display text-[clamp(25px,4vw,36px)]">
            {greeting()}، {user.fullName.split(' ')[0]}.
          </h1>
          <p className="text-[16px] text-muted">آمادهٔ یک ماجرای تازه‌اید؟</p>
        </div>
        <PrimaryLink href="/wizard" className="px-6.5 py-4 text-[15.5px]">
          ساخت قصهٔ تازه
        </PrimaryLink>
      </div>

      {reading ? (
        <div>
          <h2 className="mb-3 text-[16px] font-bold text-muted">
            ادامهٔ خواندن
          </h2>
          <Link
            href={`/stories/${reading.id}/read`}
            className="flex flex-wrap overflow-hidden rounded-3xl border border-border bg-surface text-ink shadow-card hover:no-underline"
          >
            <span
              className="min-h-42.5 flex-1 basis-50"
              style={{
                backgroundImage: coverFor(reading.theme, reading.status),
              }}
            />
            <span className="flex flex-2 basis-75 flex-col justify-center gap-2.5 px-6 py-5.5">
              <span className="text-[12.5px] font-bold text-warm">
                صفحهٔ {faDigits(Math.max(reading.lastReadPage, 1))} از{' '}
                {faDigits(reading.pageCount)}
              </span>
              <strong className="font-display text-[23px]">
                {reading.title ?? 'قصهٔ بی‌نام'}
              </strong>
              <span className="text-[13.5px] text-muted">
                {THEME_LABEL[reading.theme]} · روایت {VOICE_LABEL[reading.voice]}
              </span>
              <span className="block h-1.5 max-w-70 overflow-hidden rounded bg-border">
                <span
                  className="block h-full bg-brand"
                  style={{
                    width: `${Math.round(
                      (reading.lastReadPage / reading.pageCount) * 100,
                    )}%`,
                  }}
                />
              </span>
              <span className="mt-1 text-[14.5px] font-bold text-brand">
                ادامه از صفحهٔ {faDigits(Math.max(reading.lastReadPage, 1))} ←
              </span>
            </span>
          </Link>
        </div>
      ) : null}

      <div>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-muted">کودکان من</h2>
          <Link
            href="/children"
            className="ms-auto text-[13px] font-bold text-brand"
          >
            مدیریت ←
          </Link>
        </div>

        {children.length === 0 ? (
          <EmptyState
            icon="✦"
            title="اول یک پروندهٔ کودک بسازید."
            action={
              <AddChildButton className="rounded-[15px] bg-linear-to-br from-brand to-warm px-6 py-3.5 text-[15px] font-bold text-brand-fg">
                + افزودن کودک
              </AddChildButton>
            }
          >
            قصه‌ها به نام و سن کودک شما ساخته می‌شوند.
          </EmptyState>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/children/${child.id}`}
                className="flex items-center gap-3.5 rounded-[20px] border border-border bg-surface p-3.5 text-ink shadow-card hover:no-underline"
              >
                <ChildAvatar child={child} size={54} />
                <span>
                  <strong className="block text-[15px]">
                    {child.firstName}
                  </strong>
                  <span className="text-[12.5px] text-muted">
                    {childMeta(child)}
                  </span>
                </span>
              </Link>
            ))}
            <AddChildButton className="flex items-center gap-3.5 rounded-[20px] border-2 border-dashed border-border p-3.5 text-muted">
              <span className="grid size-13.5 place-items-center rounded-full bg-elev text-[22px]">
                +
              </span>
              <span className="text-[13.5px] font-semibold">افزودن کودک</span>
            </AddChildButton>
          </div>
        )}
      </div>

      {stories.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-[16px] font-bold text-muted">قصه‌های تازه</h2>
            <Link
              href="/library"
              className="ms-auto text-[13px] font-bold text-brand"
            >
              همهٔ قصه‌ها ←
            </Link>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {stories.map((story) => (
              <StoryCardCompact key={story.id} story={story} />
            ))}
          </div>
        </div>
      ) : null}

      {suggestFor && suggestions.length > 0 ? (
        <Card className="bg-elev shadow-none">
          <p className="mb-3 text-[13.5px] font-bold text-muted">
            پیشنهاد برای {suggestFor.firstName}
          </p>
          <div className="flex flex-col gap-3">
            {suggestions.map((interest) => (
              <Link
                key={interest}
                href={`/wizard?child=${suggestFor.id}&idea=${encodeURIComponent(interest)}`}
                className="flex items-center gap-3 text-ink hover:no-underline"
              >
                <span
                  aria-hidden
                  className="size-11.5 flex-none rounded-xl bg-linear-to-br from-brand to-warm"
                />
                <span>
                  <strong className="block text-[14px]">
                    قصه‌ای دربارهٔ {interest}
                  </strong>
                  <span className="text-[12px] text-muted">
                    چون {suggestFor.firstName} {interest} را دوست دارد
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
    </section>
  );
}
