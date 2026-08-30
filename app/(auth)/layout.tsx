import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteMobileNav } from '@/components/public/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

/**
 * The split screen from Auth.dc.html: an illustrated night sky on one side,
 * the form well on the other. Collapses to stacked below ~680px because the
 * grid is auto-fit with a 340px minimum.
 */
/** Shared public layout for all account authentication pages. */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-svh grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
      <aside className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#221C46,#59418C_58%,#D9926B)] p-[clamp(28px,5vw,52px)] text-[#FFF6E6]">
        <span
          aria-hidden
          className="absolute left-[18%] top-[14%] size-[5px] animate-[twinkle_3.4s_ease-in-out_infinite] rounded-full bg-white shadow-[70px_60px_0_-1px_#fff,150px_-10px_0_-1px_#FFE9A8,240px_90px_0_-2px_#fff,60px_180px_0_-2px_#FFF6DC]"
        />
        <span
          aria-hidden
          className="absolute right-[12%] top-[8%] size-[70px] rounded-full bg-[#FFF3D6] shadow-[0_0_56px_rgba(255,240,200,.8)]"
        />
        <span
          aria-hidden
          className="absolute inset-x-[-14%] bottom-0 h-[32%] rounded-t-[50%] bg-[#1D1840]"
        />

        <Link href="/" className="relative flex items-center gap-2.5 text-[#FFF6E6] no-underline hover:no-underline">
          <Logo className="size-[34px]" />
          <strong className="font-display text-lg">شهرزاد قصه‌گو</strong>
        </Link>

        <div className="relative max-w-[34ch]">
          <h2 className="mb-3 font-display text-[clamp(22px,3.4vw,32px)] leading-[1.45]">
            امشب هم یک قصه، با اسم خودش.
          </h2>
          <p className="m-0 text-[14.5px] leading-[2] opacity-90">
            قصه‌های شما در کتابخانهٔ خانه می‌مانند؛ هر شب یکی را باز کنید.
          </p>
        </div>

        <p className="relative m-0 text-[12.5px] opacity-80">
          عکس کودک شما خصوصی است و در دسترس کاربر دیگری نیست.
        </p>
      </aside>

      <main className="flex flex-col p-[clamp(22px,4vw,44px)]">
        {/* Stacked below ~680px the marketing header is gone, so the way back
            out to the public site rides in the hamburger. */}
        <div className="mb-auto flex items-center gap-2.5">
          <ThemeToggle className="size-[38px] rounded-xl" />
          <SiteMobileNav className="ms-auto" />
        </div>

        <div className="mx-auto my-auto w-full max-w-[420px] py-[26px]">
          {children}
        </div>

        <div className="mt-auto flex flex-wrap gap-3.5 text-[12.5px] text-muted">
          <Link href="/privacy">حریم خصوصی</Link>
          <Link href="/terms">شرایط</Link>
        </div>
      </main>
    </div>
  );
}
/**
 * @file layout.tsx
 * @description Renders the centered, public authentication shell around login and recovery routes.
 */
