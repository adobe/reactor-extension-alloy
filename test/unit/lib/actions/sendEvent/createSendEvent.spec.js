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
  let getConfigOverrides;
  beforeEach(() => {
    getConfigOverrides = jasmine.createSpy("getConfigOverrides");
  });
  it("executes event command and notifies sendEventCallbackStorage", () => {
    const instance = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({ foo: "bar" }));
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance,
    });
    const sendEventCallbackStorage = jasmine.createSpyObj(
      "sendEventCallbackStorage",
      ["triggerEvent"],
    );
    const action = createSendEvent({
      instanceManager,
      sendEventCallbackStorage,
      getConfigOverrides,
    });
    const dataLayer = {
      fruits: [
        {
          name: "banana",
          calories: 105,
        },
        {
          name: "blueberry",
          calories: 5,
        },
      ],
    };
    const promiseReturnedFromAction = action({
      instanceName: "myinstance",
      renderDecisions: true,
      xdm: dataLayer,
    });

    expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
    expect(instance).toHaveBeenCalledWith("sendEvent", {
      renderDecisions: true,
      edgeConfigOverrides: undefined,
      xdm: {
        fruits: [
          {
            name: "banana",
            calories: 105,
          },
          {
            name: "blueberry",
            calories: 5,
          },
        ],
      },
    });
    // Ensure the XDM object was cloned
    const xdmOption = instance.calls.argsFor(0)[1].xdm;
    expect(xdmOption).not.toBe(dataLayer);
    expect(xdmOption.fruits[0]).not.toBe(dataLayer.fruits[0]);

    return promiseReturnedFromAction.then(() => {
      expect(sendEventCallbackStorage.triggerEvent).toHaveBeenCalledWith({
        foo: "bar",
      });
    });
  });
  it("throws an error when no matching instance found", () => {
    const instanceManager = jasmine.createSpyObj("instanceManager", [
      "getInstance",
    ]);
    const action = createSendEvent({ instanceManager, getConfigOverrides });

    expect(() => {
      action({
        instanceName: "myinstance",
        renderDecisions: true,
        xdm: {
          foo: "bar",
        },
      });
    }).toThrow(
      new Error(
        'Failed to send event for instance "myinstance". No matching instance was configured with this name.',
      ),
    );
  });

  it("calls sendEvent with edgeConfigOverrides", () => {
    const instance = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({ foo: "bar" }));
    getConfigOverrides.and.returnValue({
      test: "test",
    });
    const instanceManager = jasmine.createSpyObj("instanceManager", {
      getInstance: instance,
    });
    const sendEventCallbackStorage = jasmine.createSpyObj(
      "sendEventCallbackStorage",
      ["triggerEvent"],
    );
    const action = createSendEvent({
      instanceManager,
      sendEventCallbackStorage,
      getConfigOverrides,
    });
    const promiseReturnedFromAction = action({
      instanceName: "myinstance",
      renderDecisions: true,
      edgeConfigOverrides: {
        development: {
          test: "test",
        },
      },
    });

    expect(instance).toHaveBeenCalledWith("sendEvent", {
      renderDecisions: true,
      edgeConfigOverrides: {
        test: "test",
      },
    });

    return promiseReturnedFromAction;
  });
});
