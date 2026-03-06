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
import { expandAccordion } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let view;
let driver;
let cleanup;
let defaultConsentInRadio;
let defaultConsentOutRadio;
let defaultConsentPendingRadio;
let defaultConsentDataElementRadio;
let defaultConsentDataElementField;
let consentComponentCheckbox;

describe("Config consent section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    defaultConsentInRadio = view.getByTestId("defaultConsentInRadio");
    defaultConsentOutRadio = view.getByTestId("defaultConsentOutRadio");
    defaultConsentPendingRadio = view.getByTestId("defaultConsentPendingRadio");
    defaultConsentDataElementRadio = view.getByTestId(
      "defaultConsentDataElementRadio",
    );
    defaultConsentDataElementField = view.getByTestId(
      "defaultConsentDataElementField",
    );
    consentComponentCheckbox = view.getByTestId("consentComponentCheckbox");
  });

  afterEach(() => {
    cleanup();
  });

  it("sets form values from settings", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            defaultConsent: "out",
          },
        ],
      }),
    );

    await expect.element(defaultConsentOutRadio).toBeChecked();
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(buildSettings());

    await defaultConsentPendingRadio.click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].defaultConsent).toBe("pending");
  });

  it("does not emit consent settings when component is disabled", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            defaultConsent: "out",
          },
        ],
      }),
    );

    await expandAccordion("Build options");
    await consentComponentCheckbox.click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].defaultConsent).toBeUndefined();
  });

  it("hides form fields and shows alert when component is toggled off", async () => {
    await driver.init(buildSettings({}));

    await expandAccordion("Build options");
    await consentComponentCheckbox.click();

    await expect
      .element(
        view.getByRole("heading", {
          name: /consent component disabled/i,
        }),
      )
      .toBeVisible();

    await expect.element(defaultConsentInRadio).not.toBeInTheDocument();
  });

  it("shows default value 'in' when no setting is provided", async () => {
    await driver.init(buildSettings());

    await expect.element(defaultConsentInRadio).toBeChecked();
  });

  it("does not save default value 'in' to settings", async () => {
    await driver.init(buildSettings());

    const settings = await driver.getSettings();
    expect(settings.instances[0].defaultConsent).toBeUndefined();
  });

  describe("validation", () => {
    it("accepts data element in default consent field", async () => {
      await driver.init(buildSettings());

      expect(await driver.validate()).toBe(true);

      await defaultConsentDataElementRadio.click();

      await defaultConsentDataElementField.fill("%consentDataElement%");

      expect(await driver.validate()).toBe(true);
    });

    it("validates data element format in default consent field", async () => {
      await driver.init(buildSettings());

      expect(await driver.validate()).toBe(true);

      await defaultConsentDataElementRadio.click();

      await defaultConsentDataElementField.fill("%consentDataElement");

      expect(await driver.validate()).toBe(false);

      await expect.element(defaultConsentDataElementField).not.toBeValid();
      await expect
        .element(defaultConsentDataElementField)
        .toHaveAccessibleDescription(/please specify a data element/i);
    });

    it("shows error when value is missing in default consent field", async () => {
      await driver.init(buildSettings());

      expect(await driver.validate()).toBe(true);

      await defaultConsentDataElementRadio.click();

      expect(await driver.validate()).toBe(false);

      await defaultConsentDataElementField.clear();
      await expect.element(defaultConsentDataElementField).not.toBeValid();
      await expect
        .element(defaultConsentDataElementField)
        .toHaveAccessibleDescription(/please specify a data element/i);
    });
  });
});
