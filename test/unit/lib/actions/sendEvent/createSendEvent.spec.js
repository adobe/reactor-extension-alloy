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

import createSendEvent from "../../../../../src/lib/actions/sendEvent/createSendEvent";

describe("Send Event", () => {
  it("executes event command", () => {
    const promiseReturnedFromInstance = Promise.resolve();
    const instance = jasmine
      .createSpy()
      .and.returnValue(promiseReturnedFromInstance);
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const action = createSendEvent({ instanceManager });
    const promiseReturnedFromAction = action({
      instanceName: "myinstance",
      viewStart: true,
      xdm: {
        foo: "bar"
      }
    });

    expect(promiseReturnedFromAction).toBe(promiseReturnedFromInstance);
    expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
    expect(instance).toHaveBeenCalledWith("event", {
      viewStart: true,
      xdm: {
        foo: "bar"
      }
    });
  });

  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: undefined
    });
    const action = createSendEvent({ instanceManager });

    expect(() => {
      action({
        instanceName: "myinstance",
        viewStart: true,
        xdm: {
          foo: "bar"
        }
      });
    }).toThrow(
      new Error(
        'Failed to send event for instance "myinstance". No matching instance was configured with this name.'
      )
    );
  });
});
