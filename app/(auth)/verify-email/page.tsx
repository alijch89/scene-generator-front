'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Alert, Notice, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { homeFor, type UserDto } from '@/lib/session';

function Verify() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? 'ایمیلتان';

  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!token) {
      setError('لینک تأیید را از ایمیلتان باز کنید.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { user } = await api.post<{ user: UserDto }>('/auth/verify-email', {
        token,
      });
      router.replace(homeFor(user.role));
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
      setLoading(false);
    }
  }

  async function resend() {
    try {
      await api.post('/auth/resend-verification', { email });
      setResent(true);
    } catch {
      setResent(true); // the endpoint is deliberately non-committal
    }
  }

  return (
    <Notice icon="✉" title="ایمیلتان را تأیید کنید">
      <p className="mb-[22px] text-[14.5px] leading-[1.95] text-muted">
        یک لینک تأیید به {email} فرستادیم. بعد از تأیید، اولین قصه را می‌سازیم.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}
      {resent && <Alert icon="✉">اگر این ایمیل ثبت شده باشد، لینک تازه رفت.</Alert>}

      <SubmitButton
        loading={loading}
        onClick={confirm}
        loadingLabel="در حال تأیید…"
        className="w-full"
      >
        تأیید کردم، ادامه
      </SubmitButton>

      <p className="mt-4 text-[13px] text-muted">
        ایمیل نرسید؟{' '}
        <button type="button" onClick={resend} className="font-bold text-brand">
          ارسال دوباره
        </button>{' '}
        ·{' '}
        <Link href="/register" className="font-bold">
          اصلاح ایمیل
        </Link>
      </p>
    </Notice>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}
