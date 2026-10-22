'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function RefreshGenerationButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-[12.5px] font-semibold disabled:opacity-50"
    >
      {pending ? 'در حال دریافت…' : 'به‌روزرسانی اطلاعات'}
    </button>
  );
}
