// eslint-disable-next-line import/extensions
import { bridge } from "../../../../src/view/components/overrides/overridesBridge.js";

describe("overridesBridge", () => {
  describe("getInstanceDefaults", () => {
    it("should return default values", () => {
      expect(bridge.getInstanceDefaults()).toEqual({
        edgeConfigOverrides: {
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: ""
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: [""]
          },
          com_adobe_identity: {
            idSyncContainerId: ""
          },
          com_adobe_target: {
            propertyToken: ""
          }
        }
      });
    });
  });

  describe("getInitialInstanceValues", () => {
    it("it should copy over changed values with default fallbacks", () => {
      const instanceSettings = {
        name: "alloy",
        context: [
          "web",
          "device",
          "environment",
          "placeContext",
          "highEntropyUserAgentHints"
        ],
        sandbox: "prod",
        edgeDomain: "firstparty.alloyio.com",
        edgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7",
        stagingSandbox: "prod",
        onBeforeEventSend:
          '// Pass the ECID from the adobe_mc param if it exists.\n\nconsole.log("IN ON BEFORE EVENT SEND");\n\nvar adobeMcEcid = _satellite.getVar("adobeMcEcid");\n\nif (adobeMcEcid) {\n  // TODO: Expire existing kndctr_ORG ID_AdobeOrg_identity\n  \n  if (!content.xdm.identityMap) {\n    content.xdm.identityMap = {\n      ECID: []\n    }\n  }\n  \n  content.xdm.identityMap.ECID = [{\n    "id": adobeMcEcid,\n    "authenticatedState": "ambiguous"\n  }];\n  \n  console.log("ECID WAS ADDED TO EVENT -> XDM -> IDENTITYMAP");\n}',
        developmentSandbox: "prod",
        edgeConfigOverrides: {
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          }
        },
        stagingEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:stage",
        targetMigrationEnabled: true,
        developmentEdgeConfigId: "140a1d7d-90ac-44d4-921e-6bb819da36b7:dev",
        thirdPartyCookiesEnabled: false
      };

      const instanceValues = bridge.getInitialInstanceValues({
        instanceSettings
      });
      expect(instanceValues).toEqual({
        edgeConfigOverrides: {
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          },
          com_adobe_analytics: {
            reportSuites: [""]
          },
          com_adobe_identity: {
            idSyncContainerId: ""
          },
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: ""
              }
            }
          }
        }
      });
    });
  });

  describe("getInstanceSettings", () => {});

  describe("formikStateValidationSchema", () => {});
});
