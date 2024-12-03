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

import { t } from "testcafe";
import xdmTree from "../../../helpers/objectEditor/xdmTree.mjs";
import initializeExtensionView from "../../../helpers/objectEditor/initializeExtensionView.mjs";
import createExtensionViewFixture from "../../../helpers/createExtensionViewFixture.mjs";
import spectrum from "../../../helpers/spectrum.mjs";

const schemaField = spectrum.comboBox("schemaField");

createExtensionViewFixture({
  title: "XDM Object Display Names",
  viewPath: "dataElements/xdmObject.html",
  requiresAdobeIOIntegration: true,
});

test("toggles between display names and field IDs", async () => {
  const extensionViewController = await initializeExtensionView();
  await schemaField.openMenu();
  await schemaField.selectMenuOption("XDM Object Data Element Tests");
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();

  // Initially should show field IDs (default)
  await t.expect(xdmTree.node("name").exists).ok();

  // Toggle to show display names
  await xdmTree.enableDisplayNames();
  await t.expect(xdmTree.node("Name").exists).ok();

  // Toggle back to show field IDs
  await xdmTree.enableDisplayNames();
  await t.expect(xdmTree.node("name").exists).ok();
}); 