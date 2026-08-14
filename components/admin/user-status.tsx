'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { AdminUserDetailDto } from '@/lib/types';

/**
 * «غیرفعال کردن» / «فعال کردن». Suspending revokes every open session on the
 * spot and login refuses the account afterwards, so this is a real switch and
 * the confirm step is not decoration.
 */
export function UserStatusButton({ user }: { user: AdminUserDetailDto }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suspending = user.status === 'ACTIVE';

  async function apply() {
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/admin/users/${user.id}/status`, {
        status: suspending ? 'SUSPENDED' : 'ACTIVE',
      });
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'انجام نشد.');
    } finally {
      setBusy(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-muted">
          {suspending
            ? 'همهٔ نشست‌های باز این حساب بسته می‌شود. مطمئنید؟'
            : 'این حساب دوباره می‌تواند وارد شود. مطمئنید؟'}
        </span>
        <button
          type="button"
          onClick={apply}
          disabled={busy}
          className="rounded-lg border border-error bg-surface px-3.5 py-2.25 text-[12.5px] font-semibold text-error disabled:opacity-60"
        >
          {busy ? 'در حال انجام…' : 'بله، انجام بده'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-border bg-elev px-3.5 py-2.25 text-[12.5px] font-semibold"
        >
          انصراف
        </button>
        {error ? (
          <span role="alert" className="text-[12px] text-error">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={
          suspending
            ? 'rounded-lg border border-error bg-surface px-3.5 py-2.25 text-[12.5px] font-semibold text-error'
            : 'rounded-lg border border-border bg-elev px-3.5 py-2.25 text-[12.5px] font-semibold'
        }
      >
        {suspending ? 'غیرفعال کردن حساب' : 'فعال کردن حساب'}
      </button>
      {error ? (
        <span role="alert" className="text-[12px] text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}
