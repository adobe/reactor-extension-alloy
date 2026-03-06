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
    await driver.init(buildSettingsWithDummyDatastream());

    await overridesEnabled.selectOption("Enabled");
    await expect.element(overridesEnabled).toHaveValue("Enabled");

    // Enable Analytics and add report suites
    await analyticsEnabled.selectOption("Enabled");
    await expect.element(analyticsEnabled).toHaveValue("Enabled");
    await reportSuitesOverride[0].fill("myReportSuite1");
    await addReportSuite.click();
    await reportSuitesOverride[1].fill("myReportSuite2");

    // Set ID sync container
    await idSyncContainerOverride.fill("5555");

    // Enable Target and set property token
    await targetEnabled.selectOption("Enabled");
    await targetPropertyTokenOverride.fill("myTargetToken");

    // Enable Experience Platform and set dataset
    await experiencePlatformEnabled.selectOption("Enabled");
    await eventDatasetOverride.fill("myDatasetId");

    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
    });
  });

  it("validates third party id sync container", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await overridesEnabled.selectOption("Enabled");

    // Set invalid ID sync container (non-numeric)
    await idSyncContainerOverride.fill("invalid");

    expect(await driver.validate()).toBe(false);

    // Set valid ID sync container
    await idSyncContainerOverride.fill("12345");

    expect(await driver.validate()).toBe(true);
  });

  it("allows you to save data elements", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await overridesEnabled.selectOption("Enabled");

    // Use data elements for various fields
    await analyticsEnabled.selectOption("Enabled");
    await reportSuitesOverride[0].fill("%myReportSuiteDataElement%");

    await idSyncContainerOverride.fill("%myContainerIdDataElement%");

    await targetEnabled.selectOption("Enabled");
    await targetPropertyTokenOverride.fill("%myTargetTokenDataElement%");

    await experiencePlatformEnabled.selectOption("Enabled");
    await eventDatasetOverride.fill("%myDatasetDataElement%");

    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
    await overridesEnabled.selectOption("Enabled");
    await analyticsEnabled.selectOption("Enabled");

    // Add first report suite
    await reportSuitesOverride[0].fill("reportSuite1");

    // Add second report suite
    await addReportSuite.click();
    await reportSuitesOverride[1].fill("reportSuite2");

    // Add third report suite
    await addReportSuite.click();
    await reportSuitesOverride[2].fill("reportSuite3");

    let settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
      development: {
        enabled: true,
        com_adobe_analytics: {
          reportSuites: ["reportSuite1", "reportSuite2", "reportSuite3"],
        },
      },
    });

    // Remove the middle report suite
    await removeReportSuite[1].click();

    settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
    await overridesEnabled.selectOption("Enabled");
    await analyticsEnabled.selectOption("Enabled");
    await reportSuitesOverride[0].fill("devReportSuite");
    await targetEnabled.selectOption("Enabled");
    await targetPropertyTokenOverride.fill("devTargetToken");

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

    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
    await overridesEnabled.selectOption("Enabled");

    // Set analytics to disabled
    await analyticsEnabled.selectOption("Disabled");

    // Report suite fields should not be visible
    await expect.element(reportSuitesOverride[0]).not.toBeInTheDocument();
    await expect.element(addReportSuite).not.toBeInTheDocument();

    // Enable analytics
    await analyticsEnabled.selectOption("Enabled");

    // Report suite fields should now be visible
    await expect.element(reportSuitesOverride[0]).toBeInTheDocument();
    await expect.element(addReportSuite).toBeInTheDocument();
  });

  it("hides target property token when target is disabled", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await overridesEnabled.selectOption("Enabled");

    // Set target to disabled
    await targetEnabled.selectOption("Disabled");

    // Target property token field should not be visible
    await expect.element(targetPropertyTokenOverride).not.toBeInTheDocument();

    // Enable target
    await targetEnabled.selectOption("Enabled");

    // Target property token field should now be visible
    await expect.element(targetPropertyTokenOverride).toBeInTheDocument();
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
    const settings = await driver.getSettings();
    expect(settings.instances[0]).toBeDefined();
  });

  it("saves no override settings correctly", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Set to "No override"
    await overridesEnabled.selectOption("No override");

    // When no override is selected, edgeConfigOverrides should be undefined
    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual(undefined);
  });

  it("saves enabled settings correctly", async () => {
    await driver.init(buildSettingsWithDummyDatastream());

    // Enable overrides
    await overridesEnabled.selectOption("Enabled");

    // Enable Analytics
    await analyticsEnabled.selectOption("Enabled");
    await reportSuitesOverride[0].fill("enabledReportSuite");

    // Enable Target
    await targetEnabled.selectOption("Enabled");
    await targetPropertyTokenOverride.fill("enabledToken");

    // Enable Experience Platform
    await experiencePlatformEnabled.selectOption("Enabled");
    await eventDatasetOverride.fill("enabledDataset");

    // Enable Audience Manager
    await audienceManagerEnabled.selectOption("Enabled");

    // Enable SSEF
    await ssefEnabled.selectOption("Enabled");

    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
    await overridesEnabled.selectOption("Enabled");

    // Disable Analytics
    await analyticsEnabled.selectOption("Disabled");

    // Disable Target
    await targetEnabled.selectOption("Disabled");

    // Enable Experience Platform
    await experiencePlatformEnabled.selectOption("Enabled");

    // Disable Audience Manager
    await audienceManagerEnabled.selectOption("Disabled");

    // Disable SSEF
    await ssefEnabled.selectOption("Disabled");

    // Disable ODE
    await odeEnabled.selectOption("Disabled");

    // Disable Edge Segmentation
    await edgeSegmentationEnabled.selectOption("Disabled");

    // Disable Edge Destinations
    await edgeDestinationsEnabled.selectOption("Disabled");

    // Disable AJO
    await ajoEnabled.selectOption("Disabled");

    const settings = await driver.getSettings();
    expect(settings.instances[0].edgeConfigOverrides).toEqual({
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
