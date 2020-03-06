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
  "actions/setOptInPreferences.html"
);
const instanceNameField = spectrum.select(Selector("[name=instanceName]"));
const purposesRadioGroup = {
  allField: spectrum.radio(Selector(`[name='purposes'][value=all]`)),
  noneField: spectrum.radio(Selector(`[name='purposes'][value=none]`)),
  dataElementField: spectrum.radio(
    Selector(`[name='purposes'][value=dataElement]`)
  )
};
const purposesDataElementField = spectrum.textfield(
  Selector("[name=purposesDataElement]")
);
const optInDisabledAlert = spectrum.alert(Selector("#optInDisabledAlert"));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      configId: "PR123"
    },
    {
      name: "alloy2",
      configId: "PR456",
      optInEnabled: true
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Set Opt-In Preferences View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with settings containing static purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      purposes: "none"
    }
  });
  await instanceNameField.expectValue("alloy2");
  await purposesRadioGroup.allField.expectUnchecked();
  await purposesRadioGroup.noneField.expectChecked();
  await purposesRadioGroup.dataElementField.expectUnchecked();
});

test("initializes form fields with settings containing data element for purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      purposes: "%foo%"
    }
  });
  await instanceNameField.expectValue("alloy2");
  await purposesRadioGroup.allField.expectUnchecked();
  await purposesRadioGroup.noneField.expectUnchecked();
  await purposesRadioGroup.dataElementField.expectChecked();
  await purposesDataElementField.expectValue("%foo%");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue("alloy1");
  await purposesRadioGroup.allField.expectChecked();
  await purposesRadioGroup.noneField.expectUnchecked();
  await purposesRadioGroup.dataElementField.expectUnchecked();
});

test("returns valid settings containing static purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.selectOption("alloy2");
  await purposesRadioGroup.noneField.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    purposes: "none"
  });
});

test("returns valid settings containing data element for purposes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.selectOption("alloy2");
  await purposesRadioGroup.dataElementField.click();
  await purposesDataElementField.typeText("%foo%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    purposes: "%foo%"
  });
});

test("shows error for purposes data element value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await purposesRadioGroup.dataElementField.click();
  await purposesDataElementField.typeText("foo");
  await extensionViewController.expectIsNotValid();
  await purposesDataElementField.expectError();
});

test("shows error for purposes data element value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await purposesRadioGroup.dataElementField.click();
  await purposesDataElementField.typeText("%foo%%bar%");
  await extensionViewController.expectIsNotValid();
  await purposesDataElementField.expectError();
});

test("shows warning if opt-in is not enabled", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      purposes: "all"
    }
  });

  await optInDisabledAlert.expectExists();
});

test("does not show warning if opt-in is enabled", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      purposes: "all"
    }
  });

  await optInDisabledAlert.expectNotExists();
});

testInstanceNameOptions(extensionViewController, instanceNameField);
