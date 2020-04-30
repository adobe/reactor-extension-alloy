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
import stringEdit from "./xdmObject/helpers/stringEdit";

const extensionViewController = createExtensionViewController(
  "dataElements/xdmObject.html"
);

const schema = {
  id:
    "https://ns.adobe.com/alloyengineering/schemas/2c70e73b33329135dea3aac47bb52ec2",
  version: "1.6"
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
    .eql(
      data,
      `Expected data: ${JSON.stringify(data)} Actual data: ${JSON.stringify(
        actualSettings.data
      )}`
    );
};

const initializeExtensionView = async additionalInitInfo => {
  const accessToken = await getAdobeIOAccessToken();
  const initInfo = {
    extensionSettings: {
      instances: [
        {
          configId: "74580452-647b-4797-99af-6d0e042435ec"
        }
      ]
    },
    company: {
      orgId: "334F60F35E1597910A495EC2@AdobeOrg"
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

test("allows user to provide individual object attribute values", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("Adobe");
  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
      vendor: {
        name: "Adobe"
      }
    }
  });
});

test("initializes form fields with individual object attribute values", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _alloyengineering: {
          vendor: {
            name: "Adobe"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.expectValue("Adobe");
});

test("allows user to provide whole object value", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.click("vendor");
  await objectEdit.selectWholePopulationStrategy();
  await objectEdit.enterValue("%vendor%");
  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
      vendor: "%vendor%"
    }
  });
});

test("initializes form fields with whole object value", async () => {
  await initializeExtensionView({
    settings: {
      schema,
      data: {
        _alloyengineering: {
          vendor: "%vendor%"
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.click("vendor");
  await objectEdit.expectValue("%vendor%");
});

test("allows user to provide individual array items", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
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
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            industries: ["%industry%"]
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.toggleExpansion("industries");
  await xdmTree.click("Item 1");
  await arrayEdit.expectValue("%industry%");
});

test("allows user to provide whole array value", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectWholePopulationStrategy();
  await arrayEdit.enterValue("%industries%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            industries: "%industries%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.expectValue("%industries%");
});

test("allows user to provide value for property with string type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("%name%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            name: "%name%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.expectValue("%name%");
});

test("allows user to provide value for property with integer type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("numEmployees");
  await integerEdit.enterValue("123");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            numEmployees: 123
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("numEmployees");
  await integerEdit.expectValue("123");
});

test("allows user to provide value for property with number type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("revenue");
  await integerEdit.enterValue("123.123");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            revenue: 123.123
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("revenue");
  await numberEdit.expectValue("123.123");
});

test("allows user to enter data element value for property with boolean type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.enterDataElementValue("%isLicensed%");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            isLicensed: "%isLicensed%"
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectDataElementValue("%isLicensed%");
});

test("allows user to select true constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("True");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            isLicensed: true
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectConstantValue("True");
});

test("allows user to select false constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("False");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({
    _alloyengineering: {
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
        _alloyengineering: {
          vendor: {
            isLicensed: false
          }
        }
      }
    }
  });
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.expectConstantValue("False");
});

test("allows user to select no constant value for property with boolean type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("No Value");

  await extensionViewController.expectIsValid();
  await expectSettingsToContainData({});
});
