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
import path from "path";
import minimist from "minimist";
import chalk from "chalk";
import { Parcel } from "@parcel/core";
import { createRequire } from "module";
import EventEmitter from "node:events";
import { fileURLToPath } from "url";
import createTestCafe from "testcafe";
import build from "./helpers/build.mjs";
import saveAndRestoreFile from "./helpers/saveAndRestoreFile.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const argv = minimist(process.argv.slice(2));
const sandbox = require("@adobe/reactor-sandbox");
const adobeIOClientCredentials = require("../test/functional/helpers/adobeIOClientCredentials");

EventEmitter.defaultMaxListeners = 30;

const defaultSpecsPath = path.join(
  __dirname,
  "../test/functional/**/*.spec.js",
);
const {
  watch,
  firefox,
  chrome,
  safari,
  edge,
  testName: testNameFilter,
  specsPath = defaultSpecsPath,
} = argv;

const componentFixturePath = path.join(
  __dirname,
  "../test/functional/helpers/components/fixture.html",
);
const componentFixtureOutputDir = path.join(
  __dirname,
  "../componentFixtureDist",
);

const buildComponentFixtures = async () => {
  const bundler = new Parcel({
    entries: componentFixturePath,
    defaultConfig: "@parcel/config-default",
    // Development mode is required to keep the data-test-id props
    mode: "development",
    defaultTargetOptions: {
      publicUrl: "./",
      distDir: componentFixtureOutputDir,
    },
    sourceMaps: true,
  });
  return bundler.run();
};

(async () => {
  await build({ watch });
  await buildComponentFixtures();
  // Running the runtime tests requires us to re-write this file.
  // This will save the file and restore it after the tests are complete.
  saveAndRestoreFile({ file: path.resolve(".sandbox", "container.js") });
  await sandbox.init();

  const testcafe = await createTestCafe();

  const runner = watch
    ? testcafe.createLiveModeRunner()
    : testcafe.createRunner();

  let concurrency;
  let browsers;

  if (chrome) {
    browsers = "saucelabs:chrome@123:Mac 13";
    concurrency = 4;
  } else if (firefox) {
    browsers = "saucelabs:firefox@123:Mac 13";
    concurrency = 4;
  } else if (safari) {
    browsers = "saucelabs:safari@17:Mac 13";
    concurrency = 4;
  } else if (edge) {
    browsers = "saucelabs:MicrosoftEdge@121:Windows 11";
    concurrency = 4;
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
              fullTestName,
            )} will be skipped. It requires an Adobe I/O integration and no environment variables containing Adobe I/O integration details were found.`,
          ),
        );
        return false;
      }

      return true;
    })
    .browsers(browsers)
    .concurrency(concurrency)
    .run({
      skipJsErrors: true,
      quarantineMode: false,
      selectorTimeout: 50000,
      assertionTimeout: 7000,
      pageLoadTimeout: 8000,
      speed: 0.75,
      stopOnFirstFail: false,
    });
  testcafe.close();
  process.exit(failedCount ? 1 : 0);
})();
