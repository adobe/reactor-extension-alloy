/*
Copyright 2020 Adobe. All rights reserved.
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
import booleanEdit from "./helpers/booleanEdit";
import integerEdit from "./helpers/integerEdit";
import numberEdit from "./helpers/numberEdit";
import objectEdit from "./helpers/objectEdit";
import stringEdit from "./helpers/stringEdit";
import spectrum from "../../helpers/spectrum";

const schemaTitle = "XDM Object Data Element Tests";
const schemaSelectField = spectrum.select("schemaField");
const selectSchemaFromSchemasMeta = async () => {
  await schemaSelectField.selectOption(schemaTitle);
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("XDM Object View Core Functionality")
  .disablePageReloads.page("http://localhost:3000/viewSandbox.html")
  .meta("requiresAdobeIOIntegration", true);

test("doesn't show population amount for disabled fields", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  const idPop = await xdmTree.populationIndicator("_id");
  await idPop.expectBlank();
});

test("shows population amount for auto-populated fields", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  const environmentPop = await xdmTree.populationIndicator("environment");
  await environmentPop.expectPartial();
  await xdmTree.toggleExpansion("environment");
  const typePop = await xdmTree.populationIndicator("type");
  await typePop.expectFull();
});

test("shows correct population amount for data element objects", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  const vendorPop = await xdmTree.populationIndicator("vendor");
  await vendorPop.expectEmpty();
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("vendor");
  const namePop = await xdmTree.populationIndicator("name");
  await namePop.expectEmpty();
  await objectEdit.selectWholePopulationStrategy();
  await vendorPop.expectEmpty();
  await namePop.expectBlank();
  await objectEdit.enterValue("%vendor%");
  await vendorPop.expectFull();
  await namePop.expectBlank();
});

test("shows partial population amount for objects", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  const vendorPop = await xdmTree.populationIndicator("vendor");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("Adobe");
  await vendorPop.expectPartial();
});

test("show correct population amount for arrays", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  const industriesPop = await xdmTree.populationIndicator("industries");
  await industriesPop.expectEmpty();
  await xdmTree.click("industries");
  await arrayEdit.addItem();
  await industriesPop.expectEmpty();

  await arrayEdit.clickItem(0);
  await arrayEdit.enterValue("%industry%");
  await industriesPop.expectFull();
  await xdmTree.click("industries");
  await arrayEdit.addItem();
  await industriesPop.expectPartial();
});

[
  {
    title: "whole array",
    field: "industries",
    async set() {
      await arrayEdit.selectWholePopulationStrategy();
      await arrayEdit.enterValue("%industries%");
    }
  },
  {
    title: "string value",
    field: "name",
    async set() {
      await stringEdit.enterValue("%name%");
    }
  },
  {
    title: "integer value",
    field: "numEmployees",
    async set() {
      await integerEdit.enterValue("123");
    }
  },
  {
    title: "number value",
    field: "revenue",
    async set() {
      await numberEdit.enterValue("123.123");
    }
  },
  {
    title: "boolean data element",
    field: "isLicensed",
    async set() {
      await booleanEdit.enterDataElementValue("%isLicensed%");
    }
  },
  {
    title: "boolean true",
    field: "isLicensed",
    async set() {
      await booleanEdit.selectConstantInputMethod();
      await booleanEdit.selectConstantValue("True");
    }
  },
  {
    title: "boolean false",
    field: "isLicensed",
    async set() {
      await booleanEdit.selectConstantInputMethod();
      await booleanEdit.selectConstantValue("False");
    }
  }
].forEach(({ title, field, set }) => {
  test(`shows correct population amount for ${title}`, async () => {
    await initializeExtensionView();
    await selectSchemaFromSchemasMeta();
    await xdmTree.toggleExpansion("_alloyengineering");
    await xdmTree.toggleExpansion("vendor");
    await xdmTree.click(field);
    const fieldPop = await xdmTree.populationIndicator(field);
    await fieldPop.expectEmpty();
    await set();
    await fieldPop.expectFull();
  });
});

test("shows empty population indicator for booleans with No Value selected", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  const isLicensedPop = await xdmTree.populationIndicator("isLicensed");
  await isLicensedPop.expectEmpty();
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("No Value");
  await isLicensedPop.expectEmpty();
});
