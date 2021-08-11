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

import extensionViewController from "../helpers/extensionViewController";
import spectrum from "../helpers/spectrum3";
import testInstanceNameOptions from "../helpers/spectrum3TestInstanceNameOptions";
import createFixture from "../helpers/createFixture";
import runCommonViewTests from "../runCommonViewTests";

const instanceNameField = spectrum.picker("instanceNameField");
const typeField = spectrum.comboBox("typeField");
const xdmField = spectrum.textField("xdmField");
const dataField = spectrum.textField("dataField");
const mergeIdField = spectrum.textField("mergeIdField");
const datasetIdField = spectrum.textField("datasetIdField");
const documentUnloadingField = spectrum.checkbox("documentUnloadingField");
const renderDecisionsField = spectrum.checkbox("renderDecisionsField");
const scopeDataElementField = spectrum.textField("scopeDataElementField");
const scopesRadioGroup = {
  dataElement: spectrum.radio("dataElementOptionField"),
  values: spectrum.radio("constantOptionField")
};
const addDecisionScopeButton = spectrum.button("addDecisionScopeButton");
const scopeArrayValues = [];

for (let i = 0; i < 3; i += 1) {
  scopeArrayValues.push({
    value: spectrum.textField(`scope${i}Field`),
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

createFixture({
  title: "Send Event View",
  viewPath: "actions/sendEvent.html"
});

runCommonViewTests({
  extensionSettings: mockExtensionSettings
});

test("initializes form fields with full settings, when decision scopes is data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      type: "myType1",
      xdm: "%myDataLayer%",
      data: "%myData%",
      mergeId: "%myMergeId%",
      decisionScopes: "%myDecisionScope%",
      datasetId: "%myDatasetId%",
      documentUnloading: true,
      renderDecisions: true
    }
  });
  await instanceNameField.expectText("alloy2");
  await typeField.expectText("myType1");
  await xdmField.expectValue("%myDataLayer%");
  await dataField.expectValue("%myData%");
  await mergeIdField.expectValue("%myMergeId%");
  await datasetIdField.expectValue("%myDatasetId%");
  await documentUnloadingField.expectChecked();
  await renderDecisionsField.expectChecked();
  await scopesRadioGroup.dataElement.expectChecked();
  await scopesRadioGroup.values.expectUnchecked();
  await scopeDataElementField.expectValue("%myDecisionScope%");
});

test("initializes decision scopes form fields, when decision scopes is an array of scopes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      decisionScopes: ["foo1", "foo2", "foo3"]
    }
  });
  await scopesRadioGroup.values.expectChecked();
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
  await instanceNameField.expectText("alloy1");
  await typeField.expectText("");
  await xdmField.expectValue("");
  await dataField.expectValue("");
  await mergeIdField.expectValue("");
  await scopesRadioGroup.values.expectChecked();
  await datasetIdField.expectValue("");
  await documentUnloadingField.expectUnchecked();
  await renderDecisionsField.expectUnchecked();
  await scopesRadioGroup.dataElement.expectUnchecked();
  await scopeArrayValues[0].value.expectValue("");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameField.expectText("alloy1");
  await typeField.expectText("");
  await xdmField.expectValue("");
  await dataField.expectValue("");
  await mergeIdField.expectValue("");
  await datasetIdField.expectValue("");
  await documentUnloadingField.expectUnchecked();
  await renderDecisionsField.expectUnchecked();
  await scopesRadioGroup.values.expectChecked();
  await scopesRadioGroup.dataElement.expectUnchecked();
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
  await typeField.enterSearch("mytype1");
  await typeField.pressEnterKey();
  await xdmField.typeText("%myDataLayer%");
  await dataField.typeText("%myData%");
  await mergeIdField.typeText("%myMergeId%");
  await datasetIdField.typeText("%myDatasetId%");
  await documentUnloadingField.click();
  await renderDecisionsField.click();
  await scopesRadioGroup.dataElement.click();
  await scopeDataElementField.typeText("%myScope%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    type: "mytype1",
    xdm: "%myDataLayer%",
    data: "%myData%",
    mergeId: "%myMergeId%",
    datasetId: "%myDatasetId%",
    documentUnloading: true,
    renderDecisions: true,
    decisionScopes: "%myScope%"
  });
});

test("shows error for data value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText("myData");
  await extensionViewController.expectIsNotValid();
  await dataField.expectError();
});

test("returns decision scopes settings as an array", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await scopesRadioGroup.values.click();
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
  await scopesRadioGroup.values.click();
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

test("shows error for data value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText("myData");
  await extensionViewController.expectIsNotValid();
  await dataField.expectError();
});

test("shows error for decision scope value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await scopesRadioGroup.dataElement.click();
  await scopeDataElementField.typeText("fooScope");
  await extensionViewController.expectIsNotValid();
  await scopeDataElementField.expectError();
});

test("shows error for data value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText("%a%%b%");
  await extensionViewController.expectIsNotValid();
  await dataField.expectError();
});

test("shows error for xdm value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await xdmField.typeText("%a%%b%");
  await extensionViewController.expectIsNotValid();
  await xdmField.expectError();
});

test("shows error for data value that is more than one data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await dataField.typeText("%a%%b%");
  await extensionViewController.expectIsNotValid();
  await dataField.expectError();
});

testInstanceNameOptions(extensionViewController, instanceNameField);
