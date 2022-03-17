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

import initializeExtensionView from "./helpers/initializeExtensionView";
import xdmTree from "./helpers/xdmTree";
import arrayEdit from "./helpers/arrayEdit";
import stringEdit from "./helpers/stringEdit";
import editor from "./helpers/editor";
import createExtensionViewFixture from "../../helpers/createExtensionViewFixture";

createExtensionViewFixture({
  title: "XDM Object Validation",
  viewPath: "dataElements/xdmObject.html",
  requiresAdobeIOIntegration: true
});

test("arrays with no values are invalid", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await arrayEdit.addItem();
  await arrayEdit.clickItem(0);
  await arrayEdit.enterValue("%item1%");
  await xdmTree.node("industries").toggleExpansion();

  await extensionViewController.expectIsNotValid();
  await xdmTree.node("Item 1").expectIsValid();
  await xdmTree.node("Item 2").expectIsNotValid();
});

test("a populated required field is valid", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("customer").toggleExpansion();
  await xdmTree.node("emailAddress").click();
  await stringEdit.enterValue("example@adobe.com");
  await extensionViewController.expectIsValid();
});

test("an empty required field is valid if parent object is not populated", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await editor.expectExists();
  await extensionViewController.expectIsValid();
});

test("an empty required field is invalid if another field on parent object is populated", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("customer").toggleExpansion();
  // mailingAddress and emailAddress are siblings.
  await xdmTree.node("mailingAddress").toggleExpansion();
  await xdmTree.node("city").click();
  await stringEdit.enterValue("San Jose");
  await extensionViewController.expectIsNotValid();
  await xdmTree.node("emailAddress").expectIsNotValid();
});
