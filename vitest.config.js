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

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
        ],
      },
    }),
  ],
  root,
  resolve: {
    alias: {
      "@src": path.resolve(root, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(root, "test/vitest/setup.js")],
    globals: true,
    include: [
      // Let the CLI pattern control which files to include
      process.env.TEST_PATTERN || "test/unit/**/*.spec.js",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/functional/test.js",
      "**/e2e/**",
      "**/integration/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,jsx}"],
    },
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    testTimeout: 30000,
    pool: "vmThreads",
    poolOptions: {
      vmThreads: {
        useAtomics: true,
      },
    },
    sequence: {
      concurrent: false,
    },
  },
});
