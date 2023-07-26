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
// eslint-disable-next-line import/extensions
import { bridge } from "../../../../../src/view/components/overrides/overridesBridge.js";

describe("overridesBridge", () => {
  describe("getInstanceDefaults", () => {
    it("should return default values", () => {
      const edgeConfigOverrides = {};
      ["production", "staging", "development"].forEach(env => {
        edgeConfigOverrides[env] = {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
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
            idSyncContainerId: undefined
          },
          com_adobe_target: {
            propertyToken: ""
          }
        };
      });
      expect(bridge.getInstanceDefaults()).toEqual({
        edgeConfigOverrides
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
          datastreamIdInputMethod: "freeform",
          development: {
            com_adobe_target: {
              propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
            }
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
      const edgeConfigOverrides = {};
      ["production", "staging", "development"].forEach(env => {
        edgeConfigOverrides[env] = {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
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
            idSyncContainerId: undefined
          },
          com_adobe_target: {
            propertyToken:
              env === "development"
                ? "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
                : ""
          }
        };
      });
      expect(instanceValues).toEqual({
        edgeConfigOverrides
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
          datastreamIdInputMethod: "freeform",
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          },
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6335faf30f5a161c0b4b1444"
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"]
          },
          com_adobe_identity: {
            idSyncContainerId: 30793
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
      const edgeConfigOverrides = {};
      ["production", "staging", "development"].forEach(env => {
        edgeConfigOverrides[env] = {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6335faf30f5a161c0b4b1444"
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"]
          },
          com_adobe_identity: {
            idSyncContainerId: "30793"
          },
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          }
        };
      });
      expect(instanceValues).toEqual({
        edgeConfigOverrides
      });
    });
  });

  describe("getInstanceSettings", () => {
    it("should copy over changed values", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
            }
          }
        }
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
            }
          }
        }
      });
    });

    it("should trim all values of whitespace", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "         01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
            },
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "ase3aoiuoioasdklfjlk        "
                }
              }
            },
            com_adobe_analytics: {
              reportSuites: [
                "   unifiedjsqeonly2   ",
                "     unifiedjsqeonly3      "
              ]
            },
            com_adobe_identity: {
              idSyncContainerId: 30793
            }
          }
        }
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
            },
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "ase3aoiuoioasdklfjlk"
                }
              }
            },
            com_adobe_analytics: {
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"]
            },
            com_adobe_identity: {
              idSyncContainerId: 30793
            }
          }
        }
      });
    });

    it("should remove empty report suites", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            com_adobe_analytics: {
              reportSuites: ["", "unifiedjsqeonly2", "", "unifiedjsqeonly3", ""]
            }
          }
        }
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            com_adobe_analytics: {
              reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"]
            }
          }
        }
      });
    });

    it("should allow for data elements", () => {
      const instanceValues = {
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "%Data Element 1%"
            },
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "%Data Element 2%"
                }
              }
            },
            com_adobe_analytics: {
              reportSuites: ["%Data Element 3%", "%Data Element 4%"]
            },
            com_adobe_identity: {
              idSyncContainerId: "%Data Element 5%"
            }
          }
        }
      };

      const instanceSettings = bridge.getInstanceSettings({
        instanceValues
      });
      expect(instanceSettings).toEqual({
        edgeConfigOverrides: {
          development: {
            com_adobe_target: {
              propertyToken: "%Data Element 1%"
            },
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "%Data Element 2%"
                }
              }
            },
            com_adobe_analytics: {
              reportSuites: ["%Data Element 3%", "%Data Element 4%"]
            },
            com_adobe_identity: {
              idSyncContainerId: "%Data Element 5%"
            }
          }
        }
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
          ...bridge.getInstanceDefaults()
        });
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                datasets: {
                  event: {
                    datasetId: "6335faf30f5a161c0b4b1444"
                  }
                }
              },
              com_adobe_analytics: {
                reportSuites: ["unifiedjsqeonly2"]
              },
              com_adobe_identity: {
                idSyncContainerId: 30793
              },
              com_adobe_target: {
                propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8"
              }
            }
          }
        });
      }).not.toThrow();
    });

    it("should coerce the id sync container is a string", () => {
      expect(() => {
        const value = bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: "30793"
              }
            }
          }
        });
        expect(
          value.edgeConfigOverrides.development.com_adobe_identity
            .idSyncContainerId
        ).toBe(30793);
      }).not.toThrow();
    });

    it("validates data elements", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                datasets: {
                  event: {
                    datasetId: "%Data Element 2%"
                  }
                }
              },
              com_adobe_analytics: {
                reportSuites: ["%Data Element 3%", "%Data Element 4%"]
              },
              com_adobe_identity: {
                idSyncContainerId: "%Data Element 5%"
              }
            }
          }
        });
      }).not.toThrow();
    });

    it("validates partial data elements", () => {
      expect(() => {
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_experience_platform: {
                datasets: {
                  event: {
                    datasetId: "%Data Element 2%"
                  }
                }
              },
              com_adobe_analytics: {
                reportSuites: ["%Data Element 3%", "%Data Element 4%"]
              },
              com_adobe_identity: {
                idSyncContainerId: "1234%Data Element 5%333"
              }
            }
          }
        });
      }).not.toThrow();
    });

    it("gives friendly errors", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: "not a number"
              }
            }
          }
        })
      ).toThrowMatching(err => err.message.includes("Please"));
    });

    it("rejects negative and non-integer idSyncContainerId", () => {
      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: -1
              }
            }
          }
        })
      ).toThrow();

      expect(() =>
        bridge.formikStateValidationSchema.validateSync({
          edgeConfigOverrides: {
            development: {
              com_adobe_identity: {
                idSyncContainerId: 1.1
              }
            }
          }
        })
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
          }
        })
      ).not.toThrow();
    });
  });
});
