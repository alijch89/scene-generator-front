/**
 * @file error.tsx
 * @description Root error boundary for failures that escape a route-group boundary.
 */

'use client';

import { RouteError } from '@/components/route-error';

/** Handles errors thrown by nested route-group layouts while preserving the root document. */
export default function RootError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="public-site aurora relative isolate grid min-h-svh place-items-center px-5 py-10">
      <div className="relative z-[2] w-full max-w-[520px]">
        <RouteError
          title="قصه یک لحظه متوقف شد"
          body="یک اتفاق پیش‌بینی‌نشده افتاد. دوباره تلاش کن؛ اطلاعاتت سر جای خودشان هستند."
          error={error}
          reset={retry}
        />
      </div>
    </main>
  );
}
