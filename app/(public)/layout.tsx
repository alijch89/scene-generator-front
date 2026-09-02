import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteMobileNav, SiteNav } from '@/components/public/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

const FOOTER_COLUMNS = [
  {
    title: 'محصول',
    links: [
      { href: '/features', label: 'ویژگی‌ها' },
      { href: '/how', label: 'چطور کار می‌کند' },
      { href: '/pricing', label: 'قیمت' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { href: '/faq', label: 'پرسش‌ها' },
      { href: '/contact', label: 'تماس' },
      { href: '/help', label: 'راهنما' },
    ],
  },
  {
    title: 'قانونی',
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
            <ThemeToggle className="size-[38px] rounded-xl" />
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

      <footer className="relative z-[1] mt-auto border-t border-border bg-[color-mix(in_srgb,var(--sh-bg2)_88%,transparent)]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-7 px-5 py-10">
          <div className="max-w-[260px]">
            <div className="mb-3 flex items-center gap-2.5">
              <Logo className="size-9 shadow-card" />
              <strong className="font-display text-[17px]">
                شهرزاد قصه‌گو
              </strong>
            </div>
            <p className="text-[13px] leading-[1.9] text-muted">
              هر کودک دنیایی برای گفتن دارد؛ ما آن را به قصه‌ای دیدنی و شنیدنی
              تبدیل می‌کنیم.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10.5px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1.5">
                <ShieldCheck className="size-3.5 text-teal" /> خصوصی
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1.5">
                <Heart className="size-3.5 text-pink" /> ساخته‌شده برای خانواده
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col items-start gap-2">
              <span className="text-[12.5px] font-bold text-muted">
                {column.title}
              </span>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-[13.5px] text-ink hover:text-warm"
                >
                  <span className="h-px w-0 bg-warm transition-[width] duration-200 group-hover:w-3" />
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
/**
 * @file layout.tsx
 * @description Renders the public-site sticky header, navigation, footer, and aurora background.
 */
