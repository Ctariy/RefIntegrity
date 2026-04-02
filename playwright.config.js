import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 30000 },
  retries: 1,
  use: {
    baseURL: 'https://refintegrity.com',
  },
});
