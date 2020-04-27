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

import createExtensionViewController from "../helpers/createExtensionViewController";
import getAdobeIOAccessToken from "../helpers/getAdobeIOAccessToken";
import xdmTree from "./xdmObject/helpers/xdmTree";
import arrayItemsEdit from "./xdmObject/helpers/arrayItemsEdit";
import nodeEdit from "./xdmObject/helpers/nodeEdit";

const extensionViewController = createExtensionViewController(
  "dataElements/xdmObject.html"
);

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("XDM Object View")
  .disablePageReloads.page("http://localhost:3000/viewSandbox.html")
  .meta("requiresAdobeIOIntegration", true);

const schema = {
  id:
    "https://ns.adobe.com/alloyengineering/schemas/2c70e73b33329135dea3aac47bb52ec2",
  version: "1.3"
};

const initializeExtensionView = async additionalInitInfo => {
  const accessToken = await getAdobeIOAccessToken();
  const initInfo = {
    extensionSettings: {
      instances: [
        {
          edgeConfigId: "74580452-647b-4797-99af-6d0e042435ec"
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

test("allows user to provide individual object attribute values", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await nodeEdit.enterWholeValue("Adobe");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    schema,
    data: {
      _alloyengineering: {
        vendor: {
          name: "Adobe"
        }
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
  await nodeEdit.expectWholeValue("Adobe");
});

test("allows user to provide whole object value", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.click("vendor");
  await nodeEdit.selectWholePopulationStrategy();
  await nodeEdit.enterWholeValue("%vendor%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    schema,
    data: {
      _alloyengineering: {
        vendor: "%vendor%"
      }
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
  await nodeEdit.expectWholeValue("%vendor%");
});

test("allows user to provide individual array items", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await arrayItemsEdit.addItem();

  // Testing that removal of items works as well.
  await arrayItemsEdit.addItem();
  await arrayItemsEdit.removeItem(0);

  await arrayItemsEdit.clickItem(0);
  await nodeEdit.enterWholeValue("%industry%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    schema,
    data: {
      _alloyengineering: {
        vendor: {
          industries: ["%industry%"]
        }
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
  await nodeEdit.expectWholeValue("%industry%");
});

test("allows user to provide whole array value", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("industries");
  await nodeEdit.selectWholePopulationStrategy();
  await nodeEdit.enterWholeValue("%industries%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    schema,
    data: {
      _alloyengineering: {
        vendor: {
          industries: "%industries%"
        }
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
  await nodeEdit.expectWholeValue("%industries%");
});

test("allows user to provide value for property with string type", async () => {
  await initializeExtensionView();
  await xdmTree.toggleExpansion("_alloyengineering");
  await xdmTree.toggleExpansion("vendor");
  await xdmTree.click("name");
  await nodeEdit.enterWholeValue("%name%");

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    schema,
    data: {
      _alloyengineering: {
        vendor: {
          name: "%name%"
        }
      }
    }
  });
});
