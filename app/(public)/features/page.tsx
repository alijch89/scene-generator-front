import type { Metadata } from 'next';
import { Card, PageHeader, SectionHeading } from '@/components/public/ui';
import { THEMES } from '@/lib/themes';

export const metadata: Metadata = { title: 'ویژگی‌ها' };

const FEATURES = [
  {
    icon: '✎',
    tone: 'text-brand',
    title: 'قصهٔ اختصاصی',
    body: 'نام، سن، علاقه‌ها و شهر کودک در متن قصه به کار می‌رود؛ هر قصه یک‌بار نوشته می‌شود.',
  },
  {
    icon: '✦',
    tone: 'text-brand',
    title: 'تصویرهای هم‌شکل',
    body: 'شخصیت کودک در همهٔ صفحه‌ها یکسان می‌ماند؛ سه سبک تصویرسازی برای انتخاب.',
  },
  {
    icon: '▶',
    tone: 'text-brand',
    title: 'روایت فارسی',
    body: 'سه صدای راوی، سرعت پخش قابل تنظیم و هم‌خوانی متن با صدا.',
  },
  {
    icon: '🛡',
    tone: 'text-success',
    title: 'خصوصی به‌طور پیش‌فرض',
    body: 'عکس‌ها هرگز عمومی نمی‌شوند، در تبلیغات به کار نمی‌روند و هر زمان قابل پاک کردن‌اند.',
  },
  {
    icon: '⤓',
    tone: 'text-brand',
    title: 'دانلود و چاپ',
    body: 'هر قصه را به‌صورت PDF و فایل صوتی بگیرید؛ برای سفر و برای هدیه.',
  },
  {
    icon: '☺',
    tone: 'text-brand',
    title: 'چند کودک، یک حساب',
    body: 'برای هر کودک پرونده، کتابخانه و علاقه‌مندی‌های جداگانه.',
  },
];

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-[1080px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
        title="ویژگی‌ها"
        lead="هر چیزی که برای ساختن یک شب قصهٔ به‌یادماندنی لازم است — و نه بیشتر."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <span
              aria-hidden
              className={`mb-3.5 grid size-11 place-items-center rounded-[14px] bg-elev text-[19px] ${feature.tone}`}
            >
              {feature.icon}
            </span>
            <strong className="mb-2 block text-[17px]">{feature.title}</strong>
            <p className="text-sm leading-[1.9] text-muted">{feature.body}</p>
          </Card>
        ))}
      </div>

      <section className="mt-14">
        <SectionHeading
          title="دوازده ماجرا"
          lead="یکی را بردارید، یا ایدهٔ خودتان را در یک جمله بنویسید."
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className="overflow-hidden rounded-[18px] border border-border bg-surface"
            >
              <span aria-hidden className={`block h-[84px] ${theme.art}`} />
              <span className="block px-3.5 py-3">
                <strong className="block text-[14.5px]">{theme.title}</strong>
                <span className="text-xs text-muted">{theme.body}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
