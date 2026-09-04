/**
 * @file layout.tsx
 * @description Renders the shared storybook shell around authentication pages.
 */

import { BookOpenText, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { DisplayFontPreload } from '@/components/display-font-preload';
import { Logo } from '@/components/logo';
import { SiteMobileNav } from '@/components/public/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

/** Shared public layout for all account authentication pages. */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="min-h-svh bg-bg lg:grid lg:grid-cols-[minmax(440px,0.88fr)_minmax(520px,1.12fr)]">
      <DisplayFontPreload />
      <aside className="relative isolate flex min-h-[278px] flex-col overflow-hidden bg-[linear-gradient(155deg,#1D173E_0%,#382866_50%,#7A4D86_100%)] px-6 py-6 text-[#FFF8E8] sm:px-9 lg:min-h-svh lg:px-[clamp(38px,5vw,76px)] lg:py-[clamp(34px,5vw,60px)]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(circle_at_16%_18%,rgba(255,255,255,.85)_0_1.5px,transparent_2px),radial-gradient(circle_at_72%_22%,rgba(255,225,151,.75)_0_1px,transparent_1.7px),radial-gradient(circle_at_38%_47%,rgba(255,255,255,.55)_0_1px,transparent_1.7px),radial-gradient(circle_at_86%_57%,rgba(255,255,255,.7)_0_1.2px,transparent_1.8px)]"
        />
        <div
          aria-hidden
          className="absolute -left-10 top-5 -z-10 size-32 rounded-full bg-[#FFF2C7]/10 blur-2xl sm:left-8 sm:top-8 lg:left-[10%] lg:top-[10%] lg:size-52"
        />

        {/* The moon stays on the opposite side of the brand lockup, so it can
            never sit beneath the title on narrow screens. */}
        <div
          aria-hidden
          className="absolute left-7 top-7 z-0 size-[62px] rounded-full bg-[#FFF2C7] shadow-[0_0_0_9px_rgba(255,242,199,.06),0_0_50px_rgba(255,225,154,.48)] sm:left-10 sm:top-8 sm:size-[72px] lg:left-[12%] lg:top-[12%] lg:size-[92px]"
        >
          <span className="absolute right-3 top-3 size-2.5 rounded-full bg-[#E5D3AD]/35" />
          <span className="absolute bottom-5 left-4 size-4 rounded-full bg-[#E5D3AD]/25" />
        </div>

        <Link
          href="/"
          className="relative z-10 flex w-fit items-center gap-3 text-[#FFF8E8] no-underline hover:no-underline"
        >
          <Logo className="size-10 rounded-[14px] ring-2 ring-white/20" />
          <span>
            <strong className="block font-display text-lg leading-6">
              شهرزاد قصه‌گو
            </strong>
            <span className="hidden text-[11px] text-white/65 sm:block">
              قصه‌ای که فقط برای کودک شماست
            </span>
          </span>
        </Link>

        <div className="relative z-10 my-auto max-w-[480px] pt-8 lg:pt-20">
          <span className="mb-3 hidden w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 backdrop-blur-sm sm:flex">
            <Sparkles aria-hidden className="size-3.5 text-[#FFD887]" />
            هر شب، یک ماجراجویی تازه
          </span>
          <h2 className="mb-2 max-w-[13ch] font-display text-[clamp(24px,4vw,42px)] leading-[1.45] lg:mb-4">
            امشب هم یک قصه، با اسم خودش.
          </h2>
          <p className="m-0 max-w-[42ch] text-[13px] leading-[1.9] text-white/76 sm:text-[14.5px] lg:leading-8">
            قصه‌های شما در کتابخانهٔ خانه می‌مانند؛ هر شب یکی را باز کنید و با
            هم به دنیای تازه‌ای بروید.
          </p>

          <div className="mt-6 hidden flex-wrap gap-2.5 lg:flex">
            <span className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[.08] px-3.5 py-2.5 text-[12.5px] text-white/85 backdrop-blur-sm">
              <BookOpenText aria-hidden className="size-4 text-[#FFD887]" />
              کتابخانهٔ خانوادگی
            </span>
            <span className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[.08] px-3.5 py-2.5 text-[12.5px] text-white/85 backdrop-blur-sm">
              <ShieldCheck aria-hidden className="size-4 text-[#91E4D5]" />
              فضای امن و خصوصی
            </span>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-[-12%] bottom-[-74px] -z-10 h-[142px] rounded-[50%_50%_0_0/100%_100%_0_0] bg-[#171333] sm:bottom-[-82px] lg:bottom-[-8%] lg:h-[25%]"
        />
        <p className="relative z-10 mb-0 hidden items-center gap-2 text-[12px] text-white/65 lg:flex">
          <ShieldCheck aria-hidden className="size-4 text-[#91E4D5]" />
          عکس کودک شما خصوصی است و در دسترس کاربر دیگری نیست.
        </p>
      </aside>

      <main className="relative isolate flex min-h-[calc(100svh-278px)] flex-col overflow-hidden bg-[linear-gradient(145deg,var(--sh-bg),color-mix(in_srgb,var(--sh-bg2)_58%,var(--sh-bg)))] px-4 py-5 sm:px-8 lg:min-h-svh lg:px-[clamp(34px,5vw,72px)] lg:py-7">
        <div
          aria-hidden
          className="absolute -right-28 top-[18%] -z-10 size-80 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_9%,transparent)] blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 -left-20 -z-10 size-80 rounded-full bg-[color-mix(in_srgb,var(--sh-accent)_10%,transparent)] blur-3xl"
        />

        <div className="relative z-20 flex items-center gap-2.5">
          <ThemeToggle className="size-10 border-[color-mix(in_srgb,var(--sh-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--sh-surface)_82%,transparent)] shadow-sm backdrop-blur" />
          <SiteMobileNav className="ms-auto" />
          <Link
            href="/"
            className="ms-auto hidden rounded-xl px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-surface hover:text-ink hover:no-underline sm:block"
          >
            بازگشت به صفحهٔ اصلی
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 items-center py-5 lg:py-6">
          <div className="mx-auto w-full max-w-[480px] rounded-[28px] border border-[color-mix(in_srgb,var(--sh-border)_88%,white)] bg-[color-mix(in_srgb,var(--sh-surface)_90%,transparent)] p-5 shadow-[0_24px_70px_rgba(74,38,110,.14),0_1px_0_rgba(255,255,255,.7)_inset] backdrop-blur-xl sm:p-7 lg:rounded-[32px] lg:p-8 dark:border-white/10 dark:shadow-[0_28px_80px_rgba(0,0,0,.36)]">
            {children}
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-4 text-[12px] text-muted lg:justify-start">
          <Link href="/privacy">حریم خصوصی</Link>
          <Link href="/terms">شرایط استفاده</Link>
        </div>
      </main>
    </div>
  );
}
