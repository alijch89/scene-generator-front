'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { cn } from '@/lib/utils';

/** 0–3, matching the design's three-segment meter. */
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

export function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = strengthOf(password);
  const mismatch = confirm.length > 0 && confirm !== password;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch) return;
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);

    try {
      const res = await api.post<{ devToken?: string }>('/auth/register', {
        fullName: String(form.get('fullName') ?? ''),
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
        acceptedTerms: form.get('acceptedTerms') === 'on',
      });
      const query = new URLSearchParams({
        email: String(form.get('email') ?? ''),
        ...(res.devToken ? { token: res.devToken } : {}),
      });
      router.push(`/verify-email?${query.toString()}`);
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
        حساب خانوادگی بسازید
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        اولین قصه را همین امشب بسازید.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="نام و نام خانوادگی">
          <Input name="fullName" required placeholder="سحر رضایی" />
        </Field>

        <Field label="ایمیل">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="sahar@example.com"
          />
        </Field>

        <Field label="گذرواژه" hint={STRENGTH_HINT[strength]}>
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
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

        <Field label="تکرار گذرواژه" hint={mismatch ? 'گذرواژه‌ها یکی نیستند.' : undefined}>
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

        <label className="flex items-start gap-2.5 text-[13px] leading-[1.8] text-muted">
          <input
            type="checkbox"
            name="acceptedTerms"
            required
            className="mt-[3px] size-[17px] accent-[var(--sh-primary)]"
          />
          <span>
            <Link href="/terms">شرایط استفاده</Link> و{' '}
            <Link href="/privacy">حریم خصوصی</Link> را می‌پذیرم. تأیید می‌کنم
            بالای ۱۸ سال دارم.
          </span>
        </label>

        <SubmitButton loading={loading} loadingLabel="در حال ساخت حساب…">
          ساخت حساب و شروع
        </SubmitButton>
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
