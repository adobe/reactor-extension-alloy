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

const internalLinkEnabledField = page.getByTestId("internalLinkEnabledField");
const externalLinkEnabledField = page.getByTestId("externalLinkEnabledField");
const downloadLinkEnabledField = page.getByTestId("downloadLinkEnabledField");
const downloadLinkQualifierField = page.getByTestId(
  "downloadLinkQualifierField",
);
const contextGranularitySpecificField = page.getByTestId(
  "contextGranularitySpecificField",
);
const contextGranularityAllField = page.getByTestId(
  "contextGranularityAllField",
);
const contextWebField = page.getByTestId("contextWebField");
const contextDeviceField = page.getByTestId("contextDeviceField");
const contextEnvironmentField = page.getByTestId("contextEnvironmentField");
const contextPlaceContextField = page.getByTestId("contextPlaceContextField");
const contextHighEntropyUserAgentHintsField = page.getByTestId(
  "contextHighEntropyUserAgentHintsField",
);
const contextOneTimeAnalyticsReferrerField = page.getByTestId(
  "contextOneTimeAnalyticsReferrerField",
);
const eventGroupingNoneField = page.getByTestId("eventGroupingNoneField");
const eventGroupingSessionStorageField = page.getByTestId(
  "eventGroupingSessionStorageField",
);
const eventGroupingMemoryField = page.getByTestId("eventGroupingMemoryField");
const downloadLinkQualifierTestButton = page.getByTestId(
  "downloadLinkQualifierTestButton",
);
const downloadLinkQualifierRestoreButton = page.getByTestId(
  "downloadLinkQualifierRestoreButton",
);
const onBeforeEventSendEditButton = page.getByTestId(
  "onBeforeEventSendEditButton",
);
const filterClickDetailsEditButton = page.getByTestId(
  "filterClickDetailsEditButton",
);

const eventGroupingRadio = (name) =>
  page.getByTestId(`eventGrouping${name}Field`);
const contextCheckbox = (name) => page.getByTestId(`context${name}Field`);

