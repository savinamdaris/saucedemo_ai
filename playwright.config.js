import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only with enhanced retry logic */
  retries: process.env.CI ? (process.env.RETRIES ? parseInt(process.env.RETRIES) : 3) : 1,
  /* Workers configuration with performance optimization */
  workers: process.env.CI 
    ? (process.env.WORKERS ? parseInt(process.env.WORKERS) : 2)
    : process.env.WORKERS ? parseInt(process.env.WORKERS) : '50%',
  
  /* Test sharding configuration */
  shard: process.env.SHARD ? {
    current: parseInt(process.env.SHARD_CURRENT) || 1,
    total: parseInt(process.env.SHARD_TOTAL) || 1
  } : undefined,
  
  /* Performance timeout configurations */
  timeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : 30000,
  expect: {
    timeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 10000,
  },
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['github'],
    ['list']
  ] : [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  /* Performance and retry optimizations */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: process.env.CI ? 'only-on-failure' : 'only-on-failure',
    
    /* Record video configuration */
    video: process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
    
    /* Global timeout for each action with performance optimization */
    actionTimeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30000,
    
    /* Global timeout for navigation with performance optimization */
    navigationTimeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30000,
    
    /* Performance optimizations */
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    
    /* Retry configuration per action */
    contextOptions: {
      reducedMotion: 'reduce',
      forcedColors: 'none',
    },
  },

  /* Configure projects for major browsers with performance optimization */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        /* Performance optimizations for Chromium */
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-dev-shm-usage',
            '--no-sandbox',
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        /* Performance optimizations for Firefox */
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
            'permissions.default.microphone': 1,
            'permissions.default.camera': 1,
          },
        },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        /* Performance optimizations for WebKit */
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    /* Mobile testing with performance optimization */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        launchOptions: {
          args: ['--disable-web-security', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    /* Performance testing project */
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
          ],
        },
      },
      testMatch: '**/*.perf.spec.js',
    },
  ],

  /* Global setup and teardown */
  globalSetup: process.env.GLOBAL_SETUP ? './utils/globalSetup.js' : undefined,
  globalTeardown: process.env.GLOBAL_TEARDOWN ? './utils/globalTeardown.js' : undefined,
});
