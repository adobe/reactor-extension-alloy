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

import createSetOptInPreferences from "../../../../../src/lib/actions/setOptInPreferences/createSetOptInPreferences";
import turbineVariable from "../../../helpers/turbineVariable";

describe("Set Opt-In Preferences", () => {
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      error: jasmine.createSpy()
    };
    turbineVariable.mock({
      logger: mockLogger
    });
  });

  afterEach(() => {
    turbineVariable.reset();
  });

  ["all", "none"].forEach(purposes => {
    it(`executes optIn command with "${purposes}" purposes`, () => {
      const instance = jasmine.createSpy();
      const instanceManager = {
        getAccessor: jasmine.createSpy().and.returnValue({
          instance
        })
      };
      const action = createSetOptInPreferences(instanceManager);

      action({
        instanceName: "myinstance",
        purposes
      });

      expect(instanceManager.getAccessor).toHaveBeenCalledWith("myinstance");
      expect(instance).toHaveBeenCalledWith("optIn", {
        purposes
      });
    });
  });

  it("logs an error when no matching instance found", () => {
    const instanceManager = {
      getAccessor() {
        return undefined;
      }
    };
    const action = createSetOptInPreferences(instanceManager);

    action({
      instanceName: "myinstance",
      purposes: "none"
    });

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send event for instance "myinstance". No matching instance was configured with this name.'
    );
  });
});
