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

import { expect } from "vitest";

const RETRIES = 3;

const withRetries = async (fn) => {
  for (let i = 0; i < RETRIES; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fn();
      return;
    } catch (error) {
      if (i === RETRIES - 1) {
        throw error;
      }
    }
  }
};

const TIMEOUT = { timeout: 2000 };

/**
 * Open the listbox and select an option.
 * ComboBox: locator is the input (testId is on the input). Button is xpath=../../..
 * Picker: locator is the button. Uses [aria-controls] for listbox to avoid stale refs after re-render.
 */
export async function selectOption(locator, name) {
  await withRetries(async () => {
    if (locator.element().getAttribute("aria-expanded") === "false") {
      const isComboBox = locator.element().tagName.toLowerCase() === "input";
      const button = isComboBox
        ? locator.locator("xpath=../../..").getByRole("button")
        : locator;
      await button.click(TIMEOUT);
      await expect
        .element(locator, TIMEOUT)
        .toHaveAttribute("aria-expanded", "true");
    }
    const listbox = locator.controls();
    await expect.element(listbox, TIMEOUT).toBeVisible();
    await listbox
      .getByRole("option", { name, exact: true })
      .nth(0)
      .click(TIMEOUT);
    await expect
      .element(locator, TIMEOUT)
      .toHaveAttribute("aria-expanded", "false");
    if (locator.element().tagName.toLowerCase() === "input") {
      await expect.element(locator, TIMEOUT).toHaveValue(name);
    } else {
      await expect.element(locator, TIMEOUT).toHaveTextContent(name);
    }
  });
}

/**
 * Expand a disclosure/combobox (click if not already expanded). Re-queries locator after click to avoid stale refs.
 */
export async function expand(locator) {
  await withRetries(async () => {
    await expect.element(locator).toBeVisible(TIMEOUT);
    if (locator.element().getAttribute("aria-expanded") !== "true") {
      await locator.click(TIMEOUT);
      await expect
        .element(locator, TIMEOUT)
        .toHaveAttribute("aria-expanded", "true");
    }
  });
}
