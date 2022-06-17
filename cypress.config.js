const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "crax1q",
  e2e: {
    baseUrl: "http://localhost:7001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