describe("Config data collection section", () => {
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
            onBeforeEventSend: "// custom code",
            clickCollection: {
              filterClickDetails: "// filter code",
            },
            context: ["web", "device"],
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).toBeChecked();

    await expect.element(eventGroupingRadio("None")).toBeChecked();
    await expect
      .element(eventGroupingRadio("SessionStorage"))
      .not.toBeChecked();
    await expect.element(eventGroupingRadio("Memory")).not.toBeChecked();

    await expect.element(externalLinkEnabledField).toBeChecked();
    await expect.element(downloadLinkEnabledField).toBeChecked();

    await expect.element(contextGranularitySpecificField).toBeChecked();

    await expect.element(contextCheckbox("Web")).toBeChecked();
    await expect.element(contextCheckbox("Device")).toBeChecked();
    await expect.element(contextCheckbox("Environment")).not.toBeChecked();
    await expect.element(contextCheckbox("PlaceContext")).not.toBeChecked();
    await expect
      .element(contextHighEntropyUserAgentHintsField)
      .not.toBeChecked();
    await expect
      .element(contextOneTimeAnalyticsReferrerField)
      .not.toBeChecked();
  });

  it("sets form values from settings with event grouping session storage", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollection: {
              sessionStorageEnabled: true,
              eventGroupingEnabled: true,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).toBeChecked();

    await expect.element(eventGroupingRadio("None")).not.toBeChecked();
    await expect.element(eventGroupingRadio("SessionStorage")).toBeChecked();
    await expect.element(eventGroupingRadio("Memory")).not.toBeChecked();
  });

  it("sets form values from settings with event grouping memory", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollection: {
              eventGroupingEnabled: true,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).toBeChecked();

    await expect.element(eventGroupingRadio("None")).not.toBeChecked();
    await expect
      .element(eventGroupingRadio("SessionStorage"))
      .not.toBeChecked();
    await expect.element(eventGroupingRadio("Memory")).toBeChecked();
  });

  it("sets form values from settings with download link enabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            downloadLinkQualifier: "\\.(exe|zip)$",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(downloadLinkEnabledField).toBeChecked();
    await expect
      .element(downloadLinkQualifierField)
      .toHaveValue("\\.(exe|zip)$");
  });

  it("sets form values from settings with all link types disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollectionEnabled: false,
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).not.toBeChecked();
    await expect.element(externalLinkEnabledField).not.toBeChecked();
    await expect.element(downloadLinkEnabledField).not.toBeChecked();
  });

  it("sets form values from settings with some link types disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollection: {
              externalLinkEnabled: false,
              downloadLinkEnabled: false,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).toBeChecked();
    await expect.element(externalLinkEnabledField).not.toBeChecked();
    await expect.element(downloadLinkEnabledField).not.toBeChecked();
  });

  it("updates form values and saves to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await externalLinkEnabledField.click();
    await downloadLinkEnabledField.click();

    await contextGranularitySpecificField.click();

    await contextWebField.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].clickCollection.externalLinkEnabled).toBe(
      false,
    );
    expect(settings.instances[0].clickCollection.downloadLinkEnabled).toBe(
      false,
    );
    expect(settings.instances[0].context).toEqual([
      "device",
      "environment",
      "placeContext",
    ]);
  });

  it("shows and hides download link qualifier based on download link enabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect
      .element(page.getByTestId("downloadLinkQualifierField"))
      .toBeInTheDocument();

    await downloadLinkEnabledField.click();

    await expect
      .element(page.getByTestId("downloadLinkQualifierField"))
      .not.toBeInTheDocument();
  });

  it("shows and hides event grouping options based on internal link enabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect
      .element(page.getByTestId("eventGroupingNoneField"))
      .toBeInTheDocument();

    await internalLinkEnabledField.click();

    await expect
      .element(page.getByTestId("eventGroupingNoneField"))
      .not.toBeInTheDocument();
  });

  it("saves event grouping settings when session storage is selected", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await eventGroupingSessionStorageField.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].clickCollection.eventGroupingEnabled).toBe(
      true,
    );
    expect(settings.instances[0].clickCollection.sessionStorageEnabled).toBe(
      true,
    );
  });

  it("saves event grouping settings when memory is selected", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await eventGroupingMemoryField.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].clickCollection.eventGroupingEnabled).toBe(
      true,
    );
    expect(
      settings.instances[0].clickCollection.sessionStorageEnabled,
    ).toBeUndefined();
  });

  it("does not emit click collection settings when activity collector is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollectionEnabled: true,
            clickCollection: {
              internalLinkEnabled: true,
              externalLinkEnabled: true,
              downloadLinkEnabled: true,
            },
            downloadLinkQualifier: "\\.(pdf)$",
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();
    await toggleComponent("activityCollector");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].clickCollectionEnabled).toBeUndefined();
    expect(settings.instances[0].clickCollection).toBeUndefined();
    expect(settings.instances[0].downloadLinkQualifier).toBeUndefined();
  });

  it("hides click collection fields and shows alert when activity collector is disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings({}));

    await waitForConfigurationViewToLoad();
    await toggleComponent("activityCollector");

    await expect
      .element(
        page.getByRole("heading", {
          name: /activity collector component disabled/i,
        }),
      )
      .toBeVisible();

    await expect
      .element(page.getByTestId("internalLinkEnabledField"))
      .not.toBeInTheDocument();
  });

  it("shows default values when no settings are provided", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect.element(internalLinkEnabledField).toBeChecked();
    await expect.element(externalLinkEnabledField).toBeChecked();
    await expect.element(downloadLinkEnabledField).toBeChecked();

    await expect.element(contextGranularityAllField).toBeChecked();
    await expect.element(eventGroupingNoneField).toBeChecked();
  });

  it("does not save default values to settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].onBeforeEventSend).toBeUndefined();
    expect(settings.instances[0].clickCollection).toBeUndefined();
    expect(settings.instances[0].downloadLinkQualifier).toBeUndefined();
    expect(settings.instances[0].context).toBeUndefined();
  });

  it("updates download link qualifier", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await downloadLinkQualifierField.fill("\\.(zip|exe)$");

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].downloadLinkQualifier).toBe("\\.(zip|exe)$");
  });

  it("shows context checkboxes when specific context is selected", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await expect
      .element(page.getByTestId("contextWebField"))
      .not.toBeInTheDocument();

    await contextGranularitySpecificField.click();

    await expect
      .element(page.getByTestId("contextWebField"))
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("contextDeviceField"))
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("contextEnvironmentField"))
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("contextPlaceContextField"))
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("contextHighEntropyUserAgentHintsField"))
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("contextOneTimeAnalyticsReferrerField"))
      .toBeInTheDocument();
  });

  it("saves non-default context when specific is selected", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await contextGranularitySpecificField.click();

    await contextEnvironmentField.click();

    await contextHighEntropyUserAgentHintsField.click();

    await contextOneTimeAnalyticsReferrerField.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].context).toEqual([
      "web",
      "device",
      "placeContext",
      "highEntropyUserAgentHints",
      "oneTimeAnalyticsReferrer",
    ]);
  });

  it("loads context options from settings", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            context: ["web", "device", "oneTimeAnalyticsReferrer"],
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    await expect.element(contextGranularitySpecificField).toBeChecked();

    await expect.element(contextWebField).toBeChecked();
    await expect.element(contextDeviceField).toBeChecked();
    await expect.element(contextEnvironmentField).not.toBeChecked();
    await expect.element(contextPlaceContextField).not.toBeChecked();
    await expect
      .element(contextHighEntropyUserAgentHintsField)
      .not.toBeChecked();
    await expect.element(contextOneTimeAnalyticsReferrerField).toBeChecked();
  });

  it("disables click collection when all link types are disabled", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await internalLinkEnabledField.click();
    await externalLinkEnabledField.click();
    await downloadLinkEnabledField.click();

    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].clickCollectionEnabled).toBe(false);
  });

  it("sets download link qualifier when test button is clicked", async () => {
    await renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await downloadLinkQualifierTestButton.click();

    expect(downloadLinkQualifierField.element().value).toMatch(/edited regex/i);
  });

  it("does not save onBeforeEventSend code if it matches placeholder", async () => {
    const testExtensionBridge = createExtensionBridge({
      openCodeEditor: ({ code }) => {
        return code;
      },
    });
    window.extensionBridge = testExtensionBridge;

    await renderView(ConfigurationView);

    testExtensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await onBeforeEventSendEditButton.click();

    const settings = await testExtensionBridge.getSettings();
    expect(settings.instances[0].onBeforeEventSend).toBeUndefined();
  });

  it("does not save filterClickDetails code if it matches placeholder", async () => {
    const testExtensionBridge = createExtensionBridge({
      openCodeEditor: ({ code }) => {
        return code;
      },
    });
    window.extensionBridge = testExtensionBridge;

    await renderView(ConfigurationView);

    testExtensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    await filterClickDetailsEditButton.click();

    const settings = await testExtensionBridge.getSettings();
    expect(
      settings.instances[0].clickCollection?.filterClickDetails,
    ).toBeUndefined();
  });

  describe("restore default buttons", () => {
    it("restores default download link qualifier when button is clicked", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad();

      const originalDownloadLinkQualifier =
        downloadLinkQualifierField.element().value;
      await downloadLinkQualifierField.fill("\\.(exe|zip)$");

      await expect
        .element(downloadLinkQualifierField)
        .toHaveValue("\\.(exe|zip)$");

      await downloadLinkQualifierRestoreButton.click({
        position: { x: 10, y: 10 },
      });

      await expect
        .element(downloadLinkQualifierField)
        .toHaveValue(originalDownloadLinkQualifier);
    });
  });

  describe("validation", () => {
    it("validates download link qualifier regex format", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              downloadLinkQualifier: "[(invalid regex",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad();

      expect(await extensionBridge.validate()).toBe(false);
    });

    it("accepts valid download link qualifier regex", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              downloadLinkQualifier: "\\.(pdf|doc)$",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad();

      expect(await extensionBridge.validate()).toBe(true);
    });

    it("requires download link qualifier when download link is enabled", async () => {
      await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              downloadLinkQualifier: "",
              clickCollection: {
                downloadLinkEnabled: true,
              },
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad();

      await downloadLinkQualifierField.fill("");

      expect(await extensionBridge.validate()).toBe(false);
    });
  });
});
