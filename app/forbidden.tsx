/**
 * @file forbidden.tsx
 * @description Renders the App Router boundary used when an authenticated role lacks access.
 */

import Link from "next/link";

/** Displays a role-mismatch explanation and a safe route back to the public site. */
export default function Forbidden() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-[18px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))] text-[22px] text-error"
      >
        ✕
      </span>
      <h1 className="font-display text-2xl">دسترسی به این بخش را ندارید</h1>
      <p className="max-w-sm text-[14.5px] leading-[1.95] text-muted">
        این صفحه برای نقش دیگری است. اگر فکر می‌کنید اشتباهی رخ داده، با
        پشتیبانی تماس بگیرید.
      </p>
      <Link
        href="/"
        className="rounded-2xl border border-border bg-elev px-5 py-3 font-semibold"
      >
        بازگشت به خانه
      </Link>
    </main>
  );
}
