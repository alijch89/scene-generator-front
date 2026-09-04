/**
 * @file loading.tsx
 * @description Renders the global streaming fallback while an App Router route loads.
 */

import { BookOpen, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';

/** Lightweight, branded loading state shared by every route group. */
export default function Loading() {
  return (
    <main className="public-site aurora relative isolate grid min-h-svh overflow-hidden place-items-center px-5 py-10">
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="motion-hero-reveal relative z-[2] flex w-full max-w-[440px] flex-col items-center text-center"
      >
        <div aria-hidden className="relative mb-8 grid size-32 place-items-center">
          <span className="absolute inset-0 animate-spin rounded-full border border-dashed border-[color-mix(in_srgb,var(--sh-primary)_46%,transparent)] [animation-duration:7s]" />
          <span className="absolute inset-3 animate-[spinIt_5s_linear_infinite_reverse] rounded-full border border-dotted border-[color-mix(in_srgb,var(--sh-accent)_52%,transparent)]" />
          <span className="absolute start-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_20px_var(--sh-gold)]" />
          <span className="absolute bottom-2 end-3 size-2.5 rounded-full bg-teal shadow-[0_0_18px_var(--sh-teal)]" />

          <span className="motion-float relative grid size-[76px] place-items-center rounded-[24px] border border-border bg-[linear-gradient(145deg,var(--sh-surface),var(--sh-elev))] shadow-card-lg">
            <Logo className="absolute -end-2.5 -top-2.5 size-8.5 shadow-card" />
            <BookOpen className="size-9 text-brand" strokeWidth={1.5} />
          </span>
        </div>

        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/75 px-3 py-1.5 text-[11.5px] font-bold text-warm shadow-card backdrop-blur-sm">
          <Sparkles className="size-3.5" strokeWidth={1.8} />
          قصه در راه است
        </span>
        <h1 className="font-display text-[clamp(25px,5vw,34px)] leading-[1.45]">
          داریم صفحه را آماده می‌کنیم…
        </h1>
        <p className="mt-2 text-[14.5px] leading-[1.9] text-muted">
          چند لحظه صبر کن؛ همه‌چیز تا یک چشم‌برهم‌زدن آماده می‌شود.
        </p>

        <span
          aria-hidden
          className="mt-7 h-1.5 w-full max-w-[230px] overflow-hidden rounded-full bg-elev shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--sh-primary)_12%,transparent)]"
        >
          <span className="block h-full w-1/2 animate-[shimmer_1.35s_linear_infinite] rounded-full bg-[linear-gradient(90deg,transparent,var(--sh-primary),var(--sh-accent),transparent)] bg-[length:200%_100%]" />
        </span>
      </div>
    </main>
  );
}
