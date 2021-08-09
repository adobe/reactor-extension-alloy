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

import createDecisionsReceived from "../../../../../src/lib/events/decisionsReceived/createDecisionsReceived";

describe("Decisions received event", () => {
  let trigger;
  let sendEventCallbackStorage;
  let decisionsReceived;

  beforeEach(() => {
    trigger = jasmine.createSpy("trigger");
    sendEventCallbackStorage = jasmine.createSpyObj(
      "decisionsCallbackStorage",
      ["add"]
    );
    decisionsReceived = createDecisionsReceived({
      sendEventCallbackStorage
    });
  });

  it("triggers the rule when decisions have been received", () => {
    decisionsReceived({}, trigger);
    expect(sendEventCallbackStorage.add).toHaveBeenCalledTimes(1);
    const callback = sendEventCallbackStorage.add.calls.argsFor(0)[0];
    const decisions = [];
    callback({ decisions });
    expect(trigger).toHaveBeenCalledWith({
      decisions: []
    });
  });

  it("does not trigger the rule when decisions have not been received", () => {
    decisionsReceived({}, trigger);
    expect(sendEventCallbackStorage.add).toHaveBeenCalledTimes(1);
    const callback = sendEventCallbackStorage.add.calls.argsFor(0)[0];
    callback({});
    expect(trigger).not.toHaveBeenCalled();
  });
});
