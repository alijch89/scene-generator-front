/**
 * @file back-to-top.tsx
 * @description Provides a repeatable, smooth back-to-top control for public pages.
 */

'use client';

import { ArrowUp } from 'lucide-react';

/** Scrolls to the document start on every click while respecting reduced motion. */
export function BackToTopButton() {
  function scrollToTop() {
    const reducedMotion =
      document.documentElement.dataset.motion === 'reduce' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-muted transition-colors hover:text-ink"
    >
      بازگشت به بالا
      <ArrowUp aria-hidden className="size-3.5" />
    </button>
  );
}
