/* eslint-disable */
const { defineConfig } = require('cypress');
const { rm } = require('fs/promises')

// yes use video compression in CI, where we will set the env var so we upload to cypress dashboard
const useVideoCompression = !!process.env.CYPRESS_RECORD_KEY

// https://github.com/cypress-io/cypress/issues/2522
const deleteVideosOnSuccess = (on) => {
  const filesToDelete = []
  on('after:spec', (_spec, results) => {
    if (results.stats.failures === 0 && results.video) {
      filesToDelete.push(results.video)
    }
  })
  on('after:run', async () => {
    if (filesToDelete.length) {
      console.log(
        'after:run hook: Deleting %d video(s) from successful specs',
        filesToDelete.length
      )
      await Promise.all(filesToDelete.map((videoFile) => rm(videoFile)))
    }
  })
}

module.exports = defineConfig({
  projectId: 'crax1q',

  // since it's slow
  videoCompression: useVideoCompression,

  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:7001',
    setupNodeEvents(on, config) {
      deleteVideosOnSuccess(on)
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },

  // this scrolls away from the elements for some reason with carbon when set to top
  // https://github.com/cypress-io/cypress/issues/2353
  // https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Scrolling
  scrollBehavior: "center",
});
