import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.FRONTEND_E2E_BASE_URL ?? 'http://127.0.0.1:3000';
const useExternalServer = Boolean(process.env.FRONTEND_E2E_BASE_URL);
const systemChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/usr/bin/google-chrome';

/** Browser-level configuration. Full-stack runs point this at a running Next/Nest stack. */
export default defineConfig({
  testDir: './',
  testMatch: '**/*.e2e.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['line']] : 'list',
  use: {
    baseURL,
    launchOptions: existsSync(systemChromium)
      ? { executablePath: systemChromium }
      : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: 'npm run dev -- --hostname 127.0.0.1 --port 3000',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
