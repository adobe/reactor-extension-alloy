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

import { Selector, t } from "testcafe";
import * as sandboxMocks from "../../helpers/endpointMocks/sandboxesMocks";
import * as schemasMocks from "../../helpers/endpointMocks/schemasMocks";
import * as schemaMocks from "../../helpers/endpointMocks/schemaMocks";
import initializeExtensionView from "./helpers/initializeExtensionView";
import spectrum from "../../helpers/spectrum";
import editor from "./helpers/editor";
import createExtensionViewFixture from "../../helpers/createExtensionViewFixture";

const errorBoundaryMessage = spectrum.illustratedMessage(
  "errorBoundaryMessage"
);

const testSchemaTitle = "XDM Object Data Element Tests";
const sandboxField = spectrum.picker("sandboxField");
const schemaField = spectrum.comboBox("schemaField");

createExtensionViewFixture({
  title: "XDM Object View Schema Selection",
  viewPath: "dataElements/xdmObject.html",
  requiresAdobeIOIntegration: true
});

test.requestHooks(sandboxMocks.unauthorized)(
  "displays error when access token is invalid",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /Your access token appears to be invalid\./
    );
  }
);

test.requestHooks(sandboxMocks.userRegionMissing)(
  "displays error when org is not provisioned for AEP",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /Your organization is not provisioned for Adobe Experience Platform\. Please contact your organization administrator\./
    );
  }
);

test.requestHooks(sandboxMocks.nonJsonBody)(
  "displays error when response body is invalid JSON",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(/Failed to load sandboxes\./);
  }
);

test.requestHooks(sandboxMocks.empty, schemasMocks.empty)(
  "displays error when the user has no access to any sandboxes",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /You do not have access to any sandboxes\./
    );
  }
);

test.requestHooks(sandboxMocks.singleWithoutDefault, schemasMocks.empty)(
  "auto-selects first sandbox if response contains a single sandbox not marked as default in Platform",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectText("PRODUCTION Test Sandbox 1 (VA7)");
  }
);

test.requestHooks(sandboxMocks.multipleWithDefault, schemasMocks.empty)(
  "auto-selects sandbox marked as default in Platform",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectText("PRODUCTION Test Sandbox 2 (VA7)");
  }
);

test.requestHooks(sandboxMocks.multipleWithoutDefault, schemasMocks.empty)(
  "does not auto-select sandbox if response contains multiple sandboxes, none of which are marked as default in Platform",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectText("Select a sandbox");
  }
);

test.requestHooks(
  sandboxMocks.multipleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.empty
)(
  "auto-selects corresponding sandbox when loading saved XDM object containing sandbox name in its settings",
  async () => {
    await initializeExtensionView({
      settings: {
        sandbox: {
          name: "testsandbox3"
        },
        schema: {
          id: "sch123",
          version: "1.0"
        },
        data: {}
      }
    });
    await sandboxField.expectText("PRODUCTION Test Sandbox 3 (VA7)");
  }
);

test.requestHooks(
  sandboxMocks.multipleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.multiple
)("resets schema selection when a different sandbox is selected", async () => {
  await initializeExtensionView({
    settings: {
      sandbox: {
        name: "testsandbox1"
      },
      schema: {
        id: "sch123",
        version: "1.0"
      },
      data: {}
    }
  });
  await editor.expectExists();
  await schemaField.expectText("Test Schema 1");
  await sandboxField.selectOption("PRODUCTION Test Sandbox 2 (VA7)");
  await schemaField.expectText("");
  await editor.expectNotExists();
});

test.requestHooks(
  sandboxMocks.multipleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.empty
)(
  "displays error when loading saved XDM object containing sandbox name in its settings that doesn't match any returned sandboxes",
  async () => {
    await initializeExtensionView({
      settings: {
        sandbox: {
          name: "nonexistentsandbox"
        },
        schema: {
          id: "sch123",
          version: "1.0"
        },
        data: {}
      }
    });
    await errorBoundaryMessage.expectMessage(
      /The sandbox used to build the XDM object no longer exists/
    );
  }
);

test.requestHooks(
  sandboxMocks.multipleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.empty
)(
  "auto-selects prod sandbox when loading saved XDM object containing no sandbox name",
  async () => {
    await initializeExtensionView({
      settings: {
        schema: {
          id: "sch123",
          version: "1.0"
        },
        data: {}
      }
    });
    await sandboxField.expectText("PRODUCTION Test Sandbox Prod (VA7)");
  }
);

test.requestHooks(schemasMocks.empty)(
  "show no results in menu if there are no schemas in the sandbox",
  async () => {
    await initializeExtensionView();
    await schemaField.expectText("");
    await schemaField.openMenu();
    await schemaField.expectMenuOptionLabels(["No results"]);
  }
);

test("allows user to enter a schema search query with regular expression special characters treated as regular characters", async () => {
  await initializeExtensionView();
  await schemaField.clear();
  await schemaField.enterSearch(`${testSchemaTitle.substring(0, 3)}.*`);
  // await schemaField.expectMenuOptionLabels(["No results"]);
});

