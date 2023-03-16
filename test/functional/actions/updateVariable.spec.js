/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { t } from "testcafe";
import createExtensionViewFixture from "../helpers/createExtensionViewFixture";
import * as dataElementsMocks from "../helpers/endpointMocks/dataElementsMocks";
import * as dataElementMocks from "../helpers/endpointMocks/dataElementMocks";
import extensionViewController from "../helpers/extensionViewController";
import spectrum from "../helpers/spectrum";
import runCommonExtensionViewTests from "../runCommonExtensionViewTests";
import xdmTree from "../helpers/objectEditor/xdmTree";
import stringEdit from "../helpers/objectEditor/stringEdit";

const errorBoundaryMessage = spectrum.illustratedMessage(
  "errorBoundaryMessage"
);
const dataElementField = spectrum.comboBox("dataElementField");
const clearField = spectrum.checkbox("clearField");
const noDataElementsAlert = spectrum.alert("noDataElements");

createExtensionViewFixture({
  title: "Update variable action view",
  viewPath: "actions/updateVariable.html",
  requiresAdobeIOIntegration: true
});

runCommonExtensionViewTests();

test.requestHooks(dataElementsMocks.notFound)(
  "displays an error when the access token for sandboxes is invalid",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await errorBoundaryMessage.expectMessage(/The resource was not found\./);
  }
);

test.requestHooks(dataElementsMocks.single)(
  "selects the variable when there is only one",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.expectText("Test data variable 1");
    await noDataElementsAlert.expectNotExists();
    await xdmTree.node("xdm").expectExists();
  }
);

test.requestHooks(
  dataElementsMocks.noneWithNextPage,
  dataElementsMocks.secondPageWithOne
)(
  "selects the variable when there are lots of data elements, but only one variable data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.expectText("Test data variable 1");
    await xdmTree.node("xdm").expectExists();
  }
);

test.requestHooks(dataElementsMocks.multiple)(
  "Allows the user to select a data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    const settings = await extensionViewController.getSettings();
    await t.expect(settings).eql({
      data: {},
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      transforms: {}
    });
  }
);

test.requestHooks(dataElementsMocks.multiple)(
  "Allows the user to select a data element and set the XDM",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
    await xdmTree.node("vendor").toggleExpansion();
    await xdmTree.node("name").click();
    await stringEdit.expectExists();
    await stringEdit.enterValue("name1");

    const settings = await extensionViewController.getSettings();
    await t.expect(settings).eql({
      data: {
        _unifiedjsqeonly: {
          vendor: {
            name: "name1"
          }
        }
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      transforms: {}
    });
  }
);

test.requestHooks(dataElementsMocks.multiple)(
  "Allows the user to clear an element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
    await xdmTree.node("vendor").click();
    await clearField.click();

    const settings = await extensionViewController.getSettings();
    await t.expect(settings).eql({
      data: {},
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      transforms: {
        "_unifiedjsqeonly.vendor": {
          clear: true
        }
      }
    });
  }
);

test.requestHooks(dataElementsMocks.multiple, dataElementMocks.element2)(
  "Allows a cleared element to be loaded",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      },
      settings: {
        data: {},
        dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
        dataElementId: "DE2",
        transforms: {
          "_unifiedjsqeonly.vendor": {
            clear: true
          }
        }
      }
    });
    await dataElementField.expectText("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
    await xdmTree.node("vendor").click();
    await clearField.expectChecked();
  }
);

test.requestHooks(dataElementsMocks.multiple, dataElementMocks.element2)(
  "disables clear checkbox of sub-elements",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      },
      settings: {
        data: {},
        dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
        dataElementId: "DE2",
        transforms: {
          "_unifiedjsqeonly.vendor": {
            clear: true
          }
        }
      }
    });
    await dataElementField.expectText("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
    await xdmTree.node("vendor").toggleExpansion();
    await xdmTree.node("name").click();
    await clearField.expectChecked();
    await clearField.expectDisabled();
  }
);

test.requestHooks(dataElementsMocks.multiple)(
  "Allows the user to clear the root level",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 2");
    await xdmTree.node("xdm").click();
    await clearField.click();

    const settings = await extensionViewController.getSettings();
    await t.expect(settings).eql({
      data: {},
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      transforms: {
        "": {
          clear: true
        }
      }
    });
  }
);

test.requestHooks(dataElementsMocks.none)(
  "Handle no variable data elements",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await noDataElementsAlert.expectExists();
  }
);
