/**
 * @file retry-story.tsx
 * @description Provides the administrator action for retrying eligible paid story generation.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

/**
 * «اجرای دوباره». Only offered for a paid story that did not arrive — the API
 * refuses anything else, so the button is hidden rather than shown and denied.
 */
export function RetryStoryButton({
  storyId,
  disabledReason,
}: {
  storyId: string;
  /** Why re-running is not on the table, when it is not. */
  disabledReason?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (disabledReason) {
    return <p className="text-[12px] text-muted">{disabledReason}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            await api.post(`/admin/stories/${storyId}/retry`);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'اجرا نشد.');
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-lg bg-brand px-3.5 py-2.25 text-[12.5px] font-bold text-brand-fg disabled:opacity-60"
      >
        {busy ? 'در حال شروع…' : 'اجرای دوبارهٔ ساخت'}
      </button>
      {error ? (
        <span role="alert" className="text-[12px] text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}
