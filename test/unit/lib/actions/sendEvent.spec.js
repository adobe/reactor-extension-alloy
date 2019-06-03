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

import createSendEvent from "../../../../src/lib/actions/createSendEvent";

describe("Send Event", () => {
  it("executes event command", () => {
    const instance = jasmine.createSpy();
    const getInstance = jasmine.createSpy().and.returnValue(instance);
    const action = createSendEvent(getInstance);
    expect(getInstance).toHaveBeenCalledWith("alloy");

    action({
      type: "thingHappened",
      data: {
        foo: "bar"
      }
    });

    expect(instance).toHaveBeenCalledWith("event", {
      type: "thingHappened",
      data: {
        foo: "bar"
      }
    });
  });
});
