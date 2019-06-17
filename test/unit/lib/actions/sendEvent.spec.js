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
import turbineVariable from "../../helpers/turbineVariable";

describe("Send Event", () => {
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

  it("executes event command", () => {
    const instance = jasmine.createSpy();
    const instanceManager = {
      getInstance: jasmine.createSpy().and.returnValue(instance)
    };
    const action = createSendEvent(instanceManager);

    action({
      propertyID: "PR123",
      type: "thingHappened",
      data: {
        foo: "bar"
      }
    });

    expect(instanceManager.getInstance).toHaveBeenCalledWith("PR123");
    expect(instance).toHaveBeenCalledWith("event", {
      type: "thingHappened",
      data: {
        foo: "bar"
      }
    });
  });

  it("logs an error when no matching instance found", () => {
    const instanceManager = {
      getInstance: () => {}
    };
    const action = createSendEvent(instanceManager);

    action({
      propertyID: "PR123",
      type: "thingHappened",
      data: {
        foo: "bar"
      }
    });

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send event for property ID "PR123". No matching account was configured with this ID.'
    );
  });
});
