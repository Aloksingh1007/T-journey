/**
 * Lighthouse CI Configuration
 * Run with: npx lighthouse <url> --config-path=lighthouse.config.js
 */

export default {
  extends: 'lighthouse:default',
  settings: {
    // Performance budgets
    budgets: [
      {
        resourceSizes: [
          {
            resourceType: 'script',
            budget: 300, // 300 KB for JS
          },
          {
            resourceType: 'stylesheet',
            budget: 50, // 50 KB for CSS
          },
          {
            resourceType: 'image',
            budget: 200, // 200 KB for images
          },
          {
            resourceType: 'total',
            budget: 800, // 800 KB total
          },
        ],
        timings: [
          {
            metric: 'first-contentful-paint',
            budget: 2000, // 2 seconds
          },
          {
            metric: 'largest-contentful-paint',
            budget: 2500, // 2.5 seconds
          },
          {
            metric: 'interactive',
            budget: 3500, // 3.5 seconds
          },
          {
            metric: 'cumulative-layout-shift',
            budget: 0.1, // CLS score
          },
        ],
      },
    ],
    // Only run performance, accessibility, best-practices, and SEO
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    // Emulate mobile device
    formFactor: 'mobile',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
    },
  },
};
