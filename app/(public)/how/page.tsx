import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/public/ui';
import { faDigits } from '@/lib/fa';

export const metadata: Metadata = { title: 'چطور کار می‌کند' };

const STEPS = [
  {
    title: 'پروندهٔ کودکتان را بسازید',
    body: 'نام و سن را وارد کنید و یک عکس واضح از صورت کودک بفرستید. علاقه‌ها اختیاری‌اند اما قصه را بهتر می‌کنند.',
  },
  {
    title: 'یک ماجرا انتخاب کنید',
    body: 'از دوازده دنیای آماده یکی را بردارید یا ایدهٔ خودتان را در یک جمله بنویسید.',
  },
  {
    title: 'هوش مصنوعی قصه را می‌سازد',
    body: 'متن نوشته می‌شود، تصویرها کشیده می‌شوند و راوی می‌خواند. می‌توانید صفحه را ببندید؛ خبرتان می‌کنیم.',
  },
  {
    title: 'بخوانید، گوش کنید، ذخیره کنید',
    body: 'قصه در کتابخانهٔ خانه می‌ماند. می‌توانید دانلود کنید یا برای شب‌های بعد نشانک بگذارید.',
  },
];

/** Static public walkthrough of the end-to-end product flow. */
export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-[900px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
        title="چطور کار می‌کند"
        lead="کل مسیر حدود سه دقیقه وقت می‌گیرد؛ ساخت قصه حدود یک دقیقه."
      />

      <ol className="flex list-none flex-col gap-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-4.5 rounded-[22px] border border-border bg-surface p-5 shadow-card"
          >
            <span
              aria-hidden
              className="flex-none font-display text-[26px] text-warm"
            >
              {faDigits(String(i + 1).padStart(2, '0'))}
            </span>
            <span>
              <strong className="mb-2 block text-[17px]">{step.title}</strong>
              <span className="block text-[14.5px] leading-[1.95] text-muted">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <Link
        href="/wizard"
        className="gradient-brand mt-7 inline-block rounded-[15px] px-6.5 py-4 text-[15.5px] font-bold text-white hover:no-underline"
      >
        شروع کنیم
      </Link>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Explains the child-profile, story-wizard, payment, generation, and reading workflow.
 */
