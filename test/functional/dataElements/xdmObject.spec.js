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

import { t } from "testcafe";

import createExtensionViewController from "../helpers/createExtensionViewController";
import getAdobeIOAccessToken from "../helpers/getAdobeIOAccessToken";
import xdmTree from "./xdmObject/helpers/xdmTree";
import arrayEdit from "./xdmObject/helpers/arrayEdit";
import booleanEdit from "./xdmObject/helpers/booleanEdit";
import integerEdit from "./xdmObject/helpers/integerEdit";
import numberEdit from "./xdmObject/helpers/numberEdit";
import objectEdit from "./xdmObject/helpers/objectEdit";
import * as platformMocks from "./xdmObject/helpers/platformMocks";
import stringEdit from "./xdmObject/helpers/stringEdit";
import spectrum from "../helpers/spectrum";
import adobeIOClientCredentials from "../helpers/adobeIOClientCredentials";

const extensionViewController = createExtensionViewController(
  "dataElements/xdmObject.html"
);

const schema = {
  id:
    "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
  version: "1.2"
};

const initializationErrorAlert = spectrum.alert("initializationErrorAlert");

const schemaTitle = "XDM Object Data Element Tests";

const sandboxField = spectrum.select("sandboxField");
const schemaField = spectrum.combobox("schemaField");

const selectSchemaFromSchemasMeta = async () => {
  await schemaField.selectOption(schemaTitle);
};

/**
 * Asserts that the extension view returns settings whose data
 * matches the expected data. It also asserts that the schema is
 * correct with fuzzy matching for the schema version.
 */
const expectSettingsToContainData = async data => {
  const actualSettings = await extensionViewController.getSettings();
  await t.expect(actualSettings.schema.id).eql(schema.id);
  // We use a regex here because as changes are made to the schema (to support
  // new tests), the schema version in Platform changes, which would make our
  // tests fail if the version we were asserting were hard-coded in the test.
  await t.expect(actualSettings.schema.version).match(/^\d+\.\d+$/);
  await t
    .expect(actualSettings.data)
    .eql(data, "Expected data does not match actual data");
};

const initializeExtensionView = async additionalInitInfo => {
  const accessToken = await getAdobeIOAccessToken();
  const initInfo = {
    extensionSettings: {},
    company: {
      orgId: adobeIOClientCredentials.orgId
    },
    tokens: { imsAccess: accessToken },
    ...additionalInitInfo
  };
  await extensionViewController.init(initInfo);
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("XDM Object View")
  .disablePageReloads.page("http://localhost:3000/viewSandbox.html")
  .meta("requiresAdobeIOIntegration", true);

test("initializes form fields with individual object attribute values", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            name: "Adobe"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.expectValue("Adobe");
});

test.requestHooks(platformMocks.unauthorized)(
  "ensures invalid token error",
  async () => {
    await initializeExtensionView();
    await initializationErrorAlert.expectMessage(
      /Your access token appears to be invalid\./
    );
  }
);

test.requestHooks(platformMocks.userRegionMissing)(
  "ensures non-AEP users get AEP access error",
  async () => {
    await initializeExtensionView();
    await initializationErrorAlert.expectMessage(
      /Your user account is not enabled for AEP access\. Please contact your organization administrator\./
    );
  }
);

// We're not sure if this will ever occur, but we're covering it just in case
test.requestHooks(platformMocks.nonJsonBody)(
  "ensures non-JSON response body shows a reasonable error",
  async () => {
    await initializeExtensionView();
    await initializationErrorAlert.expectMessage(
      /An unexpected response was received from the server\./
    );
  }
);

test.requestHooks(platformMocks.sandboxesEmpty)(
  "disables user from selecting a sandbox",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectDisabled();
    await selectSchemaFromSchemasMeta();
    await xdmTree.toggleExpansion("_unifiedjsqeonly");
  }
);

test.requestHooks(
  platformMocks.schemasMeta,
  platformMocks.sandboxesWithoutDefault
)(
  "auto-selects first sandbox if response contains no default sandbox",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectEnabled();
    await sandboxField.expectValue("prod");
  }
);

test.requestHooks(platformMocks.schemasMetaEmpty)(
  "checks sandbox with no schemas",
  async () => {
    await initializeExtensionView();
    await sandboxField.expectEnabled();
    await sandboxField.selectOption("PRODUCTION Prod (VA7)");
    await spectrum.alert("selectedSandboxWarning").expectExists();
  }
);

