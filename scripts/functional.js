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
const Bundler = require("parcel-bundler");

require("events").EventEmitter.defaultMaxListeners = 30;

const defaultSpecsPath = path.join(
  __dirname,
  "../test/functional/**/*.spec.js"
);
const {
  watch,
  saucelabs,
  testName: testNameFilter,
  specsPath = defaultSpecsPath
} = argv;
const createTestCafe = require("testcafe");
const build = require("./helpers/build");
const adobeIOClientCredentials = require("../test/functional/helpers/adobeIOClientCredentials");

const componentFixturePath = path.join(
  __dirname,
  "../test/functional/components/helpers/fixture.html"
);
const componentFixtureOutputDir = path.join(
  __dirname,
  "../componentFixtureDist"
);

const buildComponentFixtures = async () => {
  return new Promise(resolve => {
    const bundler = new Bundler(componentFixturePath, {
      publicUrl: "./",
      outDir: componentFixtureOutputDir,
      watch,
      // HMR seems to be broken: https://github.com/parcel-bundler/parcel/issues/2894
      hmr: false,
      sourceMaps: false
    });

    bundler.on("bundled", () => {
      resolve();
    });

    bundler.bundle();
  });
};

(async () => {
  await build({ watch });
  await buildComponentFixtures();

  const testcafe = await createTestCafe();

  const runner = watch
    ? testcafe.createLiveModeRunner()
    : testcafe.createRunner();

  let concurrency;
  let browsers;
  let reporter;

  if (saucelabs) {
    browsers = [
      "saucelabs:Chrome@latest:macOS 11.00",
      "saucelabs:MicrosoftEdge@latest:Windows 10",
      "saucelabs:Firefox@latest:macOS 11.00",
      "saucelabs:Safari@latest:macOS 11.00"
    ];
    concurrency = 2;
    reporter = "saucelabs";
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
    .reporter(reporter)
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
