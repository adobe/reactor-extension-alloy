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
import * as platformMocks from "./helpers/platformMocks";
import initializeExtensionView from "./helpers/initializeExtensionView";
import spectrum from "../../helpers/spectrum3";
import {
  schemasMetaPagingMock,
  schemasMetaPagingTitles
} from "./helpers/platformMocks";
import editor from "./helpers/editor";
import createFixture from "../../helpers/createFixture";

const errorBoundaryMessage = spectrum.illustratedMessage(
  "errorBoundaryMessage"
);

const testSchemaTitle = "XDM Object Data Element Tests";
const sandboxField = spectrum.picker("sandboxField");
const schemaField = spectrum.comboBox("schemaField");

createFixture({
  title: "XDM Object View Schema Selection",
  viewPath: "dataElements/xdmObject.html",
  requiresAdobeIOIntegration: true
});

test.requestHooks(platformMocks.sandboxesUnauthorized)(
  "displays error when access token is invalid",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /Your access token appears to be invalid\./
    );
  }
);

test.requestHooks(platformMocks.sandboxesUserRegionMissing)(
  "displays error when user is not provisioned for AEP",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /Your user account is not enabled for AEP access\. Please contact your organization administrator\./
    );
  }
);

test.requestHooks(platformMocks.sandboxesNonJsonBody)(
  "displays error when response body is invalid JSON",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(/Failed to load sandboxes\./);
  }
);

test.requestHooks(platformMocks.sandboxesEmpty, platformMocks.schemasMetaEmpty)(
  "displays error when the user has no access to any sandboxes",
  async () => {
    await initializeExtensionView();
    await errorBoundaryMessage.expectMessage(
      /You do not have access to any sandboxes\./
    );
  }
);

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schemasMetaEmpty
)(
  "auto-selects first sandbox if response contains a single sandbox not marked as default in Platform",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectText("PRODUCTION Test Sandbox 1 (VA7)");
  }
);

test.requestHooks(
  platformMocks.sandboxesMultipleWithDefault,
  platformMocks.schemasMetaEmpty
)("auto-selects sandbox marked as default in Platform", async () => {
  await initializeExtensionView();
  await sandboxField.expectText("PRODUCTION Test Sandbox 2 (VA7)");
});

test.requestHooks(
  platformMocks.sandboxesMultipleWithoutDefault,
  platformMocks.schemasMetaEmpty
)(
  "does not auto-select sandbox if response contains multiple sandboxes, none of which are marked as default in Platform",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectText("Select a sandbox");
  }
);

test.requestHooks(
  platformMocks.sandboxesMultipleWithoutDefault,
  platformMocks.schema,
  platformMocks.schemasMetaEmpty
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
  platformMocks.sandboxesMultipleWithoutDefault,
  platformMocks.schema,
  platformMocks.schemasMetaMultiple
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
  platformMocks.sandboxesMultipleWithoutDefault,
  platformMocks.schema,
  platformMocks.schemasMetaEmpty
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
  platformMocks.sandboxesMultipleWithoutDefault,
  platformMocks.schema,
  platformMocks.schemasMetaEmpty
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

test.requestHooks(platformMocks.schemasMetaEmpty)(
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
  await schemaField.expectMenuOptionLabels(["No results"]);
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
  await errorBoundaryMessage.expectMessage(/Resource not found/);
});

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schemasMetaSingle,
  platformMocks.schema
)("auto-selects schema if the sandbox contains a single schema", async () => {
  await initializeExtensionView();
  await schemaField.expectText("Test Schema 1");
});

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schemasMetaMultiple
)(
  "does not auto-select schema if the sandbox contains multiple schemas",
  async () => {
    await initializeExtensionView();
    await schemaField.expectText("");
  }
);

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schema,
  platformMocks.schemasMetaMultiple
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

test.requestHooks(platformMocks.sandboxesMultipleWithoutDefault)(
  "show error when attempting to save with no sandbox selected",
  async () => {
    const extensionViewController = await initializeExtensionView();
    await extensionViewController.expectIsNotValid();
    await t
      .expect(Selector("div").withText("Please select a sandbox.").exists)
      .ok("Error message doesn't exist.");
  }
);

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schemasMetaMultiple
)("show error when attempting to save with no schema selected", async () => {
  const extensionViewController = await initializeExtensionView();
  await extensionViewController.expectIsNotValid();
  await t
    .expect(Selector("div").withText("Please select a schema.").exists)
    .ok("Error message doesn't exist.");
});

test.requestHooks(
  platformMocks.sandboxesSingleWithoutDefault,
  platformMocks.schema,
  schemasMetaPagingMock
)("provides a proper combobox experience", async () => {
  await initializeExtensionView();

  // User types a query in the field and should only see filtered items.

  // Because the ComboBox uses virtualization when rendering items, there's
  // no good way of checking whether all the expected items are in the list,
  // because they're not all rendered in the DOM.
  await schemaField.enterSearch("e");
  const matchingLabels = schemasMetaPagingTitles.filter(name =>
    name.includes("e")
  );
  const lastMatchingItemLabel = matchingLabels[matchingLabels.length - 1];
  const nonMatchingLabels = schemasMetaPagingTitles.filter(
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
  await schemaField.expectMenuOptionLabelsInclude(
    schemasMetaPagingTitles.slice(0, 3)
  );
  await schemaField.scrollDownToItem(
    schemasMetaPagingTitles[schemasMetaPagingTitles.length - 1]
  );
  await schemaField.expectMenuOptionLabelsInclude(
    schemasMetaPagingTitles.slice(-3)
  );
});
