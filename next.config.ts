import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Required for forbidden() / unauthorized() and their file conventions,
    // which the DAL uses to reject cross-role access.
    authInterrupts: true,
  },
};

export default nextConfig;
