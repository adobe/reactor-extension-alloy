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

import createExtensionViewController from "../helpers/createExtensionViewController";
import spectrum from "../helpers/spectrum";
import testInstanceNameOptions from "../helpers/testInstanceNameOptions";

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const extensionViewController = createExtensionViewController(
  "dataElements/eventMergeId.html"
);

const instanceNameField = spectrum.select("instanceNameField");

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      configId: "PR123"
    },
    {
      name: "alloy2",
      configId: "PR456"
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Event Merge ID View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      cacheId: "cacheId1"
    }
  });
  await instanceNameField.expectValue("alloy2");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue("alloy1");
});

test("returns full valid settings when initialized without settings", async t => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.selectOption("alloy2");
  await extensionViewController.expectIsValid();
  // We can't use extensionViewController.expectSettings because we don't know
  // the exact value of actualSettings.cacheId and therefore have to do some
  // custom matching.
  const actualSettings = await extensionViewController.getSettings();
  await t.expect(actualSettings.instanceName).eql("alloy2");
  await t.expect(actualSettings.cacheId).match(uuidRegex);
});

test("does not modify cacheId if initialized with a cacheId", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      cacheId: "ab3d0f9b-6faa-40c2-bf68-a77a9bbb686a"
    }
  });
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    cacheId: "ab3d0f9b-6faa-40c2-bf68-a77a9bbb686a"
  });
});

testInstanceNameOptions(extensionViewController, instanceNameField);
