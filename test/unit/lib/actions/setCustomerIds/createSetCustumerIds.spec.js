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
import turbineVariable from "../../../helpers/turbineVariable";

describe("Set Customer IDs", () => {
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

  it("executes setCustomerIds command", () => {
    const instance = jasmine.createSpy();
    const instanceManager = {
      getAccessor: jasmine.createSpy().and.returnValue({
        instance
      })
    };
    const action = createSetCustomerIds(instanceManager);

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

    expect(instanceManager.getAccessor).toHaveBeenCalledWith("instance1");
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
    const instanceManager = {
      getAccessor() {
        return undefined;
      }
    };
    const action = createSetCustomerIds(instanceManager);

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

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to set customer IDs for instance "instance1". No matching instance was configured with this name.'
    );
  });
});
