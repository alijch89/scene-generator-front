'use client';

import { LockKeyhole, LogIn, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Alert,
  Field,
  Input,
  PasswordInput,
  SubmitButton,
} from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { homeFor, type UserDto } from '@/lib/session';

/** Login feedback states represented by the authentication design. */
type Status =
  | 'idle'
  | 'invalid' // اطلاعات نادرست
  | 'rate' // محدودیت تلاش
  | 'network' // خطای شبکه
  | 'expired' // پایان نشست
  | 'suspended'; // حساب غیرفعال

/** Signs in with a phone number and password — the only method there is. */
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

  /** Maps an API failure onto one of the design's login states. */
  function report(err: unknown) {
    if (err instanceof ApiError) {
      const code = (err.body as { code?: string })?.code;
      if (err.status === 429) setStatus('rate');
      else if (code === 'ACCOUNT_SUSPENDED') setStatus('suspended');
      else setStatus('invalid');
    } else {
      // fetch itself failed — no response to read a code from
      setStatus('network');
    }
  }

  /** Submits credentials and follows the session that comes back. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setStatus('idle');

    try {
      const { user } = await api.post<{ user: UserDto }>('/auth/login', {
        phone: String(form.get('phone') ?? ''),
        password: String(form.get('password') ?? ''),
        remember: form.get('remember') === 'on',
      });
      // An administrator-issued password gets you exactly one screen: the one
      // where you replace it. `next` is deliberately dropped here.
      router.replace(
        user.mustChangePassword
          ? '/change-password'
          : (next ?? homeFor(user.role)),
      );
      // refresh() so the server components pick up the new session cookie.
      router.refresh();
      return;
    } catch (err) {
      report(err);
    } finally {
      setLoading(false);
    }
  }

  const invalid = status === 'invalid';

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <span className="mb-3 flex w-fit items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_9%,transparent)] px-3 py-1.5 text-[11.5px] font-bold text-brand">
        <Sparkles aria-hidden className="size-3.5" />
        ادامهٔ قصه از همین‌جا
      </span>
      <h1 className="mb-1.5 font-display text-[clamp(27px,3.6vw,35px)] leading-[1.4]">
        خوش آمدید
      </h1>
      <p className="mb-6 text-[14px] leading-7 text-muted">
        به دنیای قصه‌های خانوادگی‌تان برگردید.
      </p>

      {status === 'invalid' && (
        <Alert tone="error" icon="✕">
          شمارهٔ موبایل یا گذرواژه درست نیست. دوباره امتحان کنید.
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

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label={
            <span className="flex items-center gap-2">
              <Phone aria-hidden className="size-4 text-brand" />
              شمارهٔ موبایل
            </span>
          }
        >
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
            invalid={invalid}
            className="min-h-12.5 w-full bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] px-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
        </Field>

        <Field
          label={
            <span className="flex items-center gap-2">
              <LockKeyhole aria-hidden className="size-4 text-brand" />
              گذرواژه
            </span>
          }
          // No self-service reset exists without SMS, so this says who can
          // actually help instead of linking to a page that cannot.
          hint="گذرواژه را فراموش کرده‌اید؟ پشتیبانی آن را برایتان بازنشانی می‌کند."
        >
          <PasswordInput
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            invalid={invalid}
            className="min-h-12.5 bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] ps-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
        </Field>

        <label className="flex items-center gap-2.5 rounded-2xl border border-transparent bg-[color-mix(in_srgb,var(--sh-elev)_58%,transparent)] px-3.5 py-2.5 text-[13px] text-muted transition-colors hover:border-border">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="size-[17px] rounded accent-[var(--sh-primary)]"
          />
          مرا به خاطر بسپار
        </label>

        <SubmitButton
          loading={loading}
          loadingLabel="در حال ورود…"
          className="public-cta mt-0.5 min-h-13 shadow-[0_14px_30px_color-mix(in_srgb,var(--sh-primary)_22%,transparent)]"
        >
          <LogIn aria-hidden className="size-4.5" />
          <span>ورود</span>
        </SubmitButton>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center">
        <p className="m-0 text-[13px] text-muted">
          هنوز حساب ندارید؟{' '}
          <Link href="/register" className="font-bold text-brand">
            حساب رایگان بسازید
          </Link>
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-block text-[12.5px] font-semibold text-muted"
        >
          نیاز به راهنمایی دارید؟ تماس با پشتیبانی
        </Link>
      </div>
    </section>
  );
}
/**
 * @file login-form.tsx
 * @description Implements password sign-in and maps backend outcomes to UI states.
 */
