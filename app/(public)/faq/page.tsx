import type { Metadata } from 'next';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/public/ui';
import { STORY_PRICE_BY_LENGTH } from '@/lib/config';
import { faNum } from '@/lib/fa';

export const metadata: Metadata = { title: 'پرسش‌های پرتکرار' };

/** Answers that referred to plans and credits now describe per-length pricing. */
const QUESTIONS = [
  {
    q: 'عکس کودکم چه می‌شود؟',
    a: 'عکس فقط برای ساختن شخصیت قصه استفاده می‌شود، در حساب خودتان خصوصی می‌ماند و هر زمان می‌توانید آن را پاک کنید. عکس‌ها برای آموزش مدل‌ها یا تبلیغات به کار نمی‌روند.',
  },
  {
    q: 'ساخت یک قصه چقدر طول می‌کشد؟',
    a: 'به‌طور معمول حدود ۹۰ ثانیه برای یک قصهٔ ۱۰ صفحه‌ای با روایت. لازم نیست منتظر بمانید؛ می‌توانید صفحه را ببندید و وقتی قصه آماده شد خبرتان می‌کنیم.',
  },
  {
    q: 'چطور پرداخت می‌کنم؟',
    a: `قیمت بر اساس طول ویدیو است: کوتاه ${faNum(STORY_PRICE_BY_LENGTH.SHORT)} تومان، متوسط ${faNum(STORY_PRICE_BY_LENGTH.MEDIUM)} تومان و بلند ${faNum(STORY_PRICE_BY_LENGTH.LONG)} تومان. اشتراک ماهانه و بستهٔ اعتبار نداریم. بعد از ثبت قصه لینک پرداخت را می‌گیرید و با پرداخت، ساخت شروع می‌شود.`,
  },
  {
    q: 'اگر قصه را دوست نداشتیم؟',
    a: 'می‌توانید همان قصه را دوباره بسازید؛ ساخت مجدد پرداخت تازه‌ای ندارد. اگر ساخت با خطا متوقف شود هم چیزی از شما کم نمی‌شود.',
  },
  {
    q: 'برای چه سن‌هایی مناسب است؟',
    a: '۳ تا ۱۲ سال. سطح واژگان و طول جمله‌ها با سنی که انتخاب می‌کنید تنظیم می‌شود.',
  },
  {
    q: 'می‌توانم قصه را چاپ کنم؟',
    a: 'بله. فایل PDF آمادهٔ چاپ و فایل صوتی هر قصه‌ای که ساخته‌اید قابل دانلود است.',
  },
  {
    q: 'چند کودک می‌توانم اضافه کنم؟',
    a: 'به هر تعداد که لازم دارید. هر کودک پرونده، کتابخانه و علاقه‌مندی‌های خودش را دارد و پرداخت همیشه بابت قصه است، نه بابت پرونده.',
  },
];

/** Static FAQ page using native details disclosures. */
export default function FaqPage() {
  return (
    <main className="mx-auto max-w-[820px] px-5 pt-[clamp(46px,7vw,82px)] pb-20">
      <PageHeader
        eyebrow="هر آنچه پیش از ساخت قصه باید بدانید"
        title="پرسش‌های پرتکرار"
        lead={
          <>
            اگر جوابتان را پیدا نکردید،{' '}
            <Link href="/contact" className="font-bold text-brand">
               برای ما بنویسید
            </Link>
            .
          </>
        }
      />

      <div className="flex flex-col gap-3">
        {QUESTIONS.map((item, index) => (
          <details
            key={item.q}
            style={
              { '--motion-delay': `${index * 55}ms` } as React.CSSProperties
            }
            className="faq-item motion-rise group rounded-[20px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_90%,transparent)] px-5 py-4 shadow-card transition-[border-color,box-shadow,transform] duration-300 open:border-[color-mix(in_srgb,var(--sh-primary)_35%,var(--sh-border))] open:shadow-card-lg hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--sh-primary)_25%,var(--sh-border))] open:[&_summary]:text-brand"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-[15px] font-bold sm:text-[15.5px]">
              <span className="grid size-8 flex-none place-items-center rounded-[12px] bg-elev text-brand transition-colors group-open:bg-brand group-open:text-white">
                <HelpCircle className="size-4" strokeWidth={1.9} />
              </span>
              <span className="flex-1">{item.q}</span>
              <ChevronDown className="faq-chevron size-4.5 flex-none text-muted transition-transform duration-300" />
            </summary>
            <p className="me-11 mt-3.5 border-t border-border pt-3.5 text-[14px] leading-[2.05] text-muted sm:text-[14.5px]">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[22px] border border-border bg-elev/70 p-5 sm:flex-row sm:items-center">
        <p className="text-[13.5px] font-semibold text-muted">
          هنوز جواب پرسشتان را پیدا نکردید؟
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-[13px] bg-surface px-4.5 py-3 text-sm font-bold text-brand shadow-card transition-transform hover:-translate-y-0.5 hover:no-underline"
        >
          <MessageCircle className="size-4" />
          با ما در میان بگذارید
        </Link>
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders accessible public frequently asked questions for the per-story product model.
 */
