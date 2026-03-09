/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use it except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Run an async step and log its label before starting. When a test times out,
 * the last "[step] label" in the console is the step that was in progress.
 * Remove or replace with test.step() once the hang is fixed.
 *
 * @example
 * await step("init", () => driver.init(...));
 * await step("select overrides", async () => { await selectOption(overridesEnabled, "Enabled"); ... });
 */
export async function step(label, fn) {
  console.error("[step]", label);
  return fn();
}
