/*
Copyright 2025 Adobe. All rights reserved.
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
import { fileURLToPath } from "url";
import { Command, Option, InvalidOptionArgumentError } from "commander";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel as rollupBabel } from "@rollup/plugin-babel";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

program.action(async ({ outputDir }) => {
  const outputFile = path.join(outputDir, "alloy.js");

  try {
    // eslint-disable-next-line no-console
    console.log("Building empty alloy.js for preinstalled mode...");
    // eslint-disable-next-line no-console
    console.log(`Output: ${outputFile}`);

    // Bundle the createPreinstalledProxy module with its dependencies
    const proxyInputFile = path.resolve(
      __dirname,
      "../src/lib/utils/createPreinstalledProxy.js",
    );
    const deepAssignInputFile = path.resolve(
      __dirname,
      "../src/lib/utils/deepAssign.js",
    );

    // eslint-disable-next-line no-console
    console.log(`Bundling createPreinstalledProxy: ${proxyInputFile}`);
    // eslint-disable-next-line no-console
    console.log(`Bundling deepAssign: ${deepAssignInputFile}`);

    const rollupPlugins = [
      nodeResolve({
        preferBuiltins: false,
      }),
      commonjs(),
      rollupBabel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 0.25%, not dead",
            },
          ],
        ],
        exclude: "node_modules/**",
      }),
    ];

    // Bundle createPreinstalledProxy
    const proxyBundle = await rollup({
      input: proxyInputFile,
      plugins: rollupPlugins,
    });

    const { output: proxyOutput } = await proxyBundle.generate({
      format: "iife",
      name: "AlloyPreinstalledUtils",
    });

    const proxyBundledCode = proxyOutput[0].code;

    // Bundle deepAssign
    const deepAssignBundle = await rollup({
      input: deepAssignInputFile,
      plugins: rollupPlugins,
    });

    const { output: deepAssignOutput } = await deepAssignBundle.generate({
      format: "iife",
      name: "DeepAssignUtils",
    });

    const deepAssignBundledCode = deepAssignOutput[0].code;

    // Wrap the bundled code with the createCustomInstance implementation
    const alloyContent = `/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// This is a generated file for preinstalled library mode.
// It provides a proxy implementation that waits for external alloy instances.

${proxyBundledCode}

${deepAssignBundledCode}

// Create the createCustomInstance implementation for preinstalled mode
const createCustomInstance = ({ name }) => {
  return AlloyPreinstalledUtils.createPreinstalledProxy(name, {
    timeout: 1000,
    interval: 100,
    configTimeout: 5000,
    onWarn: console.warn,
    onError: console.error,
  });
};

// Empty components object for preinstalled mode
const components = {};

// Stub utilities - not used in preinstalled mode but required for API compatibility
const createEventMergeId = () => {
  throw new Error(
    "createEventMergeId should not be called directly in preinstalled mode"
  );
};

// deepAssign is needed for Update Variable actions even in preinstalled mode
const deepAssign = DeepAssignUtils.deepAssign;

// Export for CommonJS (used by the extension runtime)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createCustomInstance,
    components,
    createEventMergeId,
    deepAssign,
  };
}
`;

    fs.writeFileSync(outputFile, alloyContent);

    // eslint-disable-next-line no-console
    console.log("✅ Successfully built empty alloy.js for preinstalled mode");
    // eslint-disable-next-line no-console
    console.log(
      `   File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`,
    );
  } catch (error) {
    console.error("❌ Error building empty alloy.js:", error);
    process.exit(1);
  }
});

program.parse();
