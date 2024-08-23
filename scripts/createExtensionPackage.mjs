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

/* eslint-disable no-console */

import { spawn } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = path.join(__dirname, "..");

const execute = (command, options) => {
  return new Promise((resolve, reject) => {
    spawn(command, options, {
      stdio: "inherit",
    })
      .on("exit", resolve)
      .on("error", reject);
  });
};
try {
  console.log("Run build process...");
  await execute("npm", ["run", "build:prod"]);

  console.log("Package the files");
  await execute("npx", ["@adobe/reactor-packager"]);
} catch (e) {
  console.log(e);
  process.exit(1);
}

const extensonJsonContent = fs.readFileSync(`extension.json`, "utf8");
const extensionDescriptor = JSON.parse(extensonJsonContent);

const packagePath = path.join(
  cwd,
  `package-${extensionDescriptor.name}-${extensionDescriptor.version}.zip`,
);

if (!fs.existsSync(packagePath)) {
  console.log(
    "The extension file was not found. Probably something wrong happened during build.",
  );
  process.exit(1);
}

const zip = new AdmZip(packagePath);

const packageJson = await fs.readFileSync(path.join(cwd, "package.tags.json"));
zip.addFile("package.json", packageJson);

const alloy = await fs.readFileSync(path.join(cwd, "src", "lib", "alloy.js"));
zip.addFile("alloy.js", alloy);

const rollupConfig = await fs.readFileSync(path.join(cwd, "rollup.config.mjs"));
zip.addFile("rollup.config.mjs", rollupConfig);

const buildScript = await fs.readFileSync(
  path.join(cwd, "scripts", "alloyBuilder.js"),
);
zip.addFile("scripts/alloyBuilder.js", buildScript);

zip.writeZip(packagePath);
