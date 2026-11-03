import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://cpcimpex.com',
    // Сайт отдаёт пустую страницу headless-браузеру (заголовки со словом
    // "HeadlessChrome"), поэтому представляемся обычным Chrome.
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    extraHTTPHeaders: { 'sec-ch-ua': '"Chromium";v="140", "Not:A-Brand";v="8"' },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
