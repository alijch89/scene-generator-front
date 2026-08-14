/**
 * @file theme-toggle.tsx
 * @description Renders the client control that toggles and persists light/dark theme state.
 */

'use client';

import { useTheme } from '@/app/providers';
import { cn } from '@/lib/utils';

/** The ☾ / ☀ button that sits in every header in the design. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغییر حالت روشن و تاریک"
      className={cn(
        'grid size-10 place-items-center rounded-[13px] border border-border bg-surface text-gold text-[17px]',
        'transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985]',
        className,
      )}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
