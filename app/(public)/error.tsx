/**
 * @file error.tsx
 * @description Client error boundary for the public marketing route group.
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
      body="ارتباط با سرویس برقرار نشد."
      error={error}
      reset={reset}
    />
  );
}
