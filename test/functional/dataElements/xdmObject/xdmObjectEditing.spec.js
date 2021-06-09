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

import xdmTree from "./helpers/xdmTree";
import arrayEdit from "./helpers/arrayEdit";
import booleanEdit from "./helpers/booleanEdit";
import integerEdit from "./helpers/integerEdit";
import numberEdit from "./helpers/numberEdit";
import objectEdit from "./helpers/objectEdit";
import stringEdit from "./helpers/stringEdit";
import initializeExtensionView from "./helpers/initializeExtensionView";

const schema = {
  id:
    "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
  version: "1.2"
};

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("XDM Object Editing")
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("name").click();
  await stringEdit.expectValue("Adobe");
});

test("allows user to provide individual object attribute values", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("name").click();
  await stringEdit.enterValue("Adobe");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
    _unifiedjsqeonly: {
      vendor: {
        name: "Adobe"
      }
    }
  });
});

test("allows user to provide whole object value", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").click();
  await objectEdit.selectWholePopulationStrategy();
  await objectEdit.enterValue("%vendor%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").click();
  await objectEdit.expectValue("%vendor%");
});

test("allows user to provide individual array items", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.addItem();

  // Testing that removal of items works as well.
  await arrayEdit.addItem();
  await arrayEdit.removeItem(0);

  await arrayEdit.clickItem(0);
  await arrayEdit.enterValue("%industry%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").toggleExpansion();
  await xdmTree.node("Item 1").click();
  await arrayEdit.expectValue("%industry%");
});

test("allows user to provide whole array value", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.selectWholePopulationStrategy();
  await arrayEdit.enterValue("%industries%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.expectValue("%industries%");
});

test("arrays using whole population strategy do not have children", async () => {
  await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await xdmTree.node("industries").toggleExpansion();
  await xdmTree.node("Item 1").expectExists();
  await arrayEdit.selectWholePopulationStrategy();
  await xdmTree.node("Item 1").expectNotExists();
});

test("arrays with a whole population strategy ancestor do not have children", async () => {
  await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("industries").click();
  await arrayEdit.selectPartsPopulationStrategy();
  await arrayEdit.addItem();
  await xdmTree.node("industries").toggleExpansion();
  await xdmTree.node("Item 1").expectExists();
  await xdmTree.node("vendor").click();
  await objectEdit.selectWholePopulationStrategy();
  await xdmTree.node("item 1").expectNotExists();
});

test("allows user to provide value for property with string type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("name").click();
  await stringEdit.enterValue("%name%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("name").click();
  await stringEdit.expectValue("%name%");
});

test("allows user to provide value for property with integer type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("numEmployees").click();
  await integerEdit.enterValue("123");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("numEmployees").click();
  await integerEdit.expectValue("123");
});

test("allows user to provide value for property with number type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("revenue").click();
  await integerEdit.enterValue("123.123");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("revenue").click();
  await numberEdit.expectValue("123.123");
});

test("allows user to enter data element value for property with boolean type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.enterDataElementValue("%isLicensed%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.expectDataElementValue("%isLicensed%");
});

test("allows user to select true constant value for property with boolean type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantTrueValueField();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.expectConstantTrueValue();
});

test("allows user to select false constant value for property with boolean type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantFalseValueField();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({
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
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.expectConstantFalseValue();
});

test("allows user to select no constant value for property with boolean type", async () => {
  const extensionViewController = await initializeExtensionView();
  await xdmTree.node("_unifiedjsqeonly").toggleExpansion();
  await xdmTree.node("vendor").toggleExpansion();
  await xdmTree.node("isLicensed").click();
  await booleanEdit.selectConstantInputMethod();
  await booleanEdit.selectConstantNoValueField();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettingsToContainData({});
});

test("disables auto-populated fields", async () => {
  await initializeExtensionView();
  await xdmTree.node("_id").click();
  await stringEdit.expectNotExists();
});

test("doesn't allow you to edit _id", async () => {
  await initializeExtensionView();
  await xdmTree.node("_id").click();
  await stringEdit.expectNotExists();
});

test("allows you to edit context fields", async () => {
  await initializeExtensionView();
  await xdmTree.node("environment").toggleExpansion();
  await xdmTree.node("type").click();
  await stringEdit.expectExists();
});
