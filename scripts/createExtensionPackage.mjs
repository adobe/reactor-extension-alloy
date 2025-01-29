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

import { spawnSync } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";
import { Command } from "commander";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = path.join(__dirname, "..");

const execute = (
  command,
  args,
  { verbose, ...options } = { verbose: false },
) => {
  const r = spawnSync(
    command,
    args,
    Object.assign(options, verbose ? { stdio: "inherit" } : {}),
  );

  if (r.status !== 0) {
    if (r.stderr) {
      const error = r.stderr.toString().trim();
      throw new Error(error);
    } else {
      throw new Error(
        `An error occurred while executing the command: ${command}.`,
      );
    }
  }
};

const getExtensionJson = () => {
  const extensonJsonContent = fs.readFileSync(
    path.join(cwd, "extension.json"),
    "utf8",
  );
  return JSON.parse(extensonJsonContent);
};

const getExtensionPath = (extensionDescriptor) =>
  path.join(
    cwd,
    `package-${extensionDescriptor.name}-${extensionDescriptor.version}.zip`,
  );

const getPackageJson = () => {
  console.log("Generating the package.json file...");
  const alloyPackageJson = JSON.parse(
    fs.readFileSync(path.join(cwd, "package.json"), "utf8"),
  );

  const allDependencies = {
    ...alloyPackageJson.dependencies,
    ...alloyPackageJson.devDependencies,
  };

  const buildPackageJson = {
    name: "reactor-extension-alloy",
    version: "1.0.0",
    author: {
      name: "Adobe",
      url: "http://adobe.com",
      email: "reactor@adobe.com",
    },
    scripts: {
      build: "node ./scripts/buildAlloy.js -i ./alloy.js -o ./dist/lib",
    },
    license: "Apache-2.0",
    description: "Tool for generating custom alloy build based on user input.",
    dependencies: {
      "@adobe/alloy": "",
      "@babel/core": "",
      "@rollup/plugin-commonjs": "",
      "@rollup/plugin-node-resolve": "",
      commander: "",
      rollup: "",
    },
  };

  buildPackageJson.dependencies = Object.keys(
    buildPackageJson.dependencies,
  ).reduce((acc, value) => {
    acc[value] = allDependencies[value];
    return acc;
  }, {});

  return buildPackageJson;
};

const getPackageLockJson = (packageJson) => {
  console.log("Generating the package-lock.json file...");
  if (!fs.existsSync(path.join(cwd, "temp"))) {
    fs.mkdirSync(path.join(cwd, "temp"));
  }

  fs.writeFileSync(path.join(cwd, "temp", "package.json"), packageJson);

  try {
    console.log("Install dependencies (`npm i`)...");
    execute("npm", ["i"], { cwd: path.join(cwd, "temp") });

    const packageLockJson = fs.readFileSync(
      path.join(cwd, "temp", "package-lock.json"),
    );

    fs.rmSync(path.join(cwd, "temp"), { recursive: true, force: true });

    return packageLockJson;
  } catch (e) {
    fs.rmSync(path.join(cwd, "temp"), { recursive: true, force: true });
    throw e;
  }
};

const createExtensionPackage = ({ verbose }) => {
  console.log("Running the clean process (`npm run clean`)...");
  execute("npm", ["run", "clean"], { verbose });

  console.log("Running the build process (`npm run build`)...");
  execute("npm", ["run", "build"], { verbose });

  console.log(
    "Generating the initial extension package...(`npx @adobe/reactor-packager`)",
  );
  execute("npx", ["@adobe/reactor-packager"], { verbose });

  const extensionDescriptor = getExtensionJson();
  const packagePath = getExtensionPath(extensionDescriptor);

  if (!fs.existsSync(packagePath)) {
    throw new Error(
      "The extension file was not found. Probably something wrong happened during build.",
    );
  }

  const packageJson = JSON.stringify(getPackageJson(), null, 2);
  const packageLockJson = getPackageLockJson(packageJson);

  const zip = new AdmZip(packagePath);
  // Create archive package.
  console.log("Appending the extra files to the package...");
  zip.addFile("package.json", packageJson);
  zip.addFile("package-lock.json", packageLockJson);

  const alloy = fs.readFileSync(path.join(cwd, "src", "lib", "alloy.js"));
  zip.addFile("alloy.js", alloy);

  const rollupConfig = fs.readFileSync(path.join(cwd, "rollup.config.mjs"));
  zip.addFile("rollup.config.mjs", rollupConfig);

  const babelJsonFile = fs.readFileSync(path.join(cwd, "babel.config.json"));
  zip.addFile("babel.config.json", babelJsonFile);

  const buildScript = fs.readFileSync(
    path.join(cwd, "scripts", "buildAlloy.cjs"),
  );
  zip.addFile("scripts/buildAlloy.js", buildScript);

  zip.writeZip(packagePath);
  console.log("Done");
};

const program = new Command();

program
  .name("createExtensionPackage")
  .description("Tool for generating the alloy extension package for Tags.");

program.option("-v, --verbose", "verbose mode", false);

program.action(createExtensionPackage);

program.parse();
process.exit(0);
