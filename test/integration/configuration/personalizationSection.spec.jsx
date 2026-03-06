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
let targetMigrationEnabledField;
let personalizationStorageEnabledField;
let prehidingStyleEditButton;
let ajoPicker;
let tgtPicker;
let personalizationComponentCheckbox;
let rulesEngineComponentCheckbox;

describe("Config personalization section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    targetMigrationEnabledField = view.getByTestId(
      "targetMigrationEnabledField",
    );
    personalizationStorageEnabledField = view.getByTestId(
      "personalizationStorageEnabledField",
    );
    prehidingStyleEditButton = view.getByTestId("prehidingStyleEditButton");
    ajoPicker = view.getByTestId("autoCollectPropositionInteractionsAJOPicker");
    tgtPicker = view.getByTestId("autoCollectPropositionInteractionsTGTPicker");
    personalizationComponentCheckbox = view.getByTestId(
      "personalizationComponentCheckbox",
    );
    rulesEngineComponentCheckbox = view.getByTestId(
      "rulesEngineComponentCheckbox",
    );
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
            targetMigrationEnabled: true,
            prehidingStyle: "#container { opacity: 0 !important }",
            personalizationStorageEnabled: true,
            autoCollectPropositionInteractions: {
              AJO: "decoratedElementsOnly",
              TGT: "always",
            },
          },
        ],
      }),
    );

    await expect.element(targetMigrationEnabledField).toBeChecked();
    await expect.element(personalizationStorageEnabledField).toBeChecked();

    await expect
      .element(ajoPicker)
      .toHaveTextContent(/decorated elements only/i);
    await expect.element(tgtPicker).toHaveTextContent(/always/i);
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(buildSettings());

    await targetMigrationEnabledField.click();
    await personalizationStorageEnabledField.click();

    await prehidingStyleEditButton.click();

    await ajoPicker.click();
    await view.getByRole("option", { name: /never/i }).click();

    await tgtPicker.click();
    await view
      .getByRole("option", { name: /decorated elements only/i })
      .click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBe(true);
    expect(settings.instances[0].personalizationStorageEnabled).toBe(true);
    expect(settings.instances[0].prehidingStyle).toBe(
      "/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/ + modified code",
    );
    expect(settings.instances[0].autoCollectPropositionInteractions.AJO).toBe(
      "never",
    );
    expect(settings.instances[0].autoCollectPropositionInteractions.TGT).toBe(
      "decoratedElementsOnly",
    );
  });

  it("does not emit personalization settings when component is disabled", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            targetMigrationEnabled: true,
            prehidingStyle: "#container { opacity: 0 !important }",
            personalizationStorageEnabled: true,
            autoCollectPropositionInteractions: {
              AJO: "always",
              TGT: "never",
            },
          },
        ],
      }),
    );

    await expandAccordion("Build options");
    await personalizationComponentCheckbox.click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBeUndefined();
    expect(settings.instances[0].prehidingStyle).toBeUndefined();
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
    expect(
      settings.instances[0].autoCollectPropositionInteractions,
    ).toBeUndefined();
  });

  it("does not emit personalization storage when rules engine is disabled", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            targetMigrationEnabled: true,
            personalizationStorageEnabled: true,
          },
        ],
      }),
    );

    await expandAccordion("Build options");
    await rulesEngineComponentCheckbox.click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBe(true);
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
  });

  it("hides personalization storage checkbox when rules engine is disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          rulesEngine: false,
        },
      }),
    );

    await expect
      .element(
        view.getByText(
          /enable it above to configure personalization storage settings/i,
        ),
      )
      .toBeVisible();

    await expect
      .element(personalizationStorageEnabledField)
      .not.toBeInTheDocument();
  });

  it("shows default values for auto-collect pickers", async () => {
    await driver.init(buildSettings());

    await expect.element(ajoPicker).toHaveTextContent(/always/i);
    await expect.element(tgtPicker).toHaveTextContent(/never/i);
  });

  it("does not save default values to settings", async () => {
    await driver.init(buildSettings());

    const settings = await driver.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBeUndefined();
    expect(settings.instances[0].prehidingStyle).toBeUndefined();
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
    expect(
      settings.instances[0].autoCollectPropositionInteractions,
    ).toBeUndefined();
  });

  it("saves non-default auto-collect values", async () => {
    await driver.init(
      buildSettings({
        components: {
          personalization: true,
        },
      }),
    );

    await tgtPicker.click();
    await view.getByRole("option", { name: /^always$/i }).click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].autoCollectPropositionInteractions?.TGT).toBe(
      "always",
    );
    expect(
      settings.instances[0].autoCollectPropositionInteractions?.AJO,
    ).toBeUndefined();
  });

  it("does not save prehidingStyle code if it matches placeholder", async () => {
    driver.openCodeEditorMock = async ({ code }) => code;

    await driver.init(
      buildSettings({
        components: {
          personalization: true,
        },
      }),
    );

    await prehidingStyleEditButton.click();

    const settings = await driver.getSettings();
    expect(settings.instances[0].prehidingStyle).toBeUndefined();
  });
});
