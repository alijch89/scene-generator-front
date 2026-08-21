'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Alert, Notice } from '@/components/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ApiError, api } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import { homeFor, type UserDto } from '@/lib/session';

/** Digits in a verification code. */
const CODE_LENGTH = 6;

/*
 * Mock delivery. No SMS gateway is wired up yet, so the "sent" code is a
 * constant and the page types it in for you a moment later — what a real
 * arrival looks like, minus the network. Only the code is fake: the session
 * still comes from POST /auth/verify-phone with the registration token, so
 * the dashboard we land on is genuinely authenticated.
 */
const MOCK_CODE = '123456';
/** How long the imaginary SMS spends in transit. */
const MOCK_ARRIVAL_MS = 2600;
/** Per-digit delay while the arrived code fills itself in. */
const MOCK_TYPING_MS = 110;
/** Seconds before «ارسال دوباره» becomes available again. */
const RESEND_AFTER = 60;

/** Collects the six-digit code, auto-filling it in mock mode, then signs in. */
export function VerifyPhoneForm({
  phone,
  initialToken,
  mode,
}: {
  phone: string;
  initialToken: string;
  /** Where a confirmed code leads: the password choice, or straight in. */
  mode: 'signup' | 'login';
}) {
  const router = useRouter();

  const [token, setToken] = useState(initialToken);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(RESEND_AFTER);
  /** Bumped by «ارسال دوباره» to restart delivery and the countdown. */
  const [attempt, setAttempt] = useState(0);

  /** Typing your own code cancels the mock autofill mid-flight. */
  const manual = useRef(false);
  /** Guards against a second submit from React's double-invoked effects. */
  const submitting = useRef(false);

  // The fake SMS: wait, then reveal the code one digit at a time.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setArrived(true);
        if (manual.current) return;
        for (let i = 0; i < CODE_LENGTH; i++) {
          timers.push(
            setTimeout(() => {
              if (manual.current) return;
              setCode(MOCK_CODE.slice(0, i + 1));
            }, i * MOCK_TYPING_MS),
          );
        }
      }, MOCK_ARRIVAL_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [attempt]);

  // Resend cooldown. The clock is reset by resend(), alongside the attempt
  // bump that restarts it — an effect body may not set state directly.
  useEffect(() => {
    const id = setInterval(
      () => setResendIn((s) => (s <= 1 ? 0 : s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [attempt]);

  // Submit as soon as the last digit lands, whoever typed it.
  useEffect(() => {
    if (code.length !== CODE_LENGTH || submitting.current) return;
    submitting.current = true;

    /** Checks the mock code, then trades the registration token for a session. */
    async function verify() {
      if (code !== MOCK_CODE) {
        setError('کد وارد شده درست نیست. دوباره تلاش کنید.');
        setCode('');
        submitting.current = false;
        return;
      }
      if (!token) {
        setError('این صفحه بدون کد تأیید باز شده. دوباره ثبت‌نام کنید.');
        submitting.current = false;
        return;
      }

      setVerifying(true);
      setError(null);
      try {
        const { user } = await api.post<{ user: UserDto }>(
          '/auth/verify-phone',
          { token },
        );
        router.replace(mode === 'signup' ? '/set-password' : homeFor(user.role));
        router.refresh();
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace('/link-expired');
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'اتصال برقرار نشد. دوباره تلاش کنید.',
        );
        setCode('');
        setVerifying(false);
        submitting.current = false;
      }
    }

    void verify();
  }, [code, token, router, mode]);

  /** Requests a fresh code and replays the mock delivery. */
  async function resend() {
    if (resendIn > 0 || verifying) return;
    manual.current = false;
    submitting.current = false;
    setCode('');
    setError(null);
    setArrived(false);
    setResendIn(RESEND_AFTER);
    try {
      const res = await api.post<{ devToken?: string }>(
        '/auth/resend-phone-verification',
        { phone },
      );
      if (res?.devToken) setToken(res.devToken);
    } catch {
      // The endpoint is deliberately non-committal about unknown numbers.
    }
    setAttempt((n) => n + 1);
  }

  return (
    <Notice icon="▣" title="کد تأیید را وارد کنید">
      <p className="mb-5 text-[14.5px] leading-[1.95] text-muted">
        کد {faDigits(CODE_LENGTH)} رقمی را به{' '}
        <span dir="ltr">{phone || 'شمارهٔ موبایلتان'}</span> فرستادیم.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}

      <div dir="ltr" className="mb-5 flex justify-center">
        <InputOTP
          maxLength={CODE_LENGTH}
          value={code}
          onChange={(next) => {
            manual.current = true;
            setError(null);
            setCode(next);
          }}
          disabled={verifying}
          autoFocus
          containerClassName="gap-2.5"
          aria-label="کد تأیید"
        >
          <InputOTPGroup className="gap-2.5">
            {Array.from({ length: CODE_LENGTH }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                aria-invalid={Boolean(error)}
                className={
                  'size-12 border bg-surface text-[19px] font-bold text-ink ' +
                  'rounded-xl first:rounded-l-xl last:rounded-r-xl'
                }
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <p className="flex items-center justify-center gap-2 text-[13px] text-muted">
        {verifying ? (
          <>
            <span
              aria-hidden
              className="size-3.5 animate-[spinIt_.8s_linear_infinite] rounded-full border-2 border-brand/30 border-t-brand"
            />
            در حال تأیید…
          </>
        ) : arrived ? (
          'کد را وارد کنید.'
        ) : (
          <>
            <span
              aria-hidden
              className="size-3.5 animate-[spinIt_.8s_linear_infinite] rounded-full border-2 border-brand/30 border-t-brand"
            />
            در انتظار پیامک…
          </>
        )}
      </p>

      <p className="mt-4 text-[13px] text-muted">
        پیامک نرسید؟{' '}
        {resendIn > 0 ? (
          <span>ارسال دوباره تا {faDigits(resendIn)} ثانیهٔ دیگر</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={verifying}
            className="font-bold text-brand"
          >
            ارسال دوباره
          </button>
        )}{' '}
        ·{' '}
        <Link href="/register" className="font-bold">
          اصلاح شماره
        </Link>
      </p>

      <p className="mt-5 rounded-xl border border-border bg-elev px-3.5 py-2.5 text-[12.5px] leading-[1.9] text-muted">
        حالت نمایشی: پیامکی فرستاده نمی‌شود. کد{' '}
        <span dir="ltr" className="font-bold">
          {MOCK_CODE}
        </span>{' '}
        چند ثانیه بعد خودش وارد می‌شود.
      </p>
    </Notice>
  );
}
/**
 * @file verify-phone-form.tsx
 * @description Implements the six-digit phone verification step with mocked SMS delivery.
 */
