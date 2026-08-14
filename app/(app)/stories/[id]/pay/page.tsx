import { notFound, redirect } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';

/**
 * Sends the parent to the gateway for a story that has not been paid for —
 * used by the wizard's retry paths and by the library card's unpaid state.
 *
 * Safe on a GET: the API hands back the existing unpaid order rather than
 * opening a second one, and refuses outright once the story is paid for.
 */
/** Server redirect page used by retry-payment actions for an existing story. */
export default async function PayPage({ params }: PageProps<'/stories/[id]/pay'>) {
  const { id } = await params;

  const { payUrl } = await sapi
    .post<{ payUrl: string }>(`/stories/${id}/order`)
    .catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound();
      // Already paid — the story is either building or done.
      if (err instanceof ApiError && err.status === 400) {
        redirect(`/stories/${id}/generating`);
      }
      throw err;
    });

  redirect(payUrl);
}
/**
 * @file page.tsx
 * @description Re-fetches an owned story payment URL on the server and redirects the browser to it.
 */
