#!/usr/bin/env node

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const path = require("path");
const argv = require("minimist")(process.argv.slice(2));
const chalk = require("chalk");
const { Parcel } = require("@parcel/core");

require("events").EventEmitter.defaultMaxListeners = 30;

const defaultSpecsPath = path.join(
  __dirname,
  "../test/functional/**/*.spec.js"
);
const {
  watch,
  firefox,
  chrome,
  safari,
  edge,
  testName: testNameFilter,
  specsPath = defaultSpecsPath
} = argv;
const createTestCafe = require("testcafe");
const build = require("./helpers/build");
const saveAndRestoreFile = require("./helpers/saveAndRestoreFile");
const adobeIOClientCredentials = require("../test/functional/helpers/adobeIOClientCredentials");

const componentFixturePath = path.join(
  __dirname,
  "../test/functional/components/helpers/fixture.html"
);
const runtimeFixturePath = path.join(
  __dirname,
  "../test/functional/runtime/helpers/fixture.html"
);
const componentFixtureOutputDir = path.join(
  __dirname,
  "../componentFixtureDist"
);

const buildComponentFixtures = async () => {
  const bundler = new Parcel({
    entries: [componentFixturePath, runtimeFixturePath],
    defaultConfig: "@parcel/config-default",
    // Development mode is required to keep the data-test-id props
    mode: "development",
    defaultTargetOptions: {
      publicUrl: "./",
      distDir: componentFixtureOutputDir
    },
    sourceMaps: true
  });
  return bundler.run();
};

(async () => {
  await build({ watch });
  await buildComponentFixtures();
  // Running the runtime tests requires us to re-write this file.
  // This will save the file and restore it after the tests are complete.
  saveAndRestoreFile({ file: path.resolve(".sandbox", "container.js") });

  const testcafe = await createTestCafe();

  const runner = watch
    ? testcafe.createLiveModeRunner()
    : testcafe.createRunner();

  let concurrency;
  let browsers;

  if (chrome) {
    browsers = "saucelabs:Chrome@latest:macOS 11.00";
    concurrency = 6;
  } else if (firefox) {
    browsers = "saucelabs:Firefox@latest:macOS 11.00";
    concurrency = 2;
  } else if (safari) {
    browsers = "saucelabs:Safari@latest:macOS 11.00";
    concurrency = 6;
  } else if (edge) {
    browsers = "saucelabs:MicrosoftEdge@latest:Windows 10";
    concurrency = 6;
  } else {
    concurrency = 1;
    browsers = "chrome";
  }

  const failedCount = await runner
    .src(specsPath)
    .filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
      if (testNameFilter && testNameFilter !== testName) {
        return false;
      }
      const requiresAdobeIOIntegration =
        fixtureMeta.requiresAdobeIOIntegration ||
        testMeta.requiresAdobeIOIntegration;

      if (requiresAdobeIOIntegration && !adobeIOClientCredentials) {
        // Using console.log instead of console.warn here because console.warn is an alias for console.error, which
        // means it outputs to stderr and this isn't technically an error.
        const fullTestName = `${fixtureName} ${testName}`;
        // eslint-disable-next-line no-console
        console.log(
          chalk.yellowBright(
            `The test named ${chalk.bold(
              fullTestName
            )} will be skipped. It requires an Adobe I/O integration and no environment variables containing Adobe I/O integration details were found.`
          )
        );
        return false;
      }

      return true;
    })
    .browsers(browsers)
    .concurrency(concurrency)
    .run({
      skipJsErrors: true,
      quarantineMode: true,
      selectorTimeout: 50000,
      assertionTimeout: 7000,
      pageLoadTimeout: 8000,
      speed: 1,
      stopOnFirstFail: true
    });
  testcafe.close();
  process.exit(failedCount ? 1 : 0);
})();
