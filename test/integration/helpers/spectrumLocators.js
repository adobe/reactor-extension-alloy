/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { locators, page } from "vitest/browser";
import { expect } from "vitest";

locators.extend({
  async selectOption(name) {
    await expect
      .poll(async () => {
        await this.element().scrollIntoView();
        // Trigger: input (Spectrum ComboBox), or button, or ancestor button for Picker-style components
        const trigger = this.locator("input")
          .or(this.getByRole("combobox"))
          .or(this.getByRole("button"))
          .or(this.locator("xpath=..").getByRole("button"))
          .or(this.locator("xpath=../../..").getByRole("button"));
        if (this.element().getAttribute("aria-expanded") === "false") {
          await trigger.click({ timeout: 0 });
          await expect.element(this).toHaveAttribute("aria-expanded", "true");
        }
        await page
          .getByRole("listbox")
          .nth(0)
          .getByRole("option", { name, exact: true })
          .nth(0)
          .click({ timeout: 0 });
      })
      .toBe();
  },
  async expand() {
    await expect
      .poll(async () => {
        if (this.element().getAttribute("aria-expanded") !== "true") {
          await this.click({ timeout: 0 });
        }
        await expect.element(this).toHaveAttribute("aria-expanded", "true");
      })
      .toBe();
  },
});
