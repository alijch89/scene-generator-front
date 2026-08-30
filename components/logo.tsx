/**
 * @file logo.tsx
 * @description Renders the brand mark shared by every header, sidebar and document lockup.
 */

import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * The square brand mark. The artwork in /public/logo.jpeg is a 1408×768 banner
 * with the emblem drawn in the middle of a wide cream margin, so a square frame
 * crops to the centre and scale-125 trims that margin back to the drawn circle.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid size-8.5 shrink-0 overflow-hidden rounded-xl bg-[#F9F6E7]',
        className,
      )}
    >
      <Image
        src="/logo.jpeg"
        alt=""
        fill
        sizes="48px"
        className="scale-125 object-cover"
      />
    </span>
  );
}
