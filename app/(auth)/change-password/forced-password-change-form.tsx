'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Alert,
  Field,
  PASSWORD_HINT,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  passwordStrength,
} from '@/components/form';
import { ApiError, api } from '@/lib/api';

/**
 * Replaces an administrator-issued password with one the parent chose.
 *
 * The «گذرواژهٔ فعلی» box is the temporary password support handed over — the
 * same endpoint as پروفایل → تغییر گذرواژه, so nothing here is a second way
 * to set a password, only a different door to the one way.
 */
export function ForcedPasswordChangeForm({ home }: { home: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const reused = password.length > 0 && password === current;

  /** Submits the replacement, then continues into the product. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch || reused) return;
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/change-password', {
        currentPassword: current,
        newPassword: password,
        confirmPassword: confirm,
      });
      // The API cleared the flag and kept this session, so the app opens up.
      router.replace(home);
      router.refresh();
    } catch (err) {
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
        یک گذرواژهٔ تازه بگذارید
      </h1>
      <p className="mb-6 text-[14.5px] leading-[1.95] text-muted">
        گذرواژهٔ فعلی حسابتان را پشتیبانی انتخاب کرده است. تا وقتی گذرواژهٔ
        خودتان را نگذارید، بقیهٔ بخش‌ها باز نمی‌شوند.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field
          label="گذرواژهٔ فعلی"
          hint="همان گذرواژه‌ای که پشتیبانی به شما داد."
        >
          <PasswordInput
            autoComplete="current-password"
            required
            autoFocus
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </Field>

        <Field
          label="گذرواژهٔ تازه"
          hint={
            reused
              ? 'گذرواژهٔ تازه باید با گذرواژهٔ فعلی فرق داشته باشد.'
              : PASSWORD_HINT[strength]
          }
        >
          <PasswordInput
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="حداقل ۸ نویسه"
            value={password}
            invalid={reused}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength score={strength} />
        </Field>

        <Field
          label="تکرار گذرواژهٔ تازه"
          hint={mismatch ? 'گذرواژه‌ها یکی نیستند.' : undefined}
        >
          <PasswordInput
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            invalid={mismatch}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </Field>

        <SubmitButton loading={loading} loadingLabel="در حال ذخیره…">
          ذخیره و ادامه
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        <button
          type="button"
          onClick={async () => {
            await api.post('/auth/logout');
            router.replace('/login');
            router.refresh();
          }}
          className="font-bold"
        >
          خروج از حساب
        </button>
      </p>
    </section>
  );
}
/**
 * @file forced-password-change-form.tsx
 * @description Implements the mandatory password replacement after an administrator reset.
 */
