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

const schema = {
  id:
    "https://ns.adobe.com/alloyengineering/schemas/2c70e73b33329135dea3aac47bb52ec2",
  version: "1.6"
};

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

test("allows user to provide individual object attribute values", async () => {
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("Adobe");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.click("vendor");
  await objectEdit.selectWholePopulationStrategy();
  await objectEdit.enterValue("%vendor%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
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
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayEdit.selectWholePopulationStrategy();
  await arrayEdit.enterValue("%industries%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await stringEdit.enterValue("%name%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("numEmployees");
  await integerEdit.enterValue("123");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("revenue");
  await integerEdit.enterValue("123.123");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.enterDataElementValue("%isLicensed%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("True");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("False");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  const extensionViewController = await initializeExtensionView();
  await selectSchemaFromSchemasMeta();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("isLicensed");
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantValue("No Value");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({});
});
