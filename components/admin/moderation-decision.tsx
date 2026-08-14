'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { AdminModerationDetail } from '@/lib/types';

/**
 * تأیید / رد. The design offered four buttons; «بازنویسی صفحه» needs a rewrite
 * pipeline we do not have, and «ارجاع به سرپرست» needs a role above admin,
 * which with two roles does not exist. Both are dropped rather than faked.
 *
 * Rejecting is destructive and irreversible — a story is pulled from its
 * family's library, or a child's photo is deleted — so it confirms first.
 */
export function ModerationDecision({ item }: { item: AdminModerationDetail }) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStory = item.targetType === 'STORY';

  async function decide(decision: 'approve' | 'reject') {
    setBusy(true);
    setError(null);
    try {
      await api.post(`/admin/moderation/${item.id}/decision`, {
        decision,
        note: note.trim() || undefined,
      });
      setConfirming(false);
      setNote('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت نشد.');
    } finally {
      setBusy(false);
    }
  }

  if (item.status !== 'PENDING') {
    return (
      <p className="text-[12.5px] leading-[1.9] text-muted">
        این مورد بازبینی شده است
        {item.reviewer ? ` — ${item.reviewer.fullName}` : ''}.
        {item.note ? ` یادداشت: «${item.note}»` : ''}
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2.5 text-[12px] font-bold">تصمیم</p>

      {error ? (
        <p
          role="alert"
          className="mb-2.5 rounded-[9px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_10%,var(--sh-surface))] px-3 py-2.25 text-[12px] text-error"
        >
          {error}
        </p>
      ) : null}

      {confirming ? (
        <div className="mb-3 rounded-[9px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_8%,var(--sh-surface))] px-3.25 py-3">
          <p className="mb-2.5 text-[12.5px] leading-[1.9]">
            {isStory
              ? 'قصه از کتابخانهٔ خانواده برداشته می‌شود، ویدیویش پاک می‌شود و به والد اطلاع داده می‌شود. این کار بازگشت‌ناپذیر است.'
              : 'عکس کودک برای همیشه پاک می‌شود و به والد اطلاع داده می‌شود. این کار بازگشت‌ناپذیر است.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decide('reject')}
              disabled={busy}
              className="rounded-[9px] border border-error bg-surface px-3.5 py-2.25 text-[12.5px] font-bold text-error disabled:opacity-60"
            >
              {busy ? 'در حال ثبت…' : 'بله، حذف کن'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-[9px] border border-border bg-elev px-3.5 py-2.25 text-[12.5px] font-semibold"
            >
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => decide('approve')}
            disabled={busy}
            className="flex-1 basis-27.5 rounded-[9px] border border-success bg-[color-mix(in_srgb,var(--sh-success)_14%,var(--sh-surface))] p-2.75 text-[12.5px] font-bold text-success disabled:opacity-60"
          >
            تأیید بدون تغییر
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={busy}
            className="flex-1 basis-27.5 rounded-[9px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))] p-2.75 text-[12.5px] font-bold text-error disabled:opacity-60"
          >
            {isStory ? 'حذف قصه' : 'حذف عکس'}
          </button>
        </div>
      )}

      <label className="flex flex-col gap-1.75">
        <span className="text-[12px] font-bold">
          یادداشت بازبینی (در گزارش رخدادها ثبت می‌شود)
        </span>
        <textarea
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={500}
          placeholder="دلیل تصمیم را کوتاه بنویسید"
          className="resize-y rounded-[9px] border border-border bg-elev px-3 py-2.5 text-[12.5px] leading-[1.8] text-ink"
        />
      </label>
    </div>
  );
}
