"use strict"

const { defineConfig } = require("cypress")
const setupNodeEvents  = require("./test/e2e/plugins/index.js")

module.exports = defineConfig({
  fileServerFolder: "test/e2e/static",
  fixturesFolder: "test/e2e/fixtures",
  screenshotsFolder: "test/e2e/screenshots",
  videosFolder: "test/e2e/videos",
  e2e: {
    baseUrl: "http://localhost:3001/",
    supportFile: "test/e2e/support/e2e.js",
    specPattern: "test/e2e/tests/**/*.js",
    setupNodeEvents,
  },
})
