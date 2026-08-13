import Link from 'next/link';

export default function Unauthorized() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-[18px] border border-border bg-elev text-[22px] text-warning"
      >
        ⏻
      </span>
      <h1 className="font-display text-2xl">برای ادامه وارد شوید</h1>
      <Link
        href="/login"
        className="rounded-[15px] bg-linear-to-br from-brand to-warm px-5 py-3 font-bold text-brand-fg"
      >
        ورود
      </Link>
    </main>
  );
}
