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
const fsPromises = require("fs").promises;

const inputDir = path.join(__dirname, "../../src");
const tempDir = path.join(__dirname, "../../temp");
const outputDir = path.join(__dirname, "../../dist");
const libInDir = path.join(inputDir, "lib");
const libOutDir = path.join(outputDir, "lib");
const viewEntries = path.join(inputDir, "view/**/*.html");
const viewOutDir = path.join(outputDir, "view");
const alloyInFile = path.join(libInDir, "alloy.js");
const alloyTempFile = path.join(tempDir, "alloy.js");
const browserslistrcFile = path.join(libInDir, ".browserslistrc");
const browserslistrcTempFile = path.join(tempDir, ".browserslistrc");

const toPromise = func => {
  return new Promise((resolve, reject) => {
    const callback = error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    func(callback);
  });
};

const run = (command, options) => {
  return toPromise(callback =>
    spawn(command, options, { stdio: "inherit" }).on("exit", callback)
  );
};

rimraf.sync(outputDir);

module.exports = (options = {}) => {
  const { watch } = options;
  const parcelPromise = new Promise(resolve => {
    const bundler = new Bundler(viewEntries, {
      // By default, Parcel updates script tags on HTML files to reference post-processed JavaScript files
      // by using an absolute directory. We can't use absolute directories, because our extension's view files
      // are deployed by Launch to Akamai under a deep subdirectory. We use publicUrl to ensure we use a relative
      // path for loading JavaScript files.
      publicUrl: "../",
      outDir: viewOutDir,
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

  // ignore alloy.js because it will be built separately below.
  const babelPromise = run("babel", [
    libInDir,
    "--out-dir",
    libOutDir,
    "--ignore",
    alloyInFile
  ]);

  if (watch) {
    const babelWatchSubprocess = run("babel", [
      libInDir,
      "--out-dir",
      libOutDir,
      "--watch",
      "--skip-initial-build",
      "--ignore",
      alloyInFile
    ]);
    // cleanup this process on ctrl-c
    process.on("exit", () => babelWatchSubprocess.kill());
  }

  // The package resolution in launch does not follow dependencies on npm packages, so we need to build our
  // own Alloy file here.
  // I tried having rollup run Babel, but it didn't respect the .browserslistrc located in the src/lib directory.
  const alloyPromise = fsPromises
    .mkdir(tempDir)
    .catch(() => undefined)
    .then(() => fsPromises.copyFile(browserslistrcFile, browserslistrcTempFile))
    .then(() => run("rollup", ["-c"]))
    .then(() => run("babel", [alloyTempFile, "--out-dir", libOutDir]))
    .finally(() => toPromise(callback => rimraf(tempDir, callback)));

  return Promise.all([babelPromise, parcelPromise, alloyPromise]);
};
