'use client';

import { useState } from 'react';

/**
 * Each button is a plain navigation to the signed callback with a different
 * outcome — the same three answers a real gateway can give. Navigating rather
 * than fetching is the point: the callback redirects the browser onward to the
 * checkout result page, exactly as the bank's return leg does.
 */
export function MockPayButtons({ callback }: { callback: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  const go = (status: 'ok' | 'failed' | 'cancelled') => {
    setBusy(status);
    const url = new URL(callback);
    url.searchParams.set('status', status);
    if (status === 'ok') {
      url.searchParams.set(
        'ref',
        String(Math.floor(10_000_000 + Math.random() * 89_999_999)),
      );
    }
    window.location.href = url.toString();
  };

  return (
    <div className="mt-4.5 flex flex-col gap-2.5">
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => go('ok')}
        className="rounded-2xl bg-linear-to-br from-brand to-warm p-4 text-[15.5px] font-bold text-brand-fg shadow-card disabled:opacity-70"
      >
        {busy === 'ok' ? 'در حال تأیید…' : 'پرداخت'}
      </button>

      <div className="flex gap-2.5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => go('failed')}
          className="flex-1 rounded-[14px] border border-border bg-elev p-3 text-[13px] font-semibold disabled:opacity-70"
        >
          شبیه‌سازی خطا
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => go('cancelled')}
          className="flex-1 rounded-[14px] border border-border bg-elev p-3 text-[13px] font-semibold disabled:opacity-70"
        >
          انصراف
        </button>
      </div>
    </div>
  );
}
