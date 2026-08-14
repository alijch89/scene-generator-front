/**
 * @file page.tsx
 * @description Implements phone-token verification, resend behavior, and authenticated wizard handoff.
 */

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Alert, Notice, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { homeFor, type UserDto } from '@/lib/session';

/** Reads verification context from the URL and manages verify/resend outcomes. */
function Verify() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const phone = params.get('phone') ?? 'شمارهٔ موبایلتان';

  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Consumes the verification token and routes the resulting session to the wizard. */
  async function confirm() {
    if (!token) {
      setError('لینک تأیید را از پیامک باز کنید.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { user } = await api.post<{ user: UserDto }>('/auth/verify-phone', {
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

  /** Requests a replacement verification token for the URL phone number. */
  async function resend() {
    try {
      await api.post('/auth/resend-phone-verification', { phone });
      setResent(true);
    } catch {
      setResent(true); // the endpoint is deliberately non-committal
    }
  }

  return (
    <Notice icon="▣" title="شمارهٔ موبایلتان را تأیید کنید">
      <p className="mb-[22px] text-[14.5px] leading-[1.95] text-muted">
        یک لینک تأیید به <span dir="ltr">{phone}</span> فرستادیم. بعد از تأیید،
        اولین قصه را می‌سازیم.
      </p>

      {error && (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      )}
      {resent && (
        <Alert icon="▣">
          اگر این شماره ثبت شده باشد، لینک تازه فرستاده شد.
        </Alert>
      )}

      <SubmitButton
        loading={loading}
        onClick={confirm}
        loadingLabel="در حال تأیید…"
        className="w-full"
      >
        تأیید کردم، ادامه
      </SubmitButton>

      <p className="mt-4 text-[13px] text-muted">
        پیامک نرسید؟{' '}
        <button type="button" onClick={resend} className="font-bold text-brand">
          ارسال دوباره
        </button>{' '}
        ·{' '}
        <Link href="/register" className="font-bold">
          اصلاح شماره
        </Link>
      </p>
    </Notice>
  );
}

/** Provides a suspense boundary for the search-parameter-dependent verification form. */
export default function VerifyPhonePage() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}
