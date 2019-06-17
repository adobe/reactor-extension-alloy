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

// Ensure we only get the LIGHTEST spectrum theme in the build output.
process.env.THEME_LIGHTEST = true;

const { spawn } = require("child_process");
const rimraf = require("rimraf");
const Bundler = require("parcel-bundler");
const path = require("path");

const inputDir = path.join(__dirname, "../../src");
const outputDir = path.join(__dirname, "../../dist");
const libInDir = path.join(inputDir, "lib");
const libOutDir = path.join(outputDir, "lib");
const viewEntries = path.join(inputDir, "view/**/*.html");
const viewOutDir = path.join(outputDir, "view");

rimraf.sync(outputDir);

module.exports = (options = {}) => {
  const { watch } = options;
  const parcelPromise = new Promise(resolve => {
    const bundler = new Bundler(viewEntries, {
      publicUrl: "../",
      outDir: viewOutDir,
      watch
    });

    bundler.on("bundled", () => {
      resolve();
    });

    bundler.bundle();
  });

  const babelPromise = new Promise((resolve, reject) => {
    spawn("babel", [libInDir, "--out-dir", libOutDir], {
      stdio: "inherit"
    }).on("exit", code => {
      if (code) {
        reject();
      } else {
        resolve();
      }
    });

    if (watch) {
      spawn(
        "babel",
        [libInDir, "--out-dir", libOutDir, "--watch", "--skip-initial-build"],
        {
          stdio: "inherit"
        }
      );
    }
  });

  return Promise.all([babelPromise, parcelPromise]);
};
