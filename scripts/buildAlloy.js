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

// This file will be used by Tags in order to generate a custom Alloy build based on user options.
// Tags doesn't support ES6 modules, so we need to use CommonJS modules here.

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { Command, Option, InvalidOptionArgumentError } = require("commander");
const babel = require("@babel/core");

const execute = (command, options) => {
  return new Promise((resolve, reject) => {
    spawn(command, options, {
      stdio: "inherit",
    })
      .on("exit", resolve)
      .on("error", reject);
  });
};

const getBrowserListFromRcFile = () => {
  const lastPath = ["./src/lib/.browserslistrc", ".browserslistrc"].reduce(
    (acc, curr) => {
      if (fs.existsSync(`${__dirname}/../${curr}`)) {
        acc = curr;
      }

      return acc;
    },
  );

  const data = fs.readFileSync(`${__dirname}/../${lastPath}`, "utf-8");
  return data.split("\n").filter((line) => line.trim() !== "");
};

const entryPointGeneratorBabelPlugin = (t, includedModules) => ({
  visitor: {
    VariableDeclarator(babelPath) {
      if (babelPath.node.id.name === "components") {
        babelPath.replaceWith(
          t.VariableDeclarator(
            t.Identifier("components"),
            t.ArrayExpression(
              includedModules.map((module) =>
                t.MemberExpression(
                  t.Identifier("optionalComponents"),
                  t.Identifier(module),
                ),
              ),
            ),
          ),
        );

        babelPath.stop();
      }
    },
  },
});

const addAlloyModulesToEntryFile = ({
  inputFile,
  outputDir,
  includedModules,
}) => {
  const output = babel.transformFileSync(inputFile, {
    plugins: [entryPointGeneratorBabelPlugin(babel.types, includedModules)],
  }).code;

  const filename = path.basename(inputFile);
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, output);

  return outputPath;
};

const getAlloyComponents = (() => {
  const components = [];
  const filePath = path.resolve(
    `${__dirname}/../node_modules/@adobe/alloy/libEs6/core/componentCreators.js`,
  );
  const code = fs.readFileSync(filePath, "utf-8");

  babel.traverse(babel.parse(code), {
    Identifier(p) {
      if (p.node.name !== "default") {
        components.push(p.node.name);
      }
    },
  });

  return () => components;
})();

const program = new Command();

program
  .name("buildCustomAlloy")
  .description("Tool for generating custom alloy build based on user input.");

program.addOption(
  new Option("-i, --inputFile <file>", "the entry point file for the build")
    .makeOptionMandatory()
    .argParser((value) => {
      if (!fs.existsSync(path.join(process.cwd(), value))) {
        throw new InvalidOptionArgumentError(
          `Input file "${value}" doen not exist.`,
        );
      }

      return value;
    }),
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

const alloyComponents = getAlloyComponents();

alloyComponents.forEach((component) => {
  program.addOption(
    new Option(`--${component} <bool>`, `enable ${component} module`)
      .env(`ALLOY_${component.toUpperCase()}`)
      .default(true, "true")
      .argParser((val) => {
        if (val === "0" || val === "false") {
          return false;
        }

        return true;
      }),
  );
});

program.action(async ({ inputFile, outputDir, ...modules }) => {
  const includedModules = Object.entries(modules).reduce(
    (acc, [key, value]) => {
      if (value === true) {
        acc.push(key);
      }

      return acc;
    },
    [],
  );

  let entryFile;
  try {
    entryFile = addAlloyModulesToEntryFile({
      inputFile,
      outputDir,
      includedModules,
    });

    await execute("npx", [
      "rollup",
      "-c",
      path.join(__dirname, "../rollup.config.mjs"),
      "-i",
      entryFile,
      "-o",
      entryFile,
    ]);

    const output = babel.transformFileSync(entryFile, {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: getBrowserListFromRcFile(),
            },
          },
        ],
      ],
    }).code;

    fs.writeFileSync(entryFile, output);
  } catch (e) {
    fs.unlinkSync(entryFile);
    console.error(e);
    process.exit(1);
  }
});

program.parse();
