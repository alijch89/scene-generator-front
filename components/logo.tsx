/**
 * @file logo.tsx
 * @description Renders the brand mark shared by every header, sidebar and document lockup.
 */

import Image from 'next/image';
import { cn } from '@/lib/utils';

/** The square Shahrazad-and-storybook brand mark shared across the product. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid size-8.5 shrink-0 overflow-hidden rounded-xl bg-[#FFF6EA]',
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}
