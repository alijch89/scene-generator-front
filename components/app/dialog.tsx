/**
 * @file dialog.tsx
 * @description Wraps the native dialog element with controlled lifecycle and accessible heading primitives.
 */

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Native <dialog>: Escape to close, focus trapping, inert background and the
 * ::backdrop, all without a modal library.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  variant = 'center',
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  /** `drawer` is the right-anchored add-child panel. */
  variant?: 'center' | 'drawer';
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself) closes it.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        'text-ink backdrop:bg-[rgba(20,12,36,.55)] backdrop:backdrop-blur-[2px]',
        variant === 'drawer'
          ? // anchored to the inline start — the right edge in RTL, as designed
            'my-0 ms-0 me-auto h-full max-h-full w-[min(440px,100%)] max-w-full overflow-y-auto border-e border-border bg-bg p-6'
          : 'm-auto w-[min(430px,calc(100%-32px))] rounded-3xl border border-border bg-surface p-6 shadow-card-lg',
      )}
    >
      {children}
    </dialog>
  );
}

/** Renders the title, optional description, and close control for a modal. */
export function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="font-display text-[21px]">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="ms-auto size-8.5 rounded-xl border border-border bg-surface"
      >
        ✕
      </button>
    </div>
  );
}
