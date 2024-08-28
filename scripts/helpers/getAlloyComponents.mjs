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

import fs from "fs";
import babel from "@babel/core";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (() => {
  const components = [];
  const filePath = resolve(
    join(
      __dirname,
      "..",
      "..",
      "node_modules",
      "@adobe",
      "alloy",
      "libEs6",
      "core",
      "componentCreators.js",
    ),
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
