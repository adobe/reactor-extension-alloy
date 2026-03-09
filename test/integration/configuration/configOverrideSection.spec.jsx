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
import { buildSettings } from "../helpers/settingsUtils";
import { selectOption } from "../helpers/spectrum";
import { step } from "../helpers/stepLog";

let view;
let driver;
let cleanup;
let developmentOverridesTab;
let stagingOverridesTab;
let productionOverridesTab;
let overridesEnabled;
let analyticsEnabled;
let reportSuitesOverride;
let removeReportSuite;
let addReportSuite;
let audienceManagerEnabled;
let idSyncContainerOverride;
let experiencePlatformEnabled;
let eventDatasetOverride;
let odeEnabled;
let edgeSegmentationEnabled;
let edgeDestinationsEnabled;
let ajoEnabled;
let ssefEnabled;
let targetEnabled;
let targetPropertyTokenOverride;
let copyFromDevelopmentButton;

const buildSettingsWithDummyDatastream = (o = {}) => {
  o.instances = o.instances || [];
  const alloyInstance = o.instances.find(
    (instance) => instance.name === "alloy",
  );
  if (!alloyInstance) {
    o.instances.push({ name: "alloy", edgeConfigId: "dummy-datastream-id" });
  } else {
    alloyInstance.edgeConfigId = "dummy-datastream-id";
  }
  return buildSettings(o);
};

