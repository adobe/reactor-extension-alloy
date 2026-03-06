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
import SendEventView from "../../../src/view/actions/sendEventView";

let extensionBridge;

const handleAdvertisingDataDisabledOption = page.getByTestId(
  "handleAdvertisingDatadisabledOption",
);
const handleAdvertisingDataAutoOption = page.getByTestId(
  "handleAdvertisingDataautoOption",
);
const handleAdvertisingDataWaitOption = page.getByTestId(
  "handleAdvertisingDatawaitOption",
);

describe("Send Event Action", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  describe("Component visibility based on configuration", () => {
    it("hides advertising section when advertising component is not enabled", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: {}, // advertising not enabled
        },
      });

      await expect
        .element(
          page.getByText("enable the Advertising component in the custom"),
        )
        .toBeVisible();

      await expect
        .element(page.getByRole("heading", { name: /Advertising/ }))
        .toBeVisible();
    });

    it("shows advertising section when advertising component is enabled", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: {
            advertising: true,
          },
        },
      });

      await expect
        .element(page.getByRole("heading", { name: /Advertising/ }))
        .toBeVisible();

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await expect
        .element(
          page.getByText("enable the Advertising component in the custom"),
        )
        .not.toBeInTheDocument();
    });

    it("hides advertising section when advertising component is explicitly disabled", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: {
            advertising: false,
          },
        },
      });

      await expect
        .element(
          page.getByText("enable the Advertising component in the custom"),
        )
        .toBeVisible();

      await expect
        .element(page.getByRole("heading", { name: /Advertising/ }))
        .toBeVisible();
    });

    it("shows personalization section by default (default component)", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: {},
        },
      });

      await expect
        .element(page.getByRole("heading", { name: /Personalization/ }))
        .toBeVisible();

      await expect
        .element(
          page.getByText("enable the Personalization component in the custom"),
        )
        .not.toBeInTheDocument();
    });

    it("hides personalization section when explicitly disabled", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: {
            personalization: false,
          },
        },
      });

      await expect
        .element(page.getByRole("heading", { name: /Personalization/ }))
        .toBeVisible();

      await expect
        .element(
          page
            .getByText("enable the Personalization component in the custom")
            .first(),
        )
        .toBeVisible();
    });
  });

  describe("Advertising settings functionality", () => {
    it("initializes with default disabled value", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await expect.element(handleAdvertisingDataDisabledOption).toBeChecked();
    });

    it("does not save advertising settings when default disabled value is selected", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      const settings = await extensionBridge.getSettings();
      expect(settings.advertising).toBeUndefined();
    });

    it("saves advertising settings when automatic is selected", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await handleAdvertisingDataAutoOption.click();

      const settings = await extensionBridge.getSettings();
      expect(settings.advertising).toBeDefined();
      expect(settings.advertising.handleAdvertisingData).toBe("auto");
    });

    it("saves advertising settings when wait is selected", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await handleAdvertisingDataWaitOption.click();

      const settings = await extensionBridge.getSettings();
      expect(settings.advertising).toBeDefined();
      expect(settings.advertising.handleAdvertisingData).toBe("wait");
    });

    it("loads existing advertising settings - automatic", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
        settings: {
          advertising: {
            handleAdvertisingData: "auto",
          },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await expect.element(handleAdvertisingDataAutoOption).toBeChecked();
    });

    it("loads existing advertising settings - wait", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
        settings: {
          advertising: {
            handleAdvertisingData: "wait",
          },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await expect.element(handleAdvertisingDataWaitOption).toBeChecked();
    });

    it("removes advertising settings when switching back to disabled", async () => {
      await renderView(SendEventView);

      extensionBridge.init({
        extensionSettings: {
          instances: [{ name: "alloy", edgeConfigId: "PR123" }],
          components: { advertising: true },
        },
        settings: {
          advertising: {
            handleAdvertisingData: "auto",
          },
        },
      });

      await expect
        .element(page.getByText("Request default Advertising data"))
        .toBeVisible();

      await handleAdvertisingDataDisabledOption.click();

      const settings = await extensionBridge.getSettings();
      expect(settings.advertising).toBeUndefined();
    });
  });
});
