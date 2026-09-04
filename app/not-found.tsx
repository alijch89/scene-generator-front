/**
 * @file not-found.tsx
 * @description Renders the global App Router fallback for missing pages and resources.
 */

import { ArrowLeft, BookOpen, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

/** Friendly, branded 404 shared by unmatched URLs and every notFound() call. */
export default function NotFound() {
  return (
    <main className="public-site aurora relative isolate flex min-h-svh overflow-hidden px-5 py-8 sm:px-8">
      <div
        aria-hidden
        className="motion-float absolute start-[7%] top-[15%] z-[1] size-3 rounded-full bg-gold shadow-[0_0_24px_var(--sh-gold)]"
      />
      <div
        aria-hidden
        className="motion-float-reverse absolute end-[9%] top-[22%] z-[1] size-2.5 rotate-45 rounded-[3px] bg-pink shadow-[0_0_22px_var(--sh-pink)]"
      />
      <div
        aria-hidden
        className="motion-pulse absolute bottom-[14%] start-[13%] z-[1] size-2 rounded-full bg-teal shadow-[0_0_20px_var(--sh-teal)]"
      />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1080px] flex-col">
        <Link
          href="/"
          aria-label="شهرزاد قصه‌گو — صفحهٔ اصلی"
          className="motion-hero-reveal flex w-fit items-center gap-2.5 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--sh-surface)_80%,transparent)] px-3.5 py-2.5 text-ink shadow-card backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 hover:no-underline"
        >
          <Logo className="size-9 shadow-card" />
          <strong className="font-display text-[16px] sm:text-[17px]">
            شهرزاد قصه‌گو
          </strong>
        </Link>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:gap-16 lg:py-14">
          <div className="motion-hero-reveal text-center lg:text-start">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/75 px-3 py-1.5 text-[11.5px] font-bold text-warm shadow-card backdrop-blur-sm">
              <Sparkles className="size-3.5" strokeWidth={1.8} />
              یک پیچِ غیرمنتظره در قصه
            </span>

            <h1 className="font-display text-[clamp(34px,7vw,64px)] leading-[1.35] tracking-[-0.02em]">
              این صفحه توی قصه نیست!
            </h1>
            <p className="mx-auto mt-4 max-w-[540px] text-[15.5px] leading-[2] text-muted sm:text-[17px] lg:mx-0">
              انگار نشانی این صفحه عوض شده یا اصلاً نوشته نشده است. می‌توانی به
              خانه برگردی و ماجراجویی را از یک جای آشنا ادامه بدهی.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/"
                className="public-cta gradient-brand inline-flex items-center justify-center gap-2 rounded-[15px] px-6 py-3.5 text-[14px] font-bold text-white hover:no-underline"
              >
                <Home className="size-[18px]" strokeWidth={1.9} />
                بازگشت به خانه
              </Link>
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center gap-2 rounded-[15px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_82%,transparent)] px-6 py-3.5 text-[14px] font-bold text-ink shadow-card backdrop-blur-sm transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--sh-primary)_38%,var(--sh-border))] hover:bg-surface hover:no-underline"
              >
                ساخت یک قصهٔ تازه
                <ArrowLeft className="size-[18px]" strokeWidth={1.9} />
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="motion-rise relative mx-auto grid aspect-square w-full max-w-[430px] place-items-center [--motion-delay:120ms]"
          >
            <span className="absolute inset-[7%] rounded-full border border-[color-mix(in_srgb,var(--sh-primary)_18%,transparent)] bg-[color-mix(in_srgb,var(--sh-surface)_54%,transparent)] shadow-[0_30px_80px_color-mix(in_srgb,var(--sh-primary)_16%,transparent)] backdrop-blur-sm" />
            <span className="absolute inset-[16%] rounded-full border border-dashed border-[color-mix(in_srgb,var(--sh-accent)_42%,transparent)]" />

            <span className="absolute top-[11%] font-display text-[clamp(86px,20vw,158px)] font-extrabold leading-none tracking-[-0.08em] text-[color-mix(in_srgb,var(--sh-primary)_15%,transparent)]">
              ۴۰۴
            </span>

            <div className="motion-float relative mt-[22%] grid size-[150px] rotate-[-4deg] place-items-center rounded-[36px] border border-[color-mix(in_srgb,var(--sh-primary)_24%,var(--sh-border))] bg-[linear-gradient(145deg,var(--sh-surface),var(--sh-elev))] shadow-[var(--sh-shadow-float)] sm:size-[176px]">
              <span className="absolute -end-4 -top-4 grid size-12 place-items-center rounded-2xl border border-border bg-surface text-gold shadow-card sm:size-14">
                <Sparkles className="size-6" strokeWidth={1.7} />
              </span>
              <span className="grid size-[92px] place-items-center rounded-[28px] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sh-primary)_15%,var(--sh-surface)),color-mix(in_srgb,var(--sh-accent)_14%,var(--sh-surface)))] text-brand sm:size-[108px]">
                <BookOpen className="size-12 sm:size-14" strokeWidth={1.4} />
              </span>
            </div>

            <span className="absolute bottom-[13%] rounded-full border border-border bg-surface/85 px-4 py-2 text-xs font-bold text-muted shadow-card backdrop-blur-sm">
              کد خطا: ۴۰۴
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
