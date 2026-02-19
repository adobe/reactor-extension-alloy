/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { afterEach, afterAll } from "vitest";
import { worker } from "./mocks/browser";
import "./spectrumLocators";
import "./spectrumMatchers";

// React (dev) logs to console when an error boundary catches an error. In Vitest browser
// mode, onConsoleLog in the config has no effect (logs stay in the browser). Override
// here so we suppress only that message in test output; it still appears in a real browser.
const reactErrorBoundaryMessage =
  "React will try to recreate this component tree";
const originalConsoleError = console.error;
console.error = (...args) => {
  for (const arg of args) {
    if (String(arg).includes(reactErrorBoundaryMessage)) {
      return;
    }
  }
  originalConsoleError.apply(console, args);
};

worker.start({
  onUnhandledRequest: "bypass",
  quiet: true,
});

// Some components from react-specturm rely on process.env to exists.
// VIRT_ON is used to determine if we are in a test environment for selects and comboboxes.
window.process = {
  env: {
    VIRT_ON: true,
  },
};

// Reset handlers after each test (important for test isolation)
afterEach(() => {
  worker.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  worker.stop();
});
