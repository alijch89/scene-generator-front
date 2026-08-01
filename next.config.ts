import type { NextConfig } from "next";
import path from "node:path";

/**
 * Next.js production and Turbopack configuration.
 *
 * Standalone output supports minimal container deployment; the explicit
 * Turbopack root keeps module resolution inside this frontend project.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
