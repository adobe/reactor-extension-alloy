/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { screen, fireEvent } from "@testing-library/react";

const createField = (name) => ({
  click: async () => {
    const element = await screen.findByTestId(name);
    fireEvent.click(element);
  },
  clear: async () => {
    const element = await screen.findByTestId(name);
    fireEvent.change(element, { target: { value: "" } });
  },
  typeText: async (text) => {
    const element = await screen.findByTestId(name);
    fireEvent.change(element, { target: { value: text } });
  },
  enterSearch: async (text) => {
    const element = await screen.findByTestId(name);
    fireEvent.change(element, { target: { value: text } });
    fireEvent.keyDown(element, { key: "Enter", code: "Enter" });
  },
  expectValue: async (value) => {
    const element = await screen.findByTestId(name);
    expect(element.value).toBe(value);
  },
  expectError: async () => {
    const element = await screen.findByTestId(`${name}-error`);
    expect(element).toBeTruthy();
  },
  expectExists: async () => {
    const element = await screen.findByTestId(name);
    expect(element).toBeTruthy();
  },
  expectNotExists: async () => {
    try {
      await screen.findByTestId(name);
      throw new Error(`Element with test ID ${name} exists when it should not`);
    } catch (error) {
      expect(error.message).toContain("Unable to find an element");
    }
  },
  expectChecked: async () => {
    const element = await screen.findByTestId(name);
    expect(element.checked).toBe(true);
  },
  expectUnchecked: async () => {
    const element = await screen.findByTestId(name);
    expect(element.checked).toBe(false);
  },
  expectSelected: async () => {
    const element = await screen.findByTestId(name);
    expect(element.getAttribute("aria-selected")).toBe("true");
  },
  expectHidden: async () => {
    const element = await screen.findByTestId(name);
    expect(element.hasAttribute("hidden")).toBe(true);
  },
  expectSelectedOptionLabel: async (label) => {
    const element = await screen.findByTestId(name);
    expect(element.textContent).toBe(label);
  },
  expectIsComboBox: async () => {
    const element = await screen.findByTestId(name);
    expect(element.getAttribute("role")).toBe("combobox");
  },
  expectDisabled: async () => {
    const element = await screen.findByTestId(name);
    expect(element.hasAttribute("disabled")).toBe(true);
  },
  selectOption: async (label) => {
    const element = await screen.findByTestId(name);
    fireEvent.change(element, { target: { value: label } });
    fireEvent.click(screen.getByText(label));
  },
});

export const createSpectrum = () => {
  return [
    {
      nameField: createField("instanceNameField"),
      downloadLinkQualifierField: createField("downloadLinkQualifierField"),
      defaultConsent: {
        inRadio: createField("defaultConsentInRadio"),
        outRadio: createField("defaultConsentOutRadio"),
        pendingRadio: createField("defaultConsentPendingRadio"),
        dataElementRadio: createField("defaultConsentDataElementRadio"),
        dataElementField: createField("defaultConsentDataElementField"),
      },
      overrides: {
        envTabs: {
          development: createField("developmentTab"),
          staging: createField("stagingTab"),
          production: createField("productionTab"),
        },
        comboBoxes: {
          envEnabled: createField("envEnabledComboBox"),
          eventDatasetOverride: createField("eventDatasetOverrideComboBox"),
          idSyncContainerOverride: createField(
            "idSyncContainerOverrideComboBox",
          ),
          targetPropertyTokenOverride: createField(
            "targetPropertyTokenOverrideComboBox",
          ),
          reportSuiteOverrides: [
            createField("reportSuiteOverride0ComboBox"),
            createField("reportSuiteOverride1ComboBox"),
          ],
        },
        textFields: {
          eventDatasetOverride: createField("eventDatasetOverrideTextField"),
          idSyncContainerOverride: createField(
            "idSyncContainerOverrideTextField",
          ),
          targetPropertyTokenOverride: createField(
            "targetPropertyTokenOverrideTextField",
          ),
          reportSuiteOverrides: [
            createField("reportSuiteOverride0TextField"),
            createField("reportSuiteOverride1TextField"),
          ],
        },
        addReportSuiteButton: createField("addReportSuiteButton"),
        copyButtons: {
          development: createField("copyDevelopmentButton"),
          staging: createField("copyStagingButton"),
          production: createField("copyProductionButton"),
        },
      },
      edgeConfig: {
        inputMethodSelectRadio: createField("edgeConfigInputMethodSelectRadio"),
        inputMethodFreeformRadio: createField(
          "edgeConfigInputMethodFreeformRadio",
        ),
        inputMethodFreeform: {
          productionEnvironmentField: createField(
            "edgeConfigProductionEnvironmentField",
          ),
          stagingEnvironmentField: createField(
            "edgeConfigStagingEnvironmentField",
          ),
          developmentEnvironmentField: createField(
            "edgeConfigDevelopmentEnvironmentField",
          ),
        },
        inputMethodSelect: {
          production: {
            sandboxField: createField("edgeConfigProductionSandboxField"),
            datastreamField: createField("edgeConfigProductionDatastreamField"),
          },
          staging: {
            sandboxField: createField("edgeConfigStagingSandboxField"),
            datastreamField: createField("edgeConfigStagingDatastreamField"),
          },
          development: {
            sandboxField: createField("edgeConfigDevelopmentSandboxField"),
            datastreamField: createField(
              "edgeConfigDevelopmentDatastreamField",
            ),
          },
        },
      },
      orgIdField: createField("orgIdField"),
      edgeDomainField: createField("edgeDomainField"),
      edgeBasePathField: createField("edgeBasePathField"),
      idMigrationEnabled: createField("idMigrationEnabledField"),
      thirdPartyCookiesEnabled: createField("thirdPartyCookiesEnabledField"),
      internalLinkEnabledField: createField("internalLinkEnabledField"),
      externalLinkEnabledField: createField("externalLinkEnabledField"),
      downloadLinkEnabledField: createField("downloadLinkEnabledField"),
      contextGranularity: {
        specificField: createField("contextGranularitySpecificField"),
        allField: createField("contextGranularityAllField"),
      },
      specificContext: {
        webField: createField("specificContextWebField"),
        deviceField: createField("specificContextDeviceField"),
        environmentField: createField("specificContextEnvironmentField"),
        placeContextField: createField("specificContextPlaceContextField"),
        highEntropyUserAgentHintsContextField: createField(
          "specificContextHighEntropyUserAgentHintsContextField",
        ),
      },
    },
  ];
};

export default createSpectrum();
