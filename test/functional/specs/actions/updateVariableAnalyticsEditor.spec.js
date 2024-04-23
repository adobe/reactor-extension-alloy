/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import createExtensionViewFixture from "../../helpers/createExtensionViewFixture";
import * as dataElementsMocks from "../../helpers/endpointMocks/dataElementsMocks";
import extensionViewController from "../../helpers/extensionViewController";

import spectrum from "../../helpers/spectrum";

const analyticsField = (type, dataTestId) => {
  return spectrum[type](
    `properties.data.properties.__adobe.properties.analytics.${dataTestId}`
  );
};
const analyticsArrayField = (type, name, dataTestId) => index => {
  return spectrum[type](
    `properties.data.properties.__adobe.properties.analytics.value.${name}.${index}.${dataTestId}`
  );
};

const individualAttributesOption = analyticsField("radio", "valuePartsOption");
const entireObjectOption = analyticsField("radio", "valueWholeOption");
const jsonEditor = analyticsField("textField", "valueWhole");
const eVarName = analyticsArrayField("comboBox", "evars", "evarField");
const eVarAction = analyticsArrayField("comboBox", "evars", "actionField");
const eVarValue = analyticsArrayField("textField", "evars", "valueTextField");
const eVarCopy = analyticsArrayField("comboBox", "evars", "copyField");
const eVarAddButton = analyticsField("button", "value.evarsAddButton");

createExtensionViewFixture({
  title: "Update variable analytics editor",
  viewPath: "actions/updateVariable.html",
  requiresAdobeIOIntegration: true
});

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns minimal valid settings",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns full valid settings",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await eVarName(0).openMenu();
    await eVarName(0).selectMenuOption("eVar10");
    await eVarValue(0).typeText("value10");
    await eVarAddButton.click();
    await eVarName(1).openMenu();
    await eVarName(1).selectMenuOption("eVar2");
    await eVarAction(1).openMenu();
    await eVarAction(1).selectMenuOption("Copy from");
    await eVarCopy(1).openMenu();
    await eVarCopy(1).selectMenuOption("eVar10");

    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          analytics: {
            eVar2: "D=v10",
            eVar10: "value10"
          }
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns single data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText("%data element%");
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          analytics: "%data element%"
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns multiple data elements",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await eVarName(0).openMenu();
    await eVarName(0).selectMenuOption("eVar10");
    await eVarValue(0).typeText("%value10%");

    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          analytics: {
            eVar10: "%value10%"
          }
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns JSON modified data",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText('{"key1":"value1"}');
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          analytics: {
            key1: "value1"
          }
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "switches between whole and parts population strategies with a data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText("%data element%");
    await extensionViewController.expectIsValid();
    await individualAttributesOption.click();
    await extensionViewController.expectIsValid();
    await entireObjectOption.click();
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          analytics: "%data element%"
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1"
    });
  }
);
