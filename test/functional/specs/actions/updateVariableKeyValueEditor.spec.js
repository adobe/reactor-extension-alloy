import createExtensionViewFixture from "../../helpers/createExtensionViewFixture";
import * as dataElementsMocks from "../../helpers/endpointMocks/dataElementsMocks";
import * as dataElementMocks from "../../helpers/endpointMocks/dataElementMocks";
import extensionViewController from "../../helpers/extensionViewController";
import {
  individualAttributesOption,
  entireObjectOption,
  key,
  value,
  propertyAddButton,
  jsonEditor,
} from "../../helpers/objectEditor/objectJsonEdit";
import xdmTree from "../../helpers/objectEditor/xdmTree";

createExtensionViewFixture({
  title: "Update variable key value editor",
  viewPath: "actions/updateVariable.html",
  requiresAdobeIOIntegration: true,
});

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns minimal valid settings",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {},
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns full valid settings",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await key(0).typeText("key1");
    await value(0).typeText("value1");
    await propertyAddButton.click();
    await key(1).typeText("key2");
    await value(1).typeText("value2");
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          target: {
            key1: "value1",
            key2: "value2",
          },
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(
  dataElementsMocks.singleSolutions,
  dataElementMocks.solutionsElement1,
)("it fills in values", async () => {
  await extensionViewController.init({
    propertySettings: {
      id: "PRabcd",
    },
    settings: {
      data: {
        __adobe: {
          target: {
            key1: "value1",
            key2: "value2",
          },
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    },
  });
  await key(0).expectValue("key1");
  await value(0).expectValue("value1");
  await key(1).expectValue("key2");
  await value(1).expectValue("value2");
});

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns single data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText("%data element%");
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          target: "%data element%",
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns data element values",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await key(0).typeText("key1");
    await value(0).typeText("%value1%");
    await propertyAddButton.click();
    await key(1).typeText("key2");
    await value(1).typeText("%value2%");
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          target: {
            key1: "%value1%",
            key2: "%value2%",
          },
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "returns JSON modified data",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText('{"key1":"value1"}');
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          target: {
            key1: "value1",
          },
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "switches between whole and parts population strategies with a data element",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await entireObjectOption.click();
    await jsonEditor.clear();
    await jsonEditor.typeText("%data element%");
    await extensionViewController.expectIsValid();
    await individualAttributesOption.click();
    await extensionViewController.expectIsValid();
    await entireObjectOption.click();
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      data: {
        __adobe: {
          target: "%data element%",
        },
      },
      dataElementCacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
      dataElementId: "SDE1",
    });
  },
);

test.requestHooks(dataElementsMocks.singleSolutions)(
  "validates fields",
  async () => {
    await extensionViewController.init({
      propertySettings: {
        id: "PRabcd",
      },
    });
    xdmTree.node("target").click();
    await value(0).typeText("value10");
    await extensionViewController.expectIsNotValid();
    await key(0).expectError();
  },
);
