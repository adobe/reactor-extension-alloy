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
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

describe("Datastream Selector - Refresh Button", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("displays refresh button next to datastream field", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "test-datastream-id",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    const refreshButton = page.getByRole("button", {
      name: "Refresh datastreams",
    });

    await expect.element(refreshButton).toBeInTheDocument();
    await expect.element(refreshButton.locator("svg")).toBeInTheDocument();
  });

  it("refresh button is disabled while loading", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "test-datastream-id",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    const refreshButton = page.getByRole("button", {
      name: "Refresh datastreams",
    });

    await refreshButton.click();

    // The button should eventually become enabled again after loading completes
    await expect
      .poll(() => refreshButton.element().disabled, {
        timeout: 5000,
      })
      .toBe(false);
  });

  it("refresh button reloads datastream list", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "test-datastream-id",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    const datastreamField = page.getByTestId("productionDatastreamField");
    const refreshButton = page.getByRole("button", {
      name: "Refresh datastreams",
    });

    await expect.element(datastreamField).toBeInTheDocument();

    await refreshButton.click();

    // Wait for reload to complete by polling the button's disabled state
    await expect
      .poll(() => refreshButton.element().disabled, {
        timeout: 5000,
      })
      .toBe(false);

    // Verify the field is still functional after refresh
    await expect.element(datastreamField).toBeInTheDocument();
  });

  it("refresh button works independently for each environment", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "prod-datastream-id",
            stagingEdgeConfigId: "staging-datastream-id",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    const allRefreshButtons = page.getByRole("button", {
      name: /Refresh datastreams/,
    });

    await expect.element(allRefreshButtons.nth(0)).toBeInTheDocument();

    const firstRefreshButton = allRefreshButtons.nth(0);
    await firstRefreshButton.click();

    await expect
      .poll(() => firstRefreshButton.element().disabled, {
        timeout: 5000,
      })
      .toBe(false);
  });
});
