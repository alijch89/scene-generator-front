/**
 * @file theme-toggle.tsx
 * @description Renders the client control that toggles and persists light/dark theme state.
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/providers';
import { cn } from '@/lib/utils';

/** The light/dark control shared by every application header. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغییر حالت روشن و تاریک"
      className={cn(
        'inline-grid size-10 place-items-center rounded-full border border-border bg-surface p-0 leading-none text-gold',
        'transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985]',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun aria-hidden className="block size-[18px]" strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden className="block size-[18px]" strokeWidth={1.8} />
      )}
    </button>
  );
}
