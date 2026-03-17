import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3001',
  },
  outputDir: 'test-results/',
  testMatch: '**/tests/**/*.@(spec|test).@(ts|js)',
  testIgnore: ['**/src/**', '**/*.test.js', '**/*.test.ts'],
  webServer: [
    {
      command: 'dotnet run',
      cwd: '../backend',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'npm start -- --host 127.0.0.1',
      cwd: '.',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
