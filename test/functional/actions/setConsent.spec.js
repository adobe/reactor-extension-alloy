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

const generateOptionsWithDataElement = (container, prefix, options) =>
  [...options, "DataElement"].reduce(
    (elements, option) => {
      elements[`${prefix}${option}Radio`] = container.radio(
        `${prefix}${option}Radio`
      );
      return elements;
    },
    {
      [`${prefix}DataElementField`]: container.textField(
        `${prefix}DataElementField`
      )
    }
  );

const instanceNamePicker = spectrum.picker("instanceNamePicker");
const identityMapField = spectrum.textField("identityMapField");
const inputMethodFormRadio = spectrum.radio("inputMethodFormRadio");
const inputMethodDataElementRadio = spectrum.radio(
  "inputMethodDataElementRadio"
);
const addConsentButton = spectrum.button("addConsentButton");
const consentObjects = [];

for (let i = 0; i < 3; i += 1) {
  const container = spectrum.container(`consentObject${i}`);
  consentObjects.push({
    container,
    standardPicker: container.picker("standardPicker"),
    adobeVersionPicker: container.picker("adobeVersionPicker"),
    iabVersionField: container.textField("iabVersionField"),
    valueField: container.textField("valueField"),
    ...generateOptionsWithDataElement(container, "general", ["In", "Out"]),
    iabValueField: container.textField("iabValueField"),
    ...generateOptionsWithDataElement(container, "gdprApplies", ["Yes", "No"]),
    ...generateOptionsWithDataElement(container, "gdprContainsPersonalData", [
      "Yes",
      "No"
    ]),
    deleteConsentButton: container.button("deleteConsentButton")
  });
}
const dataElementField = spectrum.textField("dataElementField");

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
  title: "Set Consent View",
  viewPath: "actions/setConsent.html"
});

runCommonViewTests({
  extensionSettings: mockExtensionSettings
});

test("initializes form fields with settings containing a static consent array", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      identityMap: "%dataelement1%",
      consent: [
        { standard: "Adobe", version: "1.0", value: { general: "out" } },
        {
          standard: "IAB TCF",
          version: "2.0",
          value: "1234abcd",
          gdprApplies: false,
          gdprContainsPersonalData: true
        },
        { standard: "Adobe", version: "2.0", value: "%dataelement2%" }
      ]
    }
  });
  await instanceNamePicker.expectSelectedOptionLabel("alloy2");
  await identityMapField.expectValue("%dataelement1%");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await consentObjects[0].standardPicker.expectSelectedOptionLabel("Adobe");
  await consentObjects[0].adobeVersionPicker.expectSelectedOptionLabel("1.0");
  await consentObjects[0].generalInRadio.expectUnchecked();
  await consentObjects[0].generalOutRadio.expectChecked();
  await consentObjects[0].generalDataElementRadio.expectUnchecked();
  await consentObjects[0].generalDataElementField.expectNotExists();
  await consentObjects[0].valueField.expectNotExists();
  await consentObjects[0].iabVersionField.expectNotExists();
  await consentObjects[0].iabValueField.expectNotExists();
  await consentObjects[0].gdprAppliesYesRadio.expectNotExists();
  await consentObjects[0].gdprAppliesNoRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementField.expectNotExists();

  await consentObjects[1].standardPicker.expectSelectedOptionLabel("IAB TCF");
  await consentObjects[1].adobeVersionPicker.expectNotExists();
  await consentObjects[1].generalInRadio.expectNotExists();
  await consentObjects[1].generalOutRadio.expectNotExists();
  await consentObjects[1].generalDataElementRadio.expectNotExists();
  await consentObjects[1].generalDataElementField.expectNotExists();
  await consentObjects[1].valueField.expectNotExists();
  await consentObjects[1].iabVersionField.expectValue("2.0");
  await consentObjects[1].iabValueField.expectValue("1234abcd");
  await consentObjects[1].gdprAppliesYesRadio.expectUnchecked();
  await consentObjects[1].gdprAppliesNoRadio.expectChecked();
  await consentObjects[1].gdprAppliesDataElementRadio.expectUnchecked();
  await consentObjects[1].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[1].gdprContainsPersonalDataYesRadio.expectChecked();
  await consentObjects[1].gdprContainsPersonalDataNoRadio.expectUnchecked();
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.expectUnchecked();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.expectNotExists();

  await consentObjects[2].standardPicker.expectSelectedOptionLabel("Adobe");
  await consentObjects[2].adobeVersionPicker.expectSelectedOptionLabel("2.0");
  await consentObjects[2].generalInRadio.expectNotExists();
  await consentObjects[2].generalOutRadio.expectNotExists();
  await consentObjects[2].generalDataElementRadio.expectNotExists();
  await consentObjects[2].generalDataElementField.expectNotExists();
  await consentObjects[2].valueField.expectValue("%dataelement2%");
  await consentObjects[2].iabVersionField.expectNotExists();
  await consentObjects[2].iabValueField.expectNotExists();
  await consentObjects[2].gdprAppliesYesRadio.expectNotExists();
  await consentObjects[2].gdprAppliesNoRadio.expectNotExists();
  await consentObjects[2].gdprAppliesDataElementRadio.expectNotExists();
  await consentObjects[2].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[2].gdprContainsPersonalDataYesRadio.expectNotExists();
  await consentObjects[2].gdprContainsPersonalDataNoRadio.expectNotExists();
  await consentObjects[2].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await consentObjects[2].gdprContainsPersonalDataDataElementField.expectNotExists();
});

