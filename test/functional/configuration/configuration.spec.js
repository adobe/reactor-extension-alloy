/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import extensionViewController from "../helpers/extensionViewController";
import createExtensionViewFixture from "../helpers/createExtensionViewFixture";
import {
  addInstanceButton,
  instancesTabs,
  resourceUsageDialog,
  instances
} from "./helpers/viewSelectors";
import runCommonExtensionViewTests from "../runCommonExtensionViewTests";
import * as sandboxesMocks from "../helpers/endpointMocks/sandboxesMocks";
import * as datastreamsMocks from "../helpers/endpointMocks/datastreamsMocks";
import * as datastreamMocks from "../helpers/endpointMocks/datastreamMocks";

createExtensionViewFixture({
  title: "Extension Configuration View",
  viewPath: "configuration/configuration.html",
  requiresAdobeIOIntegration: true
});

runCommonExtensionViewTests();

const defaultEdgeDomain = "edge.adobedc.net";
const defaultEdgeBasePath = "ee";
const defaultDownloadLinkQualifier =
  "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$";

test("initializes form fields with full settings", async () => {
  await extensionViewController.init({
    settings: {
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          stagingEdgeConfigId: "PR123:stage",
          developmentEdgeConfigId: "PR123:dev1",
          orgId: "ORG456@OtherCompanyOrg",
          edgeDomain: "testedge.com",
          edgeBasePath: "ee-beta",
          defaultConsent: "pending",
          idMigrationEnabled: true,
          thirdPartyCookiesEnabled: true,
          prehidingStyle: "#container { display: none }",
          context: ["device", "placeContext"],
          clickCollectionEnabled: false,
          targetMigrationEnabled: true
        },
        {
          name: "alloy2",
          edgeConfigId: "PR456",
          stagingEdgeConfigId: "PR456:stage",
          developmentEdgeConfigId: "PR456:dev3",
          defaultConsent: "%dataelement123%",
          idMigrationEnabled: false,
          thirdPartyCookiesEnabled: false,
          context: []
        },
        {
          name: "alloy3",
          edgeConfigId: "PR789",
          defaultConsent: "out"
        }
      ]
    }
  });

  await instances[0].nameField.expectValue("alloy1");
  await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR123"
  );
  await instances[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue(
    "PR123:stage"
  );
  await instances[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue(
    "PR123:dev1"
  );
  await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
  await instances[0].edgeDomainField.expectValue("testedge.com");
  await instances[0].edgeBasePathField.expectValue("ee-beta");
  await instances[0].defaultConsent.inRadio.expectUnchecked();
  await instances[0].defaultConsent.outRadio.expectUnchecked();
  await instances[0].defaultConsent.pendingRadio.expectChecked();
  await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
  await instances[0].defaultConsent.dataElementField.expectNotExists();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectUnchecked();
  await instances[0].contextGranularity.specificField.expectChecked();
  await instances[0].specificContext.webField.expectUnchecked();
  await instances[0].specificContext.deviceField.expectChecked();
  await instances[0].specificContext.environmentField.expectUnchecked();
  await instances[0].specificContext.placeContextField.expectChecked();
  await instances[0].specificContext.highEntropyUserAgentHintsContextField.expectUnchecked();
  await instances[0].targetMigrationEnabled.expectChecked();

  await instancesTabs.selectTab("alloy2");

  await instances[1].nameField.expectValue("alloy2");
  await instances[1].edgeConfig.inputMethodSelectRadio.expectNotExists();
  await instances[1].edgeConfig.inputMethodFreeformRadio.expectNotExists();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR456"
  );
  await instances[1].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue(
    "PR456:stage"
  );
  await instances[1].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue(
    "PR456:dev3"
  );
  await instances[1].orgIdField.expectValue(
    "5BFE274A5F6980A50A495C08@AdobeOrg"
  );
  await instances[1].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[1].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[1].defaultConsent.inRadio.expectUnchecked();
  await instances[1].defaultConsent.outRadio.expectUnchecked();
  await instances[1].defaultConsent.pendingRadio.expectUnchecked();
  await instances[1].defaultConsent.dataElementRadio.expectChecked();
  await instances[1].defaultConsent.dataElementField.expectValue(
    "%dataelement123%"
  );
  await instances[1].idMigrationEnabled.expectUnchecked();
  await instances[1].thirdPartyCookiesEnabled.expectUnchecked();
  await instances[1].clickCollectionEnabledField.expectChecked();
  await instances[1].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[1].contextGranularity.specificField.expectChecked();
  await instances[1].specificContext.webField.expectUnchecked();
  await instances[1].specificContext.deviceField.expectUnchecked();
  await instances[1].specificContext.environmentField.expectUnchecked();
  await instances[1].specificContext.placeContextField.expectUnchecked();
  await instances[1].specificContext.highEntropyUserAgentHintsContextField.expectUnchecked();
  await instances[0].targetMigrationEnabled.expectUnchecked();

  await instancesTabs.selectTab("alloy3");

  await instances[2].defaultConsent.inRadio.expectUnchecked();
  await instances[2].defaultConsent.outRadio.expectChecked();
  await instances[2].defaultConsent.pendingRadio.expectUnchecked();
  await instances[2].defaultConsent.dataElementRadio.expectUnchecked();
  await instances[2].defaultConsent.dataElementField.expectNotExists();
  await instances[0].targetMigrationEnabled.expectUnchecked();
});

