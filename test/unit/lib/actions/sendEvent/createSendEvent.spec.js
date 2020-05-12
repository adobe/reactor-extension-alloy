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
  it("executes event command and triggers decisions received event", () => {
    const decisions = [];
    const instance = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({ decisions }));
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const decisionsCallbackStorage = jasmine.createSpyObj(
      "decisionsCallbackStorage",
      ["triggerEvent"]
    );
    const action = createSendEvent({
      instanceManager,
      decisionsCallbackStorage
    });
    const promiseReturnedFromAction = action({
      instanceName: "myinstance",
      renderDecisions: true,
      xdm: {
        foo: "bar"
      }
    });

    expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
    expect(instance).toHaveBeenCalledWith("sendEvent", {
      renderDecisions: true,
      xdm: {
        foo: "bar"
      }
    });

    return promiseReturnedFromAction.then(() => {
      expect(decisionsCallbackStorage.triggerEvent).toHaveBeenCalledWith({
        decisions
      });
    });
  });
  it("executes event command and doesn't trigger decisions received event when decisions are missing", () => {
    const instance = jasmine.createSpy().and.returnValue(Promise.resolve({}));
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance
    });
    const decisionsCallbackStorage = jasmine.createSpyObj(
      "decisionsCallbackStorage",
      ["triggerEvent"]
    );
    const action = createSendEvent({
      instanceManager,
      decisionsCallbackStorage
    });
    const promiseReturnedFromAction = action({
      instanceName: "myinstance",
      renderDecisions: true,
      xdm: {
        foo: "bar"
      }
    });

    expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
    expect(instance).toHaveBeenCalledWith("sendEvent", {
      renderDecisions: true,
      xdm: {
        foo: "bar"
      }
    });

    return promiseReturnedFromAction.then(() => {
      expect(decisionsCallbackStorage.triggerEvent).not.toHaveBeenCalled();
    });
  });
  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", [
      "getInstance"
    ]);
    const action = createSendEvent({ instanceManager });

    expect(() => {
      action({
        instanceName: "myinstance",
        renderDecisions: true,
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
