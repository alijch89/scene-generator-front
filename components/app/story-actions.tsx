/**
 * @file story-actions.tsx
 * @description Implements client-side favorite toggling and the contextual story action menu.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { StoryDto } from '@/lib/types';
import { cn } from '@/lib/utils';

/** The ✦ on the cover — the only way a story reaches علاقه‌مندی‌ها. */
export function FavoriteButton({
  story,
  className,
}: {
  story: StoryDto;
  className?: string;
}) {
  const router = useRouter();
  // Optimistic, because the star is the whole feedback.
  const [on, setOn] = useState(story.isFavorite);
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      aria-pressed={on}
      aria-label={on ? 'برداشتن از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      onClick={async () => {
        const next = !on;
        setOn(next);
        setBusy(true);
        try {
          await api.post(`/stories/${story.id}/favorite`);
          router.refresh();
        } catch {
          setOn(!next);
        } finally {
          setBusy(false);
        }
      }}
      className={cn(
        'text-[15px] drop-shadow',
        on ? 'text-gold' : 'text-white/70',
        className,
      )}
    >
      {on ? '✦' : '✧'}
    </button>
  );
}

/** The ⋯ menu. <details> gives open/close and Escape without a popover lib. */
export function StoryMenu({ story }: { story: StoryDto }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <details className="relative">
      <summary
        aria-label="بیشتر"
        className="grid cursor-pointer list-none place-items-center rounded-xl border border-border bg-elev px-3 py-2.5 text-[12.5px]"
      >
        ⋯
      </summary>
      <div className="absolute end-0 top-11 z-20 flex w-44 flex-col rounded-2xl border border-border bg-surface p-1.5 shadow-card-lg">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api.delete(`/stories/${story.id}`);
              router.refresh();
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-xl px-3 py-2.5 text-right text-[13px] font-semibold text-error hover:bg-elev"
        >
          {busy ? 'در حال حذف…' : 'حذف قصه'}
        </button>
      </div>
    </details>
  );
}
