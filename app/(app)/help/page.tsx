import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle } from '@/components/app/ui';

export const metadata: Metadata = { title: 'راهنما' };

/** The four questions from the design, verbatim. */
const FAQ = [
  {
    q: 'عکس مناسب چه ویژگی‌هایی دارد؟',
    a: 'یک عکس روشن از صورت، رو به دوربین، بدون عینک آفتابی. حداکثر ۱۰ مگابایت، با قالب JPG یا PNG.',
  },
  {
    q: 'چطور قصه را دوباره بسازم؟',
    a: 'در کتابخانه، روی قصهٔ ناموفق دکمهٔ «ساخت دوباره» را بزنید. برای قصه‌ای که ساخته نشده مبلغی کم نمی‌شود.',
  },
  {
    q: 'قصه را چطور چاپ کنم؟',
    a: 'فایل PDF را از بخش دانلودها بگیرید؛ برای چاپ خانگی روی کاغذ A4 آماده است.',
  },
  {
    q: 'داده‌های کودکم را چطور پاک کنم؟',
    a: 'در پروندهٔ هر کودک، بخش «داده و حریم خصوصی»، می‌توانید عکس یا کل پرونده را پاک کنید. حذف تا ۷۲ ساعت کامل می‌شود.',
  },
];

/** Server page that expands the help topic selected by search parameters. */
export default async function HelpPage({ searchParams }: PageProps<'/help'>) {
  const { q } = await searchParams;
  const search = typeof q === 'string' ? q.trim() : '';
  // Four static entries — filtering them server-side keeps the page JS-free.
  const results = search
    ? FAQ.filter((item) => (item.q + item.a).includes(search))
    : FAQ;

  return (
    <section className="max-w-190 animate-[pageIn_.4s_ease_both]">
      <PageTitle title="راهنما" lead="پرسش‌های رایج خانواده‌ها، و راه رسیدن به ما." />

      <form action="/help" className="mb-4.5">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="جست‌وجو در راهنما"
          aria-label="جست‌وجو در راهنما"
          className="w-full rounded-[14px] border border-border bg-surface px-4 py-3.5 text-[14px] text-ink"
        />
      </form>

      <div className="mb-5 flex flex-col gap-3">
        {results.map((item) => (
          <details
            key={item.q}
            open={Boolean(search)}
            className="rounded-[18px] border border-border bg-surface px-4.5 py-4 shadow-card"
          >
            <summary className="cursor-pointer text-[14.5px] font-bold">
              {item.q}
            </summary>
            <p className="mt-3 text-[13.5px] leading-[2] text-muted">
              {item.a}
            </p>
          </details>
        ))}
        {results.length === 0 ? (
          <p className="text-[14px] text-muted">
            پاسخی پیدا نشد. می‌توانید به پشتیبانی پیام بدهید.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Link
          href="/contact"
          className="flex-1 basis-50 rounded-[18px] border border-border bg-elev p-4.5 text-ink hover:no-underline"
        >
          <strong className="mb-1.5 block text-[15px]">پیام به پشتیبانی</strong>
          <span className="text-[13px] text-muted">پاسخ تا یک روز کاری</span>
        </Link>
        <Link
          href="/faq"
          className="flex-1 basis-50 rounded-[18px] border border-border bg-elev p-4.5 text-ink hover:no-underline"
        >
          <strong className="mb-1.5 block text-[15px]">پرسش‌های عمومی</strong>
          <span className="text-[13px] text-muted">
            دربارهٔ ساخت قصه و حریم خصوصی
          </span>
        </Link>
      </div>
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders parent help topics, support guidance, and optional topic focus from the URL.
 */
