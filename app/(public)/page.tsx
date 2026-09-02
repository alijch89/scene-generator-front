import {
  ArrowLeft,
  BookOpenText,
  CirclePlay,
  Compass,
  Heart,
  ImageIcon,
  MoveDown,
  MoveLeft,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundPlus,
  WandSparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { Card, SectionHeading, TopicCard } from '@/components/public/ui';
import { faDigits, faNum } from '@/lib/fa';
import { PUBLIC_TOPICS } from '@/lib/story-art';

/** The landing teases six adventures; /features lists all of them. */
const FEATURED_TOPICS = PUBLIC_TOPICS.slice(0, 6);

/**
 * Marketing numbers, kept together so they are one edit rather than six.
 * ponytail: hard-coded — these become real once the admin reports endpoint
 * from phase 7 exists.
 */
const STATS = [
  { value: faNum(14200), label: 'قصهٔ ساخته‌شده' },
  { value: `${faNum(92)} ثانیه`, label: 'میانگین زمان ساخت' },
  { value: `${faNum(8)} ماجرا`, label: 'دسته‌بندی آماده' },
  { value: `${faNum(4.8)} از ${faNum(5)}`, label: 'رضایت خانواده‌ها' },
];

/**
 * The four cards of the process strip. `Icon` replaces the decorative gradient
 * tiles the section used to carry, and `tint` walks the palette so the row
 * reads as a progression rather than four identical cards.
 */
const STEPS = [
  {
    title: 'پروندهٔ کودکتان را بسازید',
    body: 'نام، سن، یک عکس و چند علاقه. همین.',
    Icon: UserRoundPlus,
    tint: 'text-brand',
    glow: 'bg-[color-mix(in_srgb,var(--sh-primary)_26%,transparent)]',
  },
  {
    title: 'یک ماجرا انتخاب کنید',
    body: 'هشت دنیای آماده، یا ایدهٔ خودتان.',
    Icon: Compass,
    tint: 'text-teal',
    glow: 'bg-[color-mix(in_srgb,var(--sh-teal)_26%,transparent)]',
  },
  {
    title: 'هوش مصنوعی قصه را می‌سازد',
    body: 'متن، تصویرها و روایت، حدود یک دقیقه.',
    Icon: WandSparkles,
    tint: 'text-warm',
    glow: 'bg-[color-mix(in_srgb,var(--sh-accent)_26%,transparent)]',
  },
  {
    title: 'بخوانید، گوش کنید، ذخیره کنید',
    body: 'کتابخانهٔ خانه، همیشه در دسترس.',
    Icon: BookOpenText,
    tint: 'text-gold',
    glow: 'bg-[color-mix(in_srgb,var(--sh-gold)_26%,transparent)]',
  },
];

/** Static public landing page assembled from reusable marketing primitives. */
export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* ————— hero ————— */}
      <section className="relative mx-auto grid min-h-[calc(100svh-84px)] max-w-[1180px] grid-cols-1 items-center gap-[clamp(34px,5vw,68px)] px-5 py-[clamp(48px,7vw,86px)] lg:grid-cols-[.94fr_1.06fr]">
        <span
          aria-hidden
          className="motion-pulse absolute top-[12%] -start-16 size-44 rounded-full bg-[color-mix(in_srgb,var(--sh-gold)_16%,transparent)] blur-3xl"
        />

        <div className="motion-hero-reveal relative z-[2]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--sh-accent)_24%,var(--sh-border))] bg-[color-mix(in_srgb,var(--sh-surface)_78%,transparent)] px-3.5 py-2 text-[12px] font-bold text-warm shadow-card backdrop-blur-md">
            <Sparkles className="size-4" strokeWidth={1.8} />
            ساخته‌شده برای شب‌های قصهٔ خانوادگی
          </p>
          <h1 className="mb-5 font-display text-[clamp(39px,6.2vw,68px)] leading-[1.22] font-bold tracking-[-.025em]">
            قصه‌ای که کودکتان
            <span className="relative mt-1 block w-fit bg-[linear-gradient(95deg,var(--sh-primary),var(--sh-accent))] bg-clip-text pb-1 text-transparent">
              قهرمان آن است.
              <svg
                aria-hidden
                viewBox="0 0 280 16"
                className="absolute -bottom-1 start-0 h-3 w-full overflow-visible text-gold"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 10 C70 2 183 16 276 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity=".62"
                />
              </svg>
            </span>
          </h1>
          <p className="mb-8 max-w-[52ch] text-[clamp(15.5px,2vw,18.5px)] leading-[2] text-muted">
            یک عکس و یک ایده کافی‌ست؛ شهرزاد قصه‌ای اختصاصی با تصویرهای یکدست
            و روایت فارسی می‌سازد که فقط به دنیای کودک شما تعلق دارد.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/wizard"
              className="public-cta gradient-brand inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold text-white hover:no-underline"
            >
              <WandSparkles className="size-5" strokeWidth={1.8} />
              اولین قصه‌تان را بسازید
              <ArrowLeft className="size-4.5" strokeWidth={1.8} />
            </Link>
            <Link
              href="/how"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--sh-surface)_76%,transparent)] px-6.5 py-4 text-[15px] font-bold text-ink shadow-card backdrop-blur-md transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-surface hover:no-underline active:scale-[.98]"
            >
              <CirclePlay className="size-5 text-brand" strokeWidth={1.8} />
              ببینید چطور کار می‌کند
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[12px] font-semibold text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-teal" /> عکس‌ها خصوصی می‌مانند
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="size-4 text-pink" /> بدون اشتراک ماهانه
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CirclePlay className="size-4 text-warm" /> روایت کاملاً فارسی
            </span>
          </div>
        </div>

        <div
          className="motion-rise relative mx-auto w-full max-w-[560px] [--motion-delay:140ms]"
        >
          <span
            aria-hidden
            className="absolute inset-8 -z-10 rounded-full bg-[linear-gradient(135deg,color-mix(in_srgb,var(--sh-primary)_34%,transparent),color-mix(in_srgb,var(--sh-accent)_26%,transparent))] blur-3xl"
          />
          <span
            aria-hidden
            className="motion-float-reverse absolute -top-5 start-[6%] z-10 grid size-12 rotate-[-8deg] place-items-center rounded-2xl border border-white/40 bg-gold text-white shadow-card-lg"
          >
            <Star className="size-5 fill-current" strokeWidth={1.5} />
          </span>
          <div className="motion-float relative rounded-[34px] border border-[color-mix(in_srgb,var(--sh-border)_82%,white)] bg-[color-mix(in_srgb,var(--sh-surface)_76%,transparent)] p-3.5 shadow-[var(--sh-shadow-float)] backdrop-blur-xl sm:p-4.5">
            <div className="relative aspect-[9/8] overflow-hidden rounded-[25px] bg-elev sm:aspect-[10/8]">
              <Image
                src={FEATURED_TOPICS[4].image}
                alt="تصویر قصهٔ آوا و بادبادک گمشده"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover transition-transform duration-[1400ms] hover:scale-[1.035]"
              />
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,12,38,.82),transparent_62%)]" />
              <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-white/76">
                  <span className="rounded-full border border-white/20 bg-white/12 px-2.5 py-1 backdrop-blur-md">
                    قصهٔ اختصاصی آوا
                  </span>
                  <span>۱۰ صفحه</span>
                </div>
                <h2 className="font-display text-[clamp(25px,5vw,38px)] leading-[1.35] [text-shadow:0_3px_18px_rgba(0,0,0,.42)]">
                  آوا و بادبادکِ آن‌سوی ابرها
                </h2>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-[19px] border border-border bg-[color-mix(in_srgb,var(--sh-elev)_72%,transparent)] px-3.5 py-3 shadow-[0_1px_0_rgba(255,255,255,.4)_inset]">
              <span className="gradient-brand grid size-10 flex-none place-items-center rounded-full text-white shadow-card">
                <CirclePlay className="size-5" fill="currentColor" strokeWidth={1.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-2 flex items-center justify-between gap-2 text-[10.5px] font-semibold text-muted">
                  <span>روایت مریم</span>
                  <span>{faDigits('03:42 / 06:00')}</span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-border">
                  <span className="story-playhead block h-full rounded-full bg-[linear-gradient(90deg,var(--sh-primary),var(--sh-accent))]" />
                </span>
              </span>
            </div>
          </div>

          <div className="motion-float-reverse public-glass absolute -end-2 bottom-[22%] z-10 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-[11px] font-bold shadow-card-lg sm:-end-7 sm:px-3.5">
            <span className="grid size-8 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--sh-primary)_12%,transparent)] text-brand">
              <ImageIcon className="size-4" strokeWidth={1.8} />
            </span>
            تصویرسازی یکدست
          </div>
        </div>
      </section>

      {/* ————— ambient topic marquee ————— */}
      <section className="relative z-[2] overflow-hidden border-y border-border bg-[color-mix(in_srgb,var(--sh-surface)_58%,transparent)] py-3.5 backdrop-blur-sm">
        <div className="topic-marquee-track flex items-center gap-3 pe-3">
          {[...FEATURED_TOPICS, ...FEATURED_TOPICS].map((topic, index) => (
            <span
              key={`${topic.id}-${index}`}
              aria-hidden={index >= FEATURED_TOPICS.length}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-3.5 py-2 text-[12px] font-semibold text-muted shadow-[0_4px_14px_color-mix(in_srgb,var(--sh-primary)_6%,transparent)]"
            >
              <span className="size-1.5 rounded-full bg-warm" />
              {topic.title}
            </span>
          ))}
        </div>
      </section>

      {/* ————— stats ————— */}
      <section className="mx-auto max-w-[1180px] px-5 py-8 sm:py-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
          {STATS.map((stat, index) => (
            <Card
              key={stat.label}
              style={
                { '--motion-delay': `${index * 75 + 160}ms` } as React.CSSProperties
              }
              className="motion-rise relative overflow-hidden rounded-[20px] p-5"
            >
              <strong className="block font-display text-[28px] text-brand">
                {stat.value}
              </strong>
              <span className="mt-0.5 block text-[12.5px] font-semibold text-muted">
                {stat.label}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* ————— four steps ————— */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(52px,7vw,86px)]">
        <SectionHeading
          title="در چهار قدم"
          lead="از عکس تا کتاب قصهٔ روایت‌شده."
        />
        {/* One rail: cards stack with a down-arrow on narrow screens and sit
            in a right-to-left row joined by arrows from `lg` up. */}
        <ol className="flex list-none flex-col items-stretch gap-2 lg:flex-row lg:gap-0">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <li className="lg:flex-1">
                <Card
                  style={
                    { '--motion-delay': `${i * 90}ms` } as React.CSSProperties
                  }
                  className="motion-rise relative h-full overflow-hidden p-5"
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -top-14 -end-12 size-24 rounded-full blur-2xl ${step.glow}`}
                  />
                  {/* The step number rides the icon badge so the pair stays
                      together at every card width. */}
                  <span
                    aria-hidden
                    className={`relative grid size-12 place-items-center rounded-[17px] border border-border bg-elev ${step.tint}`}
                  >
                    <step.Icon className="size-[22px]" strokeWidth={1.75} />
                    <span className="absolute -bottom-2 -start-2 grid size-6 place-items-center rounded-full border border-border bg-surface font-display text-[11.5px] text-ink shadow-card">
                      {faDigits(String(i + 1))}
                    </span>
                  </span>
                  <strong className="relative mt-4.5 mb-1.5 block text-base transition-colors group-hover/card:text-brand">
                    {step.title}
                  </strong>
                  <span className="relative block text-[13.5px] leading-[1.8] text-muted">
                    {step.body}
                  </span>
                </Card>
              </li>

              {i < STEPS.length - 1 ? (
                <li
                  aria-hidden
                  className="flex items-center justify-center self-center px-1 py-1 text-warm/70 lg:w-10 lg:py-0"
                >
                  <MoveDown className="size-5 lg:hidden" strokeWidth={1.75} />
                  <span className="hidden items-center lg:flex">
                    <span className="h-px w-3.5 bg-border" />
                    <MoveLeft className="size-5" strokeWidth={1.75} />
                  </span>
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </section>

      {/* ————— adventures ————— */}
      <section className="relative border-y border-border bg-[color-mix(in_srgb,var(--sh-bg2)_78%,transparent)]">
        <span
          aria-hidden
          className="absolute inset-y-0 start-0 w-1/3 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--sh-primary)_12%,transparent),transparent_68%)]"
        />
        <div className="relative mx-auto max-w-[1180px] px-5 py-[clamp(52px,7vw,78px)]">
          <SectionHeading
            title="ماجراها"
            lead="هر قصه دور یکی از این موضوع‌ها ساخته می‌شود."
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
            {FEATURED_TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                image={topic.image}
                title={topic.title}
                body={topic.body}
              />
            ))}
          </div>
          <Link
            href="/features"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand"
          >
            همهٔ ماجراها
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ————— testimonial + CTA ————— */}
      <section className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 px-5 py-[clamp(52px,7vw,86px)]">
        <Card className="relative overflow-hidden rounded-3xl p-7 sm:p-8">
          <span
            aria-hidden
            className="absolute -top-6 start-4 font-display text-[110px] leading-none text-[color-mix(in_srgb,var(--sh-primary)_9%,transparent)]"
          >
            «
          </span>
          <div className="relative mb-4 flex gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-4 fill-current" strokeWidth={1.2} />
            ))}
          </div>
          <p className="relative mb-5 text-[16px] leading-[2.05]">
            «دخترم هر شب می‌خواهد قصهٔ خودش را بشنود. اولین بار که اسمش را از
            زبان راوی شنید، نیم ساعت نخوابید.»
          </p>
          <div className="flex items-center gap-3">
            <span className="gradient-brand grid size-9 place-items-center rounded-full font-display text-sm text-white">
              س
            </span>
            <p className="text-[12.5px] font-semibold text-muted">سحر، مادر آوا</p>
          </div>
        </Card>

        <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-[linear-gradient(145deg,var(--sh-primary),color-mix(in_srgb,var(--sh-primary)_62%,var(--sh-accent)),var(--sh-accent))] p-7 text-white shadow-[var(--sh-shadow-float)] sm:p-8">
          <span
            aria-hidden
            className="motion-pulse absolute -top-12 -end-10 size-40 rounded-full border-[28px] border-white/10"
          />
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold backdrop-blur-sm">
              <Sparkles className="size-3.5" /> فقط چند دقیقه تا قصهٔ اول
            </span>
            <h3 className="mb-2.5 font-display text-[clamp(25px,4vw,34px)]">
              همین امشب، اولین قصه
            </h3>
            <p className="max-w-[48ch] text-[14.5px] leading-[2] opacity-90">
              حساب بسازید، پروندهٔ کودکتان را پر کنید و قصه را بسازید. بدون
              اشتراک — فقط بابت همان قصه‌ای که می‌سازید.
            </p>
          </div>
          <Link
            href="/register"
            className="group relative inline-flex self-start items-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-[15px] font-bold text-brand shadow-card transition-transform hover:-translate-y-0.5 hover:no-underline active:scale-[.98]"
          >
            ساخت حساب رایگان
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders the public landing hero, product benefits, themes, process, pricing, and calls to action.
 */
