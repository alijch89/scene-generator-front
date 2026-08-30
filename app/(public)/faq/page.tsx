import type { Metadata } from 'next';
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
    <main className="mx-auto max-w-[800px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
        title="پرسش‌های پرتکرار"
        lead={
          <>
            اگر جوابتان را پیدا نکردید،{' '}
            <Link href="/contact" className="font-bold text-brand">
              به ما بنویسید
            </Link>
            .
          </>
        }
      />

      <div className="flex flex-col gap-3">
        {QUESTIONS.map((item) => (
          <details
            key={item.q}
            className="rounded-[18px] border border-border bg-surface px-5 py-4.5 shadow-card open:[&_summary]:text-brand"
          >
            <summary className="cursor-pointer text-[15.5px] font-bold">
              {item.q}
            </summary>
            <p className="mt-3.5 text-[14.5px] leading-[2] text-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders accessible public frequently asked questions for the per-story product model.
 */
