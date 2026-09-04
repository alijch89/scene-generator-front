/**
 * @file route-error.tsx
 * @description Shared client error boundary body used by every route group.
 */

'use client';

import { useEffect } from 'react';

/**
 * The visible half of a Next error boundary.
 *
 * Only `app/(app)/library` had one, so a failed request anywhere else — a
 * child profile, checkout, the whole admin panel — rendered Next's default
 * error screen, which is an English stack-trace page in a right-to-left
 * Persian product. This keeps the failure inside the app's own voice and
 * gives the reader the one useful action: try again.
 *
 * `digest` is Next's server-error identifier; it is logged rather than shown,
 * because it means nothing to a parent and everything to whoever reads the
 * server logs.
 */
export function RouteError({
  title,
  body,
  error,
  reset,
}: {
  title: string;
  body: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error.digest ? `${error.message} [${error.digest}]` : error);
  }, [error]);

  return (
    <div
      role="alert"
      className="rounded-[26px] border border-error bg-surface px-5 py-12 text-center"
    >
      <h2 className="mb-2.5 text-[19px] font-bold">{title}</h2>
      <p className="mb-5 text-[14.5px] text-muted">{body}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-[14px] border border-border bg-elev px-6 py-3.5 text-[14px] font-bold"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
