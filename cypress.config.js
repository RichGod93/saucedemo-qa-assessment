const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      on('task', {
        getEnv(key) {
          return config.env[key] ?? null;
        }
      });
      return config;
    }
  }
});
