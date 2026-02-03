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
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { waitForConfigurationViewToLoad, toggleComponent } from "../helpers/ui";
import { spectrumCheckbox } from "../helpers/form";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

describe("Config brand concierge section", () => {
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
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            stickyConversationSession: true,
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad(view);

    const stickyConversationSessionField = spectrumCheckbox(
      "stickyConversationSessionField",
    );
    expect(await stickyConversationSessionField.isChecked()).toBe(true);
  });

  it("updates form values and saves to settings", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad(view);

    const stickyConversationSessionField = spectrumCheckbox(
      "stickyConversationSessionField",
    );
    await stickyConversationSessionField.check();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].stickyConversationSession).toBe(true);
  });

  it("does not emit brand concierge settings when component is disabled", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            stickyConversationSession: true,
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad(view);
    await toggleComponent("brandConcierge");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].stickyConversationSession).toBeUndefined();
  });

  it("shows alert panel when brand concierge component is disabled", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());
    await waitForConfigurationViewToLoad(view);

    await expect
      .element(
        view.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("shows alert when component is toggled off", async () => {
    const view = await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad(view);
    await toggleComponent("brandConcierge");

    await expect
      .element(
        view.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });
});
