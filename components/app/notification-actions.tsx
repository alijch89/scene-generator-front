/**
 * @file notification-actions.tsx
 * @description Provides client-side actions for updating notification read state.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

/** Marks every parent notification read, then refreshes server-rendered data. */
export function MarkAllReadButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await api.post('/notifications/read-all');
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="text-[13px] font-bold text-brand"
    >
      {busy ? 'در حال ثبت…' : 'خواندهٔ همه'}
    </button>
  );
}
