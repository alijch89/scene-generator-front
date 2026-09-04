import {
  ArrowLeft,
  BookOpenText,
  CirclePlay,
  Compass,
  Heart,
  ImageIcon,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundPlus,
  WandSparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Eyebrow, SectionHeading, TopicCard } from '@/components/public/ui';
import { faDigits, faNum } from '@/lib/fa';
import { PUBLIC_TOPICS } from '@/lib/story-art';

/** The landing teases six adventures; /features lists all of them. */
const FEATURED_TOPICS = PUBLIC_TOPICS.slice(0, 6);
const TOPIC_ACCENTS = [
  'bg-brand',
  'bg-warm',
  'bg-teal',
  'bg-gold',
  'bg-pink',
  'bg-brand',
] as const;

/**
 * Marketing numbers, kept together so they are one edit rather than six.
 * ponytail: hard-coded — these become real once the admin reports endpoint
 * from phase 7 exists.
 */
const STATS = [
  {
    value: faNum(14200),
    label: 'قصهٔ ساخته‌شده',
    tone: 'text-brand',
    accent: 'bg-brand',
    glow: 'bg-[color-mix(in_srgb,var(--sh-primary)_16%,transparent)]',
  },
  {
    value: `${faNum(92)} ثانیه`,
    label: 'میانگین زمان ساخت',
    tone: 'text-warm',
    accent: 'bg-warm',
    glow: 'bg-[color-mix(in_srgb,var(--sh-accent)_16%,transparent)]',
  },
  {
    value: `${faNum(8)} ماجرا`,
    label: 'دسته‌بندی آماده',
    tone: 'text-teal',
    accent: 'bg-teal',
    glow: 'bg-[color-mix(in_srgb,var(--sh-teal)_16%,transparent)]',
  },
  {
    value: `${faNum(4.8)} از ${faNum(5)}`,
    label: 'رضایت خانواده‌ها',
    tone: 'text-pink',
    accent: 'bg-pink',
    glow: 'bg-[color-mix(in_srgb,var(--sh-pink)_16%,transparent)]',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'دخترم با شنیدن اسم خودش ذوق کرد و خواست همان شب قصه را دوباره گوش بدهیم.',
    name: 'سحر، مادر آوا',
    initial: 'س',
    accent: 'bg-brand',
    avatar: 'bg-[linear-gradient(140deg,var(--sh-primary),var(--sh-accent))]',
  },
  {
    quote:
      'آرین تا آخر قصه نشست و فردایش ماجرا را با جزئیات برایم تعریف کرد.',
    name: 'نرگس، مادر آرین',
    initial: 'ن',
    accent: 'bg-teal',
    avatar: 'bg-teal',
  },
  {
    quote:
      'تصویرها شبیه خودِ رها بود؛ قصه را برای مادربزرگش فرستادیم و با هم شنیدند.',
    name: 'امیر، پدر رها',
    initial: 'ا',
    accent: 'bg-pink',
    avatar: 'bg-pink',
  },
] as const;

/**
 * The four milestones of the landing-page process. Each color is repeated in
 * the marker and its label so the open timeline remains easy to scan without
 * enclosing every step in a card.
 */
