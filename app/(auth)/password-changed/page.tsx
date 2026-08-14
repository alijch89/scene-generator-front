import Link from 'next/link';
import type { Metadata } from 'next';
import { Notice } from '@/components/form';

export const metadata: Metadata = { title: 'گذرواژه عوض شد · شهرزاد قصه‌گو' };

/** Displays the terminal password-changed success state. */
export default function PasswordChangedPage() {
  return (
    <Notice icon="✓" tone="success" title="گذرواژه عوض شد">
      <p className="mb-6 text-[14.5px] leading-[1.95] text-muted">
        از این پس با گذرواژهٔ تازه وارد شوید. نشست‌های دیگر بسته شدند.
      </p>
      <Link
        href="/login"
        className="block rounded-[15px] bg-linear-to-br from-brand to-warm p-[15px] text-[15.5px] font-bold text-brand-fg"
      >
        رفتن به ورود
      </Link>
    </Notice>
  );
}
/**
 * @file page.tsx
 * @description Confirms successful password replacement and links back to login.
 */
