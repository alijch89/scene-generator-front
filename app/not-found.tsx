import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Handles unmatched URLs and resources rejected with Next.js `notFound()`.
 */
export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--bg)] px-6 py-12">
      <div
        className="absolute -start-28 top-[14%] size-72 rounded-[46%_54%_61%_39%] bg-[var(--primary-soft)] opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute -end-32 bottom-[-5rem] size-80 rounded-[58%_42%_39%_61%] bg-[var(--teal-soft)] opacity-70"
        aria-hidden="true"
      />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <Link
          href="/"
          className="mb-10 flex items-center gap-2.5 text-sm font-bold"
        >
          <span className="grid size-8.5 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-ink)]">
            ✦
          </span>
          سازندهٔ صحنه
        </Link>

        <div
          className="relative mb-8 grid size-36 place-items-center rounded-[2.25rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-3)]"
          aria-hidden="true"
        >
          <span className="absolute -end-3 -top-3 grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-1)]">
            <Sparkles className="size-5" />
          </span>
          <BookOpen className="size-14 text-[var(--primary)]" strokeWidth={1.5} />
          <span className="absolute bottom-6 text-xs font-extrabold text-[var(--ink-3)]">
            صفحه‌ای پیدا نشد
          </span>
        </div>

        <p className="mb-3 text-sm font-extrabold tracking-[0.18em] text-[var(--accent)]">
          خطای ۴۰۴
        </p>
        <h1 className="m-0 text-3xl font-extrabold leading-snug sm:text-4xl">
          این صفحه از قصه جا مانده است
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-8 text-[var(--ink-2)]">
          نشانی این صفحه درست نیست یا شاید صفحه جابه‌جا شده باشد. از اول قصه
          شروع کنید یا به کتابخانه‌تان برگردید.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/">
              <ArrowRight aria-hidden="true" />
              بازگشت به خانه
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl bg-[var(--surface)]"
          >
            <Link href="/stories">
              <BookOpen aria-hidden="true" />
              رفتن به کتابخانه
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
