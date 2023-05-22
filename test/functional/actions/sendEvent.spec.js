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
import spectrum from "../helpers/spectrum";
import testInstanceNameOptions from "../helpers/testInstanceNameOptions";
import createExtensionViewFixture from "../helpers/createExtensionViewFixture";
import runCommonExtensionViewTests from "../runCommonExtensionViewTests";
import overrideViewSelectors from "../helpers/overrideViewSelectors";

import * as sandboxesMocks from "../helpers/endpointMocks/sandboxesMocks";
import * as datastreamsMocks from "../helpers/endpointMocks/datastreamsMocks";
import * as datastreamMocks from "../helpers/endpointMocks/datastreamMocks";

const instanceNameField = spectrum.picker("instanceNameField");
const typeField = spectrum.comboBox("typeField");
const xdmField = spectrum.textField("xdmField");
const dataField = spectrum.textField("dataField");
const mergeIdField = spectrum.textField("mergeIdField");
const datasetIdField = spectrum.textField("datasetIdField");
const documentUnloadingField = spectrum.checkbox("documentUnloadingField");
const renderDecisionsField = spectrum.checkbox("renderDecisionsField");
const scopeDataElementField = spectrum.textField("scopeDataElementField");
const surfaceDataElementField = spectrum.textField("surfaceDataElementField");
const scopesRadioGroup = {
  dataElement: spectrum.radio("scopeDataElementOptionField"),
  values: spectrum.radio("scopeConstantOptionField")
};
const surfacesRadioGroup = {
  dataElement: spectrum.radio("surfaceDataElementOptionField"),
  values: spectrum.radio("surfaceConstantOptionField")
};
const addDecisionScopeButton = spectrum.button("addDecisionScopeButton");
const addSurfaceButton = spectrum.button("addSurfaceButton");
const scopeArrayValues = [];
const surfaceArrayValues = [];

for (let i = 0; i < 3; i += 1) {
  scopeArrayValues.push({
    value: spectrum.textField(`scope${i}Field`),
    deleteButton: spectrum.button(`deleteScope${i}Button`)
  });
}

for (let i = 0; i < 3; i += 1) {
  surfaceArrayValues.push({
    value: spectrum.textField(`surface${i}Field`),
    deleteButton: spectrum.button(`deleteSurface${i}Button`)
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

createExtensionViewFixture({
  title: "Send Event View",
  viewPath: "actions/sendEvent.html"
});

runCommonExtensionViewTests({
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
      personalization: {
        decisionScopes: "%myDecisionScope%",
        surfaces: "%mySurface%"
      },
      datasetId: "%myDatasetId%",
      documentUnloading: true,
      renderDecisions: true,
      edgeConfigOverrides: {
        production: {
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6336ff95ba16ca1c07b4c0db"
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"]
          },
          com_adobe_identity: {
            idSyncContainerId: 23512312
          },
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          }
        },
        staging: {
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6336ff95ba16ca1c07b4c0db"
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"]
          },
          com_adobe_identity: {
            idSyncContainerId: 23512312
          },
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          }
        },
        development: {
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: "6336ff95ba16ca1c07b4c0db"
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: ["unifiedjsqeonly2"]
          },
          com_adobe_identity: {
            idSyncContainerId: 23512312
          },
          com_adobe_target: {
            propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
          }
        }
      }
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
  await surfacesRadioGroup.dataElement.expectChecked();
  await surfacesRadioGroup.values.expectUnchecked();
  await surfaceDataElementField.expectValue("%mySurface%");

  await overrideViewSelectors.envTabs.production.click();
  await overrideViewSelectors.envTabs.production.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.expectValue(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.expectValue(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.expectValue(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].expectValue(
    "unifiedjsqeonly2"
  );

  await overrideViewSelectors.envTabs.staging.click();
  await overrideViewSelectors.envTabs.staging.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.expectValue(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.expectValue(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.expectValue(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].expectValue(
    "unifiedjsqeonly2"
  );

  await overrideViewSelectors.envTabs.development.click();
  await overrideViewSelectors.envTabs.development.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.expectValue(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.expectValue(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.expectValue(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].expectValue(
    "unifiedjsqeonly2"
  );

  await extensionViewController.expectIsValid();
});

test("initializes legacy decision scopes form fields, when decision scopes is an array of scopes", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      decisionScopes: ["foo1", "foo2", "foo3"],
      personalization: {
        surfaces: ["web://bar1", "web://bar2", "web://bar3"]
      }
    }
  });
  await scopesRadioGroup.values.expectChecked();
  await scopeDataElementField.expectError;
  await scopeArrayValues[0].value.expectValue("foo1");
  await scopeArrayValues[1].value.expectValue("foo2");
  await scopeArrayValues[2].value.expectValue("foo3");
  await surfacesRadioGroup.values.expectChecked();
  await surfaceDataElementField.expectError;
  await surfaceArrayValues[0].value.expectValue("web://bar1");
  await surfaceArrayValues[1].value.expectValue("web://bar2");
  await surfaceArrayValues[2].value.expectValue("web://bar3");
});

