import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for end-to-end tests against the running app.
 * Boots the .NET backend (port 3000) and the Vite frontend (port 3001)
 * automatically, then runs the smoke tests against the frontend URL.
 */
export default defineConfig({
  testDir: './',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'dotnet run',
      cwd: '../backend',
      url: 'http://localhost:3000/',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: 'http://localhost:3001/',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
