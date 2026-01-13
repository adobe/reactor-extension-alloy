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

/* eslint-disable no-console */

// This script builds a functional stub alloy.js when using preinstalled library type.
// It provides proxy implementations that work with self-hosted alloy instances.

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Command, Option, InvalidOptionArgumentError } from "commander";
import { spawn, execSync } from "child_process";
import babel from "@babel/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execute = (command, options) => {
  return new Promise((resolve, reject) => {
    spawn(command, options, {
      stdio: "inherit",
    })
      .on("exit", resolve)
      .on("error", reject);
  });
};

const getPackageManager = () => {
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
    return "npm";
  }
};

const program = new Command();

program
  .name("buildAlloyPreinstalled")
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

program.addOption(
  new Option(
    "-f, --filename <name>",
    "the output filename for the generated build",
  ).default("alloy.js"),
);

program.action(async ({ outputDir, filename }) => {
  // Check if the file exists in src/lib, otherwise use the one from root
  const srcLibPath = path.resolve(__dirname, "../src/lib/alloyPreinstalled.js");
  const rootPath = path.resolve(__dirname, "../alloyPreinstalled.js");

  const entryFile = fs.existsSync(srcLibPath) ? srcLibPath : rootPath;

  if (!fs.existsSync(entryFile)) {
    console.error(
      `❌ Error: alloyPreinstalled.js not found in either src/lib/ or root directory`,
    );
    process.exit(1);
  }

  console.log(`Using entry file: ${entryFile}`);
  const outputFile = path.join(outputDir, filename);

  try {
    await execute(getPackageManager(), [
      "exec",
      "--",
      "rollup",
      "-c",
      path.join(__dirname, "../rollup.config.mjs"),
      "-i",
      entryFile,
      "-o",
      outputFile,
    ]);

    const output = babel.transformFileSync(outputFile, {
      presets: [["@babel/preset-env"]],
    }).code;

    console.log(`Output: ${outputFile}`);
    fs.writeFileSync(outputFile, output);
  } catch (error) {
    console.error("❌ Error building empty alloy.js:", error);
    process.exit(1);
  }
});

program.parse();
