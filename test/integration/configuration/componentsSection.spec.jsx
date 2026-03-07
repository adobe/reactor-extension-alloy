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

import useView from "../helpers/useView";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { toggleComponent } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let view;
let driver;
let cleanup;
let personalizationComponentCheckbox;
let consentComponentCheckbox;
let pushNotificationsComponentCheckbox;
let advertisingComponentCheckbox;
let activityCollectorComponentCheckbox;
let audiencesComponentCheckbox;
let rulesEngineComponentCheckbox;
let streamingMediaComponentCheckbox;
let mediaAnalyticsBridgeComponentCheckbox;
let eventMergeComponentCheckbox;

describe("Config components section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    personalizationComponentCheckbox = view.getByTestId(
      "personalizationComponentCheckbox",
    );
    consentComponentCheckbox = view.getByTestId("consentComponentCheckbox");
    pushNotificationsComponentCheckbox = view.getByTestId(
      "pushNotificationsComponentCheckbox",
    );
    advertisingComponentCheckbox = view.getByTestId(
      "advertisingComponentCheckbox",
    );
    activityCollectorComponentCheckbox = view.getByTestId(
      "activityCollectorComponentCheckbox",
    );
    audiencesComponentCheckbox = view.getByTestId("audiencesComponentCheckbox");
    rulesEngineComponentCheckbox = view.getByTestId(
      "rulesEngineComponentCheckbox",
    );
    streamingMediaComponentCheckbox = view.getByTestId(
      "streamingMediaComponentCheckbox",
    );
    mediaAnalyticsBridgeComponentCheckbox = view.getByTestId(
      "mediaAnalyticsBridgeComponentCheckbox",
    );
    eventMergeComponentCheckbox = view.getByTestId(
      "eventMergeComponentCheckbox",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("has all necessary components enabled by default", async () => {
    await driver.init();

    // Only non-default components should be in settings (eventMerge is deprecated/not default)
    await driver
      .expectSettings((s) => s.components)
      .toEqual({
        eventMerge: false,
      });
  });

  it("tracks disabled state for components enabled by default", async () => {
    await driver.init();

    // Toggle off consent and personalization components
    await toggleComponent("consent");
    await toggleComponent("personalization");

    await driver.expectSettings((s) => s.components).toBeDefined();
    await driver
      .expectSettings((s) => s.components.personalization)
      .toBe(false);
    await driver.expectSettings((s) => s.components.consent).toBe(false);
  });

  it("restores disabled components from settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          personalization: false,
          consent: false,
        },
      }),
    );

    // Verify checkboxes are unchecked
    await expect.element(personalizationComponentCheckbox).not.toBeChecked();
    await expect.element(consentComponentCheckbox).not.toBeChecked();
  });

  it("does not include new components when creating a new configuration", async () => {
    await driver.init();

    // Verify new beta components are unchecked
    await expect.element(pushNotificationsComponentCheckbox).not.toBeChecked();
    await expect.element(advertisingComponentCheckbox).not.toBeChecked();

    await driver.expectSettings((s) => s.components).toBeDefined();
    // Only eventMerge is saved as false (it's deprecated/not default)
    // Other beta components are not saved if they match their default (false)
    await driver.expectSettings((s) => s.components.eventMerge).toBe(false);
  });

  it("does not include new components when upgrading existing configuration", async () => {
    await driver.init(
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

    // Verify new beta components are unchecked
    await expect.element(pushNotificationsComponentCheckbox).not.toBeChecked();
    await expect.element(advertisingComponentCheckbox).not.toBeChecked();

    await driver.expectSettings((s) => s.components).toBeDefined();
    await driver.expectSettings((s) => s.components.eventMerge).toBe(false);
  });

  it("enables default components by default for new configuration", async () => {
    await driver.init();

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
    await driver.init();

    // Toggle off a component
    await toggleComponent("audiences");

    await driver.expectSettings((s) => s.components.audiences).toBe(false);

    // Toggle it back on
    await toggleComponent("audiences");

    await driver.expectSettings((s) => s.components.audiences).toBeUndefined();
  });

  it("allows enabling beta components", async () => {
    await driver.init();

    // Enable advertising component
    await toggleComponent("advertising");

    await driver.expectSettings((s) => s.components.advertising).toBe(true);

    // Verify checkbox is checked
    await expect.element(advertisingComponentCheckbox).toBeChecked();
  });

  it("preserves enabled beta components from settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
          pushNotifications: true,
        },
      }),
    );

    // Verify beta components are checked
    await expect.element(advertisingComponentCheckbox).toBeChecked();
    await expect.element(pushNotificationsComponentCheckbox).toBeChecked();

    await driver.expectSettings((s) => s.components.advertising).toBe(true);
    await driver
      .expectSettings((s) => s.components.pushNotifications)
      .toBe(true);
  });

  it("allows disabling all components", async () => {
    await driver.init();

    // Disable all default components
    await toggleComponent("activityCollector");
    await toggleComponent("audiences");
    await toggleComponent("consent");
    await toggleComponent("personalization");
    await toggleComponent("rulesEngine");
    await toggleComponent("streamingMedia");
    await toggleComponent("mediaAnalyticsBridge");

    await driver.expectSettings((s) => s.components).toBeDefined();
    await driver
      .expectSettings((s) => s.components.activityCollector)
      .toBe(false);
    await driver.expectSettings((s) => s.components.audiences).toBe(false);
    await driver.expectSettings((s) => s.components.consent).toBe(false);
    await driver
      .expectSettings((s) => s.components.personalization)
      .toBe(false);
    await driver.expectSettings((s) => s.components.rulesEngine).toBe(false);
    await driver.expectSettings((s) => s.components.streamingMedia).toBe(false);
    await driver
      .expectSettings((s) => s.components.mediaAnalyticsBridge)
      .toBe(false);
  });

  it("handles deprecated components correctly", async () => {
    await driver.init();

    // eventMerge is deprecated and should be disabled by default for new configs
    await expect.element(eventMergeComponentCheckbox).not.toBeChecked();

    await driver.expectSettings((s) => s.components.eventMerge).toBe(false);
  });

  it("preserves deprecated components from existing configuration", async () => {
    await driver.init(
      buildSettings({
        components: {
          eventMerge: true,
        },
      }),
    );

    // Verify deprecated component is enabled from settings
    await expect.element(eventMergeComponentCheckbox).toBeChecked();

    // When eventMerge is true (its default value), it won't be in settings
    // because only non-default values are saved
    await driver.expectSettings((s) => s.components).toBeUndefined();
  });

  it("only saves non-default component states to settings", async () => {
    await driver.init();

    // All default components are enabled, so no explicit component settings
    // The settings should only contain non-default values
    // eventMerge is deprecated (not default), so it's saved as false
    await driver.expectSettings((s) => s.components).toBeDefined();
    await driver.expectSettings((s) => s.components.eventMerge).toBe(false);

    // Default components should not be in settings when enabled
    await driver
      .expectSettings((s) => s.components.activityCollector)
      .toBeUndefined();
    await driver.expectSettings((s) => s.components.audiences).toBeUndefined();
    await driver.expectSettings((s) => s.components.consent).toBeUndefined();
  });
});