test("initializes form fields with minimal settings", async () => {
  await extensionViewController.init({
    settings: {
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123"
        }
      ]
    }
  });

  await instances[0].nameField.expectValue("alloy1");
  await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR123"
  );
  await instances[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue(
    ""
  );
  await instances[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue(
    ""
  );
  await instances[0].orgIdField.expectValue(
    "5BFE274A5F6980A50A495C08@AdobeOrg"
  );
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].defaultConsent.inRadio.expectChecked();
  await instances[0].defaultConsent.outRadio.expectUnchecked();
  await instances[0].defaultConsent.pendingRadio.expectUnchecked();
  await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
  await instances[0].defaultConsent.dataElementField.expectNotExists();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
  await instances[0].targetMigrationEnabled.expectUnchecked();
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init();

  await instances[0].nameField.expectValue("alloy");
  await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
    "PRODUCTION Prod (VA7)"
  );
  await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
    "Select a datastream"
  );
  await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
    "Select a datastream"
  );
  await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
    "Select a datastream"
  );
  await instances[0].orgIdField.expectValue(
    "5BFE274A5F6980A50A495C08@AdobeOrg"
  );
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].defaultConsent.inRadio.expectChecked();
  await instances[0].defaultConsent.outRadio.expectUnchecked();
  await instances[0].defaultConsent.pendingRadio.expectUnchecked();
  await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
  await instances[0].defaultConsent.dataElementField.expectNotExists();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
  await instances[0].targetMigrationEnabled.expectUnchecked();
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        edgeConfigId: "PR123",
        name: "alloy"
      }
    ]
  });
});

