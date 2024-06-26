#!/usr/bin/env node

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import build from "./helpers/build.mjs";
import buildExtensionManifest from "./helpers/buildExtensionManifest.mjs";

try {
  const resultPath = await buildExtensionManifest();
  // eslint-disable-next-line no-console
  console.log(
    "\x1b[32m%s\x1b[0m",
    `✅ Extension manifest written to ${resultPath}`,
  );

  await build();

  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
