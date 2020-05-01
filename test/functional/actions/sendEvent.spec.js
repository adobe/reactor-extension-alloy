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
  "actions/sendEvent.html"
);
const instanceNameField = spectrum.select("instanceNameField");
const renderDecisionsField = spectrum.checkbox("renderDecisionsField");
const xdmField = spectrum.textfield("xdmField");
const typeField = spectrum.textfield("typeField");
const mergeIdField = spectrum.textfield("mergeIdField");
const scopeDataElementField = spectrum.textfield("scopeDataElementField");
const radioGroup = {
  dataElement: spectrum.radio("dataElementOptionField"),
  values: spectrum.radio("constantOptionField")
};
const addDecisionScopeButton = spectrum.button("addDecisionScopeButton");
const scopeArrayValues = [];

for (let i = 0; i < 3; i += 1) {
  scopeArrayValues.push({
    value: spectrum.textfield(`scope${i}Field`),
    deleteButton: spectrum.button(`deleteScope${i}Button`)
  });
}

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
fixture("Send Event View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings, when decision scopes is data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      renderDecisions: true,
      xdm: "%myDataLayer%",
      type: "myType1",
      mergeId: "%myMergeId%",
      decisionScopes: "%myDecisionScope%"
    }
  });
  await instanceNameField.expectValue("alloy2");
  await renderDecisionsField.expectChecked();
  await xdmField.expectValue("%myDataLayer%");
  await typeField.expectValue("myType1");
  await mergeIdField.expectValue("%myMergeId%");
  await radioGroup.dataElement.expectChecked();
  await radioGroup.values.expectUnchecked();
  await scopeDataElementField.expectValue("%myDecisionScope%");
});

test("initializes form fields with full settings, when decision scopes is an array of scopes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      renderDecisions: true,
      xdm: "%myDataLayer%",
      type: "myType1",
      mergeId: "%myMergeId%",
      decisionScopes: ["foo1", "foo2", "foo3"]
    }
  });
  await instanceNameField.expectValue("alloy2");
  await renderDecisionsField.expectChecked();
  await xdmField.expectValue("%myDataLayer%");
  await typeField.expectValue("myType1");
  await mergeIdField.expectValue("%myMergeId%");
  await radioGroup.dataElement.expectUnchecked();
  await radioGroup.values.expectChecked();
  await scopeDataElementField.expectError;
  await scopeArrayValues[0].value.expectValue("foo1");
  await scopeArrayValues[1].value.expectValue("foo2");
  await scopeArrayValues[2].value.expectValue("foo3");
});

test("initializes form fields with minimal settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1"
    }
  });
  await instanceNameField.expectValue("alloy1");
  await renderDecisionsField.expectUnchecked();
  await xdmField.expectValue("");
  await typeField.expectValue("");
  await mergeIdField.expectValue("");
  await radioGroup.values.expectChecked();
  await radioGroup.dataElement.expectUnchecked();
  await scopeArrayValues[0].value.expectValue("");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectValue("alloy1");
  await renderDecisionsField.expectUnchecked();
  await xdmField.expectValue("");
  await typeField.expectValue("");
  await mergeIdField.expectValue("");
  await radioGroup.values.expectChecked();
  await radioGroup.dataElement.expectUnchecked();
  await scopeArrayValues[0].value.expectValue("");
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1"
  });
});

test("returns full valid settings with decision scopes as data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.selectOption("alloy2");
  await renderDecisionsField.click();
  await xdmField.typeText("%myDataLayer%");
  await typeField.typeText("mytype1");
  await mergeIdField.typeText("%myMergeId%");
  await radioGroup.dataElement.click();
  await scopeDataElementField.typeText("%myScope%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    renderDecisions: true,
    xdm: "%myDataLayer%",
    type: "mytype1",
    mergeId: "%myMergeId%",
    decisionScopes: "%myScope%"
  });
});
test("returns decision scopes settings as an array", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await radioGroup.values.click();
  await scopeArrayValues[0].value.typeText("foo");
  await addDecisionScopeButton.click();
  await scopeArrayValues[1].value.typeText("foo1");
  await addDecisionScopeButton.click();
  await scopeArrayValues[2].value.typeText("foo2");
  await scopeArrayValues[1].deleteButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    decisionScopes: ["foo", "foo2"]
  });
});
test("does not return decision scopes settings when provided with array of empty strings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await radioGroup.values.click();
  await addDecisionScopeButton.click();
  await addDecisionScopeButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1"
  });
});

test("shows error for xdm value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await xdmField.typeText("myDataLayer");
  await extensionViewController.expectIsNotValid();
  await xdmField.expectError();
});

test("shows error for decision scope value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await radioGroup.dataElement.click();
  await scopeDataElementField.typeText("fooScope");
  await extensionViewController.expectIsNotValid();
  await scopeDataElementField.expectError();
});

test("shows error for xdm value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await xdmField.typeText("%a%%b%");
  await extensionViewController.expectIsNotValid();
  await xdmField.expectError();
});

testInstanceNameOptions(extensionViewController, instanceNameField);
