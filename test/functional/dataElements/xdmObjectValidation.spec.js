/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import initializeExtensionView from "./xdmObject/helpers/initializeExtensionView";
import xdmTree from "./xdmObject/helpers/xdmTree";
import arrayEdit from "./xdmObject/helpers/arrayEdit";
import stringEdit from "./xdmObject/helpers/stringEdit";
import spectrum from "../helpers/spectrum2";
import createExtensionViewController from "../helpers/createExtensionViewController";

const schemaTitle = "XDM Object Data Element Tests";
const schemaSelectField = spectrum.combobox("schemaField");
const selectSchemaFromSchemasMeta = async () => {
  await schemaSelectField.selectOption(schemaTitle);
};

const extensionViewController = createExtensionViewController(
  "dataElements/xdmObject.html"
);

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("XDM Object Population Indicator")
  .disablePageReloads.page("http://localhost:3000/viewSandbox.html")
  .meta("requiresAdobeIOIntegration", true);

test("arrays with no values are invalid", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await arrayEdit.addItem();
  await arrayEdit.clickItem(0);
  await arrayEdit.enterValue("%item1%");
  await xdmTree.toggleExpansion("industries");

  await extensionViewController.expectIsNotValid();
  await xdmTree.expectIsValid("Item 1");
  await xdmTree.expectIsNotValid("Item 2");
});

test("a populated required field is valid", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("customer");
  await xdmTree.click("emailAddress");
  await stringEdit.enterValue("example@adobe.com");
  await extensionViewController.expectIsValid();
});

test("an empty required field is valid if parent object is not populated", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await extensionViewController.expectIsValid();
});

test("an empty required field is invalid if another field on parent object is populated", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("customer");
  // mailingAddress and emailAddress are siblings.
  await xdmTree.toggleExpansion("mailingAddress");
  await xdmTree.click("city");
  await stringEdit.enterValue("San Jose");
  await extensionViewController.expectIsNotValid();
  await xdmTree.expectIsNotValid("emailAddress");
});
