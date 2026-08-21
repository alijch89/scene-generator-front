'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { cn } from '@/lib/utils';

/** 0–3, matching the design's three-segment meter. */
/** Scores password length and character variety for the three-segment UI meter. */
function strengthOf(password: string) {
  if (password.length < 8) return password.length === 0 ? 0 : 1;
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (hasDigit && hasSpecial) return 3;
  if (hasDigit || hasSpecial) return 2;
  return 2;
}

const STRENGTH_HINT = [
  '',
  'گذرواژه باید حداقل ۸ نویسه باشد.',
  'گذرواژه خوب است. یک عدد یا نویسهٔ ویژه آن را قوی‌تر می‌کند.',
  'گذرواژهٔ قوی.',
];

/**
 * The account already has a session by the time this renders — verification
 * signed the parent in. Both branches land on the dashboard; the only question
 * is whether future sign-ins can use a password as well as a code.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const [choosing, setChoosing] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = strengthOf(password);
  const mismatch = confirm.length > 0 && confirm !== password;

  /** Leaves the account code-only and continues to the dashboard. */
  function skip() {
    router.replace('/dashboard');
    router.refresh();
  }

  /** Stores the chosen password, then continues to the dashboard. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch) return;
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/set-password', { password });
      router.replace('/dashboard');
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

  if (choosing) {
    return (
      <section className="animate-[pageIn_.4s_ease_both]">
        <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
          دفعهٔ بعد چطور وارد شوید؟
        </h1>
        <p className="mb-6 text-[14.5px] leading-[1.95] text-muted">
          شمارهٔ شما تأیید شد. می‌توانید یک گذرواژه بگذارید، یا هر بار با کدی که
          پیامک می‌شود وارد شوید.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setChoosing(false)}
            className="rounded-2xl border border-border bg-surface p-4 text-start transition-colors hover:border-brand"
          >
            <strong className="block text-[15px]">گذرواژه می‌گذارم</strong>
            <span className="mt-1 block text-[13px] leading-[1.85] text-muted">
              ورود سریع‌تر، بدون منتظر ماندن برای پیامک. هر وقت خواستید با کد هم
              می‌توانید وارد شوید.
            </span>
          </button>

          <button
            type="button"
            onClick={skip}
            className="rounded-2xl border border-border bg-surface p-4 text-start transition-colors hover:border-brand"
          >
            <strong className="block text-[15px]">هر بار با کد وارد می‌شوم</strong>
            <span className="mt-1 block text-[13px] leading-[1.85] text-muted">
              چیزی برای به خاطر سپردن نیست. بعداً هم می‌توانید در تنظیمات
              گذرواژه بگذارید.
            </span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        یک گذرواژه بگذارید
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        حداقل ۸ نویسه. بعداً در تنظیمات قابل تغییر است.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="گذرواژه" hint={STRENGTH_HINT[strength]}>
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            autoFocus
            placeholder="حداقل ۸ نویسه"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="mt-0.5 flex gap-[5px]" aria-hidden>
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={cn(
                  'h-1 flex-1 rounded-[3px]',
                  strength >= step
                    ? strength === 1
                      ? 'bg-error'
                      : strength === 2
                        ? 'bg-warning'
                        : 'bg-success'
                    : 'bg-border',
                )}
              />
            ))}
          </span>
        </Field>

        <Field
          label="تکرار گذرواژه"
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

        <SubmitButton loading={loading} loadingLabel="در حال ذخیره…">
          ذخیره و ادامه
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        <button type="button" onClick={skip} className="font-bold">
          فعلاً نه، با کد وارد می‌شوم
        </button>
      </p>
    </section>
  );
}
/**
 * @file set-password-form.tsx
 * @description Implements the post-verification choice between a password and code-only sign-in.
 */
