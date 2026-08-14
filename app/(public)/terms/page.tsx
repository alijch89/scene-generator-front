import type { Metadata } from 'next';
import { Card } from '@/components/public/ui';

export const metadata: Metadata = { title: 'شرایط استفاده' };

const UPDATED_AT = '۲۲ مرداد ۱۴۰۵';

const SECTIONS = [
  {
    title: 'حساب کاربری',
    body: 'حساب باید به‌دست فردی بالای ۱۸ سال ساخته و اداره شود. مسئولیت پرونده‌های کودکان و عکس‌های بارگذاری‌شده بر عهدهٔ صاحب حساب است.',
  },
  {
    title: 'مالکیت قصه‌ها',
    body: 'قصه‌هایی که می‌سازید برای استفادهٔ شخصی و خانوادگی شماست؛ می‌توانید چاپ کنید و هدیه دهید. فروش تجاری قصه‌ها مجاز نیست.',
  },
  {
    title: 'استفادهٔ مجاز',
    body: 'بارگذاری عکس افرادی که اجازهٔ آن را ندارید، و ساختن محتوای آسیب‌رسان یا نامناسب برای کودکان، ممنوع است. محتوای گزارش‌شده بازبینی انسانی می‌شود.',
  },
  {
    // Rewritten for the per-story model: the design's subscription renewal and
    // cancellation clauses describe a product we do not sell.
    title: 'پرداخت',
    body: 'پرداخت برای هر قصه جداگانه و با قیمت ثابت انجام می‌شود؛ اشتراک، تمدید خودکار و بستهٔ اعتباری در کار نیست، پس چیزی برای لغو کردن هم وجود ندارد. قصه‌هایی که پرداخت شده‌اند در کتابخانهٔ شما می‌مانند. اگر ساخت قصه‌ای با خطا متوقف شود، ساخت دوبارهٔ همان قصه پرداخت تازه‌ای ندارد.',
  },
];

/** Static terms-of-use page for the per-story service. */
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[760px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <h1 className="mb-2.5 font-display text-[clamp(28px,4.6vw,40px)]">
        شرایط استفاده
      </h1>
      <p className="mb-7 text-[14.5px] text-muted">
        آخرین به‌روزرسانی: {UPDATED_AT}
      </p>

      <div className="flex flex-col gap-3.5">
        {SECTIONS.map((section) => (
          <Card key={section.title} className="rounded-[20px]">
            <h2 className="mb-2.5 text-[17px]">{section.title}</h2>
            <p className="text-[14.5px] leading-[2] text-muted">
              {section.body}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders the public terms governing parent accounts, payments, generated content, and acceptable use.
 */