test("initializes form fields with settings containing data elements for parts", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      identityMap: "%data0%",
      consent: [
        { standard: "Adobe", version: "1.0", value: { general: "%data1%" } },
        {
          standard: "IAB TCF",
          version: "2.0",
          value: "%data2%",
          gdprApplies: "%data3%",
          gdprContainsPersonalData: "%data4%"
        }
      ]
    }
  });
  await instanceNamePicker.expectSelectedOptionLabel("alloy2");
  await identityMapField.expectValue("%data0%");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await consentObjects[0].standardPicker.expectSelectedOptionLabel("Adobe");
  await consentObjects[0].adobeVersionPicker.expectSelectedOptionLabel("1.0");
  await consentObjects[0].generalInRadio.expectUnchecked();
  await consentObjects[0].generalOutRadio.expectUnchecked();
  await consentObjects[0].generalDataElementRadio.expectChecked();
  await consentObjects[0].generalDataElementField.expectValue("%data1%");
  await consentObjects[0].valueField.expectNotExists();
  await consentObjects[0].iabVersionField.expectNotExists();
  await consentObjects[0].iabValueField.expectNotExists();
  await consentObjects[0].gdprAppliesYesRadio.expectNotExists();
  await consentObjects[0].gdprAppliesNoRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementField.expectNotExists();

  await consentObjects[1].standardPicker.expectSelectedOptionLabel("IAB TCF");
  await consentObjects[1].adobeVersionPicker.expectNotExists();
  await consentObjects[1].generalInRadio.expectNotExists();
  await consentObjects[1].generalOutRadio.expectNotExists();
  await consentObjects[1].generalDataElementRadio.expectNotExists();
  await consentObjects[1].generalDataElementField.expectNotExists();
  await consentObjects[1].valueField.expectNotExists();
  await consentObjects[1].iabVersionField.expectValue("2.0");
  await consentObjects[1].iabValueField.expectValue("%data2%");
  await consentObjects[1].gdprAppliesYesRadio.expectUnchecked();
  await consentObjects[1].gdprAppliesNoRadio.expectUnchecked();
  await consentObjects[1].gdprAppliesDataElementRadio.expectChecked();
  await consentObjects[1].gdprAppliesDataElementField.expectValue("%data3%");
  await consentObjects[1].gdprContainsPersonalDataYesRadio.expectUnchecked();
  await consentObjects[1].gdprContainsPersonalDataNoRadio.expectUnchecked();
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.expectChecked();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.expectValue(
    "%data4%"
  );
});

