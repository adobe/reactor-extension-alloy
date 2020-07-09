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

const extensionViewController = createExtensionViewController(
  "actions/setConsent.html"
);
const instanceNameField = spectrum.select("instanceNameField");
const radioGroup = {
  inField: spectrum.radio("inOptionField"),
  outField: spectrum.radio("outOptionField"),
  dataElementField: spectrum.radio("dataElementOptionField")
};
const dataElementField = spectrum.textfield("dataElementField");

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      edgeConfigId: "PR123"
    },
    {
      name: "alloy2",
      edgeConfigId: "PR456"
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Set Consent View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with settings containing static purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      consent: [
        { standard: "Adobe", version: "1.0", value: { general: "out" } }
      ]
    }
  });
  await instanceNameField.expectValue("alloy2");
  await radioGroup.inField.expectUnchecked();
  await radioGroup.outField.expectChecked();
  await radioGroup.dataElementField.expectUnchecked();
});

test("initializes form fields with settings containing data element for purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      consent: "%foo%"
    }
  });
  await instanceNameField.expectValue("alloy2");
  await radioGroup.inField.expectUnchecked();
  await radioGroup.outField.expectUnchecked();
  await radioGroup.dataElementField.expectChecked();
  await dataElementField.expectValue("%foo%");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue("alloy1");
  await radioGroup.inField.expectChecked();
  await radioGroup.outField.expectUnchecked();
  await radioGroup.dataElementField.expectUnchecked();
});

test("returns valid settings containing static purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.selectOption("alloy2");
  await radioGroup.outField.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    consent: [{ standard: "Adobe", version: "1.0", value: { general: "out" } }]
  });
});

test("returns valid settings containing data element for purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.selectOption("alloy2");
  await radioGroup.dataElementField.click();
  await dataElementField.typeText("%foo%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    consent: "%foo%"
  });
});

test("shows error for purposes data element value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await radioGroup.dataElementField.click();
  await dataElementField.typeText("foo");
  await extensionViewController.expectIsNotValid();
  await dataElementField.expectError();
});

test("shows error for purposes data element value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await radioGroup.dataElementField.click();
  await dataElementField.typeText("%foo%%bar%");
  await extensionViewController.expectIsNotValid();
  await dataElementField.expectError();
});

testInstanceNameOptions(extensionViewController, instanceNameField);
