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

const edgeBasePathField = page.getByTestId("edgeBasePathField");
const edgeBasePathRestoreButton = page.getByTestId("edgeBasePathRestoreButton");

describe("Config advanced section", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("sets form values from settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeBasePath: "custom-path",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(edgeBasePathField).toHaveValue("custom-path");
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await edgeBasePathField.fill("my-custom-path");

    // Get settings and verify
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].edgeBasePath).toBe("my-custom-path");
  });

  it("shows default value 'ee' when no setting is provided", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect.element(edgeBasePathField).toHaveValue("ee");
  });

  it("does not save default value 'ee' to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    // Default should be "ee" but not saved
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].edgeBasePath).toBeUndefined();
  });

  it("allows data element in edge base path field", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeBasePath: "%myDataElement%",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(edgeBasePathField).toHaveValue("%myDataElement%");

    // Verify it's saved
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].edgeBasePath).toBe("%myDataElement%");
  });

  it("restores default edge base path when restore button is clicked", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    // Change the value
    await edgeBasePathField.fill("custom-path");

    // Verify it changed
    await expect.element(edgeBasePathField).toHaveValue("custom-path");

    // Click restore button
    await edgeBasePathRestoreButton.click();

    // Verify it's restored to default
    await expect.element(edgeBasePathField).toHaveValue("ee");
  });

  describe("validation", () => {
    it("requires edge base path", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();

      expect(await extensionBridge.validate()).toBe(true);

      // Clear the edge base path field
      await edgeBasePathField.fill("");

      await expect.element(edgeBasePathField).not.toBeValid();
      await expect
        .element(edgeBasePathField)
        .toHaveAccessibleDescription(/please specify an edge base path/i);

      expect(await extensionBridge.validate()).toBe(false);
    });

    it("accepts valid edge base path", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              edgeBasePath: "custom-edge-path",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad();

      expect(await extensionBridge.validate()).toBe(true);
    });
  });
});