test("returns full valid settings", async () => {
  await extensionViewController.init(
    {},
    {
      openCodeEditor(options) {
        return Promise.resolve(
          // We include options.language and options.code in the result
          // just so we can assert that the code editor was properly configured
          `language=${options.language};code=${options.code}`
        );
      }
    }
  );

  await instances[0].nameField.typeText("1");
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await instances[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.typeText(
    "PR123:stage"
  );
  await instances[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.typeText(
    "PR123:dev1"
  );
  await instances[0].edgeDomainField.typeText("2");
  await instances[0].edgeBasePathField.typeText("-alpha");
  await instances[0].defaultConsent.outRadio.click();
  await instances[0].idMigrationEnabled.click();
  await instances[0].thirdPartyCookiesEnabled.click();
  await instances[0].prehidingStyleEditButton.click();
  await instances[0].targetMigrationEnabled.click();
  await addInstanceButton.click();

  await instances[1].nameField.typeText("2");
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR456"
  );
  await instances[1].edgeConfig.inputMethodFreeform.stagingEnvironmentField.typeText(
    "PR456:stage"
  );
  await instances[1].edgeConfig.inputMethodFreeform.developmentEnvironmentField.typeText(
    "PR456:dev1"
  );
  await instances[1].orgIdField.typeText("2");
  await instances[1].defaultConsent.dataElementRadio.click();
  await instances[1].defaultConsent.dataElementField.typeText(
    "%dataelement123%"
  );
  await instances[1].idMigrationEnabled.click();
  await instances[1].thirdPartyCookiesEnabled.click();
  await instances[1].onBeforeEventSendEditButton.click();
  // Click on the field before clearing to get rid of the "..."
  await instances[1].downloadLinkQualifierField.click();
  await instances[1].downloadLinkQualifierField.clear();
  await instances[1].downloadLinkQualifierField.typeText("[]");
  await instances[1].contextGranularity.specificField.click();

  await addInstanceButton.click();
  await instances[2].nameField.typeText("3");
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR789"
  );
  await instances[2].orgIdField.typeText("3");
  await instances[2].defaultConsent.pendingRadio.click();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        name: "alloy1",
        edgeConfigId: "PR123",
        stagingEdgeConfigId: "PR123:stage",
        developmentEdgeConfigId: "PR123:dev1",
        edgeDomain: `${defaultEdgeDomain}2`,
        edgeBasePath: `${defaultEdgeBasePath}-alpha`,
        defaultConsent: "out",
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
        prehidingStyle:
          "language=css;code=/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/",
        targetMigrationEnabled: true
      },
      {
        name: "alloy2",
        edgeConfigId: "PR456",
        stagingEdgeConfigId: "PR456:stage",
        developmentEdgeConfigId: "PR456:dev1",
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg2",
        defaultConsent: "%dataelement123%",
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
        onBeforeEventSend:
          'language=javascript;code=// Modify content.xdm or content.data as necessary. There is no need to wrap the\n// code in a function or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";',
        context: ["web", "device", "environment", "placeContext"],
        downloadLinkQualifier: "[]"
      },
      {
        name: "alloy3",
        edgeConfigId: "PR789",
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg3",
        defaultConsent: "pending"
      }
    ]
  });
});

test("shows error for empty required values", async () => {
  await extensionViewController.init();
  await instances[0].nameField.clear();
  await instances[0].orgIdField.clear();
  await instances[0].edgeDomainField.clear();
  await instances[0].edgeBasePathField.clear();
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
  await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectError();
  await instances[0].orgIdField.expectError();
  await instances[0].edgeDomainField.expectError();
  await instances[0].edgeBasePathField.expectError();
});

test("shows error on manual edgeConfigId entry", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await extensionViewController.expectIsNotValid();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectError();
});

test("shows error for duplicate name", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await addInstanceButton.click();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR456"
  );
  // We'll select the first instance before we validate to test that
  // validation selects the invalid instance (in this case, the second one)
  // Even though both tab labels are "alloy", this will select the first one.
  await instancesTabs.selectTab("alloy");
  await extensionViewController.expectIsNotValid();
  await instances[1].nameField.expectError();
});

test("shows error for name that matches key on window", async () => {
  await extensionViewController.init();
  await instances[0].nameField.clear();
  await instances[0].nameField.typeText("addEventListener");
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
});

test("shows error for numeric name", async () => {
  await extensionViewController.init();
  await instances[0].nameField.clear();
  await instances[0].nameField.typeText("123");
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
});

test("shows a warning when name is changed on existing configuration", async () => {
  await extensionViewController.init({
    settings: {
      instances: [
        {
          name: "alloy",
          edgeConfigId: "PR123"
        }
      ]
    }
  });
  await instances[0].nameField.typeText("123");
  await instances[0].nameChangeAlert.expectExists();
});

test("does not show a warning when name is changed on new configuration", async () => {
  await extensionViewController.init();
  await instances[0].nameField.typeText("123");
  await instances[0].nameChangeAlert.expectNotExists();
});

