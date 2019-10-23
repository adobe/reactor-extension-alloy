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

import createInstanceManager from "../../../../src/lib/instanceManager/createInstanceManager";
import turbineVariable from "../../helpers/turbineVariable";

describe("Instance Manager", () => {
  let runAlloy;
  let instanceManager;
  let mockWindow;

  beforeEach(() => {
    turbineVariable.mock({
      getExtensionSettings() {
        return {
          instances: [
            {
              name: "alloy1",
              configId: "PR123"
            },
            {
              name: "alloy2",
              configId: "PR456",
              imsOrgId: "DIFFERENTORG@AdobeOrg"
            }
          ]
        };
      }
    });
    mockWindow = {};
    runAlloy = jasmine.createSpy().and.callFake(names => {
      names.forEach(name => {
        mockWindow[name] = jasmine
          .createSpy()
          .and.callFake((commandName, options) => {
            if (commandName === "configure") {
              options.reactorRegisterGetEcid(() => `${name}:ecid`);
              options.reactorRegisterCreateEventMergeId(
                () => `${name}:eventMergeId`
              );
            }
          });
      });
    });
    instanceManager = createInstanceManager(
      mockWindow,
      runAlloy,
      "ABC@AdobeOrg"
    );
  });

  afterEach(() => {
    turbineVariable.reset();
  });

  it("runs alloy", () => {
    expect(runAlloy).toHaveBeenCalledWith(["alloy1", "alloy2"]);
  });

  it("creates an SDK instance for each configured instance", () => {
    expect(mockWindow.alloy1).toEqual(jasmine.any(Function));
    expect(mockWindow.alloy2).toEqual(jasmine.any(Function));
  });

  it("configures an SDK instance for each configured instance", () => {
    expect(mockWindow.alloy1).toHaveBeenCalledWith("configure", {
      configId: "PR123",
      imsOrgId: "ABC@AdobeOrg",
      logEnabled: true,
      reactorRegisterGetEcid: jasmine.any(Function),
      reactorRegisterCreateEventMergeId: jasmine.any(Function)
    });
    expect(mockWindow.alloy2).toHaveBeenCalledWith("configure", {
      configId: "PR456",
      imsOrgId: "DIFFERENTORG@AdobeOrg",
      logEnabled: true,
      reactorRegisterGetEcid: jasmine.any(Function),
      reactorRegisterCreateEventMergeId: jasmine.any(Function)
    });
  });

  it("returns accessor by name", () => {
    const accessor = instanceManager.getAccessor("alloy2");
    expect(accessor.instance).toBe(mockWindow.alloy2);
    expect(accessor.getEcid()).toBe("alloy2:ecid");
    expect(accessor.createEventMergeId()).toBe("alloy2:eventMergeId");
  });
});
