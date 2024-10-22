/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { bridge } from "../../../../../src/view/components/overrides/overridesBridge";

const FIELD = Object.freeze({
  enabled: "Enabled",
  disabled: "Disabled",
});
const MATCH_FIELD = Object.freeze({
  ...FIELD,
  disabled: "Match datastream configuration",
});

const envs = Object.freeze(["production", "staging", "development"]);

describe("overridesBridge", () => {
  describe("getInstanceDefaults", () => {
    it("should return default values", () => {
      const edgeConfigOverrides = {};
      envs.forEach((env) => {
        edgeConfigOverrides[env] = {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: MATCH_FIELD.disabled,
          com_adobe_experience_platform: {
            enabled: FIELD.enabled,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_segmentation: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: FIELD.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: FIELD.enabled,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: FIELD.enabled,
            propertyToken: "",
          },
          com_adobe_audience_manager: {
            enabled: FIELD.enabled,
          },
          com_adobe_launch_ssf: {
            enabled: FIELD.enabled,
          },
        };
      });
      expect(bridge.getInstanceDefaults()).toEqual({
        edgeConfigOverrides,
      });
    });
  });

  describe("getInitialInstanceValues", () => {
    it("should copy over changed values with default fallbacks", () => {
      const instanceSettings = {
        name: "alloy",
        context: [
          "web",
          "device",
          "environment",
          "placeContext",
          "highEntropyUserAgentHints",
        ],
        sandbox: "prod",
        edgeDomain: "firstparty.alloyio.com",
        edgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7",
        stagingSandbox: "prod",
        onBeforeEventSend:
          '// Pass the ECID from the adobe_mc param if it exists.\n\nconsole.log("IN ON BEFORE EVENT SEND");\n\nvar adobeMcEcid = _satellite.getVar("adobeMcEcid");\n\nif (adobeMcEcid) {\n  // TODO: Expire existing kndctr_ORG ID_AdobeOrg_identity\n  \n  if (!content.xdm.identityMap) {\n    content.xdm.identityMap = {\n      ECID: []\n    }\n  }\n  \n  content.xdm.identityMap.ECID = [{\n    "id": adobeMcEcid,\n    "authenticatedState": "ambiguous"\n  }];\n  \n  console.log("ECID WAS ADDED TO EVENT -> XDM -> IDENTITYMAP");\n}',
        developmentSandbox: "prod",
        edgeConfigOverrides: {
          datastreamIdInputMethod: "freeform",
          development: {
            enabled: true,
            com_adobe_target: {
              enabled: false,
            },
          },
          staging: {
            enabled: true,
            com_adobe_experience_platform: {
              com_adobe_edge_ode: {
                enabled: false,
              },
            },
            com_adobe_target: {
              propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
            },
          },
        },
        stagingEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:stage",
        targetMigrationEnabled: true,
        developmentEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:dev",
        thirdPartyCookiesEnabled: false,
      };

      const instanceValues = bridge.getInitialInstanceValues({
        instanceSettings,
      });
      const expectedEdgeConfigOverrides = {
        development: {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: MATCH_FIELD.enabled,
          com_adobe_experience_platform: {
            enabled: FIELD.enabled,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_segmentation: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: FIELD.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: FIELD.enabled,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: FIELD.disabled,
            propertyToken: "",
          },
          com_adobe_audience_manager: {
            enabled: FIELD.enabled,
          },
          com_adobe_launch_ssf: {
            enabled: FIELD.enabled,
          },
        },
        staging: {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: MATCH_FIELD.enabled,
          com_adobe_experience_platform: {
            enabled: FIELD.enabled,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: FIELD.disabled,
            },
            com_adobe_edge_segmentation: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: FIELD.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: FIELD.enabled,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: FIELD.enabled,
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
          },
          com_adobe_audience_manager: {
            enabled: FIELD.enabled,
          },
          com_adobe_launch_ssf: {
            enabled: FIELD.enabled,
          },
        },
        production: {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: MATCH_FIELD.disabled,
          com_adobe_experience_platform: {
            enabled: FIELD.enabled,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_segmentation: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: FIELD.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: FIELD.enabled,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: FIELD.enabled,
            propertyToken: "",
          },
          com_adobe_audience_manager: {
            enabled: FIELD.enabled,
          },
          com_adobe_launch_ssf: {
            enabled: FIELD.enabled,
          },
        },
      };
      expect(instanceValues).toEqual({
        edgeConfigOverrides: expectedEdgeConfigOverrides,
      });
    });

    it("should copy old settings to new settings", () => {
      const instanceSettings = {
        name: "alloy",
        context: [
          "web",
          "device",
          "environment",
          "placeContext",
          "highEntropyUserAgentHints",
        ],
        sandbox: "prod",
        edgeDomain: "firstparty.alloyio.com",
        edgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7",
        stagingSandbox: "prod",
        onBeforeEventSend:
          '// Pass the ECID from the adobe_mc param if it exists.\n\nconsole.log("IN ON BEFORE EVENT SEND");\n\nvar adobeMcEcid = _satellite.getVar("adobeMcEcid");\n\nif (adobeMcEcid) {\n  // TODO: Expire existing kndctr_ORG ID_AdobeOrg_identity\n  \n  if (!content.xdm.identityMap) {\n    content.xdm.identityMap = {\n      ECID: []\n    }\n  }\n  \n  content.xdm.identityMap.ECID = [{\n    "id": adobeMcEcid,\n    "authenticatedState": "ambiguous"\n  }];\n  \n  console.log("ECID WAS ADDED TO EVENT -> XDM -> IDENTITYMAP");\n}',
        developmentSandbox: "prod",
        edgeConfigOverrides: {
          datastreamIdInputMethod: "freeform",
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
          },
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6335faf30f5a161c0b4b1444",
              },
            },
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"],
          },
          com_adobe_identity: {
            idSyncContainerId: 30793,
          },
        },
        stagingEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:stage",
        targetMigrationEnabled: true,
        developmentEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:dev",
        thirdPartyCookiesEnabled: false,
      };

      const instanceValues = bridge.getInitialInstanceValues({
        instanceSettings,
      });
      const edgeConfigOverrides = {};
      envs.forEach((env) => {
        edgeConfigOverrides[env] = {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: MATCH_FIELD.enabled,
          com_adobe_experience_platform: {
            enabled: FIELD.enabled,
            datasets: {
              event: {
                datasetId: "6335faf30f5a161c0b4b1444",
              },
            },
            com_adobe_edge_ode: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_segmentation: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: FIELD.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: FIELD.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: FIELD.enabled,
            reportSuites: ["unifiedjsqeonly2"],
          },
          com_adobe_identity: {
            idSyncContainerId: "30793",
          },
          com_adobe_launch_ssf: {
            enabled: FIELD.enabled,
          },
          com_adobe_audience_manager: {
            enabled: FIELD.enabled,
          },
          com_adobe_target: {
            enabled: FIELD.enabled,
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
          },
        };
      });
      expect(instanceValues).toEqual({
        edgeConfigOverrides,
      });
    });

    it("should enable edgeConfigOverrides if there is no 'enabled' field but there are other overrides", () => {
      const instanceSettings = {
        edgeConfigOverrides: {
          development: {
            com_adobe_identity: {
              idSyncContainerId: 123123,
            },
          },
        },
      };
      const result = bridge.getInitialInstanceValues({
        instanceSettings,
      });
      expect(result).toEqual({
        edgeConfigOverrides: {
          development: {
            sandbox: "",
            datastreamId: "",
            datastreamIdInputMethod: "freeform",
            enabled: MATCH_FIELD.enabled,
            com_adobe_experience_platform: {
              enabled: FIELD.enabled,
              datasets: {
                event: {
                  datasetId: "",
                },
              },
              com_adobe_edge_ode: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_segmentation: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_destinations: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_ajo: {
                enabled: FIELD.enabled,
              },
            },
            com_adobe_analytics: {
              enabled: FIELD.enabled,
              reportSuites: [""],
            },
            com_adobe_identity: {
              idSyncContainerId: "123123",
            },
            com_adobe_target: {
              enabled: FIELD.enabled,
              propertyToken: "",
            },
            com_adobe_audience_manager: {
              enabled: FIELD.enabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.enabled,
            },
          },
          staging: {
            sandbox: "",
            datastreamId: "",
            datastreamIdInputMethod: "freeform",
            enabled: MATCH_FIELD.disabled,
            com_adobe_experience_platform: {
              enabled: FIELD.enabled,
              datasets: {
                event: {
                  datasetId: "",
                },
              },
              com_adobe_edge_ode: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_segmentation: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_destinations: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_ajo: {
                enabled: FIELD.enabled,
              },
            },
            com_adobe_analytics: {
              enabled: FIELD.enabled,
              reportSuites: [""],
            },
            com_adobe_identity: {
              idSyncContainerId: undefined,
            },
            com_adobe_target: {
              enabled: FIELD.enabled,
              propertyToken: "",
            },
            com_adobe_audience_manager: {
              enabled: FIELD.enabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.enabled,
            },
          },
          production: {
            sandbox: "",
            datastreamId: "",
            datastreamIdInputMethod: "freeform",
            enabled: MATCH_FIELD.disabled,
            com_adobe_experience_platform: {
              enabled: FIELD.enabled,
              datasets: {
                event: {
                  datasetId: "",
                },
              },
              com_adobe_edge_ode: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_segmentation: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_destinations: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_ajo: {
                enabled: FIELD.enabled,
              },
            },
            com_adobe_analytics: {
              enabled: FIELD.enabled,
              reportSuites: [""],
            },
            com_adobe_identity: {
              idSyncContainerId: undefined,
            },
            com_adobe_target: {
              enabled: FIELD.enabled,
              propertyToken: "",
            },
            com_adobe_audience_manager: {
              enabled: FIELD.enabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.enabled,
            },
          },
        },
      });
    });

    it("should convert from booleans to 'Enabled' and 'Disabled' ", () => {
      const enabledEdgeConfigOverrides = envs.reduce(
        (acc, env) => ({
          ...acc,
          [env]: {
            enabled: true,
            com_adobe_experience_platform: {
              enabled: true,
              com_adobe_edge_ode: {
                enabled: true,
              },
              com_adobe_edge_segmentation: {
                enabled: true,
              },
              com_adobe_edge_destinations: {
                enabled: true,
              },
              com_adobe_edge_ajo: {
                enabled: true,
              },
            },
            com_adobe_analytics: {
              enabled: true,
            },
            com_adobe_target: {
              enabled: true,
            },
            com_adobe_audience_manager: {
              enabled: true,
            },
            com_adobe_launch_ssf: {
              enabled: true,
            },
          },
        }),
        {},
      );
      expect(
        bridge.getInitialInstanceValues({
          instanceSettings: {
            edgeConfigOverrides: enabledEdgeConfigOverrides,
          },
        }),
      ).toEqual({
        edgeConfigOverrides: envs.reduce(
          (acc, env) => ({
            ...acc,
            [env]: {
              enabled: MATCH_FIELD.enabled,
              com_adobe_experience_platform: {
                enabled: FIELD.enabled,
                com_adobe_edge_ode: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.enabled,
                },
                datasets: {
                  event: {
                    datasetId: "",
                  },
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.enabled,
                reportSuites: [""],
              },
              com_adobe_target: {
                enabled: FIELD.enabled,
                propertyToken: "",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.enabled,
              },
              com_adobe_launch_ssf: {
                enabled: FIELD.enabled,
              },
              com_adobe_identity: {
                idSyncContainerId: undefined,
              },
              datastreamId: "",
              datastreamIdInputMethod: "freeform",
              sandbox: "",
            },
          }),
          {},
        ),
      });

      const disabledEdgeConfigOverrides = envs.reduce(
        (acc, env) => ({
          ...acc,
          [env]: {
            enabled: true,
            com_adobe_experience_platform: {
              enabled: false,
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
              enabled: false,
            },
            com_adobe_target: {
              enabled: false,
            },
            com_adobe_audience_manager: {
              enabled: false,
            },
            com_adobe_launch_ssf: {
              enabled: false,
            },
          },
        }),
        {},
      );
      expect(
        bridge.getInitialInstanceValues({
          instanceSettings: {
            edgeConfigOverrides: disabledEdgeConfigOverrides,
          },
        }),
      ).toEqual({
        edgeConfigOverrides: envs.reduce(
          (acc, env) => ({
            ...acc,
            [env]: {
              enabled: MATCH_FIELD.enabled,
              com_adobe_experience_platform: {
                enabled: FIELD.disabled,
                com_adobe_edge_ode: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.disabled,
                },
                datasets: {
                  event: {
                    datasetId: "",
                  },
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.disabled,
                reportSuites: [""],
              },
              com_adobe_target: {
                enabled: FIELD.disabled,
                propertyToken: "",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.disabled,
              },
              com_adobe_launch_ssf: {
                enabled: FIELD.disabled,
              },
              com_adobe_identity: {
                idSyncContainerId: undefined,
              },
              datastreamId: "",
              datastreamIdInputMethod: "freeform",
              sandbox: "",
            },
          }),
          {},
        ),
      });
    });

    it("should not convert data elements to Enabled/Disabled", () => {
      const dataElementEdgeConfigOverrides = envs.reduce(
        (acc, env) => ({
          ...acc,
          [env]: {
            enabled: "%Data element of enabledness%",
            com_adobe_experience_platform: {
              enabled: "%Data element of enabledness%",
              com_adobe_edge_ode: {
                enabled: "%Data element of enabledness%",
              },
              com_adobe_edge_segmentation: {
                enabled: "%Data element of enabledness%",
              },
              com_adobe_edge_destinations: {
                enabled: "%Data element of enabledness%",
              },
              com_adobe_edge_ajo: {
                enabled: "%Data element of enabledness%",
              },
            },
            com_adobe_analytics: {
              enabled: "%Data element of enabledness%",
            },
            com_adobe_target: {
              enabled: "%Data element of enabledness%",
            },
            com_adobe_audience_manager: {
              enabled: "%Data element of enabledness%",
            },
            com_adobe_launch_ssf: {
              enabled: "%Data element of enabledness%",
            },
          },
        }),
        {},
      );
      expect(
        bridge.getInitialInstanceValues({
          instanceSettings: {
            edgeConfigOverrides: dataElementEdgeConfigOverrides,
          },
        }),
      ).toEqual({
        edgeConfigOverrides: envs.reduce(
          (acc, env) => ({
            ...acc,
            [env]: {
              datastreamId: "",
              datastreamIdInputMethod: "freeform",
              sandbox: "",
              enabled: "%Data element of enabledness%",
              com_adobe_experience_platform: {
                enabled: "%Data element of enabledness%",
                com_adobe_edge_ode: {
                  enabled: "%Data element of enabledness%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data element of enabledness%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data element of enabledness%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data element of enabledness%",
                },
                datasets: {
                  event: {
                    datasetId: "",
                  },
                },
              },
              com_adobe_analytics: {
                enabled: "%Data element of enabledness%",
                reportSuites: [""],
              },
              com_adobe_target: {
                enabled: "%Data element of enabledness%",
                propertyToken: "",
              },
              com_adobe_audience_manager: {
                enabled: "%Data element of enabledness%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data element of enabledness%",
              },
              com_adobe_identity: {
                idSyncContainerId: undefined,
              },
            },
          }),
          {},
        ),
      });
    });

    it("should fill in with defaults if edgeConfigOverrides is disabled", () => {
      const enabledEdgeConfigOverrides = envs.reduce(
        (acc, env) => ({
          ...acc,
          [env]: {
            enabled: false,
          },
        }),
        {},
      );
      expect(
        bridge.getInitialInstanceValues({
          instanceSettings: {
            edgeConfigOverrides: enabledEdgeConfigOverrides,
          },
        }),
      ).toEqual({
        edgeConfigOverrides: envs.reduce(
          (acc, env) => ({
            ...acc,
            [env]: {
              enabled: MATCH_FIELD.disabled,
              com_adobe_experience_platform: {
                enabled: FIELD.enabled,
                com_adobe_edge_ode: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.enabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.enabled,
                },
                datasets: {
                  event: {
                    datasetId: "",
                  },
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.enabled,
                reportSuites: [""],
              },
              com_adobe_target: {
                enabled: FIELD.enabled,
                propertyToken: "",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.enabled,
              },
              com_adobe_launch_ssf: {
                enabled: FIELD.enabled,
              },
              com_adobe_identity: {
                idSyncContainerId: undefined,
              },
              datastreamId: "",
              datastreamIdInputMethod: "freeform",
              sandbox: "",
            },
          }),
          {},
        ),
      });
    });
  });

  describe("getInstanceSettings", () => {
    it("should copy over changed values", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            sandbox: "prod",
            datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
            datastreamIdInputMethod: "freeform",
            enabled: MATCH_FIELD.enabled,
            com_adobe_experience_platform: {
              enabled: FIELD.disabled,
              datasets: {
                event: {
                  datasetId: "",
                },
              },
              com_adobe_edge_ode: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_segmentation: {
                enabled: FIELD.disabled,
              },
              com_adobe_edge_destinations: {
                enabled: FIELD.disabled,
              },
              com_adobe_edge_ajo: {
                enabled: FIELD.disabled,
              },
            },
            com_adobe_analytics: {
              enabled: FIELD.enabled,
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
            },
            com_adobe_identity: {
              idSyncContainerId: 105012,
            },
            com_adobe_target: {
              enabled: FIELD.enabled,
              propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
            },
            com_adobe_audience_manager: {
              enabled: FIELD.disabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.disabled,
            },
          },
        },
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues,
      });

      expect(instanceSettings).toEqual({
        // don't expect enabled: true, as that is the default value (except for
        // the top-level enabled field, which defaults to enabled: false)
        edgeConfigOverrides: {
          development: {
            sandbox: "prod",
            datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
            enabled: true,
            com_adobe_experience_platform: {
              enabled: false,
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
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
            },
            com_adobe_identity: {
              idSyncContainerId: 105012,
            },
            com_adobe_target: {
              propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
            },
            com_adobe_audience_manager: {
              enabled: false,
            },
            com_adobe_launch_ssf: {
              enabled: false,
            },
          },
        },
      });
    });

    it("should trim all values of whitespace", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            enabled: "   Enabled   ",
            com_adobe_target: {
              enabled: "   Disabled   ",
            },
            com_adobe_experience_platform: {
              enabled: "   Disabled   ",
              com_adobe_edge_ode: {
                enabled: "   Disabled   ",
              },
              com_adobe_edge_segmentation: {
                enabled: "   Disabled   ",
              },
              com_adobe_edge_destinations: {
                enabled: "   Disabled   ",
              },
              com_adobe_edge_ajo: {
                enabled: "   Disabled   ",
              },
            },
            com_adobe_analytics: {
              enabled: "   Disabled   ",
            },
            com_adobe_identity: {
              idSyncContainerId: 30793,
            },
            com_adobe_audience_manager: {},
            com_adobe_launch_ssf: {
              enabled: "   Disabled   ",
            },
          },
        },
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues,
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            enabled: true,
            com_adobe_target: {
              enabled: false,
            },
            com_adobe_experience_platform: {
              enabled: false,
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
              enabled: false,
            },
            com_adobe_identity: {
              idSyncContainerId: 30793,
            },
            com_adobe_launch_ssf: {
              enabled: false,
            },
          },
        },
      });
    });

    it("should remove empty report suites", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            enabled: FIELD.enabled,
            com_adobe_analytics: {
              reportSuites: [
                "",
                "unifiedjsqeonly2",
                "",
                "unifiedjsqeonly3",
                "",
              ],
            },
          },
        },
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues,
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            enabled: true,
            com_adobe_analytics: {
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"],
            },
          },
        },
      });
    });

    it("should allow for data elements", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            enabled: "%Data Element 0%",
            com_adobe_target: {
              enabled: "%Data Element 0%",
              propertyToken: "%Data Element 1%",
            },
            com_adobe_experience_platform: {
              enabled: "%Data Element 0%",
              datasets: {
                event: {
                  datasetId: "%Data Element 2%",
                },
              },
              com_adobe_edge_ode: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_segmentation: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_destinations: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_ajo: {
                enabled: "%Data Element 0%",
              },
            },
            com_adobe_analytics: {
              enabled: "%Data Element 0%",
              reportSuites: ["%Data Element 3%", "%Data Element 4%"],
            },
            com_adobe_identity: {
              idSyncContainerId: "%Data Element 5%",
            },
            com_adobe_audience_manager: {
              enabled: "%Data Element 0%",
            },
            com_adobe_launch_ssf: {
              enabled: "%Data Element 0%",
            },
          },
        },
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues,
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            enabled: "%Data Element 0%",
            com_adobe_target: {
              enabled: "%Data Element 0%",
              propertyToken: "%Data Element 1%",
            },
            com_adobe_experience_platform: {
              enabled: "%Data Element 0%",
              datasets: {
                event: {
                  datasetId: "%Data Element 2%",
                },
              },
              com_adobe_edge_ode: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_segmentation: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_destinations: {
                enabled: "%Data Element 0%",
              },
              com_adobe_edge_ajo: {
                enabled: "%Data Element 0%",
              },
            },
            com_adobe_analytics: {
              enabled: "%Data Element 0%",
              reportSuites: ["%Data Element 3%", "%Data Element 4%"],
            },
            com_adobe_identity: {
              idSyncContainerId: "%Data Element 5%",
            },
            com_adobe_audience_manager: {
              enabled: "%Data Element 0%",
            },
            com_adobe_launch_ssf: {
              enabled: "%Data Element 0%",
            },
          },
        },
      });
    });

    it("should remove edgeConfigOverrides if it is empty or contains only the default sandbox value", () => {
      expect(
        bridge.getInstanceSettings({
          instanceValues: {
            edgeConfigOverrides: { development: { sandbox: "prod" } },
          },
        }),
      ).toEqual({});
      expect(bridge.getInstanceSettings({ instanceValues: {} })).toEqual({});
    });

    it("should remove edgeConfigOverrides for an env if they are disabled", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            sandbox: "prod",
            datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
            datastreamIdInputMethod: "freeform",
            enabled: MATCH_FIELD.disabled,
            com_adobe_experience_platform: {
              enabled: FIELD.disabled,
              datasets: {
                event: {
                  datasetId: "6335dd690894431c07237f2d",
                },
              },
              com_adobe_edge_ode: {
                enabled: FIELD.enabled,
              },
              com_adobe_edge_segmentation: {
                enabled: FIELD.disabled,
              },
              com_adobe_edge_destinations: {
                enabled: FIELD.disabled,
              },
              com_adobe_edge_ajo: {
                enabled: FIELD.disabled,
              },
            },
            com_adobe_analytics: {
              enabled: FIELD.disabled,
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
            },
            com_adobe_identity: {
              idSyncContainerId: 105012,
            },
            com_adobe_target: {
              enabled: FIELD.disabled,
              propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
            },
            com_adobe_audience_manager: {
              enabled: FIELD.disabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.disabled,
            },
          },
          staging: {
            sandbox: "prod",
            datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
            datastreamIdInputMethod: "freeform",
            enabled: FIELD.enabled,
            com_adobe_experience_platform: {
              enabled: FIELD.disabled,
            },
            com_adobe_analytics: {
              enabled: FIELD.disabled,
            },
            com_adobe_identity: {
              idSyncContainerId: 105012,
            },
            com_adobe_target: {
              enabled: FIELD.disabled,
            },
            com_adobe_audience_manager: {
              enabled: FIELD.disabled,
            },
            com_adobe_launch_ssf: {
              enabled: FIELD.disabled,
            },
          },
        },
      };
      const instanceSettings = bridge.getInstanceSettings({
        instanceValues,
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          staging: {
            sandbox: "prod",
            datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
            enabled: true,
            com_adobe_experience_platform: {
              enabled: false,
            },
            com_adobe_analytics: {
              enabled: false,
            },
            com_adobe_identity: {
              idSyncContainerId: 105012,
            },
            com_adobe_target: {
              enabled: false,
            },
            com_adobe_audience_manager: {
              enabled: false,
            },
            com_adobe_launch_ssf: {
              enabled: false,
            },
          },
        },
      });
    });
  });

  describe("formikStateValidationSchema", () => {
    it("should return a yup schema", () => {
      const schema = bridge.formikStateValidationSchema;
      expect(schema).toBeDefined();
    });

    it("should validate the edge config overrides", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          ...bridge.getInstanceDefaults(),
        });
      }).not.toThrow();
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              sandbox: "prod",
              enabled: MATCH_FIELD.enabled,
              datastreamId: "aca8c786-4940-442f-ace5-7c4aba02118e",
              datastreamIdInputMethod: "freeform",
              com_adobe_experience_platform: {
                enabled: FIELD.disabled,
                datasets: {
                  event: {
                    datasetId: "6335dd690894431c07237f2d",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.disabled,
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.disabled,
                reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
              },
              com_adobe_identity: {
                idSyncContainerId: 105012,
              },
              com_adobe_target: {
                enabled: FIELD.disabled,
                propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.disabled,
              },
              com_adobe_launch_ssf: {
                enabled: FIELD.disabled,
              },
            },
          },
        });
      }).not.toThrow();
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              enabled: MATCH_FIELD.enabled,
              com_adobe_experience_platform: {
                enabled: FIELD.disabled,
                datasets: {
                  event: {
                    datasetId: "6335dd690894431c07237f2d",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.disabled,
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.disabled,
                reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
              },
              com_adobe_identity: {
                idSyncContainerId: 105012,
              },
              com_adobe_target: {
                enabled: FIELD.disabled,
                propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.disabled,
              },
            },
            staging: {
              enabled: MATCH_FIELD.enabled,
              com_adobe_experience_platform: {
                enabled: FIELD.disabled,
                datasets: {
                  event: {
                    datasetId: "6335dd690894431c07237f2d",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.disabled,
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.disabled,
                reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
              },
              com_adobe_identity: {
                idSyncContainerId: 105012,
              },
              com_adobe_target: {
                enabled: FIELD.disabled,
                propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.disabled,
              },
            },
            production: {
              enabled: MATCH_FIELD.enabled,
              com_adobe_experience_platform: {
                enabled: FIELD.disabled,
                datasets: {
                  event: {
                    datasetId: "6335dd690894431c07237f2d",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_segmentation: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_destinations: {
                  enabled: FIELD.disabled,
                },
                com_adobe_edge_ajo: {
                  enabled: FIELD.disabled,
                },
              },
              com_adobe_analytics: {
                enabled: FIELD.disabled,
                reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonlylatest"],
              },
              com_adobe_identity: {
                idSyncContainerId: 105012,
              },
              com_adobe_target: {
                enabled: FIELD.disabled,
                propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
              },
              com_adobe_audience_manager: {
                enabled: FIELD.disabled,
              },
            },
          },
        });
      }).not.toThrow();
    });

    it("should coerce the id sync container is a string", () => {
      expect(() => {
        const value = bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: "30793",
              },
            },
          },
        });
        expect(
          value.edgeConfigOverrides.development.com_adobe_identity
            .idSyncContainerId,
        ).toBe(30793);
      }).not.toThrow();
    });

    it("validates data elements", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_target: {
                enabled: "%Data Element 0%",
                propertyToken: "%Data Element 1%",
              },
              com_adobe_experience_platform: {
                enabled: "%Data Element 0%",
                datasets: {
                  event: {
                    datasetId: "%Data Element 2%",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data Element 0%",
                },
              },
              com_adobe_analytics: {
                enabled: "%Data Element 0%",
                reportSuites: ["%Data Element 3%", "%Data Element 4%"],
              },
              com_adobe_identity: {
                idSyncContainerId: "%Data Element 5%",
              },
              com_adobe_audience_manager: {
                enabled: "%Data Element 0%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data Element 0%",
              },
            },
            staging: {
              com_adobe_target: {
                enabled: "%Data Element 0%",
                propertyToken: "%Data Element 1%",
              },
              com_adobe_experience_platform: {
                enabled: "%Data Element 0%",
                datasets: {
                  event: {
                    datasetId: "%Data Element 2%",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data Element 0%",
                },
              },
              com_adobe_analytics: {
                enabled: "%Data Element 0%",
                reportSuites: ["%Data Element 3%", "%Data Element 4%"],
              },
              com_adobe_identity: {
                idSyncContainerId: "%Data Element 5%",
              },
              com_adobe_audience_manager: {
                enabled: "%Data Element 0%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data Element 0%",
              },
            },
            production: {
              com_adobe_target: {
                enabled: "%Data Element 0%",
                propertyToken: "%Data Element 1%",
              },
              com_adobe_experience_platform: {
                enabled: "%Data Element 0%",
                datasets: {
                  event: {
                    datasetId: "%Data Element 2%",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data Element 0%",
                },
              },
              com_adobe_analytics: {
                enabled: "%Data Element 0%",
                reportSuites: ["%Data Element 3%", "%Data Element 4%"],
              },
              com_adobe_identity: {
                idSyncContainerId: "%Data Element 5%",
              },
              com_adobe_audience_manager: {
                enabled: "%Data Element 0%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data Element 0%",
              },
            },
          },
        });
      }).not.toThrow();
    });

    it("validates partial data elements", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_target: {
                enabled: "%Data Element 0%",
                propertyToken: "%Data Element 1%werwer%Data Element 0%",
              },
              com_adobe_experience_platform: {
                enabled: "%Data Element 0%",
                datasets: {
                  event: {
                    datasetId:
                      "%Data Element 2%%Data Element 0%%Data Element 0%",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data Element 0%",
                },
              },
              com_adobe_analytics: {
                enabled: "%Data Element 0%",
                reportSuites: [
                  "asdfasd%Data Element 3%werwer",
                  "asdfasd%Data Element 4%werwer",
                ],
              },
              com_adobe_identity: {
                idSyncContainerId: "were%Data Element 5%rrerer",
              },
              com_adobe_audience_manager: {
                enabled: "%Data Element 0%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data Element 0%",
              },
            },
          },
        });
      }).not.toThrow();
    });

    it("does not accept partial or multiple data elements in the `enabled` fields", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_target: {
                enabled: "%Data Element 1%werwer%Data Element 0%",
                propertyToken: "%Data Element 1%werwer%Data Element 0%",
              },
              com_adobe_experience_platform: {
                enabled: "asdfasd%Data Element 0%",
                datasets: {
                  event: {
                    datasetId:
                      "%Data Element 2%%Data Element 0%%Data Element 0%",
                  },
                },
                com_adobe_edge_ode: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_segmentation: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_destinations: {
                  enabled: "%Data Element 0%",
                },
                com_adobe_edge_ajo: {
                  enabled: "%Data Element 0%",
                },
              },
              com_adobe_analytics: {
                enabled: "%Data Element 0%",
                reportSuites: [
                  "asdfasd%Data Element 3%werwer",
                  "asdfasd%Data Element 4%werwer",
                ],
              },
              com_adobe_identity: {
                idSyncContainerId: "were%Data Element 5%rrerer",
              },
              com_adobe_audience_manager: {
                enabled: "%Data Element 0%",
              },
              com_adobe_launch_ssf: {
                enabled: "%Data Element 0%",
              },
            },
          },
        });
      }).toThrow();
    });

    it("gives friendly errors", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: "not a number",
              },
            },
          },
        }),
      ).toThrowMatching((value) => /Please/.test(value?.message ?? value));
    });

    it("rejects negative and non-integer idSyncContainerId", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: -1,
              },
            },
          },
        }),
      ).toThrow();

      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: 1.1,
              },
            },
          },
        }),
      ).toThrow();
    });

    it("allows for empty string entries", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                datasets: {
                  event: {
                    datasetId: "",
                  },
                },
              },
              com_adobe_analytics: {
                reportSuites: [""],
              },
              com_adobe_identity: {
                idSyncContainerId: "",
              },
              com_adobe_target: {
                propertyToken: "",
              },
            },
          },
        }),
      ).not.toThrow();
    });

    it("allows for null and undefined entries", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                enabled: null,
                datasets: {
                  event: {
                    datasetId: null,
                  },
                },
                com_adobe_edge_ode: {
                  enabled: null,
                },
                com_adobe_edge_segmentation: {
                  enabled: null,
                },
                com_adobe_edge_destinations: {
                  enabled: null,
                },
                com_adobe_edge_ajo: {
                  enabled: null,
                },
              },
              com_adobe_analytics: {
                reportSuites: null,
              },
              com_adobe_identity: {
                idSyncContainerId: null,
              },
              com_adobe_target: {
                propertyToken: null,
              },
              com_adobe_audience_manager: {
                enabled: null,
              },
              com_adobe_launch_ssf: {
                enabled: null,
              },
            },
          },
        }),
      ).not.toThrow();

      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                enabled: undefined,
                datasets: {
                  event: {
                    datasetId: undefined,
                  },
                },
                com_adobe_edge_ode: {
                  enabled: undefined,
                },
                com_adobe_edge_segmentation: {
                  enabled: undefined,
                },
                com_adobe_edge_destinations: {
                  enabled: undefined,
                },
                com_adobe_edge_ajo: {
                  enabled: undefined,
                },
              },
              com_adobe_analytics: {
                reportSuites: undefined,
              },
              com_adobe_identity: {
                idSyncContainerId: undefined,
              },
              com_adobe_target: {
                propertyToken: undefined,
              },
              com_adobe_audience_manager: {
                enabled: undefined,
              },
              com_adobe_launch_ssf: {
                enabled: undefined,
              },
            },
          },
        }),
      ).not.toThrow();
    });
  });
});
