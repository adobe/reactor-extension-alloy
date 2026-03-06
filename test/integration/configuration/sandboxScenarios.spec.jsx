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

import { describe, it, beforeEach, afterEach, expect } from "vitest";

import { page } from "vitest/browser";
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { waitForConfigurationViewToLoad } from "../helpers/ui";
import { worker } from "../helpers/mocks/browser";
import {
  singleSandboxNoDefaultHandlers,
  sandboxUserRegionMissingHandlers,
} from "../helpers/mocks/defaultHandlers";

let extensionBridge;

const productionSandboxField = page.getByTestId("productionSandboxField");
const edgeConfigInputMethodSelectRadio = page.getByTestId(
  "edgeConfigInputMethodSelectRadio",
);

describe("Config Sandboxes", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("shows disabled sandbox dropdown when only one non default sandbox is returned", async () => {
    worker.use(...singleSandboxNoDefaultHandlers);
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    await expect.element(productionSandboxField).toBeDisabled();
  });

  it("shows alert panel when user region is missing", async () => {
    worker.use(...sandboxUserRegionMissingHandlers);

    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    await edgeConfigInputMethodSelectRadio.click();

    await expect
      .element(
        page.getByRole("heading", {
          name: /you do not have enough permissions to fetch the organization configurations/i,
        }),
      )
      .toBeVisible();
  });
});
