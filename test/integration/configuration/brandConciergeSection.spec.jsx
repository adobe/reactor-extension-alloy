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

import { page, userEvent } from "vitest/browser";
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { waitForConfigurationViewToLoad, expandAccordion } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

const stickyConversationSessionField = page.getByTestId(
  "stickyConversationSessionField",
);
const streamTimeoutField = page.getByTestId("streamTimeoutDataTestId");
const brandConciergeComponentCheckbox = page.getByTestId(
  "brandConciergeComponentCheckbox",
);

describe("Config brand concierge section", () => {
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
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              stickyConversationSession: true,
              streamTimeout: 20000,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(stickyConversationSessionField).toBeChecked();
    await expect.element(streamTimeoutField).toHaveValue("20");
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    await stickyConversationSessionField.click();

    await streamTimeoutField.fill("30");
    await userEvent.keyboard("{Tab}");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].conversation.stickyConversationSession).toBe(
      true,
    );
    expect(settings.instances[0].conversation.streamTimeout).toBe(30000);
  });

  it("does not emit brand concierge settings when component is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              stickyConversationSession: true,
              streamTimeout: 15000,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await brandConciergeComponentCheckbox.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].conversation).toBeUndefined();
  });

  it("shows alert panel when brand concierge component is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());
    await waitForConfigurationViewToLoad();

    await expect
      .element(
        page.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("shows alert when component is toggled off", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await brandConciergeComponentCheckbox.click();

    await expect
      .element(
        page.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("converts stream timeout from milliseconds to seconds on load", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              streamTimeout: 45000,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(streamTimeoutField).toHaveValue("45");
  });

  it("does not save stream timeout when it equals default value", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].conversation?.streamTimeout).toBeUndefined();
  });
});
