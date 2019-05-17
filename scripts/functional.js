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
const sandbox = require("@adobe/reactor-sandbox");
const argv = require("minimist")(process.argv.slice(2));

const { watch } = argv;
const createTestCafe = require("testcafe");
const build = require("./helpers/build");

const testsDir = path.join(__dirname, "../test/functional");

(async () => {
  await build({ watch });
  await sandbox.run();

  const testcafe = await createTestCafe("localhost", 1337, 1338);
  const runner = watch
    ? testcafe.createLiveModeRunner()
    : testcafe.createRunner();
  const failedCount = await runner
    .src(testsDir)
    .browsers("chrome")
    .run();
  testcafe.close();
  process.exit(failedCount ? 1 : 0);
})();
