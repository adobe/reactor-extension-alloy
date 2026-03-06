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
let internalLinkEnabledField;
let externalLinkEnabledField;
let downloadLinkEnabledField;
let downloadLinkQualifierField;
let contextGranularitySpecificField;
let contextGranularityAllField;
let contextWebField;
let contextDeviceField;
let contextEnvironmentField;
let contextPlaceContextField;
let contextHighEntropyUserAgentHintsField;
let contextOneTimeAnalyticsReferrerField;
let eventGroupingNoneField;
let eventGroupingSessionStorageField;
let eventGroupingMemoryField;
let downloadLinkQualifierTestButton;
let downloadLinkQualifierRestoreButton;
let onBeforeEventSendEditButton;
let filterClickDetailsEditButton;
let eventGroupingRadio;
let contextCheckbox;

describe("Config data collection section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    internalLinkEnabledField = view.getByTestId("internalLinkEnabledField");
    externalLinkEnabledField = view.getByTestId("externalLinkEnabledField");
    downloadLinkEnabledField = view.getByTestId("downloadLinkEnabledField");
    downloadLinkQualifierField = view.getByTestId("downloadLinkQualifierField");
    contextGranularitySpecificField = view.getByTestId(
      "contextGranularitySpecificField",
    );
    contextGranularityAllField = view.getByTestId("contextGranularityAllField");
    contextWebField = view.getByTestId("contextWebField");
    contextDeviceField = view.getByTestId("contextDeviceField");
    contextEnvironmentField = view.getByTestId("contextEnvironmentField");
    contextPlaceContextField = view.getByTestId("contextPlaceContextField");
    contextHighEntropyUserAgentHintsField = view.getByTestId(
      "contextHighEntropyUserAgentHintsField",
    );
    contextOneTimeAnalyticsReferrerField = view.getByTestId(
      "contextOneTimeAnalyticsReferrerField",
    );
    eventGroupingNoneField = view.getByTestId("eventGroupingNoneField");
    eventGroupingSessionStorageField = view.getByTestId(
      "eventGroupingSessionStorageField",
    );
    eventGroupingMemoryField = view.getByTestId("eventGroupingMemoryField");
    downloadLinkQualifierTestButton = view.getByTestId(
      "downloadLinkQualifierTestButton",
    );
    downloadLinkQualifierRestoreButton = view.getByTestId(
      "downloadLinkQualifierRestoreButton",
    );
    onBeforeEventSendEditButton = view.getByTestId(
      "onBeforeEventSendEditButton",
    );
    filterClickDetailsEditButton = view.getByTestId(
      "filterClickDetailsEditButton",
    );
    eventGroupingRadio = (name) =>
      view.getByTestId(`eventGrouping${name}Field`);
    contextCheckbox = (name) => view.getByTestId(`context${name}Field`);
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
            onBeforeEventSend: "// custom code",
            clickCollection: {
              filterClickDetails: "// filter code",
            },
            context: ["web", "device"],
          },
        ],
      }),
    );

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
    await driver.init(
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

    await expect.element(internalLinkEnabledField).toBeChecked();

    await expect.element(eventGroupingRadio("None")).not.toBeChecked();
    await expect.element(eventGroupingRadio("SessionStorage")).toBeChecked();
    await expect.element(eventGroupingRadio("Memory")).not.toBeChecked();
  });

  it("sets form values from settings with event grouping memory", async () => {
    await driver.init(
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

    await expect.element(internalLinkEnabledField).toBeChecked();

    await expect.element(eventGroupingRadio("None")).not.toBeChecked();
    await expect
      .element(eventGroupingRadio("SessionStorage"))
      .not.toBeChecked();
    await expect.element(eventGroupingRadio("Memory")).toBeChecked();
  });

  it("sets form values from settings with download link enabled", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            downloadLinkQualifier: "\\.(exe|zip)$",
          },
        ],
      }),
    );

    await expect.element(downloadLinkEnabledField).toBeChecked();
    await expect
      .element(downloadLinkQualifierField)
      .toHaveValue("\\.(exe|zip)$");
  });

  it("sets form values from settings with all link types disabled", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            clickCollectionEnabled: false,
          },
        ],
      }),
    );

    await expect.element(internalLinkEnabledField).not.toBeChecked();
    await expect.element(externalLinkEnabledField).not.toBeChecked();
    await expect.element(downloadLinkEnabledField).not.toBeChecked();
  });

  it("sets form values from settings with some link types disabled", async () => {
    await driver.init(
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

    await expect.element(internalLinkEnabledField).toBeChecked();
    await expect.element(externalLinkEnabledField).not.toBeChecked();
    await expect.element(downloadLinkEnabledField).not.toBeChecked();
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(buildSettings());

    await externalLinkEnabledField.click();
    await downloadLinkEnabledField.click();

    await contextGranularitySpecificField.click();

    await contextWebField.click();

    await driver
      .expectSettings((s) => s.instances[0].clickCollection.externalLinkEnabled)
      .toBe(false);
    await driver
      .expectSettings((s) => s.instances[0].clickCollection.downloadLinkEnabled)
      .toBe(false);
    await driver
      .expectSettings((s) => s.instances[0].context)
      .toEqual(["device", "environment", "placeContext"]);
  });

  it("shows and hides download link qualifier based on download link enabled", async () => {
    await driver.init(buildSettings());

    await expect.element(downloadLinkQualifierField).toBeVisible();

    await downloadLinkEnabledField.click();

    await expect.element(downloadLinkQualifierField).not.toBeInTheDocument();
  });

  it("shows and hides event grouping options based on internal link enabled", async () => {
    await driver.init(buildSettings());

    await expect.element(eventGroupingNoneField).toBeVisible();

    await internalLinkEnabledField.click();

    await expect.element(eventGroupingNoneField).not.toBeInTheDocument();
  });

  it("saves event grouping settings when session storage is selected", async () => {
    await driver.init(buildSettings());

    await eventGroupingSessionStorageField.click();

    await driver
      .expectSettings(
        (s) => s.instances[0].clickCollection.eventGroupingEnabled,
      )
      .toBe(true);
    await driver
      .expectSettings(
        (s) => s.instances[0].clickCollection.sessionStorageEnabled,
      )
      .toBe(true);
  });

  it("saves event grouping settings when memory is selected", async () => {
    await driver.init(buildSettings());

    await eventGroupingMemoryField.click();

    await driver
      .expectSettings(
        (s) => s.instances[0].clickCollection.eventGroupingEnabled,
      )
      .toBe(true);
    await driver
      .expectSettings(
        (s) => s.instances[0].clickCollection.sessionStorageEnabled,
      )
      .toBeUndefined();
  });

  it("does not emit click collection settings when activity collector is disabled", async () => {
    await driver.init(
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

    await toggleComponent("activityCollector");

    await driver
      .expectSettings((s) => s.instances[0].clickCollectionEnabled)
      .toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].clickCollection)
      .toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].downloadLinkQualifier)
      .toBeUndefined();
  });

  it("hides click collection fields and shows alert when activity collector is disabled", async () => {
    await driver.init(buildSettings({}));

    await toggleComponent("activityCollector");

    await expect
      .element(
        view.getByRole("heading", {
          name: /activity collector component disabled/i,
        }),
      )
      .toBeVisible();

    await expect.element(internalLinkEnabledField).not.toBeInTheDocument();
  });

  it("shows default values when no settings are provided", async () => {
    await driver.init(buildSettings());

    await expect.element(internalLinkEnabledField).toBeChecked();
    await expect.element(externalLinkEnabledField).toBeChecked();
    await expect.element(downloadLinkEnabledField).toBeChecked();

    await expect.element(contextGranularityAllField).toBeChecked();
    await expect.element(eventGroupingNoneField).toBeChecked();
  });

  it("does not save default values to settings", async () => {
    await driver.init(buildSettings());

    await driver
      .expectSettings((s) => s.instances[0].onBeforeEventSend)
      .toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].clickCollection)
      .toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].downloadLinkQualifier)
      .toBeUndefined();
    await driver.expectSettings((s) => s.instances[0].context).toBeUndefined();
  });

  it("updates download link qualifier", async () => {
    await driver.init(buildSettings());

    await downloadLinkQualifierField.fill("\\.(zip|exe)$");

    await driver
      .expectSettings((s) => s.instances[0].downloadLinkQualifier)
      .toBe("\\.(zip|exe)$");
  });

  it("shows context checkboxes when specific context is selected", async () => {
    await driver.init(buildSettings());

    await expect.element(contextWebField).not.toBeInTheDocument();

    await contextGranularitySpecificField.click();

    await expect.element(contextWebField).toBeVisible();
    await expect.element(contextDeviceField).toBeVisible();
    await expect.element(contextEnvironmentField).toBeVisible();
    await expect.element(contextPlaceContextField).toBeVisible();
    await expect.element(contextHighEntropyUserAgentHintsField).toBeVisible();
    await expect.element(contextOneTimeAnalyticsReferrerField).toBeVisible();
  });

  it("saves non-default context when specific is selected", async () => {
    await driver.init(buildSettings());

    await contextGranularitySpecificField.click();

    await contextEnvironmentField.click();

    await contextHighEntropyUserAgentHintsField.click();

    await contextOneTimeAnalyticsReferrerField.click();

    await driver
      .expectSettings((s) => s.instances[0].context)
      .toEqual([
        "web",
        "device",
        "placeContext",
        "highEntropyUserAgentHints",
        "oneTimeAnalyticsReferrer",
      ]);
  });

  it("loads context options from settings", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            context: ["web", "device", "oneTimeAnalyticsReferrer"],
          },
        ],
      }),
    );

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
    await driver.init(buildSettings());

    await internalLinkEnabledField.click();
    await externalLinkEnabledField.click();
    await downloadLinkEnabledField.click();

    await driver
      .expectSettings((s) => s.instances[0].clickCollectionEnabled)
      .toBe(false);
  });

  it("sets download link qualifier when test button is clicked", async () => {
    await driver.init(buildSettings());

    await downloadLinkQualifierTestButton.click();

    expect(downloadLinkQualifierField.element().value).toMatch(/edited regex/i);
  });

  it("does not save onBeforeEventSend code if it matches placeholder", async () => {
    driver.openCodeEditorMock = async ({ code }) => code;

    await driver.init(buildSettings());

    await onBeforeEventSendEditButton.click();

    await driver
      .expectSettings((s) => s.instances[0].onBeforeEventSend)
      .toBeUndefined();
  });

  it("does not save filterClickDetails code if it matches placeholder", async () => {
    driver.openCodeEditorMock = async ({ code }) => code;

    await driver.init(buildSettings());

    await filterClickDetailsEditButton.click();

    await driver
      .expectSettings((s) => s.instances[0].clickCollection?.filterClickDetails)
      .toBeUndefined();
  });

  describe("restore default buttons", () => {
    it("restores default download link qualifier when button is clicked", async () => {
      await driver.init(buildSettings());

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
      await driver.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              downloadLinkQualifier: "[(invalid regex",
            },
          ],
        }),
      );

      await driver.expectValidate().toBe(false);
    });

    it("accepts valid download link qualifier regex", async () => {
      await driver.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              downloadLinkQualifier: "\\.(pdf|doc)$",
            },
          ],
        }),
      );

      await driver.expectValidate().toBe(true);
    });

    it("requires download link qualifier when download link is enabled", async () => {
      await driver.init(
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

      await downloadLinkQualifierField.fill("");

      await driver.expectValidate().toBe(false);
    });
  });
});