test("initializes form fields with settings containing data element for consent", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy2",
      identityMap: "%data1%",
      consent: "%data2%"
    }
  });
  await instanceNamePicker.expectSelectedOptionLabel("alloy2");
  await identityMapField.expectValue("%data1%");
  await inputMethodFormRadio.expectUnchecked();
  await inputMethodDataElementRadio.expectChecked();
  await dataElementField.expectValue("%data2%");
  await addConsentButton.expectNotExists();
  await consentObjects[0].container.expectNotExists();
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNamePicker.expectSelectedOptionLabel("alloy1");
  await identityMapField.expectValue("");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await consentObjects[0].standardPicker.expectSelectedOptionLabel("Adobe");
  await consentObjects[0].adobeVersionPicker.expectSelectedOptionLabel("1.0");
  await consentObjects[0].adobeVersionPicker.selectOption("2.0");
  await consentObjects[0].generalInRadio.expectNotExists();
  await consentObjects[0].generalOutRadio.expectNotExists();
  await consentObjects[0].generalDataElementRadio.expectNotExists();
  await consentObjects[0].generalDataElementField.expectNotExists();
  await consentObjects[0].valueField.expectValue("");
  await consentObjects[0].iabVersionField.expectNotExists();
  await consentObjects[0].iabValueField.expectNotExists();
  await consentObjects[0].gdprAppliesYesRadio.expectNotExists();
  await consentObjects[0].gdprAppliesNoRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementRadio.expectNotExists();
  await consentObjects[0].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataDataElementField.expectNotExists();
  await consentObjects[1].container.expectNotExists();

  await consentObjects[0].adobeVersionPicker.selectOption("1.0");

  await consentObjects[0].generalInRadio.expectChecked();
  await consentObjects[0].generalOutRadio.expectUnchecked();
  await consentObjects[0].generalDataElementRadio.expectUnchecked();
  await consentObjects[0].generalDataElementField.expectNotExists();
  await consentObjects[0].valueField.expectNotExists("");

  await consentObjects[0].standardPicker.selectOption("IAB TCF");

  await consentObjects[0].standardPicker.expectSelectedOptionLabel("IAB TCF");
  await consentObjects[0].adobeVersionPicker.expectNotExists();
  await consentObjects[0].generalInRadio.expectNotExists();
  await consentObjects[0].generalOutRadio.expectNotExists();
  await consentObjects[0].generalDataElementRadio.expectNotExists();
  await consentObjects[0].generalDataElementField.expectNotExists();
  await consentObjects[0].valueField.expectNotExists();
  await consentObjects[0].iabVersionField.expectValue("2.0");
  await consentObjects[0].iabValueField.expectValue("");
  await consentObjects[0].gdprAppliesYesRadio.expectChecked();
  await consentObjects[0].gdprAppliesNoRadio.expectUnchecked();
  await consentObjects[0].gdprAppliesDataElementRadio.expectUnchecked();
  await consentObjects[0].gdprAppliesDataElementField.expectNotExists();
  await consentObjects[0].gdprContainsPersonalDataYesRadio.expectUnchecked();
  await consentObjects[0].gdprContainsPersonalDataNoRadio.expectChecked();
  await consentObjects[0].gdprContainsPersonalDataDataElementRadio.expectUnchecked();
  await consentObjects[0].gdprContainsPersonalDataDataElementField.expectNotExists();
  await consentObjects[1].container.expectNotExists();
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await addConsentButton.click();
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.typeText("2.1", { replace: true });
  await consentObjects[1].iabValueField.typeText("1234abcd");
  await addConsentButton.click();
  await consentObjects[2].adobeVersionPicker.selectOption("2.0");
  await consentObjects[2].valueField.typeText("%dataelement2%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    consent: [
      {
        standard: "Adobe",
        version: "1.0",
        value: { general: "in" }
      },
      {
        standard: "IAB TCF",
        version: "2.1",
        value: "1234abcd",
        gdprApplies: true,
        gdprContainsPersonalData: false
      },
      {
        standard: "Adobe",
        version: "2.0",
        value: "%dataelement2%"
      }
    ]
  });
});

test("returns full valid settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNamePicker.selectOption("alloy2");
  await identityMapField.typeText("%data0%");
  await consentObjects[0].standardPicker.selectOption("IAB TCF");
  await consentObjects[0].iabVersionField.typeText("2.2", { replace: true });
  await consentObjects[0].iabValueField.typeText("a");
  await consentObjects[0].gdprAppliesNoRadio.click();
  await consentObjects[0].gdprContainsPersonalDataYesRadio.click();
  await addConsentButton.click();
  await consentObjects[1].adobeVersionPicker.selectOption("1.0");
  await consentObjects[1].generalOutRadio.click();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy2",
    identityMap: "%data0%",
    consent: [
      {
        standard: "IAB TCF",
        version: "2.2",
        value: "a",
        gdprApplies: false,
        gdprContainsPersonalData: true
      },
      {
        standard: "Adobe",
        version: "1.0",
        value: { general: "out" }
      }
    ]
  });
});

test("returns valid settings for guided form data elements", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await consentObjects[0].generalDataElementRadio.click();
  await consentObjects[0].generalDataElementField.typeText("%data1%");
  await addConsentButton.click();
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.typeText("2.3", { replace: true });
  await consentObjects[1].iabValueField.typeText("%data2%");
  await consentObjects[1].gdprAppliesDataElementRadio.click();
  await consentObjects[1].gdprAppliesDataElementField.typeText("%data3%");
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.click();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.typeText(
    "%data4%"
  );

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    consent: [
      {
        standard: "Adobe",
        version: "1.0",
        value: { general: "%data1%" }
      },
      {
        standard: "IAB TCF",
        version: "2.3",
        value: "%data2%",
        gdprApplies: "%data3%",
        gdprContainsPersonalData: "%data4%"
      }
    ]
  });
});

