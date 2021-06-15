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
import spectrum from "../helpers/spectrum2";
import testInstanceNameOptions from "../helpers/spectrum2TestInstanceNameOptions";
import createFixture from "../helpers/createFixture";

const extensionViewController = createExtensionViewController(
  "actions/setConsent.html"
);

const generateOptionsWithDataElement = (container, prefix, options) =>
  [...options, "DataElement"].reduce(
    (elements, option) => {
      elements[`${prefix}${option}Radio`] = container.radio(
        `${prefix}${option}Radio`
      );
      return elements;
    },
    {
      [`${prefix}DataElementField`]: container.textfield(
        `${prefix}DataElementField`
      )
    }
  );

const instanceNameSelect = spectrum.select("instanceNameSelect");
const identityMapField = spectrum.textfield("identityMapField");
const inputMethodFormRadio = spectrum.radio("inputMethodFormRadio");
const inputMethodDataElementRadio = spectrum.radio(
  "inputMethodDataElementRadio"
);
const addConsentButton = spectrum.button("addConsentButton");
const instances = [];

for (let i = 0; i < 3; i += 1) {
  const container = spectrum.container(`instance${i}`);
  instances.push({
    container,
    standardSelect: container.select("standardSelect"),
    adobeVersionSelect: container.select("adobeVersionSelect"),
    iabVersionField: container.textfield("iabVersionField"),
    valueField: container.textfield("valueField"),
    ...generateOptionsWithDataElement(container, "general", ["In", "Out"]),
    iabValueField: container.textfield("iabValueField"),
    ...generateOptionsWithDataElement(container, "gdprApplies", ["Yes", "No"]),
    ...generateOptionsWithDataElement(container, "gdprContainsPersonalData", [
      "Yes",
      "No"
    ]),
    deleteConsentButton: container.button("deleteConsentButton")
  });
}
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

