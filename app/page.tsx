import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-6 py-8 sm:px-12">
      <nav className="relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-2.5 font-bold">
          <span className="grid size-8.5 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-ink)]">
            ✦
          </span>
          سازندهٔ صحنه
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold">
            ورود
          </Link>
          <Button asChild size="sm">
            <Link href="/register">شروع کنید</Link>
          </Button>
        </div>
      </nav>
      <section className="relative z-10 mx-auto mt-24 w-full max-w-3xl text-center sm:mt-32">
        <p className="mb-3 text-xs font-extrabold tracking-[0.17em] text-[var(--accent)]">
          صحنه به صحنه
        </p>
        <h1 className="m-0 text-5xl font-extrabold leading-tight sm:text-7xl">
          قصه‌هایی که ارزش به‌یادماندن دارند بسازید.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--ink-2)]">
          فضایی امن و متمرکز برای تبدیل یک عکس کودک به قصه‌ای مصور و روایت‌شده.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/register">
            ساخت اولین قصه <span aria-hidden>←</span>
          </Link>
        </Button>
      </section>
      <div className="absolute -start-32 top-[17%] size-[23rem] rounded-[48%_52%_42%_58%] bg-[var(--primary-soft)] opacity-60 blur-[1px]" />
      <div className="absolute -end-40 bottom-[-8rem] size-[29rem] rounded-[48%_52%_42%_58%] bg-[var(--teal-soft)] opacity-60 blur-[1px]" />
    </main>
  );
}
