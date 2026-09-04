/**
 * @file display-font-preload.tsx
 * @description Preloads the display face for the layouts whose first paint contains display type.
 */

/**
 * Baloo Bhaijaan 2 backs the `font-display` utility, which the admin panel
 * never uses — so the root layout keeps it off the critical path and the
 * layouts that open on a display heading ask for it here. React hoists the tag
 * into <head>, so this renders correctly from anywhere in the tree.
 *
 * A rendered <link> rather than react-dom's `preload()`: that helper only
 * flushes from a client component, and a preload hint is not worth shipping
 * JavaScript for. A statically prerendered page emits the tag twice, once from
 * the element and once from React's own resource flush — the browser keys
 * preloads by URL, so it is still a single fetch.
 */
export function DisplayFontPreload() {
  return (
    <link
      rel="preload"
      href="/fonts/baloo-bhaijaan-2-v21-arabic.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  );
}
