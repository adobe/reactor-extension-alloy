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
  it("executes setCustomerIds command", () => {
    const promiseReturnedFromInstance = Promise.resolve();
    const instance = jasmine
      .createSpy()
      .and.returnValue(promiseReturnedFromInstance);
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const action = createSetCustomerIds({ instanceManager });
    const promiseReturnedFromAction = action({
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

    expect(promiseReturnedFromAction).toBe(promiseReturnedFromInstance);
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

  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: undefined
    });
    const action = createSetCustomerIds({ instanceManager });

    expect(() => {
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
    }).toThrow(
      new Error(
        'Failed to set customer IDs for instance "instance1". No matching instance was configured with this name.'
      )
    );
  });
});
