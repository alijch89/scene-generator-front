import { useCallback, useEffect, useRef } from 'react';

/**
 * Keeps a <details> disclosure honest on touch: it stays uncontrolled — the
 * element still owns its own open state and keyboard handling — and this only
 * ever closes it, when a pointer goes down anywhere outside or Escape is hit.
 */
export function useDismissDetails() {
  const ref = useRef<HTMLDetailsElement>(null);

  /** Closes the panel; for clicks *inside* it, which the listener ignores. */
  const close = useCallback(() => {
    if (ref.current) ref.current.open = false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // pointerdown, not click, so the panel is already gone by the time the tap
    // lands on whatever sits underneath — and a scroll or drag dismisses it too.
    const onPointerDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) el.open = false;
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return { ref, close };
}
/**
 * @file use-dismiss.ts
 * @description Provides a ref that closes a <details> disclosure on outside pointer events and Escape.
 */
