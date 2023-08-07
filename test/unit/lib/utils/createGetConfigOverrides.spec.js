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
import createGetConfigOverrides from "../../../../src/lib/utils/createGetConfigOverrides";

describe("createGetConfigOverrides", () => {
  ["development", "staging", "production"].forEach(stage => {
    const createConfigOverrides = createGetConfigOverrides(stage);
    describe(`stage ${stage}`, () => {
      it("should return undefined when edgeConfigOverrides is undefined", () => {
        const result = createConfigOverrides({}, stage);
        expect(result).toBeUndefined();
      });

      it("should flatten comma separated lists of report suites", () => {
        const result = createConfigOverrides(
          {
            edgeConfigOverrides: {
              [stage]: {
                com_adobe_analytics: {
                  reportSuites: [
                    "test1        ",
                    "test5,test2    ,    test333",
                    "test4"
                  ]
                }
              }
            }
          },
          stage
        );
        expect(result).toEqual({
          com_adobe_analytics: {
            reportSuites: ["test1", "test5", "test2", "test333", "test4"]
          }
        });
      });

      it("should extract the config overrides for the given environment", () => {
        const result = createConfigOverrides(
          {
            edgeConfigOverrides: {
              [stage]: {
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
          },
          stage
        );
        expect(result).toEqual({
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
        });
      });

      it("should convert string values to numbers when appropriate", () => {
        const result = createConfigOverrides(
          {
            edgeConfigOverrides: {
              [stage]: {
                com_adobe_identity: {
                  idSyncContainerId: "30793"
                }
              }
            }
          },
          stage
        );
        expect(result).toEqual({
          com_adobe_identity: {
            idSyncContainerId: 30793
          }
        });

        const result2 = createConfigOverrides(
          {
            edgeConfigOverrides: {
              [stage]: {
                com_adobe_identity: {
                  idSyncContainerId: 30793
                }
              }
            }
          },
          stage
        );
        expect(result2).toEqual({
          com_adobe_identity: {
            idSyncContainerId: 30793
          }
        });
      });
    });
  });

  it("should extract the old settings if they exist", () => {
    const getConfigOverrides = createGetConfigOverrides("development");
    const result = getConfigOverrides({
      edgeConfigOverrides: {
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
    });
    expect(result).toEqual({
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
    });
  });
});
