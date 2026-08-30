/**
 * @file user-password-reset.tsx
 * @description Implements the administrator password reset shown on a user's account file.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PasswordInput } from '@/components/form';
import { api } from '@/lib/api';

/** Length the API enforces, mirrored here so the button can say why it is off. */
const MIN_LENGTH = 8;

/**
 * «بازنشانی گذرواژه» — the recovery path, now that no reset link can be sent.
 *
 * The new password is shown back to the administrator once, because they have
 * to read it out to the account holder; the account is forced to replace it at
 * its next sign-in, so what is on screen here stops being a credential the
 * moment it is used.
 */
export function UserPasswordReset({
  userId,
  pending,
}: {
  userId: string;
  /** A reset from an earlier visit that the account has not replaced yet. */
  pending: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [issued, setIssued] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tooShort = password.length > 0 && password.length < MIN_LENGTH;

  /** Sends the replacement password and refreshes the audited detail view. */
  async function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/admin/users/${userId}/password`, { password });
      setIssued(password);
      setPassword('');
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'انجام نشد.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-3.5">
      {pending && !issued ? (
        <p className="mb-3 rounded-lg border border-warning bg-elev px-3.5 py-2.5 text-[11.5px] leading-[1.9] text-muted">
          گذرواژهٔ این حساب را مدیر بازنشانی کرده و کاربر هنوز گذرواژهٔ خودش را
          نگذاشته است. تا آن موقع فقط صفحهٔ «تغییر گذرواژه» برایش باز است.
        </p>
      ) : null}

      {issued ? (
        <div className="mb-3 rounded-lg border border-success bg-elev px-3.5 py-3">
          <strong className="block text-[12.5px]">
            گذرواژهٔ تازه ساخته شد
          </strong>
          <p className="mt-1.5 text-[11.5px] leading-[1.9] text-muted">
            آن را به کاربر بدهید. همهٔ نشست‌های باز بسته شد و کاربر در اولین
            ورود باید گذرواژهٔ خودش را بگذارد.
          </p>
          <code dir="ltr" className="mt-2 block text-[13px] font-bold">
            {issued}
          </code>
        </div>
      ) : null}

      {open ? (
        <form onSubmit={apply} className="flex flex-col gap-2.5">
          <label className="text-[12px] font-semibold" htmlFor="new-password">
            گذرواژهٔ تازه
          </label>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            required
            minLength={MIN_LENGTH}
            placeholder="حداقل ۸ نویسه"
            value={password}
            invalid={tooShort}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy || password.length < MIN_LENGTH}
              className="rounded-lg border border-border bg-elev px-3.5 py-2.25 text-[12.5px] font-semibold disabled:opacity-60"
            >
              {busy ? 'در حال بازنشانی…' : 'بازنشانی گذرواژه'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setPassword('');
                setError(null);
              }}
              className="rounded-lg border border-border bg-surface px-3.5 py-2.25 text-[12.5px] font-semibold"
            >
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setIssued(null);
          }}
          className="rounded-lg border border-border bg-elev px-3.5 py-2.25 text-[12.5px] font-semibold"
        >
          بازنشانی گذرواژه
        </button>
      )}

      {error ? (
        <p role="alert" className="mt-2 text-[12px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