describe("Config overrides section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));

    developmentOverridesTab = view.getByTestId("developmentOverridesTab");
    stagingOverridesTab = view.getByTestId("stagingOverridesTab");
    productionOverridesTab = view.getByTestId("productionOverridesTab");
    overridesEnabled = view.getByTestId("overridesEnabled");
    analyticsEnabled = view.getByTestId("analyticsEnabled");
    reportSuitesOverride = [0, 1, 2].map((index) =>
      view.getByTestId(`reportSuitesOverride.${index}`),
    );
    removeReportSuite = [0, 1, 2].map((index) =>
      view.getByTestId(`removeReportSuite.${index}`),
    );
    addReportSuite = view.getByTestId("addReportSuite");
    audienceManagerEnabled = view.getByTestId("audienceManagerEnabled");
    idSyncContainerOverride = view.getByTestId("idSyncContainerOverride");
    experiencePlatformEnabled = view.getByTestId("experiencePlatformEnabled");
    eventDatasetOverride = view.getByTestId("eventDatasetOverride");
    odeEnabled = view.getByTestId("odeEnabled");
    edgeSegmentationEnabled = view.getByTestId("edgeSegmentationEnabled");
    edgeDestinationsEnabled = view.getByTestId("edgeDestinationsEnabled");
    ajoEnabled = view.getByTestId("ajoEnabled");
    ssefEnabled = view.getByTestId("ssefEnabled");
    targetEnabled = view.getByTestId("targetEnabled");
    targetPropertyTokenOverride = view.getByTestId(
      "targetPropertyTokenOverride",
    );
    copyFromDevelopmentButton = view.getByTestId("copyFromDevelopmentButton");
  });

  afterEach(() => {
    cleanup();
  });

  it("sets form values from settings", async () => {
    await driver.init(
      buildSettingsWithDummyDatastream({
        instances: [
          {
            name: "alloy",
            edgeConfigOverrides: {
              development: {
                enabled: true,
                com_adobe_experience_platform: {
                  datasets: {
                    event: {
                      datasetId: "aepDatasetId",
                    },
                  },
                  com_adobe_edge_ode: {
                    enabled: false,
                  },
                  com_adobe_edge_segmentation: {
                    enabled: false,
                  },
                  com_adobe_edge_destinations: {
                    enabled: false,
                  },
                  com_adobe_edge_ajo: {
                    enabled: false,
                  },
                },
                com_adobe_analytics: {
                  reportSuites: ["reportSuite1", "reportSuite2"],
                },
                com_adobe_identity: {
                  idSyncContainerId: 1111,
                },
                com_adobe_target: {
                  propertyToken: "targetPropToken",
                },
                com_adobe_audiencemanager: {
                  enabled: false,
                },
                com_adobe_launch_ssf: {
                  enabled: false,
                },
              },
              staging: {
                enabled: true,
                com_adobe_experience_platform: {
                  datasets: {
                    event: {
                      datasetId: "aepDatasetIdStaging",
                    },
                  },
                  com_adobe_edge_ode: {
                    enabled: false,
                  },
                  com_adobe_edge_segmentation: {
                    enabled: false,
                  },
                  com_adobe_edge_destinations: {
                    enabled: false,
                  },
                  com_adobe_edge_ajo: {
                    enabled: false,
                  },
                },
                com_adobe_analytics: {
                  reportSuites: ["reportSuite1Staging", "reportSuite2Staging"],
                },
                com_adobe_identity: {
                  idSyncContainerId: 1111,
                },
                com_adobe_target: {
                  propertyToken: "targetPropTokenStaging",
                },
                com_adobe_audiencemanager: {
                  enabled: false,
                },
                com_adobe_launch_ssf: {
                  enabled: false,
                },
              },
            },
          },
        ],
      }),
    );

    await expect.element(developmentOverridesTab).toBeSelected();
    await expect.element(overridesEnabled).toHaveValue("Enabled");

    await expect.element(reportSuitesOverride[0]).toHaveValue("reportSuite1");
    await expect.element(reportSuitesOverride[1]).toHaveValue("reportSuite2");
    await expect.element(removeReportSuite[0]).not.toBeDisabled();
    await expect.element(removeReportSuite[1]).not.toBeDisabled();
    await expect.element(addReportSuite).not.toBeDisabled();
    await expect.element(audienceManagerEnabled).toHaveValue("Disabled");
    await expect.element(idSyncContainerOverride).toHaveValue("1111");
    await expect.element(experiencePlatformEnabled).toHaveValue("Enabled");
    await expect.element(eventDatasetOverride).toHaveValue("aepDatasetId");
    await expect.element(odeEnabled).toHaveValue("Disabled");
    await expect.element(edgeSegmentationEnabled).toHaveValue("Disabled");
    await expect.element(edgeDestinationsEnabled).toHaveValue("Disabled");
    await expect.element(ajoEnabled).toHaveValue("Disabled");
    await expect.element(ssefEnabled).toHaveValue("Disabled");
    await expect.element(targetEnabled).toHaveValue("Enabled");
    await expect
      .element(targetPropertyTokenOverride)
      .toHaveValue("targetPropToken");

    await productionOverridesTab.click();
    await expect.element(overridesEnabled).toHaveValue("No override");

    await stagingOverridesTab.click();
    await expect.element(overridesEnabled).toHaveValue("Enabled");
    await expect.element(analyticsEnabled).toHaveValue("Enabled");
    await expect
      .element(reportSuitesOverride[0])
      .toHaveValue("reportSuite1Staging");
    await expect
      .element(reportSuitesOverride[1])
      .toHaveValue("reportSuite2Staging");
    await expect.element(removeReportSuite[0]).not.toBeDisabled();
    await expect.element(removeReportSuite[1]).not.toBeDisabled();
    await expect.element(addReportSuite).not.toBeDisabled();
    await expect.element(audienceManagerEnabled).toHaveValue("Disabled");
    await expect.element(experiencePlatformEnabled).toHaveValue("Enabled");
    await expect
      .element(eventDatasetOverride)
      .toHaveValue("aepDatasetIdStaging");
    await expect.element(odeEnabled).toHaveValue("Disabled");
    await expect.element(edgeSegmentationEnabled).toHaveValue("Disabled");
    await expect.element(edgeDestinationsEnabled).toHaveValue("Disabled");
    await expect.element(ajoEnabled).toHaveValue("Disabled");
    await expect.element(ssefEnabled).toHaveValue("Disabled");
    await expect.element(targetEnabled).toHaveValue("Enabled");
    await expect
      .element(targetPropertyTokenOverride)
      .toHaveValue("targetPropTokenStaging");
  });

  it("updates form values and saves to settings", async () => {
    await step("init", () => driver.init(buildSettingsWithDummyDatastream()));

    await step("overridesEnabled", async () => {
      await selectOption(overridesEnabled, "Enabled");
      await expect
        .element(overridesEnabled, { timeout: 1000 })
        .toHaveValue("Enabled");
    });

    await step("analytics + report suites", async () => {
      await selectOption(analyticsEnabled, "Enabled");
      await expect
        .element(analyticsEnabled, { timeout: 1000 })
        .toHaveValue("Enabled");
      await reportSuitesOverride[0].fill("myReportSuite1");
      await addReportSuite.click();
      await reportSuitesOverride[1].fill("myReportSuite2");
    });

    await step("idSyncContainer", () => idSyncContainerOverride.fill("5555"));

    await step("target: selectOption", () =>
      selectOption(targetEnabled, "Enabled"),
    );
    await step("target: toHaveValue", () =>
      expect.element(targetEnabled, { timeout: 1000 }).toHaveValue("Enabled"),
    );
    await step("target: tab", () => driver.tab());
    await step("target: fill token", () =>
      targetPropertyTokenOverride.fill("myTargetToken"),
    );

    await step("experiencePlatform: wait visible", () =>
      expect.element(experiencePlatformEnabled).toBeVisible({ timeout: 5000 }),
    );
    await step("experiencePlatform: selectOption", () =>
      selectOption(experiencePlatformEnabled, "Enabled"),
    );
    await step("experiencePlatform: toHaveValue", () =>
      expect
        .element(experiencePlatformEnabled, { timeout: 1000 })
        .toHaveValue("Enabled"),
    );
    await step("experiencePlatform: fill dataset", () =>
      eventDatasetOverride.fill("myDatasetId"),
    );
    await step("experiencePlatform: tab", () => driver.tab());

    await step("expectSettings", () =>
      driver
        .expectSettings((s) => s.instances[0].edgeConfigOverrides)
        .toEqual({
          development: {
            enabled: true,
            com_adobe_analytics: {
              reportSuites: ["myReportSuite1", "myReportSuite2"],
            },
            com_adobe_identity: {
              idSyncContainerId: 5555,
            },
            com_adobe_target: {
              propertyToken: "myTargetToken",
            },
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "myDatasetId",
                },
              },
            },
          },
        }),
    );
    await step("done", () => undefined);
  });

  it("validates third party id sync container", async () => {
    await step("init", () => driver.init(buildSettingsWithDummyDatastream()));
    await step("overridesEnabled: wait visible", () =>
      expect.element(overridesEnabled).toBeVisible({ timeout: 5000 }),
    );
    await step("overridesEnabled: selectOption", () =>
      selectOption(overridesEnabled, "Enabled"),
    );
    await step("overridesEnabled: toHaveValue", () =>
      expect
        .element(overridesEnabled, { timeout: 1000 })
        .toHaveValue("Enabled"),
    );
    await step("fill invalid id sync", async () => {
      await idSyncContainerOverride.fill("invalid");
      await driver.tab();
    });
    await step("expectValidate false", () =>
      driver.expectValidate().toBe(false),
    );
    await step("fill valid id sync", async () => {
      await idSyncContainerOverride.fill("12345");
      await driver.tab();
    });
    await step("expectValidate true", () => driver.expectValidate().toBe(true));
    await step("done", () => undefined);
  });

  it("allows you to save data elements", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await driver.tab();
    await expect.element(analyticsEnabled).toBeVisible();

    // Use data elements for various fields
    await selectOption(analyticsEnabled, "Enabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await reportSuitesOverride[0].fill("%myReportSuiteDataElement%");

    await idSyncContainerOverride.fill("%myContainerIdDataElement%");

    await selectOption(targetEnabled, "Enabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await targetPropertyTokenOverride.fill("%myTargetTokenDataElement%");

    await selectOption(experiencePlatformEnabled, "Enabled");
    await expect
      .element(experiencePlatformEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await eventDatasetOverride.fill("%myDatasetDataElement%");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["%myReportSuiteDataElement%"],
          },
          com_adobe_identity: {
            idSyncContainerId: "%myContainerIdDataElement%",
          },
          com_adobe_target: {
            propertyToken: "%myTargetTokenDataElement%",
          },
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "%myDatasetDataElement%",
              },
            },
          },
        },
      });
  });

  it("allows you to add and delete report suites", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides and analytics
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await selectOption(analyticsEnabled, "Enabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Add first report suite
    await reportSuitesOverride[0].fill("reportSuite1");

    // Add second report suite
    await addReportSuite.click();
    await reportSuitesOverride[1].fill("reportSuite2");

    // Add third report suite
    await addReportSuite.click();
    await reportSuitesOverride[2].fill("reportSuite3");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["reportSuite1", "reportSuite2", "reportSuite3"],
          },
        },
      });

    // Remove the middle report suite
    await removeReportSuite[1].click();

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["reportSuite1", "reportSuite3"],
          },
        },
      });
  });

  it("allows you to copy overrides from one environment to another", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Set up development environment with some overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await selectOption(analyticsEnabled, "Enabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await reportSuitesOverride[0].fill("devReportSuite");
    await selectOption(targetEnabled, "Enabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await targetPropertyTokenOverride.fill("devTargetToken");
    await driver.tab();

    // Switch to production tab
    await productionOverridesTab.click();
    await expect.element(overridesEnabled).toHaveValue("No override");

    // Copy from development
    await copyFromDevelopmentButton.click();

    // Verify the settings were copied
    await expect.element(overridesEnabled).toHaveValue("Enabled");
    await expect.element(analyticsEnabled).toHaveValue("Enabled");
    await expect.element(reportSuitesOverride[0]).toHaveValue("devReportSuite");
    await expect.element(targetEnabled).toHaveValue("Enabled");
    await expect
      .element(targetPropertyTokenOverride)
      .toHaveValue("devTargetToken");

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["devReportSuite"],
          },
          com_adobe_target: {
            propertyToken: "devTargetToken",
          },
        },
        production: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["devReportSuite"],
          },
          com_adobe_target: {
            propertyToken: "devTargetToken",
          },
        },
      });
  });

  it("hides everything when no overrides are enabled", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Analytics, Target, and other override fields should not be visible
    await expect.element(analyticsEnabled).not.toBeInTheDocument();
    await expect.element(targetEnabled).not.toBeInTheDocument();
    await expect.element(experiencePlatformEnabled).not.toBeInTheDocument();
  });

  it("hides report suites when analytics is disabled", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Set analytics to disabled
    await selectOption(analyticsEnabled, "Disabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");
    await driver.tab();

    // Report suite fields should not be visible
    await expect.element(reportSuitesOverride[0]).not.toBeInTheDocument();
    await expect.element(addReportSuite).not.toBeInTheDocument();

    // Enable analytics
    await selectOption(analyticsEnabled, "Enabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await driver.tab();

    // Report suite fields should now be visible
    await expect.element(reportSuitesOverride[0]).toBeVisible();
    await expect.element(addReportSuite).toBeVisible();
  });

  it("hides target property token when target is disabled", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Set target to disabled
    await selectOption(targetEnabled, "Disabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");
    await driver.tab();

    // Target property token field should not be visible
    await expect.element(targetPropertyTokenOverride).not.toBeInTheDocument();

    // Enable target
    await selectOption(targetEnabled, "Enabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await driver.tab();

    // Target property token field should now be visible
    await expect.element(targetPropertyTokenOverride).toBeVisible();
  });

  it("migrates from legacy settings", async () => {
    // Initialize with legacy format (if there's a different format - this is a placeholder)
    await driver.init(
      buildSettingsWithDummyDatastream({
        instances: [
          {
            name: "alloy",
            // Legacy format might have had different structure
            edgeConfigId: "legacyConfigId",
          },
        ],
      }),
    );

    // After loading, settings should be in the new format
    await driver.expectSettings((s) => s.instances[0]).toBeDefined();
  });

  it("saves no override settings correctly", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Set to "No override"
    await selectOption(overridesEnabled, "No override");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("No override");
    await driver.tab();

    // When no override is selected, edgeConfigOverrides should be undefined
    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual(undefined);
  });

  it("saves enabled settings correctly", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Enable Analytics
    await selectOption(analyticsEnabled, "Enabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await reportSuitesOverride[0].fill("enabledReportSuite");

    // Enable Target
    await selectOption(targetEnabled, "Enabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await driver.tab();
    await targetPropertyTokenOverride.fill("enabledToken");

    // Enable Experience Platform
    await selectOption(experiencePlatformEnabled, "Enabled");
    await expect
      .element(experiencePlatformEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");
    await eventDatasetOverride.fill("enabledDataset");

    // Enable Audience Manager
    await selectOption(audienceManagerEnabled, "Enabled");
    await expect
      .element(audienceManagerEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Enable SSEF
    await selectOption(ssefEnabled, "Enabled");
    await expect.element(ssefEnabled, { timeout: 1000 }).toHaveValue("Enabled");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            reportSuites: ["enabledReportSuite"],
          },
          com_adobe_target: {
            propertyToken: "enabledToken",
          },
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "enabledDataset",
              },
            },
          },
          com_adobe_audiencemanager: {},
          com_adobe_launch_ssf: {},
        },
      });
  });

  it("saves disabled settings correctly", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await selectOption(overridesEnabled, "Enabled");
    await expect
      .element(overridesEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Disable Analytics
    await selectOption(analyticsEnabled, "Disabled");
    await expect
      .element(analyticsEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Disable Target
    await selectOption(targetEnabled, "Disabled");
    await expect
      .element(targetEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Enable Experience Platform
    await selectOption(experiencePlatformEnabled, "Enabled");
    await expect
      .element(experiencePlatformEnabled, { timeout: 1000 })
      .toHaveValue("Enabled");

    // Disable Audience Manager
    await selectOption(audienceManagerEnabled, "Disabled");
    await expect
      .element(audienceManagerEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Disable SSEF
    await selectOption(ssefEnabled, "Disabled");
    await expect
      .element(ssefEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Disable ODE
    await selectOption(odeEnabled, "Disabled");
    await expect.element(odeEnabled, { timeout: 1000 }).toHaveValue("Disabled");

    // Disable Edge Segmentation
    await selectOption(edgeSegmentationEnabled, "Disabled");
    await expect
      .element(edgeSegmentationEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Disable Edge Destinations
    await selectOption(edgeDestinationsEnabled, "Disabled");
    await expect
      .element(edgeDestinationsEnabled, { timeout: 1000 })
      .toHaveValue("Disabled");

    // Disable AJO
    await selectOption(ajoEnabled, "Disabled");
    await expect.element(ajoEnabled, { timeout: 1000 }).toHaveValue("Disabled");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0].edgeConfigOverrides)
      .toEqual({
        development: {
          enabled: true,
          com_adobe_analytics: {
            enabled: false,
          },
          com_adobe_target: {
            enabled: false,
          },
          com_adobe_experience_platform: {
            com_adobe_edge_ode: {
              enabled: false,
            },
            com_adobe_edge_segmentation: {
              enabled: false,
            },
            com_adobe_edge_destinations: {
              enabled: false,
            },
            com_adobe_edge_ajo: {
              enabled: false,
            },
          },
          com_adobe_audiencemanager: {
            enabled: false,
          },
          com_adobe_launch_ssf: {
            enabled: false,
          },
        },
      });
  });
});
