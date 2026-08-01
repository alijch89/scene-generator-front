import { Sparkles } from "lucide-react";

/**
 * Root Suspense fallback used while any application route is streaming.
 */
export default function Loading() {
  return (
    <main
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--bg)] px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="absolute -start-24 top-[18%] size-56 rounded-full bg-[var(--primary-soft)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -end-24 bottom-[12%] size-64 rounded-full bg-[var(--teal-soft)] blur-3xl"
        aria-hidden="true"
      />

      <div
        className="relative flex flex-col items-center text-center"
        role="status"
      >
        <div className="relative mb-7 grid size-24 place-items-center">
          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[var(--primary)] border-e-[var(--primary-border)]"
            aria-hidden="true"
          />
          <span className="grid size-16 place-items-center rounded-[22px] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-3)]">
            <Sparkles className="size-7 animate-pulse" aria-hidden="true" />
          </span>
        </div>

        <p className="m-0 text-lg font-extrabold">صحنه در حال آماده‌شدن است</p>
        <p className="mt-2 text-sm text-[var(--ink-2)]">
          فقط چند لحظه صبر کنید...
        </p>
      </div>
    </main>
  );
}
