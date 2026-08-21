'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';

/** Collects a phone number, and optionally a name, then sends a sign-in code. */
export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  /** Creates the account and forwards the code-verification context. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get('phone') ?? '');
    const fullName = String(form.get('fullName') ?? '').trim();

    setLoading(true);
    setError(null);

    try {
      const res = await api.post<{ devToken?: string }>('/auth/register', {
        phone,
        // Omitted entirely when blank, so the API applies its own placeholder.
        ...(fullName ? { fullName } : {}),
      });
      const query = new URLSearchParams({
        phone,
        mode: 'signup',
        ...(res.devToken ? { token: res.devToken } : {}),
      });
      router.push(`/verify-phone?${query.toString()}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(
          <>
            این شماره قبلاً ثبت شده.{' '}
            <Link href="/login" className="font-bold">
              وارد شوید
            </Link>
            .
          </>,
        );
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : 'اتصال برقرار نشد. دوباره تلاش کنید.',
        );
      }
      setLoading(false);
    }
  }

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        حساب خانوادگی بسازید
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        شمارهٔ موبایلتان کافی است. اولین قصه را همین امشب بسازید.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="شمارهٔ موبایل">
          <Input
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            pattern="09[0-9]{9}"
            required
            autoFocus
            placeholder="09123456789"
            dir="ltr"
          />
        </Field>

        <Field
          label={
            <>
              نام و نام خانوادگی
              <span className="ms-2 font-normal text-muted">(اختیاری)</span>
            </>
          }
          hint="بعداً هم می‌توانید در تنظیمات اضافه کنید."
        >
          <Input
            name="fullName"
            autoComplete="name"
            minLength={2}
            maxLength={60}
            placeholder="سحر رضایی"
          />
        </Field>

        <SubmitButton loading={loading} loadingLabel="در حال ارسال کد…">
          دریافت کد
        </SubmitButton>

        {/* The design's explicit checkbox is gone with the rest of the form —
            consent rides on the submit, as it does in every code sign-up. */}
        <p className="text-center text-[12.5px] leading-[1.9] text-muted">
          با ادامه، <Link href="/terms">شرایط استفاده</Link> و{' '}
          <Link href="/privacy">حریم خصوصی</Link> را می‌پذیرید و تأیید می‌کنید
          بالای ۱۸ سال دارید.
        </p>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        حساب دارید؟{' '}
        <Link href="/login" className="font-bold">
          ورود
        </Link>
      </p>
    </section>
  );
}
/**
 * @file register-form.tsx
 * @description Implements phone-only parent registration and the handoff to code verification.
 */
