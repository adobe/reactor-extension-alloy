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

const extensionViewController = createExtensionViewController(
  "actions/setCustomerIds.html"
);

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

const instanceNameField = spectrum.select(Selector("[name=instanceName]"));

const customerIds = [];

for (let i = 0; i < 2; i += 1) {
  customerIds.push({
    namespaceField: spectrum.textfield(
      Selector(`[name='customerIds.${i}.namespace']`)
    ),
    idField: spectrum.textfield(Selector(`[name='customerIds.${i}.id']`)),
    hashEnabledField: spectrum.checkbox(
      Selector(`[name='customerIds.${i}.hashEnabled']`)
    ),
    authenticatedStateField: spectrum.select(
      Selector(`[name='customerIds.${i}.authenticatedState']`)
    ),
    primaryField: spectrum.checkbox(
      Selector(`[name='customerIds.${i}.primary']`)
    ),
    deleteButton: spectrum.button(Selector(`#deleteButton${i}`))
  });
}

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Set Customer IDs View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy99",
      customerIds: [
        {
          namespace: "CORE",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hashEnabled: true
        }
      ]
    }
  });
  await instanceNameField.expectValue(t, "alloy99");
  await customerIds[0].namespaceField.expectValue(t, "CORE");
  await customerIds[0].idField.expectValue(t, "wvg");
  await customerIds[0].hashEnabledField.expectChecked(t);
  await customerIds[0].authenticatedStateField.expectValue(t, "loggedOut");
  await customerIds[0].primaryField.expectUnchecked(t);
});

// test("initializes form fields with minimal settings", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings,
//     settings: {
//       instanceName: "alloy1"
//     }
//   });
//   await instanceNameField.expectValue(t, "alloy1");
//   await viewStartField.expectUnchecked(t);
//   await xdmField.expectValue(t, "");
// });
//
// test("initializes form fields with no settings", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings
//   });
//   await instanceNameField.expectValue(t, "alloy1");
//   await viewStartField.expectUnchecked(t);
//   await xdmField.expectValue(t, "");
// });
//
// test("returns minimal valid settings", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings
//   });
//
//   await extensionViewController.expectIsValid(t);
//   await extensionViewController.expectSettings(t, {
//     instanceName: "alloy1"
//   });
// });
//
// test("returns full valid settings", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings
//   });
//   await instanceNameField.selectOption(t, "alloy2");
//   await viewStartField.click(t);
//   await xdmField.typeText(t, "%myDataLayer%");
//   await extensionViewController.expectIsValid(t);
//   await extensionViewController.expectSettings(t, {
//     instanceName: "alloy2",
//     viewStart: true,
//     xdm: "%myDataLayer%"
//   });
// });
//
// test("shows error for xdm value that is not a data element", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings
//   });
//   await xdmField.typeText(t, "myDataLayer");
//   await extensionViewController.expectIsNotValid(t);
//   await xdmField.expectError(t);
// });
//
// test("shows error for xdm value that is more than one data element", async t => {
//   await extensionViewController.init(t, {
//     extensionSettings: mockExtensionSettings
//   });
//   await xdmField.typeText(t, "%a%%b%");
//   await extensionViewController.expectIsNotValid(t);
//   await xdmField.expectError(t);
// });
