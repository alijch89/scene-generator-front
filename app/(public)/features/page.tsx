import type { Metadata } from 'next';
import {
  ArrowLeft,
  AudioLines,
  BookHeart,
  Download,
  Images,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  PageHeader,
  SectionHeading,
  TopicCard,
} from '@/components/public/ui';
import { PUBLIC_TOPICS } from '@/lib/story-art';

export const metadata: Metadata = { title: 'ویژگی‌ها' };

const FEATURES = [
  {
    Icon: BookHeart,
    tone: 'text-brand',
    title: 'قصهٔ اختصاصی',
    body: 'نام، سن، علاقه‌ها و شهر کودک در متن قصه به کار می‌رود؛ هر قصه یک‌بار نوشته می‌شود.',
  },
  {
    Icon: Images,
    tone: 'text-brand',
    title: 'تصویرهای هم‌شکل',
    body: 'شخصیت کودک در همهٔ صفحه‌ها یکسان می‌ماند؛ سه سبک تصویرسازی برای انتخاب.',
  },
  {
    Icon: AudioLines,
    tone: 'text-brand',
    title: 'روایت فارسی',
    body: 'صدای راوی، سرعت پخش قابل تنظیم و هم‌خوانی متن با صدا.',
  },
  {
    Icon: ShieldCheck,
    tone: 'text-success',
    title: 'خصوصی به‌طور پیش‌فرض',
    body: 'عکس‌ها هرگز عمومی نمی‌شوند، در تبلیغات به کار نمی‌روند و هر زمان قابل پاک کردن‌اند.',
  },
  {
    Icon: Download,
    tone: 'text-brand',
    title: 'دانلود و چاپ',
    body: 'هر قصه را به‌صورت PDF و فایل صوتی بگیرید؛ برای سفر و برای هدیه.',
  },
  {
    Icon: UsersRound,
    tone: 'text-brand',
    title: 'چند کودک، یک حساب',
    body: 'برای هر کودک پرونده، کتابخانه و علاقه‌مندی‌های جداگانه.',
  },
];

/** Static marketing page describing story personalization and parent controls. */
export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-[1080px] px-5 pt-[clamp(46px,7vw,82px)] pb-20">
      <PageHeader
        eyebrow="شخصی‌سازی، تصویر و روایت در یک‌جا"
        title="ویژگی‌ها"
        lead="هر چیزی که برای ساختن یک شب قصهٔ به‌یادماندنی لازم است — و نه بیشتر."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {FEATURES.map((feature, index) => (
          <Card
            key={feature.title}
            style={
              { '--motion-delay': `${index * 70}ms` } as React.CSSProperties
            }
            className="motion-rise relative overflow-hidden"
          >
            <span
              aria-hidden
              className="absolute -top-12 -end-12 size-28 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_8%,transparent)] blur-2xl transition-transform duration-500 group-hover/card:scale-125"
            />
            <span
              aria-hidden
              className={`relative mb-4 grid size-12 place-items-center rounded-[16px] border border-border bg-elev shadow-[0_6px_18px_color-mix(in_srgb,var(--sh-primary)_8%,transparent)] ${feature.tone}`}
            >
              <feature.Icon className="size-[22px]" strokeWidth={1.7} />
            </span>
            <strong className="relative mb-2 block text-[17px] transition-colors group-hover/card:text-brand">
              {feature.title}
            </strong>
            <p className="relative text-sm leading-[1.95] text-muted">
              {feature.body}
            </p>
          </Card>
        ))}
      </div>

      <section className="mt-14">
        <SectionHeading
          title="هشت ماجرا"
          lead="یکی را بردارید، یا ایدهٔ خودتان را در یک جمله بنویسید."
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {PUBLIC_TOPICS.map((topic) => (
            <TopicCard
              key={topic.id}
              image={topic.image}
              title={topic.title}
              body={topic.body}
            />
          ))}
        </div>
      </section>

      <section className="relative mt-14 overflow-hidden rounded-[30px] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--sh-primary)_12%,var(--sh-surface)),color-mix(in_srgb,var(--sh-accent)_10%,var(--sh-surface)))] p-7 shadow-card-lg sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
        <span
          aria-hidden
          className="motion-pulse absolute -top-16 -start-10 size-40 rounded-full border-[28px] border-brand/10"
        />
        <div className="relative">
          <span className="mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-warm">
            <Sparkles className="size-4" /> آمادهٔ یک ماجرای تازه‌اید؟
          </span>
          <h2 className="font-display text-[clamp(23px,3vw,32px)]">
            قصهٔ بعدی، قصهٔ کودک شماست.
          </h2>
        </div>
        <Link
          href="/wizard"
          className="public-cta gradient-brand relative mt-5 inline-flex items-center gap-2 rounded-[15px] px-6 py-3.5 text-sm font-bold text-white hover:no-underline sm:mt-0 sm:flex-none"
        >
          ساخت قصه
          <ArrowLeft className="size-4" />
        </Link>
      </section>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders the complete public feature inventory and product trust statements.
 */
