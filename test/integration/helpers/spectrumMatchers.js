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
import { expect } from "vitest";

expect.extend({
  toBeSelected(element) {
    if (this.isNot) {
      return {
        pass: element.getAttribute("aria-selected") === "true",
        message: () => `Expected element to not be selected, but it was`,
        actual: element.getAttribute("aria-selected"),
        expected: "false",
      };
    }
    return {
      pass: element.getAttribute("aria-selected") === "true",
      message: () => `Expected element to be selected, but it was not`,
      actual: element.getAttribute("aria-selected"),
      expected: "true",
    };
  },
  async toHaveError(element, message) {
    let description;
    const domEl =
      element && typeof element.element === "function"
        ? element.element()
        : element;

    const hasInvalid = domEl?.getAttribute?.("aria-invalid") === "true";
    if (!hasInvalid) {
      return {
        pass: false,
        message: () =>
          `Expected element to have error (aria-invalid="true") but got aria-invalid="${domEl?.getAttribute?.("aria-invalid") ?? "undefined"}"`,
        actual: domEl?.getAttribute?.("aria-invalid"),
        expected: "true",
      };
    }

    if (message === undefined) {
      return {
        pass: true,
        message: () => "",
        actual: undefined,
        expected: undefined,
      };
    }

    const describedBy = domEl.getAttribute("aria-describedby");
    if (describedBy) {
      const firstId = describedBy.split(/\s+/)[0];
      const descEl = document.getElementById(firstId);
      description = descEl ? (descEl.textContent?.trim() ?? "") : "";
    }

    const pass =
      message instanceof RegExp
        ? message.test(description ?? "")
        : description === message;

    return {
      pass,
      message: () =>
        `Expected element to ${this.isNot ? "not have" : "have"} error matching ${String(message)} but got ${description ?? "undefined"}`,
      actual: description,
      expected: message,
    };
  },
});
