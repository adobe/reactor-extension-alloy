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

import createSetCustomerIds from "../../../../../src/lib/actions/setCustomerIds/createSetCustomerIds";

describe("Set Customer IDs", () => {
  let turbine;

  beforeEach(() => {
    turbine = {
      logger: jasmine.createSpyObj("logger", ["error"])
    };
  });

  it("executes setCustomerIds command", () => {
    const instance = jasmine.createSpy();
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const action = createSetCustomerIds({ instanceManager, turbine });

    action({
      instanceName: "instance1",
      customerIds: [
        {
          namespace: "ECID",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hash: true
        }
      ]
    });

    expect(instanceManager.getInstance).toHaveBeenCalledWith("instance1");
    expect(instance).toHaveBeenCalledWith("setCustomerIds", {
      ECID: {
        namespace: "ECID",
        id: "wvg",
        authenticatedState: "loggedOut",
        primary: false,
        hash: true
      }
    });
  });

  it("logs an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: undefined
    });
    const action = createSetCustomerIds({ instanceManager, turbine });

    action({
      instanceName: "instance1",
      customerIds: [
        {
          namespace: "ECID",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hash: true
        }
      ]
    });

    expect(turbine.logger.error).toHaveBeenCalledWith(
      'Failed to set customer IDs for instance "instance1". No matching instance was configured with this name.'
    );
  });
});
