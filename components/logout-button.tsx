/**
 * @file logout-button.tsx
 * @description Renders a client-side logout control that closes the current session and refreshes routing state.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

/** Logs out the current browser session and returns the visitor to the public home page. */
export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await api.post('/auth/logout');
        } finally {
          router.replace('/login');
          router.refresh();
        }
      }}
      className={cn(
        'rounded-xl border border-border bg-elev px-4 py-2 text-[13.5px] font-semibold',
        className,
      )}
    >
      {busy ? 'در حال خروج…' : 'خروج'}
    </button>
  );
}
