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
const purposesFields = {
  allField: spectrum.radio(Selector(`[name='purposes'][value=all]`)),
  noneField: spectrum.radio(Selector(`[name='purposes'][value=none]`))
};
const warning = spectrum.alert(Selector(`.spectrum-Alert`));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      propertyId: "PR123"
    },
    {
      name: "alloy2",
      propertyId: "PR456",
      optInEnabled: true
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Set Opt-In Preferences View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      purposes: "none"
    }
  });
  await instanceNameField.expectValue(t, "alloy2");
  await purposesFields.allField.expectUnchecked(t);
  await purposesFields.noneField.expectChecked(t);
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue(t, "alloy1");
  await purposesFields.allField.expectChecked(t);
  await purposesFields.noneField.expectUnchecked(t);
});

test("returns valid settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.selectOption(t, "alloy2");
  await purposesFields.noneField.click(t);
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instanceName: "alloy2",
    purposes: "none"
  });
});

test("shows warning if opt-in is not enabled", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      purposes: "all"
    }
  });

  await warning.expectTitle(t, "Opt-In Not Enabled");
});

test("does not show warning if opt-in is enabled", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      purposes: "all"
    }
  });

  await warning.expectNotExists(t);
});

testInstanceNameOptions(extensionViewController, instanceNameField);
