import type { NextConfig } from 'next';

/**
 * Origin the browser loads media and JSON from. Part of the CSP because the
 * API is a different origin in every deployment of this stack.
 */
const apiOrigin = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
    ).origin;
  } catch {
    return 'http://localhost:3001';
  }
})();

/**
 * Sent on every response.
 *
 * Neither tier set any of these before, which left the payment and
 * account-deletion flows framable, the media endpoints MIME-sniffable, and a
 * first visit over HTTP downgradeable.
 *
 * `unsafe-inline` for styles is Next's requirement for its own injected
 * critical CSS; scripts get `unsafe-inline` only because the anti-FOUC script
 * in `app/layout.tsx` carries no nonce yet, and `unsafe-eval` is dropped
 * entirely — nothing in the bundle needs it.
 */
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `connect-src 'self' ${apiOrigin}`,
      `img-src 'self' data: blob: ${apiOrigin}`,
      `media-src 'self' blob: ${apiOrigin}`,
      "font-src 'self' https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

/** Next.js configuration for the frontend application. */
const nextConfig: NextConfig = {
  // Emits .next/standalone with a self-contained server.js and only the
  // traced node_modules, which is what the Docker runtime stage copies.
  output: 'standalone',
  // Version disclosure buys an attacker a CVE list and buys us nothing.
  poweredByHeader: false,
  experimental: {
    // Required for forbidden() / unauthorized() and their file conventions,
    // which the DAL uses to reject cross-role access.
    authInterrupts: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
/**
 * @file next.config.ts
 * @description Enables Next.js features required by the application's authorization boundaries and sets response security headers.
 */
