/**
 * @file providers.tsx
 * @description Supplies RTL direction and persistent light/dark theme state to all client components.
 */

'use client';

import { DirectionProvider } from '@radix-ui/react-direction';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

/** Supported visual themes stored on the root data-theme attribute. */
export type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

/** Returns the current theme and the operation that toggles it. */
export const useTheme = () => useContext(ThemeContext);

/** Wraps the application in theme state and Radix's right-to-left direction. */
export function Providers({ children }: { children: React.ReactNode }) {
  // Starts as light and is corrected on mount from what the pre-hydration
  // script already stamped on <html>, so the two never disagree visually.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stamped = document.documentElement.dataset.theme;
    // The inline pre-hydration script is the external source of truth here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stamped === 'dark' || stamped === 'light') setTheme(stamped);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // private mode — the choice just won't survive a reload
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <DirectionProvider dir="rtl">{children}</DirectionProvider>
    </ThemeContext.Provider>
  );
}
