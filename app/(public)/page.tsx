import {
  BookOpenText,
  Compass,
  MoveDown,
  MoveLeft,
  UserRoundPlus,
  WandSparkles,
} from 'lucide-react';
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
    <main>
      {/* ————— hero ————— */}
      <section className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(28px,5vw,56px)] px-5 py-[clamp(34px,6vw,72px)]">
        <div className="animate-[pageIn_.6s_ease_both]">
          <p className="mb-3.5 inline-flex items-center gap-[7px] rounded-full border border-border bg-elev px-3.5 py-2 text-[12.5px] font-semibold text-warm">
            ✦ ساخته‌شده با هوش مصنوعی، برای شب‌های قصه
          </p>
          <h1 className="mb-4.5 font-display text-[clamp(32px,5.6vw,58px)] leading-[1.3] font-bold">
            کودک شما قهرمان قصهٔ خودش می‌شود.
          </h1>
          <p className="mb-7 max-w-[50ch] text-[clamp(15px,2vw,19px)] leading-[1.95] text-muted">
            یک عکس بفرستید، یک ماجرا انتخاب کنید و بگذارید هوش مصنوعی قصه‌ای
            تصویرشده و روایت‌شده بسازد که کودکتان در آن نقش اول است.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/wizard"
              className="gradient-brand rounded-2xl px-7 py-4 text-base font-bold text-white shadow-card-lg hover:no-underline"
            >
              اولین قصه‌تان را بسازید
            </Link>
            <Link
              href="/how"
              className="rounded-2xl border border-border bg-surface px-6.5 py-4 text-[15.5px] font-bold text-ink hover:no-underline"
            >
              ببینید چطور کار می‌کند
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-5.5 text-[12.5px] text-muted">
            <span>✓ بدون اشتراک ماهانه</span>
            <span>✓ عکس‌ها خصوصی می‌مانند</span>
            <span>✓ روایت فارسی</span>
          </div>
        </div>

        <div className="rounded-[30px] border border-border bg-[linear-gradient(160deg,var(--sh-elev),var(--sh-bg2))] p-[22px] shadow-card-lg">
          <p className="mb-4 text-[12.5px] font-bold tracking-[.4px] text-muted">
            عکس ← شخصیت ← کتاب قصه
          </p>
          <div className="grid grid-cols-[1fr_1fr_1.15fr] items-center gap-3">
            <div className="animate-[stageStep_7s_ease-in-out_infinite]">
              {/* ponytail: a gradient stand-in, not next/image — there is no
                  uploaded photo on a marketing page. */}
              <div className="grid h-28 place-items-center rounded-2xl border border-dashed border-border bg-elev text-[11px] text-muted">
                عکس کودک
              </div>
              <p className="mt-2 text-center text-[11.5px] text-muted">
                عکس آوا
              </p>
            </div>

            <div className="animate-[stageStep_7s_ease-in-out_infinite_1.2s]">
              <div className="relative h-28 overflow-hidden rounded-2xl bg-[linear-gradient(150deg,#6B4BA8,#C77FBF_60%,#F3B26A)]">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_40%_34%,rgba(255,255,255,.55),transparent_46%)]"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-2.5 end-1/2 h-13 w-13 translate-x-1/2 rounded-[50%_50%_40%_40%] bg-[rgba(30,18,52,.6)]"
                />
              </div>
              <p className="mt-2 text-center text-[11.5px] text-muted">
                شخصیت آوا
              </p>
            </div>

            <div className="animate-[stageStep_7s_ease-in-out_infinite_2.4s]">
              <div className="relative h-33 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#221C46,#59418C_58%,#D9926B)] shadow-card-lg">
                <span
                  aria-hidden
                  className="absolute top-[12%] end-[16%] size-8.5 rounded-full bg-[#FFF3D6] shadow-[0_0_26px_rgba(255,240,200,.85)]"
                />
                <span
                  aria-hidden
                  className="absolute top-[24%] start-[18%] size-1 animate-[twinkle_3s_ease-in-out_infinite] rounded-full bg-white shadow-[26px_18px_0_-1px_#FFE9A8,54px_-6px_0_-1px_#fff]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 -inset-x-[10%] h-[34%] rounded-t-[50%] bg-[#1D1840]"
                />
                <span className="absolute inset-x-3 bottom-2.5 font-display text-[13px] leading-tight font-bold text-[#FFF6E6] [text-shadow:0_2px_10px_rgba(0,0,0,.6)]">
                  آوا و ماه گمشده
                </span>
              </div>
              <p className="mt-2 text-center text-[11.5px] text-muted">
                کتاب قصه
              </p>
            </div>
          </div>

          <div className="mt-4.5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5">
            <span
              aria-hidden
              className="gradient-brand grid size-8.5 place-items-center rounded-full text-[13px] text-white"
            >
              ▶
            </span>
            <span className="h-[5px] flex-1 overflow-hidden rounded bg-border">
              <span className="block h-full w-[38%] bg-brand" />
            </span>
            <span className="text-[11.5px] text-muted">
              روایت مریم · {faDigits('6:00')}
            </span>
          </div>
        </div>
      </section>

      {/* ————— stats ————— */}
      <section className="mx-auto max-w-[1180px] px-5 pb-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
          {STATS.map((stat) => (
            <Card key={stat.label} className="rounded-[20px] p-5">
              <strong className="block font-display text-[26px]">
                {stat.value}
              </strong>
              <span className="text-[13px] text-muted">{stat.label}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* ————— four steps ————— */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(40px,6vw,72px)]">
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
                <Card className="relative h-full overflow-hidden p-5">
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
                  <strong className="relative mt-4.5 mb-1.5 block text-base">
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
      <section className="border-y border-border bg-bg2">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(40px,6vw,64px)]">
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
            className="mt-5 inline-block text-sm font-bold text-brand"
          >
            همهٔ ماجراها ←
          </Link>
        </div>
      </section>

      {/* ————— testimonial + CTA ————— */}
      <section className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 px-5 py-[clamp(40px,6vw,72px)]">
        <Card className="rounded-3xl p-6.5">
          <p className="mb-4 text-base leading-[2]">
            «دخترم هر شب می‌خواهد قصهٔ خودش را بشنود. اولین بار که اسمش را از
            زبان راوی شنید، نیم ساعت نخوابید.»
          </p>
          <p className="text-[13px] text-muted">سحر، مادر آوا</p>
        </Card>

        <div className="flex flex-col justify-between gap-4.5 rounded-3xl bg-[linear-gradient(150deg,var(--sh-primary),var(--sh-accent))] p-6.5 text-white shadow-card-lg">
          <div>
            <h3 className="mb-2 font-display text-2xl">همین امشب، اولین قصه</h3>
            <p className="text-[14.5px] leading-[1.9] opacity-90">
              حساب بسازید، پروندهٔ کودکتان را پر کنید و قصه را بسازید. بدون
              اشتراک — فقط بابت همان قصه‌ای که می‌سازید.
            </p>
          </div>
          <Link
            href="/register"
            className="self-start rounded-[14px] bg-white px-6 py-3.5 text-[15px] font-bold text-brand hover:no-underline"
          >
            ساخت حساب رایگان
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
