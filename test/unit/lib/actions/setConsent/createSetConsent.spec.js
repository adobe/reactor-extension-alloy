/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createSetConsent from "../../../../../src/lib/actions/setConsent/createSetConsent";

describe("Set Consent", () => {
  ["in", "out"].forEach(generalConsent => {
    it(`executes setConsent command with "${generalConsent}" general consent`, () => {
      const promiseReturnedFromInstance = Promise.resolve();
      const instance = jasmine
        .createSpy()
        .and.returnValue(promiseReturnedFromInstance);
      const instanceManager = jasmine.createSpyObj("instanceManager", {
        getInstance: instance
      });
      const action = createSetConsent({ instanceManager });
      const promiseReturnedFromAction = action({
        instanceName: "myinstance",
        identityMap: "%dataelement123%",
        consent: [
          {
            standard: "Adobe",
            version: "1.0",
            value: { general: generalConsent }
          }
        ],
        edgeConfigOverrides: undefined
      });

      expect(promiseReturnedFromAction).toBe(promiseReturnedFromInstance);
      expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
      expect(instance).toHaveBeenCalledWith("setConsent", {
        identityMap: "%dataelement123%",
        consent: [
          {
            standard: "Adobe",
            version: "1.0",
            value: {
              general: generalConsent
            }
          }
        ],
        edgeConfigOverrides: undefined
      });
    });
  });

  ["", null, undefined].forEach(identityMap => {
    it(`doesn't pass identityMap when it is ${JSON.stringify(
      identityMap
    )}`, () => {
      const instance = jasmine.createSpy();
      const instanceManager = { getInstance: () => instance };
      const action = createSetConsent({ instanceManager });
      action({
        instanceName: "myinstance",
        identityMap,
        consent: [{ standard: "IAB TCF", version: "2.0", value: "1234abcd" }]
      });
      expect(instance).toHaveBeenCalledWith("setConsent", {
        consent: [{ standard: "IAB TCF", version: "2.0", value: "1234abcd" }],
        edgeConfigOverrides: undefined
      });
    });
  });

  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: undefined
    });
    const action = createSetConsent({ instanceManager });

    expect(() => {
      action({
        instanceName: "myinstance",
        purposes: "none"
      });
    }).toThrow(
      new Error(
        'Failed to set consent for instance "myinstance". No matching instance was configured with this name.'
      )
    );
  });

  // a test that checks the inclusion for the edgeConfigOverrides
  it("passes edgeConfigOverrides when it is defined", () => {
    const instance = jasmine.createSpy();
    const instanceManager = { getInstance: () => instance };
    const action = createSetConsent({ instanceManager });
    action({
      instanceName: "myinstance",
      identityMap: "%dataelement123%",
      consent: [{ standard: "IAB TCF", version: "2.0", value: "1234abcd" }],
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
    expect(instance).toHaveBeenCalledWith("setConsent", {
      identityMap: "%dataelement123%",
      consent: [{ standard: "IAB TCF", version: "2.0", value: "1234abcd" }],
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
  });
});
