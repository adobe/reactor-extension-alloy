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

// This script builds a functional stub alloy.js when using preinstalled library type.
// It provides proxy implementations that work with self-hosted alloy instances.

import path from "path";
import fs from "fs";
import { Command, Option, InvalidOptionArgumentError } from "commander";
import babel from "@babel/core";

const program = new Command();

program
  .name("buildEmptyAlloy")
  .description(
    "Tool for generating an empty/proxy alloy build for preinstalled library type.",
  );

program.addOption(
  new Option(
    "-o, --outputDir <dir>",
    "the output directory for the generated build",
  )
    .default(process.cwd())
    .argParser((value) => {
      if (!fs.existsSync(path.join(process.cwd(), value))) {
        throw new InvalidOptionArgumentError(
          `Output directory "${value}" is not a valid directory path.`,
        );
      }
      return value;
    }),
);

program.action(({ outputDir }) => {
  // Create stub content that uses the actual @adobe/alloy/utils
  const proxyContent = `
// Import the utility functions from @adobe/alloy/utils
const { createEventMergeId, deepAssign } = require("@adobe/alloy/utils");

// Create a proxy function for createCustomInstance that looks for window instances
const createCustomInstance = (name) => {
  if (typeof window !== 'undefined' && typeof window[name] === 'function') {
    return window[name];
  }
  console.warn(\`Alloy instance "\${name}" not found on window. Please ensure it is loaded before the Launch library.\`);
  return () => Promise.resolve({});
};

// Empty components object for preinstalled mode
const components = {};

// Export the implementations
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS exports
  module.exports = { createCustomInstance, components, createEventMergeId, deepAssign };
} else {
  // ES module exports
  if (typeof exports !== 'undefined') {
    exports.createCustomInstance = createCustomInstance;
    exports.components = components;
    exports.createEventMergeId = createEventMergeId;
    exports.deepAssign = deepAssign;
  }
}
`;

  const outputFile = path.join(outputDir, "alloy.js");

  // Transform the proxy content with Babel
  const output = babel.transform(proxyContent, {
    presets: [["@babel/preset-env"]],
  }).code;

  fs.writeFileSync(outputFile, output);
});

program.parse();
