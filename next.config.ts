import type { NextConfig } from 'next';

/** Next.js configuration for the frontend application. */
const nextConfig: NextConfig = {
  // Emits .next/standalone with a self-contained server.js and only the
  // traced node_modules, which is what the Docker runtime stage copies.
  output: 'standalone',
  experimental: {
    // Required for forbidden() / unauthorized() and their file conventions,
    // which the DAL uses to reject cross-role access.
    authInterrupts: true,
  },
};

export default nextConfig;
/**
 * @file next.config.ts
 * @description Enables Next.js features required by the application's authorization boundaries.
 */
