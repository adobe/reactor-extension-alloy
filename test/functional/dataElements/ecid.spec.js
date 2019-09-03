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

import { Selector } from "testcafe";
import createExtensionViewController from "../helpers/createExtensionViewController";
import spectrum from "../helpers/spectrum";
import testInstanceNameOptions from "../helpers/testInstanceNameOptions";

const extensionViewController = createExtensionViewController(
  "dataElements/ecid.html"
);
const instanceNameField = spectrum.select(Selector("[name=instanceName]"));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      propertyId: "PR123"
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("ECID View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1"
    }
  });
  await instanceNameField.expectValue(t, "alloy1");
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue(t, "");
});

test("returns full valid settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.selectOption(t, "alloy1");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instanceName: "alloy1"
  });
});

test("shows errors for empty required values", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await extensionViewController.expectIsNotValid(t);
  await instanceNameField.expectError(t);
});

testInstanceNameOptions(extensionViewController, instanceNameField);
