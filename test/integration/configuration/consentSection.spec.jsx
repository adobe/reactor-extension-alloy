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
// eslint-disable-next-line import/no-unresolved
import { page } from "vitest/browser";
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { waitForConfigurationViewToLoad, toggleComponent } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

describe("Config consent section", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("sets form values from settings", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            defaultConsent: "out",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad(view);

    const outRadio = page.getByTestId("defaultConsentOutRadio");
    expect(outRadio.element().checked).toBe(true);
  });

  it("updates form values and saves to settings", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad(view);

    // Change to "pending"
    const pendingRadio = page.getByTestId("defaultConsentPendingRadio");
    await pendingRadio.click();

    // Get settings and verify
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].defaultConsent).toBe("pending");
  });

  it("does not emit consent settings when component is disabled", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            defaultConsent: "out",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad(view);
    await toggleComponent("consent");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].defaultConsent).toBeUndefined();
  });

  it("hides form fields and shows alert when component is toggled off", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(buildSettings({}));

    await waitForConfigurationViewToLoad(view);
    await toggleComponent("consent");

    // Should now show alert panel
    await expect
      .element(
        view.getByRole("heading", {
          name: /consent component disabled/i,
        }),
      )
      .toBeVisible();

    // Radio buttons should not be present
    await expect
      .element(view.getByTestId("defaultConsentInRadio"))
      .not.toBeInTheDocument();
  });

  it("shows default value 'in' when no setting is provided", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad(view);

    const inRadio = page.getByTestId("defaultConsentInRadio");
    expect(inRadio.element().checked).toBe(true);
  });

  it("does not save default value 'in' to settings", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad(view);

    // Default should be "in" but not saved
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].defaultConsent).toBeUndefined();
  });
});
