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
    <div className="aurora flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-[color-mix(in_srgb,var(--sh-bg)_88%,transparent)] backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1180px] items-center gap-[18px] px-5 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ink hover:no-underline"
          >
            <Logo className="size-[34px]" />
            <strong className="font-display text-lg">شهرزاد قصه‌گو</strong>
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
              className="gradient-brand hidden rounded-[13px] px-[18px] py-[11px] text-sm font-bold text-white shadow-card hover:no-underline sm:block"
            >
              ساخت قصه
            </Link>
            <SiteMobileNav />
          </div>
        </div>
      </header>

      <div className="relative z-[1] flex-1">{children}</div>

      <footer className="relative z-[1] border-t border-border bg-bg2">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6 px-5 py-[34px]">
          <div>
            <strong className="mb-2 block font-display text-[17px]">
              شهرزاد قصه‌گو
            </strong>
            <p className="text-[13px] leading-[1.9] text-muted">
              کودک شما، قهرمان قصهٔ خودش.
            </p>
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
                  className="text-[13.5px] text-ink hover:text-warm"
                >
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
