'use client';

import {
  BadgeCheck,
  LockKeyhole,
  Phone,
  Sparkles,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Alert,
  Field,
  Input,
  PASSWORD_HINT,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  passwordStrength,
} from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { homeFor, type UserDto } from '@/lib/session';

/**
 * Collects a phone number, a password, and optionally a name.
 *
 * There is no SMS step any more, so this form is the whole of signing up: the
 * API returns a session with the new account and the parent lands in the
 * product from here.
 */
export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const strength = passwordStrength(password);
  const mismatch = confirm.length > 0 && confirm !== password;

  /** Creates the account, then follows the session it comes back with. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch) return;

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') ?? '').trim();

    setLoading(true);
    setError(null);

    try {
      const { user } = await api.post<{ user: UserDto }>('/auth/register', {
        phone: String(form.get('phone') ?? ''),
        password,
        confirmPassword: confirm,
        // Omitted entirely when blank, so the API applies its own placeholder.
        ...(fullName ? { fullName } : {}),
      });
      router.replace(homeFor(user.role));
      // refresh() so the server components pick up the new session cookie.
      router.refresh();
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
      <span className="mb-3 flex w-fit items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_9%,transparent)] px-3 py-1.5 text-[11.5px] font-bold text-brand">
        <Sparkles aria-hidden className="size-3.5" />
        شروع یک دنیای تازه
      </span>
      <h1 className="mb-1.5 font-display text-[clamp(27px,3.6vw,35px)] leading-[1.4]">
        حساب خانوادگی بسازید
      </h1>
      <p className="mb-5 text-[13.5px] leading-7 text-muted sm:text-[14px]">
        فقط با شمارهٔ موبایل و یک گذرواژه؛ اولین قصه را همین امشب بسازید.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
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
            className="min-h-12 w-full bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] px-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
        </Field>

        <Field
          label={
            <span className="flex items-center gap-2">
              <UserRound aria-hidden className="size-4 text-brand" />
              <span>نام و نام خانوادگی</span>
              <span className="ms-2 font-normal text-muted">(اختیاری)</span>
            </span>
          }
          hint="بعداً هم می‌توانید در تنظیمات اضافه کنید."
        >
          <Input
            name="fullName"
            autoComplete="name"
            minLength={2}
            maxLength={60}
            placeholder="سحر رضایی"
            className="min-h-12 bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] px-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
        </Field>

        <Field
          label={
            <span className="flex items-center gap-2">
              <LockKeyhole aria-hidden className="size-4 text-brand" />
              گذرواژه
            </span>
          }
          hint={PASSWORD_HINT[strength]}
        >
          <PasswordInput
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="حداقل ۸ نویسه"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-12 bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] ps-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
          <PasswordStrength score={strength} />
        </Field>

        <Field
          label={
            <span className="flex items-center gap-2">
              <BadgeCheck aria-hidden className="size-4 text-brand" />
              تکرار گذرواژه
            </span>
          }
          hint={mismatch ? 'گذرواژه‌ها یکی نیستند.' : undefined}
        >
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            invalid={mismatch}
            onChange={(event) => setConfirm(event.target.value)}
            className="min-h-12 bg-[color-mix(in_srgb,var(--sh-surface)_72%,var(--sh-elev))] ps-4 shadow-[0_1px_0_rgba(255,255,255,.6)_inset]"
          />
        </Field>

        <SubmitButton
          loading={loading}
          loadingLabel="در حال ساخت حساب…"
          className="public-cta mt-0.5 min-h-13 shadow-[0_14px_30px_color-mix(in_srgb,var(--sh-primary)_22%,transparent)]"
        >
          ساخت حساب
        </SubmitButton>

        {/* The design's explicit checkbox is gone with the rest of the form —
            consent rides on the submit, as it does in most sign-ups. */}
        <p className="px-2 text-center text-[11.5px] leading-[1.9] text-muted sm:text-xs">
          با ادامه، <Link href="/terms">شرایط استفاده</Link> و{' '}
          <Link href="/privacy">حریم خصوصی</Link> را می‌پذیرید و تأیید می‌کنید
          بالای ۱۸ سال دارید.
        </p>
      </form>

      <p className="mt-5 border-t border-border pt-5 text-center text-[13px] text-muted">
        حساب دارید؟{' '}
        <Link href="/login" className="font-bold text-brand">
          ورود
        </Link>
      </p>
    </section>
  );
}
/**
 * @file register-form.tsx
 * @description Implements password-based parent registration and the handoff into the product.
 */
