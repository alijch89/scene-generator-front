import type { Metadata } from 'next';
import Link from 'next/link';
import { DownloadButton } from '@/components/app/story-media';
import { EmptyState, PageTitle, PrimaryLink } from '@/components/app/ui';
import { sapi } from '@/lib/dal';
import { faDateShort, faDigits, faDuration } from '@/lib/fa';
import { THEME_LABEL, coverFor } from '@/lib/story-art';
import type { StoryDto } from '@/lib/types';

export const metadata: Metadata = { title: 'دانلودها' };

/**
 * Every finished story is downloadable — the file lives in our storage, and
 * the browser owns the transfer once the link is clicked.
 *
 * ponytail: no per-download state machine. The design's «در حال دانلود ۶۲٪» and
 * «ناموفق» rows describe progress the browser already shows in its own download
 * tray, and nothing server-side can observe it. Add a service worker only if
 * offline playback is ever asked for.
 */
export default async function DownloadsPage() {
  const { items } = await sapi.get<{ items: StoryDto[] }>(
    '/stories?status=READY',
  );

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="دانلودها"
        lead="قصه‌های آماده را روی دستگاه خودتان ذخیره کنید تا بدون اینترنت هم تماشا شوند."
        meta={`${faDigits(items.length)} قصه`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="⤓"
          title="هنوز قصه‌ای برای دانلود ندارید."
          action={<PrimaryLink href="/wizard">ساخت قصهٔ تازه</PrimaryLink>}
        >
          هر قصه‌ای که ساخته شود، همین‌جا برای ذخیره روی دستگاه آماده می‌شود.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((story) => (
            <li
              key={story.id}
              className="flex flex-wrap items-center gap-4 rounded-[20px] border border-border bg-surface p-3.5 shadow-card"
            >
              <span
                aria-hidden
                className="h-15 w-20 flex-none rounded-2xl"
                style={{ backgroundImage: coverFor(story.theme, story.status) }}
              />
              <span className="min-w-0 flex-1 basis-50">
                <Link
                  href={`/stories/${story.id}/read`}
                  className="block truncate text-[15px] font-bold text-ink hover:no-underline"
                >
                  {story.title ?? 'قصهٔ بی‌نام'}
                </Link>
                <span className="text-[12.5px] text-muted">
                  {story.childName} · {THEME_LABEL[story.theme]} ·{' '}
                  {faDigits(story.pageCount)} صفحه
                  {story.durationSec ? ` · ${faDuration(story.durationSec)}` : ''}{' '}
                  · {faDateShort(story.readyAt ?? story.createdAt)}
                </span>
              </span>
              <DownloadButton
                storyId={story.id}
                className="rounded-xl border border-border bg-elev px-4 py-2.5 text-[13px] font-semibold"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
