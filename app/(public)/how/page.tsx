import type { Metadata } from 'next';
import {
  ArrowLeft,
  BookOpenText,
  Check,
  Compass,
  UserRoundPlus,
  WandSparkles,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/public/ui';
import { faDigits } from '@/lib/fa';

export const metadata: Metadata = { title: 'چطور کار می‌کند' };

const STEPS = [
  {
    Icon: UserRoundPlus,
    title: 'پروندهٔ کودکتان را بسازید',
    body: 'نام و سن را وارد کنید و یک عکس واضح از صورت کودک بفرستید. علاقه‌ها اختیاری‌اند اما قصه را بهتر می‌کنند.',
  },
  {
    Icon: Compass,
    title: 'یک ماجرا انتخاب کنید',
    body: 'از هشت دنیای آماده یکی را بردارید یا ایدهٔ خودتان را در یک جمله بنویسید.',
  },
  {
    Icon: WandSparkles,
    title: 'هوش مصنوعی قصه را می‌سازد',
    body: 'متن نوشته می‌شود، تصویرها کشیده می‌شوند و راوی می‌خواند. می‌توانید صفحه را ببندید؛ خبرتان می‌کنیم.',
  },
  {
    Icon: BookOpenText,
    title: 'بخوانید، گوش کنید، ذخیره کنید',
    body: 'قصه در کتابخانهٔ خانه می‌ماند. می‌توانید دانلود کنید یا برای شب‌های بعد نشانک بگذارید.',
  },
];

/** Static public walkthrough of the end-to-end product flow. */
export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-[920px] px-5 pt-[clamp(46px,7vw,82px)] pb-20">
      <PageHeader
        eyebrow="از یک عکس تا یک کتاب شنیدنی"
        title="چطور کار می‌کند"
        lead="کل مسیر حدود سه دقیقه وقت می‌گیرد؛ ساخت قصه حدود یک دقیقه."
      />

      <ol className="relative flex list-none flex-col gap-4 before:absolute before:top-12 before:bottom-12 before:start-[31px] before:w-px before:bg-[linear-gradient(to_bottom,var(--sh-primary),var(--sh-accent),var(--sh-gold))] sm:before:start-[39px]">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            style={
              { '--motion-delay': `${i * 90}ms` } as React.CSSProperties
            }
            className="motion-rise group relative flex gap-4 rounded-[24px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_90%,transparent)] p-4 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--sh-primary)_30%,var(--sh-border))] hover:shadow-card-lg sm:gap-5 sm:p-5.5"
          >
            <span
              aria-hidden
              className="gradient-brand relative z-[1] grid size-12 flex-none place-items-center rounded-[17px] text-white shadow-card sm:size-14"
            >
              <step.Icon className="size-5.5 sm:size-6" strokeWidth={1.7} />
              <span className="absolute -bottom-1.5 -start-1.5 grid size-5.5 place-items-center rounded-full border-2 border-surface bg-elev font-display text-[9px] text-brand">
                {faDigits(String(i + 1))}
              </span>
            </span>
            <span className="pt-0.5">
              <strong className="mb-2 block text-[17px] transition-colors group-hover:text-brand">
                {step.title}
              </strong>
              <span className="block text-[14.5px] leading-[1.95] text-muted">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-border bg-elev/70 p-5 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-[13.5px] font-semibold text-muted">
          <span className="grid size-7 place-items-center rounded-full bg-success/12 text-success">
            <Check className="size-4" strokeWidth={2.2} />
          </span>
          برای شروع، فقط یک عکس واضح از کودک لازم است.
        </p>
        <Link
          href="/wizard"
          className="public-cta gradient-brand inline-flex items-center gap-2 rounded-[15px] px-6.5 py-3.5 text-[15px] font-bold text-white hover:no-underline"
        >
          شروع کنیم
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Explains the child-profile, story-wizard, payment, generation, and reading workflow.
 */