test("shows error for duplicate edge configuration ID", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await addInstanceButton.click();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  // We'll select the first instance before we validate to test that
  // validation selects the invalid instance (in this case, the second one)
  // Even though both tab labels are "alloy", this will select the first one.
  await instancesTabs.selectTab("alloy");
  await extensionViewController.expectIsNotValid();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectError();
});

test("shows error for duplicate IMS org ID", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await addInstanceButton.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR456"
  );
  // We'll select the first instance before we validate to test that
  // validation selects the invalid instance (in this case, the second one)
  // Even though both tab labels are "alloy", this will select the first one.
  await instancesTabs.selectTab("alloy");
  await extensionViewController.expectIsNotValid();
  await instances[1].orgIdField.expectError();
});

test("shows error for bad default consent data element", async () => {
  await extensionViewController.init();

  // This test would sometimes fail seemingly because when TestCafe would go to click
  // the data element radio button, the edge configuration combobox would go from
  // being hidden to shown, which would move the data element radio button down,
  // which apparently made the radio button click ineffective.
  // This seems more like a bug in TestCafe, but we're working around it by waiting
  // for the combo box to be present before trying to click the data element
  // radio button.
  await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectExists();
  await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectExists();

  await instances[0].defaultConsent.dataElementRadio.click();
  await instances[0].defaultConsent.dataElementField.typeText(
    "notadataelement"
  );
  await extensionViewController.expectIsNotValid();
  await instances[0].defaultConsent.dataElementField.expectError();
});

test("shows error for empty default consent data element", async () => {
  await extensionViewController.init();
  await instances[0].defaultConsent.dataElementRadio.click();
  await extensionViewController.expectIsNotValid();
  await instances[0].defaultConsent.dataElementField.expectError();
});

test("shows error for empty download link qualifier", async () => {
  await extensionViewController.init();
  // Click on the field before clearing to get rid of the "..."
  await instances[0].downloadLinkQualifierField.click();
  await instances[0].downloadLinkQualifierField.clear();
  await extensionViewController.expectIsNotValid();
  await instances[0].downloadLinkQualifierField.expectError();
});

test("shows error for invalid download link qualifier", async () => {
  await extensionViewController.init();
  // Click on the field before clearing to get rid of the "..."
  await instances[0].downloadLinkQualifierField.click();
  await instances[0].downloadLinkQualifierField.clear();
  await instances[0].downloadLinkQualifierField.typeText("[");
  await extensionViewController.expectIsNotValid();
  await instances[0].downloadLinkQualifierField.expectError();
});

test("restores default IMS org ID value when restore button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].orgIdField.typeText("foo");
  await instances[0].orgIdRestoreButton.click();
  await instances[0].orgIdField.expectValue(
    "5BFE274A5F6980A50A495C08@AdobeOrg"
  );
});

test("restores default edge domain value when restore button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].edgeDomainField.typeText("foo");
  await instances[0].edgeDomainRestoreButton.click();
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
});

test("restores default edge base path value when restore button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].edgeBasePathField.typeText("foo");
  await instances[0].edgeBasePathRestoreButton.click();
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
});

test("restores default download link qualifier when restore button is clicked", async () => {
  await extensionViewController.init();
  // Click on the field before clearing to get rid of the "..."
  await instances[0].downloadLinkQualifierField.click();
  await instances[0].downloadLinkQualifierField.typeText(".");
  await instances[0].downloadLinkQualifierRestoreButton.click();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
});

test("sets download link qualifier when test button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].downloadLinkQualifierTestButton.click();
  // openRegexTester returns Edited Regex ### in the sandbox environment
  await instances[0].downloadLinkQualifierField.expectMatch(/^Edited Regex/);
});

test("deletes an instance", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await instances[0].deleteButton.expectNotExists();
  await addInstanceButton.click();
  await instances[1].deleteButton.expectExists();
  // Make tab label unique
  await instances[1].nameField.typeText("2");
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR456"
  );
  await instancesTabs.selectTab("alloy");
  await instances[0].deleteButton.click();
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.cancelDeleteInstanceButton.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR123"
  );
  // Alright, delete for real.
  await instances[0].deleteButton.click();
  await resourceUsageDialog.confirmDeleteInstanceButton.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR456"
  );
});

