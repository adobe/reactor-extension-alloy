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

const targetMigrationEnabledField = page.getByTestId(
  "targetMigrationEnabledField",
);
const personalizationStorageEnabledField = page.getByTestId(
  "personalizationStorageEnabledField",
);
const prehidingStyleEditButton = page.getByTestId("prehidingStyleEditButton");
const ajoPicker = page.getByTestId(
  "autoCollectPropositionInteractionsAJOPicker",
);
const tgtPicker = page.getByTestId(
  "autoCollectPropositionInteractionsTGTPicker",
);
const personalizationComponentCheckbox = page.getByTestId(
  "personalizationComponentCheckbox",
);
const rulesEngineComponentCheckbox = page.getByTestId(
  "rulesEngineComponentCheckbox",
);

describe("Config personalization section", () => {
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

    await waitForConfigurationViewToLoad();

    await expect.element(targetMigrationEnabledField).toBeChecked();
    await expect.element(personalizationStorageEnabledField).toBeChecked();

    await expect
      .element(ajoPicker)
      .toHaveTextContent(/decorated elements only/i);
    await expect.element(tgtPicker).toHaveTextContent(/always/i);
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await targetMigrationEnabledField.click();
    await personalizationStorageEnabledField.click();

    await prehidingStyleEditButton.click();

    await ajoPicker.click();
    await page.getByRole("option", { name: /never/i }).click();

    await tgtPicker.click();
    await page
      .getByRole("option", { name: /decorated elements only/i })
      .click();

    const settings = await extensionBridge.getSettings();
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
    await renderView(ConfigurationView);

    extensionBridge.init(
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

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await personalizationComponentCheckbox.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBeUndefined();
    expect(settings.instances[0].prehidingStyle).toBeUndefined();
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
    expect(
      settings.instances[0].autoCollectPropositionInteractions,
    ).toBeUndefined();
  });

  it("does not emit personalization storage when rules engine is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
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

    await waitForConfigurationViewToLoad();
    await expandAccordion("Build options");
    await rulesEngineComponentCheckbox.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBe(true);
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
  });

  it("hides personalization storage checkbox when rules engine is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          rulesEngine: false,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect
      .element(
        page.getByText(
          /enable it above to configure personalization storage settings/i,
        ),
      )
      .toBeVisible();

    await expect
      .element(personalizationStorageEnabledField)
      .not.toBeInTheDocument();
  });

  it("shows default values for auto-collect pickers", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect.element(ajoPicker).toHaveTextContent(/always/i);
    await expect.element(tgtPicker).toHaveTextContent(/never/i);
  });

  it("does not save default values to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].targetMigrationEnabled).toBeUndefined();
    expect(settings.instances[0].prehidingStyle).toBeUndefined();
    expect(settings.instances[0].personalizationStorageEnabled).toBeUndefined();
    expect(
      settings.instances[0].autoCollectPropositionInteractions,
    ).toBeUndefined();
  });

  it("saves non-default auto-collect values", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        components: {
          personalization: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();

    await tgtPicker.click();
    await page.getByRole("option", { name: /^always$/i }).click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].autoCollectPropositionInteractions?.TGT).toBe(
      "always",
    );
    expect(
      settings.instances[0].autoCollectPropositionInteractions?.AJO,
    ).toBeUndefined();
  });

  it("does not save prehidingStyle code if it matches placeholder", async () => {
    const testExtensionBridge = createExtensionBridge({
      openCodeEditor: ({ code }) => {
        return code;
      },
    });
    window.extensionBridge = testExtensionBridge;

    await renderView(ConfigurationView);

    testExtensionBridge.init(
      buildSettings({
        components: {
          personalization: true,
        },
      }),
    );

    await waitForConfigurationViewToLoad();
    await prehidingStyleEditButton.click();

    const settings = await testExtensionBridge.getSettings();

    expect(settings.instances[0].prehidingStyle).toBeUndefined();
  });
});
