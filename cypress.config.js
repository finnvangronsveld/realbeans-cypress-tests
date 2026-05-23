const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    pageLoadTimeout: 180000,
    defaultCommandTimeout: 15000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    blockHosts: [
      "*monorail-edge.shopifysvc.com",
      "*otlp-http-production.shopifysvc.com",
      "*error-analytics-sessions-production.shopifysvc.com",
    ],
    setupNodeEvents(on, config) {
      return config;
    },
  },
});