test("does not save prehidingStyle code if it matches placeholder", async () => {
  await extensionViewController.init(
    {},
    {
      openCodeEditor() {
        return Promise.resolve(
          "/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/"
        );
      }
    }
  );

  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await instances[0].prehidingStyleEditButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        name: "alloy",
        edgeConfigId: "PR123"
      }
    ]
  });
});

test("does not save onBeforeEventSend code if it matches placeholder", async () => {
  await extensionViewController.init(
    {},
    {
      openCodeEditor() {
        return Promise.resolve(
          '// Modify content.xdm or content.data as necessary. There is no need to wrap the\n// code in a function or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";'
        );
      }
    }
  );

  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123"
  );
  await instances[0].onBeforeEventSendEditButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        name: "alloy",
        edgeConfigId: "PR123"
      }
    ]
  });
});

test.requestHooks(
  sandboxesMocks.singleWithoutDefault,
  datastreamsMocks.multiple
)(
  "initializes form: when default sandbox only we show only one disabled sandbox dropdown",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "Select a datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "Select a datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "Select a datastream"
    );
    await instances[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg"
    );
    await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
    await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
    await instances[0].defaultConsent.inRadio.expectChecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectUnchecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].clickCollectionEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(
      defaultDownloadLinkQualifier
    );
    await instances[0].contextGranularity.allField.expectChecked();
  }
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamsMocks.multiple
)(
  "initializes form fields: when multiple sandboxes we show dropdowns for every env",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox"
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectNotExists();
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectNotExists();
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox"
    );
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectNotExists();
    await instances[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg"
    );
    await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
    await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
    await instances[0].defaultConsent.inRadio.expectChecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectUnchecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].clickCollectionEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(
      defaultDownloadLinkQualifier
    );
    await instances[0].contextGranularity.allField.expectChecked();
  }
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple
)(
  "initializes form fields with full settings but no sandbox configs",
  async () => {
    await extensionViewController.init({
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
            stagingEdgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030:stage",
            developmentEdgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030:dev",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            defaultConsent: "pending",
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext", "highEntropyUserAgentHints"],
            clickCollectionEnabled: false,
            targetMigrationEnabled: false
          }
        ]
      }
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "test datastream: stage"
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "test datastream: development"
    );

    await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
    await instances[0].edgeDomainField.expectValue("testedge.com");
    await instances[0].edgeBasePathField.expectValue("ee-beta");
    await instances[0].defaultConsent.inRadio.expectUnchecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectChecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectUnchecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].clickCollectionEnabledField.expectUnchecked();
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
    await instances[0].specificContext.highEntropyUserAgentHintsContextField.expectChecked();
  }
);

test.requestHooks(
  sandboxesMocks.singleWithoutDefault,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple
)(
  "initializes form fields with prod edge configs, no sandbox configs, default sandbox use case",
  async () => {
    await extensionViewController.init({
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            defaultConsent: "pending",
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false,
            targetMigrationEnabled: true
          }
        ]
      }
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "Select a datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "Select a datastream"
    );

    await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
    await instances[0].edgeDomainField.expectValue("testedge.com");
    await instances[0].edgeBasePathField.expectValue("ee-beta");
    await instances[0].defaultConsent.inRadio.expectUnchecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectChecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectChecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].clickCollectionEnabledField.expectUnchecked();
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
  }
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple
)(
  "initializes form fields with prod edge configs settings but no sandbox configs, multiple sandboxes",
  async () => {
    await extensionViewController.init({
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            defaultConsent: "pending",
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false
          }
        ]
      }
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1"
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream"
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox"
    );

    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox"
    );

    await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
    await instances[0].edgeDomainField.expectValue("testedge.com");
    await instances[0].edgeBasePathField.expectValue("ee-beta");
    await instances[0].defaultConsent.inRadio.expectUnchecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectChecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectUnchecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].clickCollectionEnabledField.expectUnchecked();
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
  }
);
