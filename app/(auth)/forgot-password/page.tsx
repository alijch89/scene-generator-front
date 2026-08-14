/**
 * @file page.tsx
 * @description Implements the client password-reset request form with enumeration-safe feedback.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';

/** Requests a password-reset token without revealing whether the phone exists. */
export default function ForgotPasswordPage() {
  const [state, setState] = useState<'idle' | 'bad' | 'sent'>('idle');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);

  /** Requests password recovery and displays the enumeration-safe response. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ devToken?: string }>(
        '/auth/forgot-password',
        { phone },
      );
      setDevToken(res.devToken ?? null);
      setState('sent');
    } catch (err) {
      setState(err instanceof ApiError && err.status === 400 ? 'bad' : 'sent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        بازیابی گذرواژه
      </h1>
      <p className="mb-6 text-[14.5px] leading-[1.9] text-muted">
        شمارهٔ موبایل حسابتان را بنویسید؛ یک لینک بازیابی می‌فرستیم.
      </p>

      {state === 'bad' && (
        <Alert tone="error" icon="✕">
          شمارهٔ موبایل درست به نظر نمی‌رسد. نمونه: ۰۹۱۲۳۴۵۶۷۸۹
        </Alert>
      )}

      {state === 'sent' && (
        <div className="mb-[18px] rounded-[18px] border border-border bg-elev p-5">
          <span
            aria-hidden
            className="mb-3 grid size-11 place-items-center rounded-[14px] bg-surface text-lg text-brand"
          >
            ▣
          </span>
          <strong className="mb-[7px] block text-base">پیامک فرستاده شد</strong>
          <p className="m-0 text-[13.5px] leading-[1.9] text-muted">
            لینک بازیابی به {phone} فرستاده شد و تا ۳۰ دقیقه معتبر است. اگر
            نرسید، چند دقیقه بعد دوباره تلاش کنید.
          </p>
          {devToken && (
            <p className="mt-3 text-[12.5px]">
              {/* SMS isn't wired yet — this shortcut only exists outside production. */}
              <Link
                href={`/reset-password?token=${encodeURIComponent(devToken)}`}
                className="font-bold"
              >
                باز کردن لینک بازیابی (حالت توسعه)
              </Link>
            </p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="شمارهٔ موبایل">
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            pattern="09[0-9]{9}"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09123456789"
            dir="ltr"
            invalid={state === 'bad'}
          />
        </Field>
        <SubmitButton loading={loading} loadingLabel="در حال ارسال…">
          فرستادن لینک بازیابی
        </SubmitButton>
        <Link
          href="/login"
          className="text-center text-[13.5px] font-semibold text-muted"
        >
          بازگشت به ورود
        </Link>
      </form>
    </section>
  );
}
