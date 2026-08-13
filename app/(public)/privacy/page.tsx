import type { Metadata } from 'next';
import { Card } from '@/components/public/ui';

export const metadata: Metadata = { title: 'حریم خصوصی' };

/** A literal, not faDate(new Date()) — a policy's date is when it last changed. */
const UPDATED_AT = '۲۲ مرداد ۱۴۰۵';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[760px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <h1 className="mb-2.5 font-display text-[clamp(28px,4.6vw,40px)]">
        حریم خصوصی
      </h1>
      <p className="mb-7 text-[14.5px] text-muted">
        آخرین به‌روزرسانی: {UPDATED_AT}
      </p>

      <div className="flex flex-col gap-3.5">
        <div className="flex gap-3.5 rounded-[20px] border border-border bg-elev px-5 py-4.5">
          <span aria-hidden className="text-[17px] text-success">
            🛡
          </span>
          <p className="text-[14.5px] leading-[2]">
            خلاصهٔ صادقانه: عکس کودک شما خصوصی است، عمومی نمی‌شود، برای آموزش
            مدل‌ها به کار نمی‌رود و هر زمان بخواهید پاک می‌شود.
          </p>
        </div>

        <Card className="rounded-[20px]">
          <h2 className="mb-2.5 text-[17px]">چه چیزی جمع‌آوری می‌کنیم</h2>
          <p className="text-[14.5px] leading-[2] text-muted">
            اطلاعات حساب (نام، ایمیل)، پروندهٔ کودک (نام کوچک، سن، علاقه‌ها)،
            عکس‌هایی که خودتان می‌فرستید، و قصه‌هایی که ساخته می‌شوند. اطلاعات
            پرداخت را نگه نمی‌داریم؛ پردازش آن نزد درگاه بانکی انجام می‌شود و
            فقط شمارهٔ پیگیری تراکنش نزد ما می‌ماند.
          </p>
        </Card>

        <Card className="rounded-[20px]">
          <h2 className="mb-2.5 text-[17px]">چگونه از عکس‌ها استفاده می‌شود</h2>
          <p className="text-[14.5px] leading-[2] text-muted">
            عکس تنها برای ساختن شخصیت تصویری کودک در قصه‌های خودتان پردازش
            می‌شود. تصویرها روی حساب شما ذخیره می‌شوند و در دسترس کاربر دیگری
            نیستند.
          </p>
        </Card>

        <Card className="rounded-[20px]">
          <h2 className="mb-2.5 text-[17px]">اختیارهای شما</h2>
          <ul className="ps-5 text-[14.5px] leading-[2.1] text-muted">
            <li>پاک کردن عکس یک کودک، بدون پاک شدن قصه‌ها</li>
            <li>پاک کردن کامل پروندهٔ یک کودک</li>
            <li>دریافت نسخهٔ کامل داده‌هایتان</li>
            <li>پاک کردن حساب و همهٔ داده‌ها تا ۷۲ ساعت</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
