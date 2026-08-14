/**
 * @file page.tsx
 * @description Implements token-based password replacement and invalid/expired-link routing.
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';

/** Reads the reset token, validates matching passwords, and submits the replacement. */
function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && confirm !== password;

  /** Validates and submits matching replacement passwords with the URL token. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', { token, password });
      router.replace('/password-changed');
    } catch (err) {
      // An invalid or used token is indistinguishable from an expired one —
      // the design has a dedicated page for that.
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/link-expired');
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : 'اتصال برقرار نشد. دوباره تلاش کنید.',
      );
      setLoading(false);
    }
  }

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        گذرواژهٔ تازه
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        گذرواژهٔ تازه‌ای انتخاب کنید. نشست‌های دیگر بسته می‌شوند.
      </p>

      {!token && (
        <Alert tone="error" icon="✕">
          لینک ناقص است. دوباره از صفحهٔ بازیابی شروع کنید.
        </Alert>
      )}
      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="گذرواژهٔ جدید">
          <Input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="حداقل ۸ نویسه"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field
          label="تکرار گذرواژهٔ جدید"
          hint={mismatch ? 'گذرواژه‌ها یکی نیستند.' : undefined}
        >
          <Input
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            invalid={mismatch}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <SubmitButton
          loading={loading}
          disabled={!token}
          loadingLabel="در حال ذخیره…"
        >
          ذخیرهٔ گذرواژه
        </SubmitButton>
      </form>
    </section>
  );
}

/** Provides a suspense boundary for the search-parameter-dependent reset form. */
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