test("allows user to enter a valid search query and get results", async () => {
  await initializeExtensionView();
  await spectrum.combobox("schemaField").enterSearch(schemaTitle);
  await spectrum.alert("selectedSchemaError").expectNotExists();
});

test("allows user to enter an invalid search query and get no results", async () => {
  await initializeExtensionView();
  await spectrum.combobox("schemaField").enterSearch("Foo2");
  await spectrum.alert("selectedSchemaError").expectNotExists();
  await spectrum.combobox("schemaField").clear();
  await spectrum.combobox("schemaField").enterSearch(schemaTitle);
  await spectrum.alert("selectedSchemaError").expectNotExists();
});

test.requestHooks(platformMocks.schemasMeta)(
  "attempts to load an invalid schema",
  async () => {
    await initializeExtensionView();
    await spectrum.combobox("schemaField").selectOption("Foo2");
    await spectrum.alert("selectedSchemaError").expectExists();
  }
);

test("allows user to provide individual object attribute values", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("Adobe");
  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        name: "Adobe"
      }
    }
  });
});

test("allows user to provide whole object value", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.click("vendor");
  await objectEdit.selectWholePopulationStrategy();
  await objectEdit.enterValue("%vendor%");
  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: "%vendor%"
    }
  });
});

test("initializes form fields with whole object value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: "%vendor%"
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.click("vendor");
  await objectEdit.expectValue("%vendor%");
});

test("allows user to provide individual array items", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.addItem();

  // Testing that removal of items works as well.
  await arrayEdit.addItem();
  await arrayEdit.removeItem(0);

  await arrayEdit.clickItem(0);
  await arrayEdit.enterValue("%industry%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        industries: ["%industry%"]
      }
    }
  });
});

test("initializes form fields with individual array items", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            industries: ["%industry%"]
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.toggleExpansion("industries");
  await xdmTree.click("Item 1");
  await arrayEdit.expectValue("%industry%");
});

test("allows user to provide whole array value", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectWholePopulationStrategy();
  await arrayEdit.enterValue("%industries%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        industries: "%industries%"
      }
    }
  });
});

test("initializes form fields with whole array value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            industries: "%industries%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.expectValue("%industries%");
});

test("arrays using whole population strategy do not have children", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await xdmTree.toggleExpansion("industries");
  await xdmTree.expectExists("Item 1");
  await arrayEdit.selectWholePopulationStrategy();
  await xdmTree.expectNotExists("Item 1");
});

test("arrays with a whole population strategy ancestor do not have children", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await xdmTree.toggleExpansion("industries");
  await xdmTree.expectExists("Item 1");
  await xdmTree.click("vendor");
  await objectEdit.selectWholePopulationStrategy();
  await xdmTree.expectNotExists("Item 1");
});

test("allows user to provide value for property with string type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("%name%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        name: "%name%"
      }
    }
  });
});

test("initializes form fields with string value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            name: "%name%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.expectValue("%name%");
});

test("allows user to provide value for property with integer type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("numEmployees");
  await integerEdit.enterValue("123");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        numEmployees: 123
      }
    }
  });
});

test("initializes form fields with integer value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            numEmployees: 123
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("numEmployees");
  await integerEdit.expectValue("123");
});

test("allows user to provide value for property with number type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("revenue");
  await integerEdit.enterValue("123.123");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        revenue: 123.123
      }
    }
  });
});

test("initializes form fields with number value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            revenue: 123.123
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("revenue");
  await numberEdit.expectValue("123.123");
});

test("allows user to enter data element value for property with boolean type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.enterDataElementValue("%isLicensed%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        isLicensed: "%isLicensed%"
      }
    }
  });
});

test("initializes form fields with boolean data element value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            isLicensed: "%isLicensed%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectDataElementValue("%isLicensed%");
});

test("allows user to select true constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("True");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        isLicensed: true
      }
    }
  });
});

test("initializes form fields with boolean constant value of true", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            isLicensed: true
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectConstantValue("True");
});

test("allows user to select false constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("False");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        isLicensed: false
      }
    }
  });
});

test("initializes form fields with boolean constant value of false", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _unifiedjsqeonly: {
          vendor: {
            isLicensed: false
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectConstantValue("False");
});

test("allows user to select no constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_unifiedjsqeonly");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("No Value");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({});
});

test("disables auto-populated fields", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.click("_id");
  await stringEdit.expectNotExists();
});

test("doesn't allow you to edit _id", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.click("_id");
  await stringEdit.expectNotExists();
});

test("allows you to edit context fields", async () => {
  await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("environment");
  await xdmTree.click("type");
  await stringEdit.expectExists();
});
