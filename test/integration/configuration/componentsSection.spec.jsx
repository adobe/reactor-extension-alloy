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
import { waitForConfigurationViewToLoad, toggleComponent } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

const personalizationComponentCheckbox = page.getByTestId(
  "personalizationComponentCheckbox",
);
const consentComponentCheckbox = page.getByTestId("consentComponentCheckbox");
const pushNotificationsComponentCheckbox = page.getByTestId(
  "pushNotificationsComponentCheckbox",
);
const advertisingComponentCheckbox = page.getByTestId(
  "advertisingComponentCheckbox",
);
const activityCollectorComponentCheckbox = page.getByTestId(
  "activityCollectorComponentCheckbox",
);
const audiencesComponentCheckbox = page.getByTestId(
  "audiencesComponentCheckbox",
);
const rulesEngineComponentCheckbox = page.getByTestId(
  "rulesEngineComponentCheckbox",
);
const streamingMediaComponentCheckbox = page.getByTestId(
  "streamingMediaComponentCheckbox",
);
const mediaAnalyticsBridgeComponentCheckbox = page.getByTestId(
  "mediaAnalyticsBridgeComponentCheckbox",
);
const eventMergeComponentCheckbox = page.getByTestId(
  "eventMergeComponentCheckbox",
);

describe("Config components section", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("has all necessary components enabled by default", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    const settings = await extensionBridge.getSettings();

    // Only non-default components should be in settings (eventMerge is deprecated/not default)
    expect(settings.components).toEqual({
      eventMerge: false,
    });
  });

  it("tracks disabled state for components enabled by default", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Toggle off consent and personalization components
    await toggleComponent("consent");
    await toggleComponent("personalization");

    const settings = await extensionBridge.getSettings();

    expect(settings.components).toBeDefined();
    expect(settings.components.personalization).toBe(false);
    expect(settings.components.consent).toBe(false);
  });

  it("restores disabled components from settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          personalization: false,
          consent: false,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    // Verify checkboxes are unchecked
    await expect.element(personalizationComponentCheckbox).not.toBeChecked();
    await expect.element(consentComponentCheckbox).not.toBeChecked();
  });

  it("does not include new components when creating a new configuration", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Verify new beta components are unchecked
    await expect.element(pushNotificationsComponentCheckbox).not.toBeChecked();
    await expect.element(advertisingComponentCheckbox).not.toBeChecked();

    const settings = await extensionBridge.getSettings();
    expect(settings.components).toBeDefined();
    // Only eventMerge is saved as false (it's deprecated/not default)
    // Other beta components are not saved if they match their default (false)
    expect(settings.components.eventMerge).toBe(false);
  });

  it("does not include new components when upgrading existing configuration", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    // Verify new beta components are unchecked
    await expect.element(pushNotificationsComponentCheckbox).not.toBeChecked();
    await expect.element(advertisingComponentCheckbox).not.toBeChecked();

    const settings = await extensionBridge.getSettings();
    expect(settings.components).toBeDefined();
    expect(settings.components.eventMerge).toBe(false);
  });

  it("enables default components by default for new configuration", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Verify default components are checked
    await expect.element(activityCollectorComponentCheckbox).toBeChecked();
    await expect.element(audiencesComponentCheckbox).toBeChecked();
    await expect.element(consentComponentCheckbox).toBeChecked();
    await expect.element(personalizationComponentCheckbox).toBeChecked();
    await expect.element(rulesEngineComponentCheckbox).toBeChecked();
    await expect.element(streamingMediaComponentCheckbox).toBeChecked();
    await expect.element(mediaAnalyticsBridgeComponentCheckbox).toBeChecked();
  });

  it("allows toggling components on and off", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Toggle off a component
    await toggleComponent("audiences");

    let settings = await extensionBridge.getSettings();
    expect(settings.components.audiences).toBe(false);

    // Toggle it back on
    await toggleComponent("audiences");

    settings = await extensionBridge.getSettings();
    expect(settings.components.audiences).toBeUndefined();
  });

  it("allows enabling beta components", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Enable advertising component
    await toggleComponent("advertising");

    const settings = await extensionBridge.getSettings();
    expect(settings.components.advertising).toBe(true);

    // Verify checkbox is checked
    await expect.element(advertisingComponentCheckbox).toBeChecked();
  });

  it("preserves enabled beta components from settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          advertising: true,
          pushNotifications: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    // Verify beta components are checked
    await expect.element(advertisingComponentCheckbox).toBeChecked();
    await expect.element(pushNotificationsComponentCheckbox).toBeChecked();

    const settings = await extensionBridge.getSettings();
    expect(settings.components.advertising).toBe(true);
    expect(settings.components.pushNotifications).toBe(true);
  });

  it("allows disabling all components", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // Disable all default components
    await toggleComponent("activityCollector");
    await toggleComponent("audiences");
    await toggleComponent("consent");
    await toggleComponent("personalization");
    await toggleComponent("rulesEngine");
    await toggleComponent("streamingMedia");
    await toggleComponent("mediaAnalyticsBridge");

    const settings = await extensionBridge.getSettings();
    expect(settings.components).toBeDefined();
    expect(settings.components.activityCollector).toBe(false);
    expect(settings.components.audiences).toBe(false);
    expect(settings.components.consent).toBe(false);
    expect(settings.components.personalization).toBe(false);
    expect(settings.components.rulesEngine).toBe(false);
    expect(settings.components.streamingMedia).toBe(false);
    expect(settings.components.mediaAnalyticsBridge).toBe(false);
  });

  it("handles deprecated components correctly", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // eventMerge is deprecated and should be disabled by default for new configs
    await expect.element(eventMergeComponentCheckbox).not.toBeChecked();

    const settings = await extensionBridge.getSettings();
    expect(settings.components.eventMerge).toBe(false);
  });

  it("preserves deprecated components from existing configuration", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          eventMerge: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    // Verify deprecated component is enabled from settings
    await expect.element(eventMergeComponentCheckbox).toBeChecked();

    const settings = await extensionBridge.getSettings();
    // When eventMerge is true (its default value), it won't be in settings
    // because only non-default values are saved
    expect(settings.components).toBeUndefined();
  });

  it("only saves non-default component states to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init();

    await waitForConfigurationViewToLoad();

    // All default components are enabled, so no explicit component settings
    const settings = await extensionBridge.getSettings();

    // The settings should only contain non-default values
    // eventMerge is deprecated (not default), so it's saved as false
    expect(settings.components).toBeDefined();
    expect(settings.components.eventMerge).toBe(false);

    // Default components should not be in settings when enabled
    expect(settings.components.activityCollector).toBeUndefined();
    expect(settings.components.audiences).toBeUndefined();
    expect(settings.components.consent).toBeUndefined();
  });
});
