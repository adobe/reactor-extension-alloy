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

<<<<<<< HEAD:src/lib/actions/syncIdentity/createSyncIdentity.js
module.exports = ({ instanceManager }) => settings => {
  const { instanceName, identities } = settings;
  const instance = instanceManager.getInstance(instanceName);

  if (!instance) {
    throw new Error(
      `Failed to sync identity for instance "${instanceName}". No matching instance was configured with this name.`
    );
  }

  return instance("syncIdentity", {
    identities
  });
};
=======
import createDecisionsReceivedEvent from "../../../../../src/lib/events/decisionsReceived/createDecisionsReceivedEvent";

describe("Decisions received event", () => {
  it("should add a trigger in the callbackStorage", () => {
    const trigger = () => {};
    const decisionsCallbackStorage = jasmine.createSpyObj(
      "decisionsCallbackStorage",
      ["add"]
    );

    const decisionsReceived = createDecisionsReceivedEvent({
      decisionsCallbackStorage
    });

    decisionsReceived({}, trigger);

    expect(decisionsCallbackStorage.add).toHaveBeenCalledWith(trigger);
  });
});
>>>>>>> master:test/unit/lib/events/decisionsReceived/createDecisionsReceivedEvent.spec.js