test("initializes decision scopes and surfaces form fields, when these are arrays", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy1",
      personalization: {
        decisionScopes: ["foo1", "foo2", "foo3"],
        surfaces: ["web://bar1", "web://bar2", "web://bar3"]
      }
    }
  });
  await scopesRadioGroup.values.expectChecked();
  await scopeDataElementField.expectError;
  await scopeArrayValues[0].value.expectValue("foo1");
  await scopeArrayValues[1].value.expectValue("foo2");
  await scopeArrayValues[2].value.expectValue("foo3");
  await surfacesRadioGroup.values.expectChecked();
  await surfaceDataElementField.expectError;
  await surfaceArrayValues[0].value.expectValue("web://bar1");
  await surfaceArrayValues[1].value.expectValue("web://bar2");
  await surfaceArrayValues[2].value.expectValue("web://bar3");
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
  await surfacesRadioGroup.dataElement.expectUnchecked();
  await surfaceArrayValues[0].value.expectValue("");
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
  await surfacesRadioGroup.values.expectChecked();
  await surfacesRadioGroup.dataElement.expectUnchecked();
  await surfaceArrayValues[0].value.expectValue("");
  await overrideViewSelectors.textFields.eventDatasetOverride.expectValue("");
  await overrideViewSelectors.textFields.idSyncContainerOverride.expectValue(
    ""
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.expectValue(
    ""
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].expectValue(
    ""
  );
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
  await surfacesRadioGroup.dataElement.click();
  await surfaceDataElementField.typeText("%mySurface%");
  await extensionViewController.expectIsValid();

  await overrideViewSelectors.envTabs.production.expectExists();
  await overrideViewSelectors.envTabs.production.click();
  await overrideViewSelectors.envTabs.production.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.typeText(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.typeText(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.typeText(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].typeText(
    "unifiedjsqeonly2"
  );
  await overrideViewSelectors.addReportSuiteButton.click();
  await overrideViewSelectors.textFields.reportSuiteOverrides[1].typeText(
    "unifiedjsqeonly3"
  );
  await overrideViewSelectors.envTabs.staging.expectExists();
  await overrideViewSelectors.envTabs.staging.click();
  await overrideViewSelectors.envTabs.staging.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.typeText(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.typeText(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.typeText(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].typeText(
    "unifiedjsqeonly2"
  );
  await overrideViewSelectors.addReportSuiteButton.click();
  await overrideViewSelectors.textFields.reportSuiteOverrides[1].typeText(
    "unifiedjsqeonly3"
  );
  await overrideViewSelectors.envTabs.development.expectExists();
  await overrideViewSelectors.envTabs.development.click();
  await overrideViewSelectors.envTabs.development.expectSelected();
  await overrideViewSelectors.textFields.eventDatasetOverride.typeText(
    "6336ff95ba16ca1c07b4c0db"
  );
  await overrideViewSelectors.textFields.idSyncContainerOverride.typeText(
    "23512312"
  );
  await overrideViewSelectors.textFields.targetPropertyTokenOverride.typeText(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
  );
  await overrideViewSelectors.textFields.reportSuiteOverrides[0].typeText(
    "unifiedjsqeonly2"
  );
  await overrideViewSelectors.addReportSuiteButton.click();
  await overrideViewSelectors.textFields.reportSuiteOverrides[1].typeText(
    "unifiedjsqeonly3"
  );

  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    type: "mytype1",
    xdm: "%myDataLayer%",
    data: "%myData%",
    mergeId: "%myMergeId%",
    datasetId: "%myDatasetId%",
    documentUnloading: true,
    renderDecisions: true,
    personalization: {
      decisionScopes: "%myScope%",
      surfaces: "%mySurface%"
    },
    edgeConfigOverrides: {
      production: {
        com_adobe_experience_platform: {
          datasets: {
            event: {
              datasetId: "6336ff95ba16ca1c07b4c0db"
            }
          }
        },
        com_adobe_analytics: {
          reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"]
        },
        com_adobe_identity: {
          idSyncContainerId: 23512312
        },
        com_adobe_target: {
          propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
        }
      },
      staging: {
        com_adobe_experience_platform: {
          datasets: {
            event: {
              datasetId: "6336ff95ba16ca1c07b4c0db"
            }
          }
        },
        com_adobe_analytics: {
          reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"]
        },
        com_adobe_identity: {
          idSyncContainerId: 23512312
        },
        com_adobe_target: {
          propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
        }
      },
      development: {
        com_adobe_experience_platform: {
          datasets: {
            event: {
              datasetId: "6336ff95ba16ca1c07b4c0db"
            }
          }
        },
        com_adobe_analytics: {
          reportSuites: ["unifiedjsqeonly2", "unifiedjsqeonly3"]
        },
        com_adobe_identity: {
          idSyncContainerId: 23512312
        },
        com_adobe_target: {
          propertyToken: "01dbc634-07c1-d8f9-ca69-b489a5ac5e94"
        }
      }
    }
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
    personalization: {
      decisionScopes: ["foo", "foo2"]
    }
  });
});

test("returns surfaces settings as an array", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await surfacesRadioGroup.values.click();
  await surfaceArrayValues[0].value.typeText("web://foo");
  await addSurfaceButton.click();
  await surfaceArrayValues[1].value.typeText("web://foo1");
  await addSurfaceButton.click();
  await surfaceArrayValues[2].value.typeText("web://foo2");
  await surfaceArrayValues[1].deleteButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    personalization: {
      surfaces: ["web://foo", "web://foo2"]
    }
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

test("does not return surface settings when provided with array of empty strings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await surfacesRadioGroup.values.click();
  await addSurfaceButton.click();
  await addSurfaceButton.click();
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

test("shows error for surface value that is not a data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await surfacesRadioGroup.dataElement.click();
  await surfaceDataElementField.typeText("fooSurface");
  await extensionViewController.expectIsNotValid();
  await surfaceDataElementField.expectError();
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

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamsMocks.single,
  datastreamMocks.withConfigOverrides
)("populates overrides dropdowns with Blackbird config data", async () => {
  await extensionViewController.init({
    extensionSettings: {
      instances: [
        {
          name: "alloy",
          edgeConfigId: "aca8c786-4940-442f-ace5-7c4aba02118e",
          sandbox: "prod"
        }
      ]
    }
  });

  await overrideViewSelectors.envTabs.production.expectSelected();
  await overrideViewSelectors.comboBoxes.eventDatasetOverride.expectExists();
  await overrideViewSelectors.comboBoxes.eventDatasetOverride.openMenu();
  await overrideViewSelectors.comboBoxes.eventDatasetOverride.expectMenuOptionLabels(
    ["6335faf30f5a161c0b4b1444"]
  );
  await overrideViewSelectors.comboBoxes.eventDatasetOverride.selectMenuOption(
    "6335faf30f5a161c0b4b1444"
  );

  await overrideViewSelectors.comboBoxes.idSyncContainerOverride.expectExists();
  await overrideViewSelectors.comboBoxes.idSyncContainerOverride.openMenu();
  await overrideViewSelectors.comboBoxes.idSyncContainerOverride.expectMenuOptionLabels(
    ["107756", "107757"]
  );
  await overrideViewSelectors.comboBoxes.idSyncContainerOverride.selectMenuOption(
    "107756"
  );

  await overrideViewSelectors.comboBoxes.targetPropertyTokenOverride.expectExists();
  await overrideViewSelectors.comboBoxes.targetPropertyTokenOverride.openMenu();
  await overrideViewSelectors.comboBoxes.targetPropertyTokenOverride.expectMenuOptionLabels(
    [
      "aba5431a-9f59-f816-7d73-8e40c8f4c4fd",
      "65d186ff-be14-dfa0-75fa-546d93bebf91"
    ]
  );
  await overrideViewSelectors.comboBoxes.targetPropertyTokenOverride.selectMenuOption(
    "aba5431a-9f59-f816-7d73-8e40c8f4c4fd"
  );

  await overrideViewSelectors.comboBoxes.reportSuiteOverrides[0].expectExists();
  await overrideViewSelectors.comboBoxes.reportSuiteOverrides[0].openMenu();
  await overrideViewSelectors.comboBoxes.reportSuiteOverrides[0].expectMenuOptionLabels(
    ["unifiedjsqeonly2", "unifiedjsqeonlylatest", "unifiedjsqeonlymobileweb"]
  );
  await overrideViewSelectors.comboBoxes.reportSuiteOverrides[0].selectMenuOption(
    "unifiedjsqeonlylatest"
  );

  await extensionViewController.expectIsValid();
});
