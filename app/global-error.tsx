/**
 * @file global-error.tsx
 * @description Last-resort boundary for failures in the root layout itself.
 */

'use client';

/**
 * Replaces the entire document when the root layout fails, so it has to carry
 * its own `<html>` and `<body>` — none of the app's providers, fonts, or
 * stylesheets are mounted at this point. Deliberately styled inline for the
 * same reason.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <main style={{ padding: '24px', maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>
            برنامه بالا نیامد
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 2, opacity: 0.75 }}>
            مشکلی پیش آمد که نتوانستیم داخل برنامه نشانش دهیم.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '18px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '14px',
              border: '1px solid currentColor',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            تلاش دوباره
          </button>
        </main>
      </body>
    </html>
  );
}
