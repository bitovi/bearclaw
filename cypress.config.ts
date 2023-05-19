import { defineConfig } from "cypress";
const { rmdir, existsSync } = require("fs");

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
        chromeWebSecurity: false, // needed in order to assert against Stripe elements within iFrame
      };

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      // cy.task('deleteFolder', folderName)

      on("task", {
        log: (message) => {
          console.log(message);

          return null;
        },
        deleteFolder(folderName) {
          console.log("deleting folder %s", folderName);
          // clears our cypress/downloads folder after testing the downloading of an attachment, if the folder exists
          if (existsSync(folderName)) {
            return new Promise((resolve, reject) => {
              rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
                if (err) {
                  console.error(err);
                  return reject(err);
                }
                resolve(null);
              });
            });
          }
        },
      });

      return { ...config, ...configOverrides };
    },
  },
});
