#!/usr/bin/env node

/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import path from "path";
import fsPromises from "fs/promises";
import { rimraf } from "rimraf";
import run from "./helpers/run.mjs";

import { tempDir, inputDir, outputDir } from "./helpers/options.mjs";

const libInDir = path.join(inputDir, "lib");
const libOutDir = path.join(outputDir, "lib");
const alloyTempFile = path.join(tempDir, "alloy.js");
const browserslistrcFile = path.join(libInDir, ".browserslistrc");
const browserslistrcTempFile = path.join(tempDir, ".browserslistrc");

// The package resolution in launch does not follow dependencies on npm packages, so we need to build our
// own Alloy file here.
// I tried having rollup run Babel, but it didn't respect the .browserslistrc located in the src/lib directory.
fsPromises
  .mkdir(tempDir)
  .catch(() => undefined)
  .then(() => fsPromises.copyFile(browserslistrcFile, browserslistrcTempFile))
  .then(() => run("rollup", ["-c"]))
  .then(() =>
    run("babel", [
      alloyTempFile,
      "--out-dir",
      libOutDir,
      "--presets=@babel/preset-env",
      "--compact=false",
    ]),
  )
  .finally(() => rimraf(tempDir));