test("allows user to enter a schema search query that renders results and selects one of them", async () => {
  await initializeExtensionView();
  await schemaField.clear();
  await schemaField.enterSearch(testSchemaTitle.substring(2, 6));
  await schemaField.expectMenuOptionLabels([testSchemaTitle]);
  await schemaField.selectMenuOption(testSchemaTitle);
});

test("allows user to enter schema search query that renders no results", async () => {
  await initializeExtensionView();
  await schemaField.clear();
  await schemaField.enterSearch("bogus");
  await schemaField.expectMenuOptionLabels(["No results"]);
});

test("attempts to load a schema that has been deleted", async () => {
  await initializeExtensionView({
    settings: {
      sandbox: {
        name: "prod"
      },
      schema: {
        id: "sch123",
        version: "1.0"
      },
      data: {}
    }
  });
  await errorBoundaryMessage.expectMessage(/The resource was not found\./);
});

test.requestHooks(
  sandboxMocks.singleWithoutDefault,
  schemasMocks.single,
  schemaMocks.basic
)("auto-selects schema if the sandbox contains a single schema", async () => {
  await initializeExtensionView();
  await schemaField.expectText("Test Schema 1");
});

test.requestHooks(sandboxMocks.singleWithoutDefault, schemasMocks.multiple)(
  "does not auto-select schema if the sandbox contains multiple schemas",
  async () => {
    await initializeExtensionView();
    await schemaField.expectText("");
  }
);

test.requestHooks(
  sandboxMocks.singleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.multiple
)(
  "auto-selects schema when loading saved XDM object even when schema is not in the first page of schema metas loaded from server",
  async () => {
    // This test is to ensure we're avoiding issues described in
    // https://github.com/adobe/react-spectrum/issues/1942
    await initializeExtensionView({
      settings: {
        sandbox: {
          name: "testsandbox1"
        },
        schema: {
          id: "sch123",
          version: "1.0"
        },
        data: {}
      }
    });
    await schemaField.expectText("Test Schema 1");
  }
);

test.requestHooks(sandboxMocks.multipleWithoutDefault)(
  "show error when attempting to save with no sandbox selected",
  async () => {
    const extensionViewController = await initializeExtensionView();
    await extensionViewController.expectIsNotValid();
    await t
      .expect(Selector("div").withText("Please select a sandbox.").exists)
      .ok("Error message doesn't exist.");
  }
);

test.requestHooks(sandboxMocks.singleWithoutDefault, schemasMocks.multiple)(
  "show error when attempting to save with no schema selected",
  async () => {
    const extensionViewController = await initializeExtensionView();
    await extensionViewController.expectIsNotValid();
    await t
      .expect(Selector("div").withText("Please select a schema.").exists)
      .ok("Error message doesn't exist.");
  }
);

test.requestHooks(
  sandboxMocks.singleWithoutDefault,
  schemaMocks.basic,
  schemasMocks.paging
)("provides a proper combobox experience", async () => {
  await initializeExtensionView();

  // User types a query in the field and should only see filtered items.

  // Because the ComboBox uses virtualization when rendering items, there's
  // no good way of checking whether all the expected items are in the list,
  // because they're not all rendered in the DOM.
  await schemaField.enterSearch("e");
  const matchingLabels = schemasMocks.pagingTitles.filter(name =>
    name.includes("e")
  );
  const lastMatchingItemLabel = matchingLabels[matchingLabels.length - 1];
  const nonMatchingLabels = schemasMocks.pagingTitles.filter(
    name => !name.includes("e")
  );
  await schemaField.expectMenuOptionLabelsInclude(matchingLabels.slice(0, 3));
  // While we could check that none of the non-matching items are in the menu, it takes
  // too much time, so we'll just make sure the first few don't exist.
  await schemaField.expectMenuOptionLabelsExclude(
    nonMatchingLabels.slice(0, 3)
  );
  await schemaField.scrollDownToItem(lastMatchingItemLabel);
  await schemaField.expectMenuOptionLabelsInclude(matchingLabels.slice(-3));
  await schemaField.expectMenuOptionLabelsExclude(nonMatchingLabels.slice(-3));

  // User selects the last item.

  await schemaField.selectMenuOption(lastMatchingItemLabel);
  await schemaField.expectText(lastMatchingItemLabel);

  // User enters text that shouldn't have any matches.

  await schemaField.clear();
  await schemaField.enterSearch("bogus");
  await schemaField.expectText("bogus");
  await schemaField.expectMenuOptionLabels(["No results"]);

  // User blurs off the field

  await t.pressKey("tab");
  await schemaField.expectText(lastMatchingItemLabel);

  // User manually opens the menu and should see all unfiltered items.

  await schemaField.openMenu();
  await schemaField.scrollToTop();
  await schemaField.expectMenuOptionLabelsInclude(
    schemasMocks.pagingTitles.slice(0, 3)
  );
  await schemaField.scrollDownToItem(
    schemasMocks.pagingTitles[schemasMocks.pagingTitles.length - 1]
  );
  await schemaField.expectMenuOptionLabelsInclude(
    schemasMocks.pagingTitles.slice(-3)
  );
});
