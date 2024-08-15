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

import buildAlloy from "./helpers/buildAlloy.mjs";
import buildComponentFixtures from "./helpers/buildComponentFixtures.mjs";
import buildExtensionManifest from "./helpers/buildExtensionManifest.mjs";
import buildLib from "./helpers/buildLib.mjs";
import buildView from "./helpers/buildView.mjs";
import minimist from "minimist";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, "../src");
const tempDir = path.join(__dirname, "../temp");
const outputDir = path.join(__dirname, "../dist");

const { components, watch } = minimist(process.argv.slice(2));
const BUILDERS = {
  alloy: buildAlloy,
  componentfixtures: buildComponentFixtures,
  manifest: buildExtensionManifest,
  lib: buildLib,
  view: buildView
};
const componentNames = Object.keys(BUILDERS);
const promises = (components || "")
  .split(",")
  .filter(component => componentNames.includes(component.toLowerCase()))
  .map(component => componentNames[componentNames.indexOf(component.toLowerCase())])
  .reduce((acc, component) => {
    acc.push(BUILDERS[component]({ watch, inputDir, outputDir, tempDir }));
    return acc;
  }, []);

if (promises.length === 0) {
  console.error("No valid components specified to build.");
  process.exit(1);
}

try {
  await Promise.all(promises);
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