const STEPS = [
  {
    title: 'پروندهٔ کودکتان را بسازید',
    body: 'نام، سن، یک عکس و چند علاقه. همین.',
    Icon: UserRoundPlus,
    marker: 'bg-brand',
    tint: 'text-brand',
    wash: 'bg-[color-mix(in_srgb,var(--sh-primary)_14%,transparent)]',
  },
  {
    title: 'یک ماجرا انتخاب کنید',
    body: 'هشت دنیای آماده، یا ایدهٔ خودتان.',
    Icon: Compass,
    marker: 'bg-teal',
    tint: 'text-teal',
    wash: 'bg-[color-mix(in_srgb,var(--sh-teal)_14%,transparent)]',
  },
  {
    title: 'هوش مصنوعی قصه را می‌سازد',
    body: 'متن، تصویرها و روایت، حدود یک دقیقه.',
    Icon: WandSparkles,
    marker: 'bg-warm',
    tint: 'text-warm',
    wash: 'bg-[color-mix(in_srgb,var(--sh-accent)_14%,transparent)]',
  },
  {
    title: 'بخوانید، گوش کنید، ذخیره کنید',
    body: 'کتابخانهٔ خانه، همیشه در دسترس.',
    Icon: BookOpenText,
    marker: 'bg-gold',
    tint: 'text-gold',
    wash: 'bg-[color-mix(in_srgb,var(--sh-gold)_16%,transparent)]',
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
          <Eyebrow className="mb-4 text-[12px]">
            ساخته‌شده برای شب‌های قصهٔ خانوادگی
          </Eyebrow>
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

      {/* ————— featured topics ————— */}
      <section
        aria-labelledby="featured-topics-title"
        className="relative z-[2] border-y border-[color-mix(in_srgb,var(--sh-border)_70%,transparent)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sh-primary)_5%,transparent),color-mix(in_srgb,var(--sh-surface)_38%,transparent),color-mix(in_srgb,var(--sh-accent)_5%,transparent))] backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:gap-8 md:py-6">
          <div className="flex flex-none items-center gap-2.5">
            <span
              aria-hidden
              className="gradient-brand grid size-8 place-items-center rounded-full text-white shadow-[0_8px_20px_color-mix(in_srgb,var(--sh-primary)_18%,transparent)]"
            >
              <Sparkles className="size-4" strokeWidth={1.8} />
            </span>
            <h2
              id="featured-topics-title"
              className="text-[13.5px] font-extrabold text-ink"
            >
              قصه‌هایی دربارهٔ
            </h2>
          </div>

          <ul className="flex flex-1 list-none flex-wrap items-center gap-x-5 gap-y-3 md:justify-between">
            {FEATURED_TOPICS.map((topic, index) => (
              <li
                key={topic.id}
                className="inline-flex items-center gap-2 whitespace-nowrap text-[12.5px] font-semibold text-muted"
              >
                <span
                  aria-hidden
                  className={`size-1.5 rotate-45 rounded-[2px] ${TOPIC_ACCENTS[index]}`}
                />
                {topic.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— stats ————— */}
      <section
        aria-label="آمار شهرزاد"
        className="mx-auto max-w-[1180px] px-5 py-10 sm:py-12"
      >
        <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4 sm:gap-y-0">
          {STATS.map((stat, index) => (
            <li
              key={stat.label}
              style={
                { '--motion-delay': `${index * 75 + 160}ms` } as React.CSSProperties
              }
              className="motion-rise group relative flex min-h-24 flex-col items-center justify-center px-2 text-center sm:min-h-28 sm:px-5"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute top-1/2 size-20 -translate-y-1/2 rounded-full opacity-70 blur-2xl transition-[transform,opacity] duration-300 group-hover:scale-125 group-hover:opacity-100 ${stat.glow}`}
              />
              <span
                aria-hidden
                className={`relative mb-3 h-1 w-7 rounded-full transition-[width] duration-300 group-hover:w-12 ${stat.accent}`}
              />
              <strong
                className={`relative block font-display text-[clamp(27px,3.4vw,42px)] leading-none tracking-[-.025em] transition-transform duration-300 group-hover:-translate-y-0.5 ${stat.tone}`}
              >
                {stat.value}
              </strong>
              <span className="relative mt-2.5 block text-[12.5px] font-semibold text-muted sm:text-[13px]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ————— four steps ————— */}
      <section className="relative mx-auto max-w-[1180px] px-5 py-[clamp(52px,7vw,86px)]">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="در چهار قدم"
            lead="از یک عکس ساده تا قصه‌ای که می‌شود شنید و بارها خواند."
          />
          <p className="max-w-[31ch] text-[12.5px] leading-[1.9] text-muted sm:mb-7 sm:text-end">
            مسیر ساخت قصه کوتاه است؛ شهرزاد کارهای سخت را پشت صحنه انجام
            می‌دهد.
          </p>
        </div>

        {/* A continuous route replaces the old boxed cards and directional
            arrows. It turns vertical on small screens and horizontal on lg. */}
        <ol className="relative mx-auto flex max-w-[760px] list-none flex-col gap-9 before:absolute before:top-7 before:bottom-7 before:start-7 before:w-0.5 before:bg-[linear-gradient(to_bottom,var(--sh-primary),var(--sh-teal),var(--sh-accent),var(--sh-gold))] lg:grid lg:max-w-none lg:grid-cols-4 lg:gap-0 lg:before:start-[12.5%] lg:before:end-[12.5%] lg:before:top-7 lg:before:bottom-auto lg:before:h-0.5 lg:before:w-auto lg:before:bg-[linear-gradient(to_left,var(--sh-primary),var(--sh-teal),var(--sh-accent),var(--sh-gold))]">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              style={
                { '--motion-delay': `${i * 90}ms` } as React.CSSProperties
              }
              className="motion-rise group relative grid grid-cols-[56px_1fr] items-start gap-5 lg:block lg:px-4 lg:text-center"
            >
              <span className="relative z-[1] grid size-14 place-items-center rounded-full bg-bg ring-[7px] ring-bg lg:mx-auto">
                <span
                  aria-hidden
                  className={`absolute inset-0 scale-150 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 ${step.wash}`}
                />
                <span
                  aria-hidden
                  className={`relative grid size-11 place-items-center rounded-full text-white shadow-[0_9px_22px_color-mix(in_srgb,currentColor_22%,transparent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 ${step.marker}`}
                >
                  <step.Icon className="size-[21px]" strokeWidth={1.75} />
                </span>
              </span>

              <div className="pt-0.5 lg:mt-6 lg:pt-0">
                <span
                  className={`mb-1.5 block text-[11px] font-extrabold tracking-[.08em] ${step.tint}`}
                >
                  گام {faDigits(String(i + 1))}
                </span>
                <strong className="mb-2 block text-[16px] leading-[1.65] transition-colors duration-300 group-hover:text-brand">
                  {step.title}
                </strong>
                <span className="mx-auto block max-w-[29ch] text-[13.5px] leading-[1.9] text-muted">
                  {step.body}
                </span>
              </div>
            </li>
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

      {/* ————— testimonials + CTA ————— */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(52px,7vw,86px)]">
        <SectionHeading
          title="از زبان خانواده‌ها"
          lead="چند تجربهٔ کوتاه از قصه‌هایی که به خانه‌ها رفته‌اند."
        />

        <div className="grid gap-2.5 min-[360px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              key={testimonial.name}
              style={
                { '--motion-delay': `${index * 80}ms` } as React.CSSProperties
              }
              className="motion-rise"
            >
              <Card className="relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-[20px] p-4 min-[360px]:min-h-[228px] sm:min-h-[210px] sm:rounded-[22px] sm:p-5 lg:min-h-[220px]">
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 ${testimonial.accent}`}
                />
                <span
                  aria-hidden
                  className="absolute -top-4 -end-1 font-display text-[64px] leading-none text-[color-mix(in_srgb,var(--sh-primary)_7%,transparent)] sm:text-[80px]"
                >
                  «
                </span>

                <div
                  aria-label={`${faDigits('5')} ستاره`}
                  className="relative mb-2.5 flex gap-0.5 text-gold sm:mb-3"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      aria-hidden
                      className="size-2.5 fill-current sm:size-3"
                      strokeWidth={1.2}
                    />
                  ))}
                </div>
                <p className="relative mb-4 text-[12px] leading-[1.9] text-ink sm:mb-5 sm:text-[13.5px] sm:leading-[1.95]">
                  {testimonial.quote}
                </p>
                <footer className="mt-auto flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`grid size-7 flex-none place-items-center rounded-full font-display text-[11px] text-white shadow-card sm:size-8 sm:text-[12px] ${testimonial.avatar}`}
                  >
                    {testimonial.initial}
                  </span>
                  <span className="text-[10px] leading-[1.6] font-semibold text-muted sm:text-[11.5px]">
                    {testimonial.name}
                  </span>
                </footer>
              </Card>
            </article>
          ))}

          <div className="motion-rise relative flex min-h-[180px] flex-col justify-between gap-4 overflow-hidden rounded-[20px] bg-[linear-gradient(145deg,var(--sh-primary),color-mix(in_srgb,var(--sh-primary)_62%,var(--sh-accent)),var(--sh-accent))] p-4 text-white shadow-card-lg [--motion-delay:240ms] min-[360px]:min-h-[228px] sm:min-h-[210px] sm:gap-5 sm:rounded-[22px] sm:p-5 lg:min-h-[220px]">
            <span
              aria-hidden
              className="absolute -top-10 -end-9 size-32 rounded-full border-[22px] border-white/10"
            />
            <div className="relative">
              <span className="mb-3 grid size-8 place-items-center rounded-full bg-white/14">
                <Sparkles className="size-4" strokeWidth={1.8} />
              </span>
              <h3 className="mb-2 font-display text-[18px] leading-[1.6] sm:text-[21px]">
                قصهٔ شما، همین امشب
              </h3>
              <p className="text-[11.5px] leading-[1.8] text-white/85 sm:text-[12.5px] sm:leading-[1.9]">
                فقط یک عکس و یک ایده؛ باقی مسیر با شهرزاد.
              </p>
            </div>
            <Link
              href="/register"
              className="group relative inline-flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-white px-2 py-2.5 text-[11.5px] font-bold text-brand shadow-card transition-transform hover:-translate-y-0.5 hover:no-underline active:scale-[.98] sm:w-auto sm:self-start sm:rounded-[12px] sm:px-4 sm:text-[12.5px]"
            >
              ساخت حساب رایگان
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders the public landing hero, product benefits, themes, process, pricing, and calls to action.
 */
