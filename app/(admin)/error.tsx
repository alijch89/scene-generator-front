/**
 * @file error.tsx
 * @description Client error boundary for the administrator panel route group.
 */

'use client';

import { RouteError } from '@/components/route-error';

/** Keeps a failed request inside the app's own error state. */
export default function GroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="این صفحه بار نشد"
      body="درخواست به سرویس نرسید. دوباره تلاش کنید."
      error={error}
      reset={reset}
    />
  );
}
