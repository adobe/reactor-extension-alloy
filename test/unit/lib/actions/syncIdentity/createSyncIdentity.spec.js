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

import createSyncIdentity from "../../../../../src/lib/actions/syncIdentity/createSyncIdentity";

describe("Sync Identity", () => {
  it("executes syncIdentity command", () => {
    const promiseReturnedFromInstance = Promise.resolve();
    const instance = jasmine
      .createSpy()
      .and.returnValue(promiseReturnedFromInstance);
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const action = createSyncIdentity({ instanceManager });
    const promiseReturnedFromAction = action({
      instanceName: "instance1",
      identities: {
        ECID: {
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hash: true
        }
      }
    });

    expect(promiseReturnedFromAction).toBe(promiseReturnedFromInstance);
    expect(instanceManager.getInstance).toHaveBeenCalledWith("instance1");
    expect(instance).toHaveBeenCalledWith("syncIdentity", {
      identities: {
        ECID: {
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hash: true
        }
      }
    });
  });

  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: undefined
    });
    const action = createSyncIdentity({ instanceManager });

    expect(() => {
      action({
        instanceName: "instance1",
        identities: {
          ECID: {
            id: "wvg",
            authenticatedState: "loggedOut",
            primary: false,
            hash: true
          }
        }
      });
    }).toThrow(
      new Error(
        'Failed to sync identity for instance "instance1". No matching instance was configured with this name.'
      )
    );
  });
});