/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import vitestPlugin from "eslint-plugin-vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  js.configs.recommended,
  ...compat.extends("airbnb", "plugin:testcafe/recommended"),
  ...compat.plugins("ban", "testcafe"),
  {
    ignores: ["dist/**", "src/lib/runAlloy.js"],
  },
  {
    files: ["**/*.{mjs,cjs,js,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
      vitest: vitestPlugin,
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.node,
        fixture: true,
        test: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        vi: true,
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "ban/ban": [
        "error",
        { name: ["describe", "only"], message: "don't focus tests" },
        { name: "fdescribe", message: "don't focus tests" },
        { name: ["it", "only"], message: "don't focus tests" },
        { name: "fit", message: "don't focus tests" },
        { name: ["fixture", "only"], message: "don't focus tests" },
        { name: ["test", "only"], message: "don't focus tests" },
        { name: "ftest", message: "don't focus tests" },
      ],
      "no-param-reassign": "off",
      "prettier/prettier": "error",
      "react/require-default-props": "off",
      "react/no-array-index-key": "off",
      "react/forbid-prop-types": "off",
      "jsx-a11y/label-has-associated-control": [
        2,
        {
          controlComponents: ["WrappedField"],
        },
      ],
      // Has been deprecated in favor of label-has-associated-control
      "jsx-a11y/label-has-for": "off",
      // Turning this off allows us to import devDependencies in our build tools.
      // We enable the rule in src/.eslintrc.js since that's the only place we
      // want to disallow importing extraneous dependencies.
      "import/no-extraneous-dependencies": "off",
      "prefer-destructuring": "off",
      "import/prefer-default-export": "off",
      "no-console": [
        "warn",
        {
          allow: ["error"],
        },
      ],
      // This rule typically shows an error if a Link component
      // doesn't have an href. We use React-Spectrum's Link
      // component, however, which doesn't have an href prop
      // (Link expects a anchor element as a child). We have
      // to provide an empty components array here to get around
      // eslint complaining about this. eslint still checks
      // anchor elements though.
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: [],
        },
      ],
      "no-underscore-dangle": [
        2,
        {
          allow: ["_experience", "__dirname", "__filename", "__alloyMonitors"],
        },
      ],
      "react/jsx-props-no-spreading": "off",
      "react/function-component-definition": [
        2,
        { namedComponents: "arrow-function" },
      ],

      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "vitest/expect-expect": "error",
      "vitest/no-disabled-tests": "off",
      "vitest/no-focused-tests": "error",
      "vitest/no-identical-title": "error",
    },
  },
  {
    files: ["src/**/*.{mjs,cjs,js,jsx}"],
    languageOptions: {
      globals: {
        _satellite: "readonly",
      },
    },
    rules: {
      "import/no-extraneous-dependencies": "error",
    },
  },
  {
    files: ["src/lib/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        turbine: "readonly",
      },
    },
    rules: {
      "no-var": "off",
      "func-names": "off",
      "import/no-default-export": 2,
      "no-underscore-dangle": [
        "error",
        { allow: ["__alloyNS", "__alloyMonitors"] },
      ],
    },
  },

  eslintPluginPrettierRecommended,
];
