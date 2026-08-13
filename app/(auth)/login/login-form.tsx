'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { homeFor, type UserDto } from '@/lib/session';

/** The five login states the design specifies, plus the happy path. */
type Status =
  | 'idle'
  | 'invalid' // اطلاعات نادرست
  | 'rate' // محدودیت تلاش
  | 'verify' // تأیید لازم
  | 'network' // خطای شبکه
  | 'expired'; // پایان نشست

export function LoginForm({
  initialStatus,
  next,
}: {
  initialStatus: Status;
  next?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setStatus('idle');

    try {
      const { user } = await api.post<{ user: UserDto }>('/auth/login', {
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
        remember: form.get('remember') === 'on',
      });
      // refresh() so the server components pick up the new session cookie.
      router.replace(next ?? homeFor(user.role));
      router.refresh();
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        const code = (err.body as { code?: string })?.code;
        if (err.status === 429) setStatus('rate');
        else if (code === 'EMAIL_NOT_VERIFIED') setStatus('verify');
        else setStatus('invalid');
      } else {
        // fetch itself failed — no response to read a code from
        setStatus('network');
      }
    } finally {
      setLoading(false);
    }
  }

  const invalid = status === 'invalid';

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        خوش آمدید
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        وارد شوید تا کتابخانهٔ قصه‌های خانه را ببینید.
      </p>

      {status === 'invalid' && (
        <Alert tone="error" icon="✕">
          ایمیل یا گذرواژه درست نیست. دوباره امتحان کنید یا{' '}
          <Link href="/forgot-password" className="font-bold">
            گذرواژه را بازیابی کنید
          </Link>
          .
        </Alert>
      )}
      {status === 'rate' && (
        <Alert tone="warning" icon="!">
          تلاش‌های زیادی انجام شده. برای امنیت حساب، ۵ دقیقهٔ دیگر دوباره
          امتحان کنید.
        </Alert>
      )}
      {status === 'verify' && (
        <Alert icon="✉">
          ایمیلتان هنوز تأیید نشده.{' '}
          <Link href="/verify-email" className="font-bold">
            ارسال دوبارهٔ لینک تأیید
          </Link>
        </Alert>
      )}
      {status === 'network' && (
        <Alert icon="⇄">
          اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره تلاش کنید.
        </Alert>
      )}
      {status === 'expired' && (
        <Alert icon="⏻">
          برای امنیت حساب از سیستم خارج شدید. دوباره وارد شوید.
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="ایمیل">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="sahar@example.com"
            invalid={invalid}
          />
        </Field>

        <Field
          label={
            <>
              گذرواژه
              <Link
                href="/forgot-password"
                className="ms-auto text-[12.5px] font-semibold"
              >
                فراموش کردید؟
              </Link>
            </>
          }
        >
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            invalid={invalid}
          />
        </Field>

        <label className="flex items-center gap-2.5 text-[13.5px] text-muted">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="size-[17px] accent-[var(--sh-primary)]"
          />
          مرا به خاطر بسپار
        </label>

        <SubmitButton loading={loading} loadingLabel="در حال ورود…">
          ورود
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        حساب ندارید؟{' '}
        <Link href="/register" className="font-bold">
          ساخت حساب
        </Link>
      </p>
    </section>
  );
}
