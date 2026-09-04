import {
  ArrowLeft,
  BookOpenText,
  Heart,
  LifeBuoy,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { BackToTopButton } from '@/components/public/back-to-top';
import { SiteMobileNav, SiteNav } from '@/components/public/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

const FOOTER_COLUMNS = [
  {
    title: 'محصول',
    Icon: BookOpenText,
    links: [
      { href: '/features', label: 'ویژگی‌ها' },
      { href: '/how', label: 'چطور کار می‌کند' },
      { href: '/pricing', label: 'قیمت' },
    ],
  },
  {
    title: 'پشتیبانی',
    Icon: LifeBuoy,
    links: [
      { href: '/faq', label: 'پرسش‌ها' },
      { href: '/contact', label: 'تماس' },
      { href: '/help', label: 'راهنما' },
    ],
  },
  {
    title: 'قانونی',
    Icon: Scale,
    links: [
      { href: '/privacy', label: 'حریم خصوصی' },
      { href: '/terms', label: 'شرایط استفاده' },
    ],
  },
];

/** Sticky blurred header + footer from Public Site.dc.html, over the aurora. */
/** Shared marketing layout for public product, policy, contact, and mock-payment routes. */
export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="public-site aurora flex min-h-full flex-col">
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
        <div className="public-glass mx-auto flex max-w-[1180px] items-center gap-[18px] rounded-[20px] px-3.5 py-2.5 sm:px-4.5">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-ink hover:no-underline"
          >
            <Logo className="size-[38px] shadow-card transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105" />
            <span>
              <strong className="block font-display text-[17px] leading-none sm:text-lg">
                شهرزاد قصه‌گو
              </strong>
              <span className="mt-1 hidden text-[9.5px] font-semibold tracking-[.05em] text-muted lg:block">
                قصه‌ای که فقط برای شماست
              </span>
            </span>
          </Link>

          <SiteNav />

          {/* Below sm the links and both calls to action move into the
              hamburger; only the theme toggle stays out in the bar. */}
          <div className="ms-auto flex items-center gap-2.5 sm:ms-0">
            <ThemeToggle className="size-[38px]" />
            <Link
              href="/login"
              className="hidden rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-ink hover:bg-elev hover:no-underline sm:block"
            >
              ورود
            </Link>
            <Link
              href="/wizard"
              className="public-cta gradient-brand hidden items-center gap-1.5 rounded-[13px] px-[18px] py-[11px] text-sm font-bold text-white hover:no-underline sm:flex"
            >
              <Sparkles className="size-4" strokeWidth={1.9} />
              ساخت قصه
            </Link>
            <SiteMobileNav />
          </div>
        </div>
      </header>

      <div className="relative z-[1] flex-1">{children}</div>

      <footer className="relative z-[1] mt-auto overflow-hidden border-t border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--sh-bg2)_72%,var(--sh-bg)),var(--sh-bg2))] text-ink">
        <span
          aria-hidden
          className="absolute inset-y-0 start-0 w-[38%] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--sh-primary)_10%,transparent),transparent_68%)]"
        />
        <span
          aria-hidden
          className="absolute -end-24 bottom-[-60%] size-80 rounded-full bg-[color-mix(in_srgb,var(--sh-accent)_9%,transparent)] blur-3xl"
        />

        <div className="relative mx-auto max-w-[1180px] px-5">
          <div className="grid grid-cols-2 gap-x-7 gap-y-10 py-11 md:grid-cols-[1.55fr_repeat(3,1fr)] md:gap-x-10 md:py-14">
            <div className="col-span-2 max-w-[390px] md:col-span-1">
              <Link
                href="/"
                className="group mb-4 flex w-fit items-center gap-3 text-ink hover:no-underline"
              >
                <Logo className="size-11 rounded-[15px] shadow-card ring-2 ring-[color-mix(in_srgb,var(--sh-border)_78%,transparent)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105" />
                <span>
                  <strong className="block font-display text-xl leading-7">
                    شهرزاد قصه‌گو
                  </strong>
                  <span className="text-[10.5px] text-muted">
                    جایی برای قصه‌های خودِ شما
                  </span>
                </span>
              </Link>
              <p className="max-w-[37ch] text-[13px] leading-7 text-muted">
                هر کودک دنیایی برای گفتن دارد؛ ما آن را به قصه‌ای دیدنی و
                شنیدنی برای شب‌های خانوادگی تبدیل می‌کنیم.
              </p>
              <Link
                href="/register"
                className="public-cta gradient-brand group mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-extrabold text-white hover:no-underline"
              >
                <Sparkles aria-hidden className="size-4" />
                ساخت حساب رایگان
                <ArrowLeft
                  aria-hidden
                  className="size-4 transition-transform group-hover:-translate-x-1"
                />
              </Link>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div
                key={column.title}
                className="flex flex-col items-start gap-2.5 last:col-span-2 sm:last:col-span-1"
              >
                <span className="mb-1.5 flex items-center gap-2 text-[12px] font-extrabold text-brand">
                  <span className="grid size-7 place-items-center rounded-lg border border-border bg-surface text-brand shadow-sm">
                    <column.Icon aria-hidden className="size-3.5" />
                  </span>
                  {column.title}
                </span>
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink hover:no-underline"
                  >
                    <span className="h-px w-2 bg-border transition-[width,background-color] duration-200 group-hover:w-4 group-hover:bg-warm" />
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border py-5 text-[11px] text-muted sm:flex-row sm:items-center">
            <p className="m-0">© شهرزاد قصه‌گو؛ همهٔ حقوق محفوظ است.</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ms-auto">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck aria-hidden className="size-3.5 text-teal" />
                حریم امن خانواده
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart aria-hidden className="size-3.5 text-pink" />
                ساخته‌شده برای شب‌های قصه
              </span>
              <BackToTopButton />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
/**
 * @file layout.tsx
 * @description Renders the public-site sticky header, navigation, footer, and aurora background.
 */
