/**
 * @file story-actions.tsx
 * @description Implements client-side favorite toggling and the contextual story action menu.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal, ModalHeader } from '@/components/app/dialog';
import { ApiError, api } from '@/lib/api';
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

/** Sends a fresh generation request for a paid failed story. */
export function RetryStoryButton({
  storyId,
  onStarted,
}: {
  storyId: string;
  onStarted?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function retry() {
    setBusy(true);
    setError(null);
    try {
      await api.post(`/stories/${storyId}/retry`);
      if (onStarted) onStarted();
      else router.push(`/stories/${storyId}/generating`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'شروع دوبارهٔ ساخت انجام نشد. دوباره تلاش کنید.',
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={retry}
        className="w-full rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-brand-fg disabled:opacity-60"
      >
        {busy ? 'در حال شروع دوباره…' : 'تلاش دوباره بدون پرداخت'}
      </button>
      {error ? (
        <p role="alert" className="text-[12.5px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Story actions shared by every library card, regardless of its status. */
export function StoryMenu({ story }: { story: StoryDto }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/stories/${story.id}`);
    } catch (err) {
      // A second tab may already have removed this story.
      if (!(err instanceof ApiError && err.status === 404)) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'حذف قصه انجام نشد. دوباره تلاش کنید.',
        );
        setBusy(false);
        return;
      }
    }
    setConfirming(false);
    router.refresh();
  }

  function close() {
    setConfirming(false);
  }

  return (
    <>
      <details className="relative shrink-0">
        <summary
          aria-label={`گزینه‌های قصهٔ ${story.title ?? 'بی‌نام'}`}
          className="grid cursor-pointer list-none place-items-center rounded-xl border border-border bg-elev px-3 py-2.5 text-[12.5px]"
        >
          ⋯
        </summary>
        <div className="absolute end-0 bottom-full z-20 mb-1.5 flex w-44 flex-col rounded-2xl border border-border bg-surface p-1.5 shadow-card-lg">
          <button
            type="button"
            disabled={busy}
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open');
              setError(null);
              setConfirming(true);
            }}
            className="rounded-xl px-3 py-2.5 text-right text-[13px] font-semibold text-error hover:bg-elev"
          >
            {busy ? 'در حال حذف…' : 'حذف قصه'}
          </button>
        </div>
      </details>
      <Modal open={confirming} onClose={close} label="حذف قصه">
        <ModalHeader title="حذف قصه" onClose={close} />
        <p className="mb-5 text-[13.5px] leading-[1.9] text-muted">
          قصهٔ «{story.title ?? 'بی‌نام'}» حذف می‌شود. این کار قابل بازگشت نیست.
        </p>
        {error ? (
          <p role="alert" className="mb-4 text-[13px] text-error">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className="rounded-xl bg-error px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
          >
            {busy ? 'در حال حذف…' : 'بله، حذف کن'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={close}
            className="rounded-xl border border-border bg-elev px-4 py-2.5 text-[13px] font-semibold"
          >
            انصراف
          </button>
        </div>
      </Modal>
    </>
  );
}
