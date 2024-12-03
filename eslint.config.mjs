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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("airbnb", "plugin:testcafe/recommended"),
  ...compat.plugins("ban", "testcafe"),
  {
    files: ["**/*.{mjs,js,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@src", "./src"],
            ["@test", "./test"]
          ],
          extensions: [".js", ".jsx", ".mjs"]
        },
        node: {
          extensions: [".js", ".jsx", ".mjs"],
          paths: [path.resolve(__dirname)]
        }
      }
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
        describe: true,
        it: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        vi: true,
        test: true,
        fixture: true
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
      "jsx-a11y/label-has-for": "off",
      "import/no-extraneous-dependencies": ["error", {
        "devDependencies": ["**/*.test.js", "**/*.spec.js", "**/vitest.config.js", "**/test/**/*"]
      }],
      "prefer-destructuring": "off",
      "import/prefer-default-export": "off",
      "no-console": [
        "warn",
        {
          allow: ["error"],
        },
      ],
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
      "import/no-unresolved": ["error", {
        "ignore": ["vitest", "vitest/config"]
      }]
    },
  },
  {
    files: ["test/**/*.{js,jsx,mjs}"],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        vi: true,
        test: true
      }
    }
  },
  {
    files: ["src/**/*.{mjs,js,jsx}"],
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
      "import/no-named-export": 2,
      "no-underscore-dangle": [
        "error",
        { allow: ["__alloyNS", "__alloyMonitors"] },
      ],
    },
  },

  eslintPluginPrettierRecommended,
];
