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
  toBeSelected(received) {
    const el =
      typeof received?.element === "function" ? received.element() : received;
    const selected = el?.getAttribute?.("aria-selected") === "true";
    const pass = this.isNot ? !selected : selected;
    return {
      pass,
      message: () =>
        this.isNot
          ? `Expected element to not be selected, but it was`
          : `Expected element to be selected, but it was not`,
      actual: el?.getAttribute?.("aria-selected"),
      expected: this.isNot ? "false" : "true",
    };
  },
  toBeExpanded(received) {
    const el =
      typeof received?.element === "function" ? received.element() : received;
    const expanded = el?.getAttribute?.("aria-expanded") === "true";
    const pass = this.isNot ? !expanded : expanded;
    return {
      pass,
      message: () =>
        this.isNot
          ? `Expected element to not be expanded, but it was`
          : `Expected element to be expanded, but it was not`,
      actual: el?.getAttribute?.("aria-expanded"),
      expected: this.isNot ? "false" : "true",
    };
  },
});
