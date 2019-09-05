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
  "actions/sendEvent.html"
);
const instanceNameField = spectrum.select(Selector("[name=instanceName]"));
const viewStartField = spectrum.checkbox(Selector("[name=viewStart]"));
const dataField = spectrum.textfield(Selector("[name=data]"));
const eventMergeIdField = spectrum.textfield(Selector("[name=eventMergeId]"));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      propertyId: "PR123"
    },
    {
      name: "alloy2",
      propertyId: "PR456"
    }
  ]
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Send Event View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      viewStart: true,
      data: "%myDataLayer%",
      eventMergeId: "%myEventMergeId%"
    }
  });
  await instanceNameField.expectValue(t, "alloy2");
  await viewStartField.expectChecked(t);
  await dataField.expectValue(t, "%myDataLayer%");
  await eventMergeIdField.expectValue(t, "%myEventMergeId%");
});

test("initializes form fields with minimal settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      data: "%myDataLayer%"
    }
  });
  await instanceNameField.expectValue(t, "alloy1");
  await viewStartField.expectUnchecked(t);
  await dataField.expectValue(t, "%myDataLayer%");
  await eventMergeIdField.expectValue(t, "");
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue(t, "alloy1");
  await viewStartField.expectUnchecked(t);
  await dataField.expectValue(t, "");
  await eventMergeIdField.expectValue(t, "");
});

test("returns minimal valid settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });

  await dataField.typeText(t, "%myDataLayer%");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instanceName: "alloy1",
    data: "%myDataLayer%"
  });
});

test("returns full valid settings", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.selectOption(t, "alloy2");
  await viewStartField.click(t);
  await dataField.typeText(t, "%myDataLayer%");
  await eventMergeIdField.typeText(t, "%myEventMergeId%");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instanceName: "alloy2",
    viewStart: true,
    data: "%myDataLayer%",
    eventMergeId: "%myEventMergeId%"
  });
});

test("shows errors for empty required values", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await extensionViewController.expectIsNotValid(t);
  await dataField.expectError(t);
});

test("shows error for data value that is not a data element", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText(t, "myDataLayer");
  await extensionViewController.expectIsNotValid(t);
  await dataField.expectError(t);
});

test("shows error for data value that is more than one data element", async t => {
  await extensionViewController.init(t, {
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText(t, "%a%%b%");
  await extensionViewController.expectIsNotValid(t);
  await dataField.expectError(t);
});

testInstanceNameOptions(extensionViewController, instanceNameField);
