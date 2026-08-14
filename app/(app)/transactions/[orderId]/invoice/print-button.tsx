/**
 * @file print-button.tsx
 * @description Provides the browser print action used by the parent invoice page.
 */

'use client';

/**
 * The browser's own print dialog is the whole feature — it already offers
 * "save as PDF" everywhere, which is what «دریافت فاکتور» actually means. No
 * PDF library, no server round trip, and it prints what the parent can see.
 */
export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      چاپ یا ذخیرهٔ PDF
    </button>
  );
}