createFixture({
  title: "Set Consent View",
  viewPath: "actions/setConsent.html"
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
  await instanceNameSelect.expectValue("alloy2");
  await identityMapField.expectValue("%dataelement1%");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await instances[0].standardSelect.expectValue("adobe");
  await instances[0].adobeVersionSelect.expectValue("1.0");
  await instances[0].generalInRadio.expectUnchecked();
  await instances[0].generalOutRadio.expectChecked();
  await instances[0].generalDataElementRadio.expectUnchecked();
  await instances[0].generalDataElementField.expectNotExists();
  await instances[0].valueField.expectNotExists();
  await instances[0].iabVersionField.expectNotExists();
  await instances[0].iabValueField.expectNotExists();
  await instances[0].gdprAppliesYesRadio.expectNotExists();
  await instances[0].gdprAppliesNoRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementField.expectNotExists();
  await instances[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementField.expectNotExists();

  await instances[1].standardSelect.expectValue("iab_tcf");
  await instances[1].adobeVersionSelect.expectNotExists();
  await instances[1].generalInRadio.expectNotExists();
  await instances[1].generalOutRadio.expectNotExists();
  await instances[1].generalDataElementRadio.expectNotExists();
  await instances[1].generalDataElementField.expectNotExists();
  await instances[1].valueField.expectNotExists();
  await instances[1].iabVersionField.expectValue("2.0");
  await instances[1].iabValueField.expectValue("1234abcd");
  await instances[1].gdprAppliesYesRadio.expectUnchecked();
  await instances[1].gdprAppliesNoRadio.expectChecked();
  await instances[1].gdprAppliesDataElementRadio.expectUnchecked();
  await instances[1].gdprAppliesDataElementField.expectNotExists();
  await instances[1].gdprContainsPersonalDataYesRadio.expectChecked();
  await instances[1].gdprContainsPersonalDataNoRadio.expectUnchecked();
  await instances[1].gdprContainsPersonalDataDataElementRadio.expectUnchecked();
  await instances[1].gdprContainsPersonalDataDataElementField.expectNotExists();

  await instances[2].standardSelect.expectValue("adobe");
  await instances[2].adobeVersionSelect.expectValue("2.0");
  await instances[2].generalInRadio.expectNotExists();
  await instances[2].generalOutRadio.expectNotExists();
  await instances[2].generalDataElementRadio.expectNotExists();
  await instances[2].generalDataElementField.expectNotExists();
  await instances[2].valueField.expectValue("%dataelement2%");
  await instances[2].iabVersionField.expectNotExists();
  await instances[2].iabValueField.expectNotExists();
  await instances[2].gdprAppliesYesRadio.expectNotExists();
  await instances[2].gdprAppliesNoRadio.expectNotExists();
  await instances[2].gdprAppliesDataElementRadio.expectNotExists();
  await instances[2].gdprAppliesDataElementField.expectNotExists();
  await instances[2].gdprContainsPersonalDataYesRadio.expectNotExists();
  await instances[2].gdprContainsPersonalDataNoRadio.expectNotExists();
  await instances[2].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await instances[2].gdprContainsPersonalDataDataElementField.expectNotExists();
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
  await instanceNameSelect.expectValue("alloy2");
  await identityMapField.expectValue("%data0%");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await instances[0].standardSelect.expectValue("adobe");
  await instances[0].adobeVersionSelect.expectValue("1.0");
  await instances[0].generalInRadio.expectUnchecked();
  await instances[0].generalOutRadio.expectUnchecked();
  await instances[0].generalDataElementRadio.expectChecked();
  await instances[0].generalDataElementField.expectValue("%data1%");
  await instances[0].valueField.expectNotExists();
  await instances[0].iabVersionField.expectNotExists();
  await instances[0].iabValueField.expectNotExists();
  await instances[0].gdprAppliesYesRadio.expectNotExists();
  await instances[0].gdprAppliesNoRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementField.expectNotExists();
  await instances[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementField.expectNotExists();

  await instances[1].standardSelect.expectValue("iab_tcf");
  await instances[1].adobeVersionSelect.expectNotExists();
  await instances[1].generalInRadio.expectNotExists();
  await instances[1].generalOutRadio.expectNotExists();
  await instances[1].generalDataElementRadio.expectNotExists();
  await instances[1].generalDataElementField.expectNotExists();
  await instances[1].valueField.expectNotExists();
  await instances[1].iabVersionField.expectValue("2.0");
  await instances[1].iabValueField.expectValue("%data2%");
  await instances[1].gdprAppliesYesRadio.expectUnchecked();
  await instances[1].gdprAppliesNoRadio.expectUnchecked();
  await instances[1].gdprAppliesDataElementRadio.expectChecked();
  await instances[1].gdprAppliesDataElementField.expectValue("%data3%");
  await instances[1].gdprContainsPersonalDataYesRadio.expectUnchecked();
  await instances[1].gdprContainsPersonalDataNoRadio.expectUnchecked();
  await instances[1].gdprContainsPersonalDataDataElementRadio.expectChecked();
  await instances[1].gdprContainsPersonalDataDataElementField.expectValue(
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
  await instanceNameSelect.expectValue("alloy2");
  await identityMapField.expectValue("%data1%");
  await inputMethodFormRadio.expectUnchecked();
  await inputMethodDataElementRadio.expectChecked();
  await dataElementField.expectValue("%data2%");
  await addConsentButton.expectNotExists();
  await instances[0].container.expectNotExists();
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instanceNameSelect.expectValue("alloy1");
  await identityMapField.expectValue("");
  await inputMethodFormRadio.expectChecked();
  await inputMethodDataElementRadio.expectUnchecked();
  await dataElementField.expectNotExists();
  await addConsentButton.expectExists();

  await instances[0].standardSelect.expectValue("adobe");
  await instances[0].adobeVersionSelect.expectValue("1.0");
  await instances[0].adobeVersionSelect.selectOption("2.0");
  await instances[0].generalInRadio.expectNotExists();
  await instances[0].generalOutRadio.expectNotExists();
  await instances[0].generalDataElementRadio.expectNotExists();
  await instances[0].generalDataElementField.expectNotExists();
  await instances[0].valueField.expectValue("");
  await instances[0].iabVersionField.expectNotExists();
  await instances[0].iabValueField.expectNotExists();
  await instances[0].gdprAppliesYesRadio.expectNotExists();
  await instances[0].gdprAppliesNoRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementRadio.expectNotExists();
  await instances[0].gdprAppliesDataElementField.expectNotExists();
  await instances[0].gdprContainsPersonalDataYesRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataNoRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementRadio.expectNotExists();
  await instances[0].gdprContainsPersonalDataDataElementField.expectNotExists();
  await instances[1].container.expectNotExists();

  await instances[0].adobeVersionSelect.selectOption("1.0");

  await instances[0].generalInRadio.expectChecked();
  await instances[0].generalOutRadio.expectUnchecked();
  await instances[0].generalDataElementRadio.expectUnchecked();
  await instances[0].generalDataElementField.expectNotExists();
  await instances[0].valueField.expectNotExists("");

  await instances[0].standardSelect.selectOption("IAB TCF");

  await instances[0].standardSelect.expectValue("iab_tcf");
  await instances[0].adobeVersionSelect.expectNotExists();
  await instances[0].generalInRadio.expectNotExists();
  await instances[0].generalOutRadio.expectNotExists();
  await instances[0].generalDataElementRadio.expectNotExists();
  await instances[0].generalDataElementField.expectNotExists();
  await instances[0].valueField.expectNotExists();
  await instances[0].iabVersionField.expectValue("2.0");
  await instances[0].iabValueField.expectValue("");
  await instances[0].gdprAppliesYesRadio.expectChecked();
  await instances[0].gdprAppliesNoRadio.expectUnchecked();
  await instances[0].gdprAppliesDataElementRadio.expectUnchecked();
  await instances[0].gdprAppliesDataElementField.expectNotExists();
  await instances[0].gdprContainsPersonalDataYesRadio.expectUnchecked();
  await instances[0].gdprContainsPersonalDataNoRadio.expectChecked();
  await instances[0].gdprContainsPersonalDataDataElementRadio.expectUnchecked();
  await instances[0].gdprContainsPersonalDataDataElementField.expectNotExists();
  await instances[1].container.expectNotExists();
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await addConsentButton.click();
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.typeText("2.1", { replace: true });
  await instances[1].iabValueField.typeText("1234abcd");
  await addConsentButton.click();
  await instances[2].adobeVersionSelect.selectOption("2.0");
  await instances[2].valueField.typeText("%dataelement2%");

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
  await instanceNameSelect.selectOption("alloy2");
  await identityMapField.typeText("%data0%");
  await instances[0].standardSelect.selectOption("IAB TCF");
  await instances[0].iabVersionField.typeText("2.2", { replace: true });
  await instances[0].iabValueField.typeText("a");
  await instances[0].gdprAppliesNoRadio.click();
  await instances[0].gdprContainsPersonalDataYesRadio.click();
  await addConsentButton.click();
  await instances[1].adobeVersionSelect.selectOption("1.0");
  await instances[1].generalOutRadio.click();

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

test("returns valid setting for guided form data elements", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instances[0].generalDataElementRadio.click();
  await instances[0].generalDataElementField.typeText("%data1%");
  await addConsentButton.click();
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.typeText("2.3", { replace: true });
  await instances[1].iabValueField.typeText("%data2%");
  await instances[1].gdprAppliesDataElementRadio.click();
  await instances[1].gdprAppliesDataElementField.typeText("%data3%");
  await instances[1].gdprContainsPersonalDataDataElementRadio.click();
  await instances[1].gdprContainsPersonalDataDataElementField.typeText(
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
  await instances[0].standardSelect.selectOption("IAB TCF");
  await instances[0].iabVersionField.typeText("1", { replace: true });
  await instances[0].deleteConsentButton.expectDisabled();
  await instances[1].container.expectNotExists();
  await addConsentButton.click();
  await instances[0].deleteConsentButton.expectEnabled();
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.typeText("2", { replace: true });
  await instances[0].deleteConsentButton.click();
  await instances[0].iabVersionField.expectValue("2");
  await instances[1].container.expectNotExists();
  await addConsentButton.click();
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.typeText("3");
  await instances[1].deleteConsentButton.click();
  await instances[1].container.expectNotExists();
  await instances[0].iabVersionField.expectValue("2");
});

test("shows errors for empty values", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await addConsentButton.click();
  await instances[0].adobeVersionSelect.selectOption("2.0");
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.clear();
  await instances[1].gdprAppliesDataElementRadio.click();
  await instances[1].gdprContainsPersonalDataDataElementRadio.click();
  await addConsentButton.click();
  await instances[2].generalDataElementRadio.click();

  await extensionViewController.expectIsNotValid();
  await instances[0].valueField.expectError();
  await instances[1].iabValueField.expectError();
  await instances[1].gdprAppliesDataElementField.expectError();
  await instances[1].gdprContainsPersonalDataDataElementField.expectError();
  await instances[2].generalDataElementField.expectError();
});

test("shows errors for things that aren't data elements and does not show errors for hidden invalid fields", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });
  await instances[0].generalDataElementRadio.click();
  await instances[0].generalDataElementField.typeText("notadataelement");
  await addConsentButton.click();
  await instances[1].standardSelect.selectOption("IAB TCF");
  await instances[1].iabVersionField.typeText("2");
  await instances[1].iabValueField.typeText("notadataelement");
  await instances[1].gdprAppliesDataElementRadio.click();
  await instances[1].gdprAppliesDataElementField.typeText("%data1%%data2%");
  await instances[1].gdprContainsPersonalDataDataElementRadio.click();
  await instances[1].gdprContainsPersonalDataDataElementField.typeText(
    "%notadataelement"
  );
  await addConsentButton.click();
  await instances[2].adobeVersionSelect.selectOption("2.0");
  await instances[2].valueField.typeText("notadataelement");

  await extensionViewController.expectIsNotValid();
  await instances[0].generalDataElementField.expectError();
  await instances[1].iabValueField.expectNoError();
  await instances[1].gdprAppliesDataElementField.expectError();
  await instances[1].gdprContainsPersonalDataDataElementField.expectError();
  await instances[2].valueField.expectError();

  await inputMethodDataElementRadio.click();
  await dataElementField.typeText("%dataelement%");
  await extensionViewController.expectIsValid();

  await dataElementField.typeText("notadataelement");
  await extensionViewController.expectIsNotValid();
  await dataElementField.expectError();

  await inputMethodFormRadio.click();
  await instances[0].generalInRadio.click();
  await instances[1].gdprAppliesYesRadio.click();
  await instances[1].gdprContainsPersonalDataYesRadio.click();
  await instances[2].valueField.typeText("%dataelement%", { replace: true });
  await extensionViewController.expectIsValid();
});

testInstanceNameOptions(extensionViewController, instanceNameSelect);