test("returns valid settings for data element", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await inputMethodDataElementRadio.click();
  await dataElementField.typeText("%data2%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy1",
    consent: "%data2%"
  });
});

test("deletes consent objects", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await consentObjects[0].standardPicker.selectOption("IAB TCF");
  await consentObjects[0].iabVersionField.typeText("1", { replace: true });
  await consentObjects[0].deleteConsentButton.expectNotExists();
  await consentObjects[1].container.expectNotExists();
  await addConsentButton.click();
  await consentObjects[0].deleteConsentButton.expectEnabled();
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.typeText("2", { replace: true });
  await consentObjects[0].deleteConsentButton.click();
  await consentObjects[0].iabVersionField.expectValue("2");
  await consentObjects[1].container.expectNotExists();
  await addConsentButton.click();
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.typeText("3");
  await consentObjects[1].deleteConsentButton.click();
  await consentObjects[1].container.expectNotExists();
  await consentObjects[0].iabVersionField.expectValue("2");
});

test("shows errors for empty values", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await addConsentButton.click();
  await consentObjects[0].adobeVersionPicker.selectOption("2.0");
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.clear();
  await consentObjects[1].gdprAppliesDataElementRadio.click();
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.click();
  await addConsentButton.click();
  await consentObjects[2].generalDataElementRadio.click();

  await extensionViewController.expectIsNotValid();
  await consentObjects[0].valueField.expectError();
  await consentObjects[1].iabValueField.expectError();
  await consentObjects[1].gdprAppliesDataElementField.expectError();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.expectError();
  await consentObjects[2].generalDataElementField.expectError();
});

test("shows errors for things that aren't data elements and does not show errors for hidden invalid fields", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await consentObjects[0].generalDataElementRadio.click();
  await consentObjects[0].generalDataElementField.typeText("notadataelement");
  await addConsentButton.click();
  await consentObjects[1].standardPicker.selectOption("IAB TCF");
  await consentObjects[1].iabVersionField.typeText("2");
  await consentObjects[1].iabValueField.typeText("notadataelement");
  await consentObjects[1].gdprAppliesDataElementRadio.click();
  await consentObjects[1].gdprAppliesDataElementField.typeText(
    "%data1%%data2%"
  );
  // force a blur, otherwise the error message that shows up will push everything
  // down, which will change the next click target.
  await consentObjects[1].gdprAppliesDataElementRadio.click();
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.click();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.typeText(
    "%notadataelement"
  );
  // force a blur
  await consentObjects[1].gdprContainsPersonalDataDataElementRadio.click();
  await addConsentButton.click();
  await consentObjects[2].adobeVersionPicker.selectOption("2.0");
  await consentObjects[2].valueField.typeText("notadataelement");

  await extensionViewController.expectIsNotValid();
  await consentObjects[0].generalDataElementField.expectError();
  await consentObjects[1].iabValueField.expectNoError();
  await consentObjects[1].gdprAppliesDataElementField.expectError();
  await consentObjects[1].gdprContainsPersonalDataDataElementField.expectError();
  await consentObjects[2].valueField.expectError();

  await inputMethodDataElementRadio.click();
  await dataElementField.typeText("%dataelement%");
  await extensionViewController.expectIsValid();

  await dataElementField.typeText("notadataelement");
  await extensionViewController.expectIsNotValid();
  await dataElementField.expectError();

  await inputMethodFormRadio.click();
  await consentObjects[0].generalInRadio.click();
  await consentObjects[1].gdprAppliesYesRadio.click();
  await consentObjects[1].gdprContainsPersonalDataYesRadio.click();
  await consentObjects[2].valueField.typeText("%dataelement%", {
    replace: true
  });
  await extensionViewController.expectIsValid();
});

test("remembers the initial data element value", async () => {
  const settings = {
    instanceName: "alloy2",
    consent: [
      {
        standard: "Adobe",
        version: "1.0",
        value: { general: "%dataelement1%" }
      }
    ]
  };
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings
  });

  await consentObjects[0].generalInRadio.click();
  await consentObjects[0].generalDataElementRadio.click();
  await consentObjects[0].generalDataElementField.expectValue("%dataelement1%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings(settings);
});

test("can show the consent object form when consent is initially a data element", async () => {
  const settings = {
    instanceName: "alloy",
    consent: "%dataElement1%"
  };
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings
  });

  await inputMethodFormRadio.click();
  await consentObjects[0].standardPicker.expectExists();
});

testInstanceNameOptions(extensionViewController, instanceNamePicker);
