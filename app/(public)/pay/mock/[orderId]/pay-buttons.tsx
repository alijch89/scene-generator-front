/**
 * @file pay-buttons.tsx
 * @description Provides development controls that ask the API to authorise a simulated payment outcome.
 */

'use client';

import { useState } from 'react';
import { API_URL, api } from '@/lib/api';

/** The three answers a real gateway can give. */
type Outcome = 'ok' | 'failed' | 'cancelled';

/**
 * Each button asks the API to authorise one outcome and follows the return URL
 * it hands back — the same two steps a bank performs.
 *
 * The URL is minted by our own API, but its origin is checked before
 * navigating anyway. This page used to take a URL straight from its query
 * string and send the browser there, which is an open redirect on an
 * unauthenticated route wearing a payment page's branding.
 */
export function MockPayButtons({ orderId }: { orderId: string }) {
  const [busy, setBusy] = useState<Outcome | null>(null);
  const [failed, setFailed] = useState(false);

  const go = async (outcome: Outcome) => {
    setBusy(outcome);
    setFailed(false);
    try {
      const { returnUrl } = await api.post<{ returnUrl: string }>(
        `/payments/mock/${orderId}/authorize`,
        { outcome },
      );
      const url = new URL(returnUrl);
      if (url.origin !== new URL(API_URL).origin) {
        throw new Error('return URL is not on the API origin');
      }
      window.location.href = url.toString();
    } catch {
      setFailed(true);
      setBusy(null);
    }
  };

  return (
    <div className="mt-4.5 flex flex-col gap-2.5">
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => void go('ok')}
        className="rounded-2xl bg-linear-to-br from-brand to-warm p-4 text-[15.5px] font-bold text-brand-fg shadow-card disabled:opacity-70"
      >
        {busy === 'ok' ? 'در حال تأیید…' : 'پرداخت'}
      </button>

      <div className="flex gap-2.5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void go('failed')}
          className="flex-1 rounded-[14px] border border-border bg-elev p-3 text-[13px] font-semibold disabled:opacity-70"
        >
          شبیه‌سازی خطا
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void go('cancelled')}
          className="flex-1 rounded-[14px] border border-border bg-elev p-3 text-[13px] font-semibold disabled:opacity-70"
        >
          انصراف
        </button>
      </div>

      {failed && (
        <p role="alert" className="text-center text-[12.5px] text-error">
          ارتباط با درگاه نمونه برقرار نشد.
        </p>
      )}
    </div>
  );
}
