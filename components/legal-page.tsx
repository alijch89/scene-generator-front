import { ArrowRight } from "lucide-react";
import Link from "next/link";

type LegalSection = {
  title: string;
  paragraphs: React.ReactNode[];
};

/**
 * Shared, responsive presentation for the public legal documents.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  icon,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-5 py-8 sm:px-8 sm:py-12">
      <div
        className="absolute -start-24 top-20 size-64 rounded-full bg-[var(--primary-soft)] opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -end-24 bottom-20 size-64 rounded-full bg-[var(--teal-soft)] opacity-70 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-bold">
            <span className="grid size-8.5 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-ink)]">
              ✦
            </span>
            <span>سازندهٔ صحنه</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            بازگشت به ثبت‌نام
          </Link>
        </header>

        <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-3)]">
          <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              {icon}
            </div>
            <p className="m-0 text-xs font-extrabold tracking-wide text-[var(--accent)]">
              {eyebrow}
            </p>
            <h1 className="mb-0 mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mb-0 mt-4 max-w-2xl text-[15px] leading-8 text-[var(--ink-2)]">
              {description}
            </p>
            <p className="mb-0 mt-5 text-xs font-semibold text-[var(--ink-3)]">
              آخرین به‌روزرسانی: ۱۰ مرداد ۱۴۰۵
            </p>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            {sections.map((section, index) => (
              <section
                key={section.title}
                aria-labelledby={`legal-section-${index}`}
              >
                <h2
                  id={`legal-section-${index}`}
                  className="mb-3 mt-0 text-lg font-extrabold"
                >
                  {section.title}
                </h2>
                <div className="space-y-3 text-[15px] leading-8 text-[var(--ink-2)]">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="m-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <p className="mb-0 mt-6 text-center text-xs leading-6 text-[var(--ink-3)]">
          برای پرسش‌های مرتبط، از راه ارتباطی معرفی‌شده در برنامه با ما تماس
          بگیرید.
        </p>
      </div>
    </main>
  );
}
