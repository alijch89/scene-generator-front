'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { homeFor, type UserDto } from '@/lib/session';

/** The five login states the design specifies, plus the happy path. */
/** Login feedback states represented by the authentication design. */
type Status =
  | 'idle'
  | 'invalid' // اطلاعات نادرست
  | 'rate' // محدودیت تلاش
  | 'verify' // تأیید لازم
  | 'network' // خطای شبکه
  | 'expired' // پایان نشست
  | 'nopassword' // حساب فقط با کد
  | 'notfound' // شماره ثبت نشده
  | 'suspended'; // حساب غیرفعال

/** Which of the two sign-in methods the parent picked. */
type Method = 'password' | 'code';

/** Authenticates with a password or a one-time code, whichever the parent picks. */
export function LoginForm({
  initialStatus,
  next,
}: {
  initialStatus: Status;
  next?: string;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('password');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  /** Maps an API failure onto one of the design's login states. */
  function report(err: unknown) {
    if (err instanceof ApiError) {
      const code = (err.body as { code?: string })?.code;
      if (err.status === 429) setStatus('rate');
      else if (code === 'PASSWORD_NOT_SET') setStatus('nopassword');
      else if (code === 'PHONE_NOT_VERIFIED') setStatus('verify');
      else if (code === 'ACCOUNT_NOT_FOUND') setStatus('notfound');
      else if (code === 'ACCOUNT_SUSPENDED') setStatus('suspended');
      else setStatus('invalid');
    } else {
      // fetch itself failed — no response to read a code from
      setStatus('network');
    }
  }

  /** Submits credentials and maps API failures to explicit login states. */
  async function signInWithPassword(form: FormData) {
    const { user } = await api.post<{ user: UserDto }>('/auth/login', {
      phone,
      password: String(form.get('password') ?? ''),
      remember: form.get('remember') === 'on',
    });
    // refresh() so the server components pick up the new session cookie.
    router.replace(next ?? homeFor(user.role));
    router.refresh();
  }

  /**
   * Requests a code and hands off to the shared verification screen. Throws
   * when the number has no account, so an unregistered parent is told here
   * rather than being left waiting for a code that was never sent.
   */
  async function signInWithCode() {
    const res = await api.post<{ devToken?: string }>('/auth/request-code', {
      phone,
    });
    const query = new URLSearchParams({
      phone,
      ...(res.devToken ? { token: res.devToken } : {}),
    });
    router.push(`/verify-phone?${query.toString()}`);
  }

  /** Runs whichever sign-in method is selected. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setStatus('idle');

    try {
      if (method === 'password') await signInWithPassword(form);
      else await signInWithCode();
      return;
    } catch (err) {
      report(err);
    } finally {
      setLoading(false);
    }
  }

  // Both states put the phone field in the wrong; only «اطلاعات نادرست» also
  // implicates the password, which is hidden on the code tab anyway.
  const invalid = status === 'invalid' || status === 'notfound';

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2 font-display text-[clamp(25px,3.6vw,33px)]">
        خوش آمدید
      </h1>
      <p className="mb-5 text-[14.5px] text-muted">
        وارد شوید تا کتابخانهٔ قصه‌های خانه را ببینید.
      </p>

      <div
        role="tablist"
        aria-label="روش ورود"
        className="mb-5 flex gap-1 rounded-2xl border border-border bg-elev p-1"
      >
        {(
          [
            ['password', 'با گذرواژه'],
            ['code', 'با کد یک‌بارمصرف'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={method === value}
            onClick={() => {
              setMethod(value);
              setStatus('idle');
            }}
            className={cn(
              'flex-1 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-colors',
              method === value
                ? 'bg-surface text-ink shadow-card'
                : 'text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {status === 'invalid' && (
        <Alert tone="error" icon="✕">
          شمارهٔ موبایل یا گذرواژه درست نیست. دوباره امتحان کنید یا{' '}
          <Link href="/forgot-password" className="font-bold">
            گذرواژه را بازیابی کنید
          </Link>
          .
        </Alert>
      )}
      {status === 'nopassword' && (
        <Alert icon="▣">
          این حساب گذرواژه ندارد.{' '}
          <button
            type="button"
            onClick={() => {
              setMethod('code');
              setStatus('idle');
            }}
            className="font-bold text-brand"
          >
            با کد یک‌بارمصرف وارد شوید
          </button>
          .
        </Alert>
      )}
      {status === 'notfound' && (
        <Alert tone="error" icon="✕">
          حسابی با این شماره ثبت نشده است.{' '}
          <Link href="/register" className="font-bold">
            حساب بسازید
          </Link>
          .
        </Alert>
      )}
      {status === 'suspended' && (
        <Alert tone="error" icon="✕">
          این حساب موقتاً غیرفعال است. با پشتیبانی تماس بگیرید.
        </Alert>
      )}
      {status === 'rate' && (
        <Alert tone="warning" icon="!">
          تلاش‌های زیادی انجام شده. برای امنیت حساب، ۵ دقیقهٔ دیگر دوباره امتحان
          کنید.
        </Alert>
      )}
      {status === 'verify' && (
        <Alert icon="▣">
          شمارهٔ موبایلتان هنوز تأیید نشده.{' '}
          <button
            type="button"
            onClick={() => {
              setMethod('code');
              setStatus('idle');
            }}
            className="font-bold text-brand"
          >
            کد تأیید بگیرید
          </button>
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
        <Field label="شمارهٔ موبایل">
          <Input
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            pattern="09[0-9]{9}"
            required
            placeholder="09123456789"
            dir="ltr"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            invalid={invalid}
          />
        </Field>

        {method === 'password' ? (
          <>
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
          </>
        ) : (
          <p className="text-[13px] leading-[1.9] text-muted">
            یک کد ۶ رقمی برایتان پیامک می‌شود و در صفحهٔ بعد آن را وارد می‌کنید.
          </p>
        )}

        <SubmitButton
          loading={loading}
          loadingLabel={
            method === 'password' ? 'در حال ورود…' : 'در حال ارسال کد…'
          }
        >
          {method === 'password' ? 'ورود' : 'ارسال کد'}
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
/**
 * @file login-form.tsx
 * @description Implements password and one-time-code sign-in and maps backend outcomes to UI states.
 */
