import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FavoriteButton } from '@/components/app/story-actions';
import { ChildAvatar, PrimaryLink } from '@/components/app/ui';
import { DownloadButton } from '@/components/app/story-media';
import { ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';
import { faDigits, faDuration } from '@/lib/fa';
import { STYLE_LABEL, THEME_COVER, VOICE_LABEL } from '@/lib/story-art';
import type { ChildDto, StoryDto } from '@/lib/types';

export const metadata: Metadata = { title: 'قصه آماده است' };

export default async function ReadyPage({
  params,
}: PageProps<'/stories/[id]/ready'>) {
  const { id } = await params;

  const story = await sapi.get<StoryDto>(`/stories/${id}`).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  // Only a finished story has a «آماده شد» moment.
  if (story.status !== 'READY') redirect(`/stories/${id}/generating`);

  const child = await sapi
    .get<ChildDto>(`/children/${story.childId}`)
    .catch(() => null);

  return (
    <section className="mx-auto max-w-225 animate-[riseIn_.6s_cubic-bezier(.2,.8,.2,1)_both] py-11">
      <div className="mb-7 text-center">
        <p className="mb-2 text-[13px] font-bold tracking-wide text-gold">
          ✦ آماده شد ✦
        </p>
        <h1 className="mb-2 font-display text-[clamp(27px,5vw,42px)]">
          قصهٔ {child?.firstName ?? 'شما'} آماده است.
        </h1>
        <p className="text-[15px] text-muted">
          {faDigits(story.pageCount)} صفحه
          {story.durationSec ? ` · ${faDuration(story.durationSec)}` : ''} · روایت{' '}
          {VOICE_LABEL[story.voice]} · سبک {STYLE_LABEL[story.style]}
        </p>
      </div>

      <div className="grid items-center gap-6 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        <div className="-rotate-[1.2deg] rounded-[26px] border border-border bg-surface p-2.25 shadow-card-lg">
          <div
            className="relative aspect-4/5 overflow-hidden rounded-[20px]"
            style={{ backgroundImage: THEME_COVER[story.theme] }}
          >
            <span
              aria-hidden
              className="absolute end-[16%] top-[10%] size-14.5 rounded-full bg-[#FFF3D6] shadow-[0_0_44px_rgba(255,240,200,.85)]"
            />
            <span
              aria-hidden
              className="absolute bottom-0 -start-[12%] -end-[12%] h-[36%] rounded-t-[50%] bg-[#1D1840]"
            />
            <div className="absolute inset-x-4.5 bottom-4.5 flex items-end gap-3">
              {child ? <ChildAvatar child={child} size={66} /> : null}
              <div className="pb-1.25">
                <p className="mb-1 font-display text-[22px] text-[#FFF6E6] drop-shadow-[0_2px_14px_rgba(0,0,0,.55)]">
                  {story.title ?? 'قصهٔ تازه'}
                </p>
                <p className="text-[12px] text-[rgba(255,246,230,.82)]">
                  {faDigits(story.pageCount)} صفحه
                  {story.durationSec ? ` · ${faDuration(story.durationSec)}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <PrimaryLink
            href={`/stories/${story.id}/read`}
            className="w-full rounded-[18px] px-6 py-4.25 text-[16.5px] shadow-card-lg"
          >
            شروع خواندن
          </PrimaryLink>
          <Link
            href={`/stories/${story.id}/read?play=1`}
            className="w-full rounded-[18px] border border-border bg-surface px-6 py-3.75 text-center text-[15px] font-bold text-ink hover:no-underline"
          >
            ▶ گوش دادن به قصه
          </Link>

          <div className="flex flex-wrap gap-2.5">
            <DownloadButton
              storyId={story.id}
              className="flex-1 basis-25 rounded-[14px] border border-border bg-elev p-3 text-[13.5px] font-semibold"
            />
            <span className="flex flex-1 basis-25 items-center justify-center gap-2 rounded-[14px] border border-border bg-elev p-3 text-[13.5px] font-semibold">
              <FavoriteButton story={story} className="text-[15px]" />
              علاقه‌مندی
            </span>
          </div>

          <Link
            href={`/wizard?child=${story.childId}`}
            className="self-start px-0.5 py-1.5 text-[14px] font-bold text-brand"
          >
            یک قصهٔ دیگر بسازیم →
          </Link>
        </div>
      </div>
    </section>
  );
}
