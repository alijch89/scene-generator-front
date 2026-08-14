/**
 * @file story-media.tsx
 * @description Builds ownership-protected story video stream and attachment URLs.
 */

import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * The video lives behind the API's ownership check, so this is a plain
 * top-level link rather than a fetch: a same-site GET navigation carries the
 * session cookie, and the API sets Content-Disposition, which is what actually
 * saves the file (the `download` attribute is ignored cross-origin).
 */
export function DownloadButton({
  storyId,
  className,
  children = '⤓ دانلود',
}: {
  storyId: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={`${API_URL}/stories/${storyId}/video?download=1`}
      className={cn('block text-center text-ink hover:no-underline', className)}
    >
      {children}
    </a>
  );
}

/** Credentialed, so the poster and stream stay private to the family. */
/** Builds the credentialed API URL consumed by the native video player. */
export const videoSrc = (storyId: string) =>
  `${API_URL}/stories/${storyId}/video`;
