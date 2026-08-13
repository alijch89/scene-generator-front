import Link from 'next/link';
import type { Metadata } from 'next';
import { Notice } from '@/components/form';

export const metadata: Metadata = { title: 'لینک منقضی شده · شهرزاد قصه‌گو' };

export default function LinkExpiredPage() {
  return (
    <Notice icon="⏳" tone="warning" title="این لینک منقضی شده">
      <p className="mb-6 text-[14.5px] leading-[1.95] text-muted">
        لینک‌های بازیابی نیم ساعت اعتبار دارند. یک لینک تازه بفرستیم؟
      </p>
      <Link
        href="/forgot-password"
        className="block rounded-[15px] bg-linear-to-br from-brand to-warm p-[15px] text-[15.5px] font-bold text-brand-fg"
      >
        فرستادن لینک تازه
      </Link>
      <Link
        href="/login"
        className="mt-3 inline-block text-[13.5px] font-semibold text-muted"
      >
        بازگشت به ورود
      </Link>
    </Notice>
  );
}
