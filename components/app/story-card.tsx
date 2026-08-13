import Link from 'next/link';
import { FavoriteButton, StoryMenu } from '@/components/app/story-actions';
import { faDateShort, faDigits, faDuration } from '@/lib/fa';
import { STATUS_LABEL, THEME_LABEL, coverFor } from '@/lib/story-art';
import type { StoryDto } from '@/lib/types';
import { cn } from '@/lib/utils';

const BADGE: Record<string, string> = {
  READY: 'bg-[rgba(20,12,36,.5)] text-[#FFF6E6]',
  GENERATING: 'bg-[rgba(224,120,60,.85)] text-white',
  FAILED: 'bg-error text-white',
  AWAITING_PAYMENT: 'bg-[rgba(20,12,36,.5)] text-[#FFF6E6]',
  DRAFT: 'bg-[rgba(20,12,36,.5)] text-[#FFF6E6]',
};

function Cover({
  story,
  height,
  children,
}: {
  story: StoryDto;
  height: number;
  children?: React.ReactNode;
}) {
  return (
    <span
      className="relative block"
      style={{ height, backgroundImage: coverFor(story.theme, story.status) }}
    >
      {/* Painted cover art, as in the design — no illustration file yet. */}
      <span
        aria-hidden
        className="absolute inset-e-[14%] top-[14%] size-8 rounded-full bg-[#FFF3D6] opacity-80"
      />
      <span
        aria-hidden
        className="absolute bottom-0 inset-s-[-10%] inset-e-[-10%] h-[32%] rounded-t-[50%] bg-[rgba(20,16,50,.55)]"
      />
      {children}
    </span>
  );
}

/** «آوا · خیال و جادو · ۶ دقیقه · ۲۱ مرداد» */
function meta(story: StoryDto) {
  return [
    story.childName,
    THEME_LABEL[story.theme],
    story.durationSec ? faDuration(story.durationSec) : null,
    faDateShort(story.createdAt),
  ]
    .filter(Boolean)
    .join(' · ');
}

/** Cover + title only: dashboard rows and the child's قصه‌ها tab. */
export function StoryCardCompact({ story }: { story: StoryDto }) {
  return (
    <Link
      href={`/stories/${story.id}/read`}
      className="block overflow-hidden rounded-[20px] border border-border bg-surface text-ink shadow-card hover:no-underline"
    >
      <Cover story={story} height={120} />
      <span className="block p-[13px_15px_15px]">
        <strong className="mb-1.5 block text-[14.5px]">
          {story.title ?? 'قصهٔ بی‌نام'}
        </strong>
        <span className="text-[12px] text-muted">
          {story.childName} · {faDigits(story.pageCount)} صفحه
          {story.durationSec ? ` · ${faDuration(story.durationSec)}` : ''}
        </span>
      </span>
    </Link>
  );
}

/** The full library card, with its three status shapes. */
export function StoryCard({ story }: { story: StoryDto }) {
  const ready = story.status === 'READY';

  return (
    <div className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-card">
      <Cover story={story} height={140}>
        <span
          className={cn(
            'absolute inset-e-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            BADGE[story.status],
          )}
        >
          {STATUS_LABEL[story.status]}
        </span>
        {ready ? (
          <FavoriteButton story={story} className="absolute inset-s-2.5 top-2.5" />
        ) : null}
      </Cover>

      <div className="p-[14px_16px_16px]">
        <strong className="mb-1.5 block text-[15px]">
          {story.title ?? 'قصهٔ بی‌نام'}
        </strong>

        {story.status === 'FAILED' ? (
          <>
            <span className="mb-3 block text-[12px] text-muted">
              ساخت متوقف شد · مبلغی کم نشد
            </span>
            <Link
              href={`/wizard?child=${story.childId}`}
              className="block w-full rounded-xl border border-border bg-elev p-2.5 text-center text-[12.5px] font-bold text-ink hover:no-underline"
            >
              ساخت دوباره
            </Link>
          </>
        ) : story.status === 'READY' ? (
          <>
            <span className="mb-3 block text-[12px] text-muted">
              {meta(story)}
            </span>
            <div className="flex gap-1.5">
              <Link
                href={`/stories/${story.id}/read`}
                className="flex-1 rounded-xl bg-brand p-2.5 text-center text-[12.5px] font-bold text-brand-fg hover:no-underline"
              >
                خواندن
              </Link>
              {/* ponytail: ▶ play and ⤓ download arrive with the reader and the
                  stored video in phase 5 — dead buttons help nobody. */}
              <StoryMenu story={story} />
            </div>
          </>
        ) : (
          <>
            <span className="mb-3 block text-[12px] text-muted">
              {story.childName} · {THEME_LABEL[story.theme]} ·{' '}
              {story.status === 'AWAITING_PAYMENT'
                ? 'در انتظار پرداخت'
                : 'به‌زودی آماده می‌شود'}
            </span>
            <span className="block h-1.5 overflow-hidden rounded bg-border">
              <span className="block h-full w-1/3 animate-[shimmer_1.4s_linear_infinite] bg-[length:400%_100%] bg-warm" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
