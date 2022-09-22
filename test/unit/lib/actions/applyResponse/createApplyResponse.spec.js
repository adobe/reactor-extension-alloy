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

import createApplyResponse from "../../../../../src/lib/actions/applyResponse/createApplyResponse";

describe("Apply response", () => {
  let instanceManager;
  let sendEventCallbackStorage;
  let instance;
  let applyResponse;

  beforeEach(() => {
    instanceManager = jasmine.createSpyObj("instanceManger", ["getInstance"]);
    sendEventCallbackStorage = jasmine.createSpyObj(
      "sendEventCallbackStorage",
      ["triggerEvent"]
    );
    instance = jasmine.createSpy("instance");
    applyResponse = createApplyResponse({
      instanceManager,
      sendEventCallbackStorage
    });
  });

  it("throws an error if the instance isn't defined", () => {
    expect(() => applyResponse({ instanceName: "myinstance" })).toThrow();
    expect(instanceManager.getInstance).toHaveBeenCalledOnceWith("myinstance");
  });

  it("calls applyResponse with settings", async () => {
    instanceManager.getInstance.and.returnValue(instance);
    instance.and.returnValue(Promise.resolve());
    await applyResponse({ instanceName: "myinstance", a: "1" });
    expect(instance).toHaveBeenCalledOnceWith("applyResponse", { a: "1" });
  });

  it("triggers an event on the send event callback storage", async () => {
    instanceManager.getInstance.and.returnValue(instance);
    instance.and.returnValue(Promise.resolve("myresult"));
    await applyResponse({ instanceName: "myinstance" });
    expect(sendEventCallbackStorage.triggerEvent).toHaveBeenCalledOnceWith(
      "myresult"
    );
  });
});
