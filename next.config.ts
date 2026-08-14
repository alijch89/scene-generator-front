import type { NextConfig } from 'next';

/** Next.js configuration for the frontend application. */
const nextConfig: NextConfig = {
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
