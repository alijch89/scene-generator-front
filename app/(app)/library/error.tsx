/**
 * @file error.tsx
 * @description Renders the client error boundary for failed story-library data requests.
 */

'use client';

import { RouteError } from '@/components/route-error';

/** «کتابخانه بار نشد» — the design's error state, wired to Next's reset(). */
export default function LibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="کتابخانه بار نشد"
      body="اتصال قطع شد. قصه‌های شما جای خود هستند."
      error={error}
      reset={reset}
    />
  );
}
