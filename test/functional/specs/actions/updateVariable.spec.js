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

import createExtensionViewFixture from "../../helpers/createExtensionViewFixture";
import * as dataElementsMocks from "../../helpers/endpointMocks/dataElementsMocks";
import * as dataElementMocks from "../../helpers/endpointMocks/dataElementMocks";
import * as schemaMocks from "../../helpers/endpointMocks/schemaMocks";
import extensionViewController from "../../helpers/extensionViewController";
import spectrum from "../../helpers/spectrum";
import runCommonExtensionViewTests from "../../runCommonExtensionViewTests";
import xdmTree from "../../helpers/objectEditor/xdmTree";
import stringEdit from "../../helpers/objectEditor/stringEdit";
import arrayEdit from "../../helpers/objectEditor/arrayEdit";

const errorBoundaryMessage = spectrum.illustratedMessage(
  "errorBoundaryMessage"
);
const dataElementField = spectrum.comboBox("dataElementField");
const clearField = spectrum.checkbox("clearField");
const noDataElementsAlert = spectrum.alert("noDataElements");
const schemaChangedNotice = spectrum.alert("schemaChangedNotice");

createExtensionViewFixture({
  title: "Update variable action view",
  viewPath: "actions/updateVariable.html",
  requiresAdobeIOIntegration: true
});

runCommonExtensionViewTests();

test.requestHooks(dataElementsMocks.notFound)(
  "displays an error when the access token for data elements is invalid",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await errorBoundaryMessage.expectMessage(/Failed to load data elements\./);
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
    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.4"
      }
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

    await extensionViewController.expectSettings({
      data: {
        _unifiedjsqeonly: {
          vendor: {
            name: "name1"
          }
        }
      },
      dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.4"
      }
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

    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.4"
      },
      transforms: {
        "_unifiedjsqeonly.vendor": {
          clear: true
        }
      }
    });
  }
);

test.requestHooks(dataElementsMocks.multiple)(
  "Allows the user to clear the root element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("xdm").click();
    await clearField.click();

    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.4"
      },
      transforms: {
        "": {
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
        dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
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
  "Allows the root cleared element to be loaded",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      },
      settings: {
        data: {},
        dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
        dataElementId: "DE2",
        transforms: {
          "": {
            clear: true
          }
        }
      }
    });
    await dataElementField.expectText("Test data variable 2");
    await xdmTree.node("xdm").expectExists();
    await xdmTree.node("xdm").click();
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
        dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
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

    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      dataElementId: "DE2",
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.4"
      },
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

test.requestHooks(dataElementMocks.element1, dataElementsMocks.multiple)(
  "Shows warning when the schema version changed",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      },
      settings: {
        dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1953",
        dataElementId: "DE1",
        schema: {
          id:
            "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
          version: "1.1"
        },
        data: {}
      }
    });
    await schemaChangedNotice.expectExists();
  }
);

test.requestHooks(dataElementMocks.element1, dataElementsMocks.multiple)(
  "doesn't show warning when the schema version is the same",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      },
      settings: {
        dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1953",
        dataElementId: "DE1",
        schema: {
          id:
            "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
          version: "1.2"
        },
        data: {}
      }
    });
    await schemaChangedNotice.expectNotExists();
  }
);

test.skip.requestHooks(
  schemaMocks.basic,
  schemaMocks.other,
  dataElementsMocks.multiple
)(
  "keeps data around when changing data elements and schema objects",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 4");
    await xdmTree.node("testField").click();
    await stringEdit.enterValue("myvalue1");
    await xdmTree.node("otherField").click();
    await stringEdit.enterValue("myvalue2");
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 3");
    await xdmTree.node("testField").click();
    await stringEdit.expectValue("myvalue1");
    await xdmTree.node("otherField").expectNotExists();
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 4");
    await xdmTree.node("testField").click();
    await stringEdit.expectValue("myvalue1");
    await xdmTree.node("otherField").click();
    await stringEdit.expectValue("myvalue2");
  }
);

test.requestHooks(
  schemaMocks.basicArray,
  schemaMocks.otherArray,
  dataElementsMocks.multiple
)(
  "keeps data around when changing data elements and schema arrays",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd"
      }
    });
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 6");
    await xdmTree.node("xdm").click();
    await arrayEdit.addItem();
    await arrayEdit.addItem();
    await xdmTree.node("Item 1").toggleExpansion();
    await xdmTree.node("testField").click();
    await stringEdit.enterValue("myvalue1");
    await xdmTree.node("otherField").click();
    await stringEdit.enterValue("myvalue2");
    await xdmTree.node("Item 1").toggleExpansion();
    await xdmTree.node("Item 2").toggleExpansion();
    await xdmTree.node("testField").click();
    await stringEdit.enterValue("myvalue3");
    await xdmTree.node("otherField").click();
    await stringEdit.enterValue("myvalue4");
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 5");
    await extensionViewController.expectSettings({
      data: [
        {
          testField: "myvalue1"
        },
        {
          testField: "myvalue3"
        }
      ],
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1957",
      dataElementId: "DE4",
      schema: {
        id: "sch789",
        version: "1.0"
      }
    });
    await xdmTree.node("Item 1").toggleExpansion();
    await xdmTree.node("testField").click();
    await stringEdit.expectValue("myvalue1");
    await xdmTree.node("otherField").expectNotExists();
    await xdmTree.node("Item 1").toggleExpansion();
    await xdmTree.node("Item 2").toggleExpansion();
    await xdmTree.node("testField").click();
    await stringEdit.expectValue("myvalue3");
    await xdmTree.node("otherField").expectNotExists();
    await xdmTree.node("xdm").click();
    await arrayEdit.removeItem(0);
    await dataElementField.openMenu();
    await dataElementField.selectMenuOption("Test data variable 6");
    await xdmTree.node("Item 1").toggleExpansion();
    await xdmTree.node("testField").click();
    await stringEdit.expectValue("myvalue3");
    await xdmTree.node("otherField").click();
    await stringEdit.expectValue("myvalue4");
  }
);
