/**
 * @file error.tsx
 * @description Renders the client error boundary for failed story-library data requests.
 */

'use client';

/** «کتابخانه بار نشد» — the design's error state, wired to Next's reset(). */
export default function LibraryError({ reset }: { reset: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-[26px] border border-error bg-surface px-5 py-12 text-center"
    >
      <h2 className="mb-2.5 text-[19px] font-bold">کتابخانه بار نشد</h2>
      <p className="mb-5 text-[14.5px] text-muted">
        اتصال قطع شد. قصه‌های شما جای خود هستند.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-[14px] border border-border bg-elev px-6 py-3.5 text-[14px] font-bold"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
