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

const idMigrationEnabledField = page.getByTestId("idMigrationEnabledField");
const thirdPartyCookiesEnabledField = page.getByTestId(
  "thirdPartyCookiesEnabledField",
);

describe("Config Identity section", () => {
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
            idMigrationEnabled: false,
            thirdPartyCookiesEnabled: false,
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(idMigrationEnabledField).not.toBeChecked();
    await expect.element(thirdPartyCookiesEnabledField).toHaveValue("Disabled");
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await idMigrationEnabledField.click();

    await thirdPartyCookiesEnabledField.fill("Disabled");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].idMigrationEnabled).toBe(false);
    expect(settings.instances[0].thirdPartyCookiesEnabled).toBe(false);
  });

  it("shows default values when no settings are provided", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect.element(idMigrationEnabledField).toBeChecked();
    await expect.element(thirdPartyCookiesEnabledField).toHaveValue("Enabled");
  });

  it("does not save default values to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].idMigrationEnabled).toBeUndefined();
    expect(settings.instances[0].thirdPartyCookiesEnabled).toBeUndefined();
  });

  it("allows data element in third-party cookies field", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            thirdPartyCookiesEnabled: "%myDataElement%",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect
      .element(thirdPartyCookiesEnabledField)
      .toHaveValue("%myDataElement%");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].thirdPartyCookiesEnabled).toBe(
      "%myDataElement%",
    );
  });

  describe("validation", () => {
    it("validates data element format in third-party cookies field", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();

      await thirdPartyCookiesEnabledField.fill("invalid%DataElement");

      expect(await extensionBridge.validate()).toBe(false);

      await expect.element(thirdPartyCookiesEnabledField).not.toBeValid();
      await expect
        .element(thirdPartyCookiesEnabledField)
        .toHaveAccessibleDescription(/please enter a valid data element/i);
    });

    it("accepts valid data element format in third-party cookies field", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              thirdPartyCookiesEnabled: "%validDataElement%",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad();

      expect(await extensionBridge.validate()).toBe(true);
    });
  });
});
