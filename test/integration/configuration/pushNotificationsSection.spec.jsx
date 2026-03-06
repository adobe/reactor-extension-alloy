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
import { waitForConfigurationViewToLoad, expandAccordion } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

const vapidPublicKeyField = page.getByTestId("vapidPublicKeyField");
const appIdField = page.getByTestId("appIdField");
const trackingDatasetIdField = page.getByTestId("trackingDatasetIdField");
const pushNotificationsComponentCheckbox = page.getByTestId(
  "pushNotificationsComponentCheckbox",
);

describe("Config push notifications section", () => {
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
          pushNotifications: true,
        },

        instances: [
          {
            name: "alloy",
            pushNotifications: {
              vapidPublicKey: "test-vapid-key",
              appId: "test-app-id",
              trackingDatasetId: "test-dataset-id",
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(vapidPublicKeyField).toHaveValue("test-vapid-key");
    await expect.element(appIdField).toHaveValue("test-app-id");
    await expect.element(trackingDatasetIdField).toHaveValue("test-dataset-id");
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          pushNotifications: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    await vapidPublicKeyField.fill("new-vapid-key");
    await appIdField.fill("new-app-id");
    await trackingDatasetIdField.fill("new-dataset-id");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].pushNotifications).toMatchObject({
      vapidPublicKey: "new-vapid-key",
      appId: "new-app-id",
      trackingDatasetId: "new-dataset-id",
    });
  });

  it("does not emit push notifications settings when component is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          pushNotifications: true,
        },

        instances: [
          {
            name: "alloy",
            pushNotifications: {
              vapidPublicKey: "test-vapid-key",
              appId: "test-app-id",
              trackingDatasetId: "test-dataset-id",
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await pushNotificationsComponentCheckbox.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].pushNotifications).toBeUndefined();
  });

  it("shows alert panel when push notifications component is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());
    await waitForConfigurationViewToLoad();

    await expect
      .element(
        page.getByRole("heading", {
          name: /push notifications component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("hides form fields and shows alert when component is toggled off", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          pushNotifications: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await pushNotificationsComponentCheckbox.click();

    await expect
      .element(
        page.getByRole("heading", {
          name: /push notifications component disabled/i,
        }),
      )
      .toBeVisible();
  });

  describe("validation", () => {
    it("requires VAPID public key", async () => {
      await renderView(ConfigurationView);
      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();
      expect(await extensionBridge.validate()).toBe(true);
      await expandAccordion("Build options");
      await pushNotificationsComponentCheckbox.click();

      await appIdField.fill("test-app-id");
      await trackingDatasetIdField.fill("test-dataset-id");
      await vapidPublicKeyField.fill("");

      expect(await extensionBridge.validate()).toBe(false);

      await expect.element(vapidPublicKeyField).not.toBeValid();
      await expect
        .element(vapidPublicKeyField)
        .toHaveAccessibleDescription(/please provide a vapid public key/i);
    });

    it("requires application ID", async () => {
      await renderView(ConfigurationView);
      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();
      await expandAccordion("Build options");
      await pushNotificationsComponentCheckbox.click();

      await vapidPublicKeyField.fill("test-vapid-key");
      await trackingDatasetIdField.fill("test-dataset-id");
      await appIdField.fill("");

      expect(await extensionBridge.validate()).toBe(false);

      await expect.element(appIdField).not.toBeValid();
      await expect
        .element(appIdField)
        .toHaveAccessibleDescription(/please provide an application id/i);
    });

    it("requires tracking dataset ID", async () => {
      await renderView(ConfigurationView);
      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();
      await expandAccordion("Build options");
      await pushNotificationsComponentCheckbox.click();

      await vapidPublicKeyField.fill("test-vapid-key");
      await appIdField.fill("test-app-id");
      await trackingDatasetIdField.fill("");

      expect(await extensionBridge.validate()).toBe(false);

      await expect.element(trackingDatasetIdField).not.toBeValid();
      await expect
        .element(trackingDatasetIdField)
        .toHaveAccessibleDescription(/please provide a tracking dataset id/i);
    });
  });
});
