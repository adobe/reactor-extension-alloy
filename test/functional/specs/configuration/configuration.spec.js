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
/* eslint-disable vitest/expect-expect */
import { t, Selector } from "testcafe";
import extensionViewController from "../../helpers/extensionViewController.mjs";
import createExtensionViewFixture from "../../helpers/createExtensionViewFixture.mjs";
import {
  addInstanceButton,
  instancesTabs,
  resourceUsageDialog,
  instances,
  components,
} from "../../helpers/viewSelectors.mjs";
import runCommonExtensionViewTests from "../view/runCommonExtensionViewTests.mjs";
import * as sandboxesMocks from "../../helpers/endpointMocks/sandboxesMocks.mjs";
import * as datastreamsMocks from "../../helpers/endpointMocks/datastreamsMocks.mjs";
import * as datastreamMocks from "../../helpers/endpointMocks/datastreamMocks.mjs";
import * as advertisersMocks from "../../helpers/endpointMocks/advertisersMocks.mjs";
import spectrum from "../../helpers/spectrum.mjs";
import { createTestIdSelector } from "../../helpers/dataTestIdSelectors.mjs";

createExtensionViewFixture({
  title: "Extension Configuration View",
  viewPath: "configuration/configuration.html",
  requiresAdobeIOIntegration: true,
});

const defaultDisabledComponents = {
  eventMerge: false,
};

runCommonExtensionViewTests();

const defaultEdgeDomain = "edge.adobedc.net";
const defaultEdgeBasePath = "ee";
const defaultDownloadLinkQualifier =
  "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$";

test("shows error for duplicate edge configuration ID", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123",
  );
  await addInstanceButton.click();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123",
  );
  // We'll select the first instance before we validate to test that
  // validation selects the invalid instance (in this case, the second one)
  // Even though both tab labels are "alloy", this will select the first one.
  await instancesTabs.selectTab("alloy");
  await extensionViewController.expectIsNotValid();
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectError();
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

test("shows error for invalid third party cookies enabled value", async () => {
  await extensionViewController.init();
  await instances[0].thirdPartyCookiesEnabled.clear();
  await instances[0].thirdPartyCookiesEnabled.enterSearch("foo");
  await extensionViewController.expectIsNotValid();
  await instances[0].thirdPartyCookiesEnabled.expectError();

  await instances[0].thirdPartyCookiesEnabled.clear();
  await instances[0].thirdPartyCookiesEnabled.enterSearch("%foo%%bar%");
  await extensionViewController.expectIsNotValid();
  await instances[0].thirdPartyCookiesEnabled.expectError();

  await instances[0].thirdPartyCookiesEnabled.clear();
  await instances[0].thirdPartyCookiesEnabled.enterSearch("%foo%");
  await extensionViewController.expectIsNotValid();
  await instances[0].thirdPartyCookiesEnabled.expectNoError();
});

test("restores default IMS org ID value when restore button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].orgIdField.typeText("foo");
  await instances[0].orgIdRestoreButton.click();
  await instances[0].orgIdField.expectValue(
    "5BFE274A5F6980A50A495C08@AdobeOrg",
  );
});

test("restores default edge domain value when restore button is clicked", async () => {
  await extensionViewController.init();
  await instances[0].edgeDomainField.typeText("foo");
  await instances[0].edgeDomainRestoreButton.click();
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
});

test("sets default edge domain to edge.adobedc.net when no tenant ID is provided", async () => {
  await extensionViewController.init();
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
});

test("sets default edge domain to tenant-specific domain when tenant ID is provided", async () => {
  await extensionViewController.init({
    company: {
      orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
      tenantId: "mytenant",
    },
  });
  await instances[0].edgeDomainField.expectValue("mytenant.data.adobedc.net");
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
    defaultDownloadLinkQualifier,
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
    "PR123",
  );
  await instances[0].deleteButton.expectNotExists();
  await addInstanceButton.click();
  await instances[1].deleteButton.expectExists();
  // Make tab label unique
  await instances[1].nameField.typeText("2");
  await instances[1].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR456",
  );
  await instancesTabs.selectTab("alloy");
  await instances[0].deleteButton.click();
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.cancelDeleteInstanceButton.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR123",
  );
  // Alright, delete for real.
  await instances[0].deleteButton.click();
  await resourceUsageDialog.confirmDeleteInstanceButton.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "PR456",
  );
});

test("does not save prehidingStyle code if it matches placeholder", async () => {
  await extensionViewController.init(
    {},
    {
      openCodeEditor(options) {
        return Promise.resolve(options.code);
      },
    },
  );

  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123",
  );
  await instances[0].prehidingStyleEditButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    components: defaultDisabledComponents,
    instances: [
      {
        name: "alloy",
        edgeConfigId: "PR123",
      },
    ],
  });
});

test("does not save onBeforeEventSend and filterClickDetails code if it matches placeholder", async () => {
  await extensionViewController.init(
    {},
    {
      openCodeEditor(options) {
        return Promise.resolve(options.code);
      },
    },
  );

  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123",
  );
  await instances[0].onBeforeEventSendEditButton.click();
  await instances[0].filterClickDetailsEditButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    components: defaultDisabledComponents,
    instances: [
      {
        name: "alloy",
        edgeConfigId: "PR123",
      },
    ],
  });
});

test.requestHooks(
  sandboxesMocks.singleWithoutDefault,
  datastreamsMocks.multiple,
)(
  "initializes form: when default sandbox only we show only one disabled sandbox dropdown",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await instances[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg",
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
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectChecked();
    await instances[0].eventGrouping.noneField.expectChecked();
    await instances[0].externalLinkEnabledField.expectChecked();
    await instances[0].downloadLinkEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(
      defaultDownloadLinkQualifier,
    );
    await instances[0].contextGranularity.allField.expectChecked();
  },
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamsMocks.multiple,
)(
  "initializes form fields: when multiple sandboxes we show dropdowns for every env",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectNotExists();
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectNotExists();
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectNotExists();
    await instances[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg",
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
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectChecked();
    await instances[0].eventGrouping.noneField.expectChecked();
    await instances[0].externalLinkEnabledField.expectChecked();
    await instances[0].downloadLinkEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(
      defaultDownloadLinkQualifier,
    );
    await instances[0].contextGranularity.allField.expectChecked();
  },
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple,
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
            targetMigrationEnabled: false,
          },
        ],
      },
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "test datastream: stage",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "test datastream: development",
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
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectUnchecked();
    await instances[0].externalLinkEnabledField.expectUnchecked();
    await instances[0].downloadLinkEnabledField.expectUnchecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
    await instances[0].specificContext.highEntropyUserAgentHintsContextField.expectChecked();
  },
);

test.requestHooks(
  sandboxesMocks.singleWithoutDefault,
  datastreamMocks.basic,
  datastreamsMocks.multiple,
)(
  "initializes form fields with prod edge configs, no sandbox configs, default sandbox use case",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          eventMerge: false,
        },
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
            targetMigrationEnabled: true,
          },
        ],
      },
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
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
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectUnchecked();
    await instances[0].externalLinkEnabledField.expectUnchecked();
    await instances[0].downloadLinkEnabledField.expectUnchecked();
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
  },
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple,
)(
  "initializes form fields with prod edge configs settings but no sandbox configs, multiple sandboxes",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          eventMerge: false,
        },
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
          },
        ],
      },
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "test datastream",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox",
    );

    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectSelectedOptionLabel(
      "Select a sandbox",
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
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectUnchecked();
    await instances[0].externalLinkEnabledField.expectUnchecked();
    await instances[0].downloadLinkEnabledField.expectUnchecked();
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
    await instances[0].edgeConfig.inputMethodSelect.fetchConfigsAlert.expectNotExists();
  },
);

test.requestHooks(
  sandboxesMocks.userRegionMissing,
  datastreamMocks.basic,
  datastreamMocks.notExist,
  datastreamsMocks.multiple,
)("initializes form fields with free form input configs settings", async () => {
  await extensionViewController.init({
    settings: {
      components: {
        eventMerge: false,
      },
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
        },
      ],
    },
  });

  await instances[0].nameField.expectValue("alloy1");

  await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
    "64c31a3b-d031-4a2f-8834-e96fc15d3030",
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
  await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
  await instances[0].internalLinkEnabledField.expectUnchecked();
  await instances[0].externalLinkEnabledField.expectUnchecked();
  await instances[0].downloadLinkEnabledField.expectUnchecked();
  await instances[0].contextGranularity.specificField.expectChecked();
  await instances[0].specificContext.webField.expectUnchecked();
  await instances[0].specificContext.deviceField.expectChecked();
  await instances[0].specificContext.environmentField.expectUnchecked();
  await instances[0].specificContext.placeContextField.expectChecked();

  await instances[0].edgeConfig.inputMethodSelectRadio.click();
  await instances[0].edgeConfig.inputMethodSelect.fetchConfigsAlert.expectExists();
});

test.requestHooks(sandboxesMocks.userRegionMissing, datastreamMocks.notExist)(
  "initializes clean form with free form inputs for configs because failed to fetch configs",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
      "",
    );
    await instances[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue(
      "",
    );
    await instances[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue(
      "",
    );
    await instances[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg",
    );
    await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
    await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
    await instances[0].defaultConsent.inRadio.expectChecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].thirdPartyCookiesEnabled.expectText("Enabled");
    await instances[0].internalLinkEnabledField.expectChecked();
    await instances[0].eventGrouping.noneField.expectChecked();
    await instances[0].externalLinkEnabledField.expectChecked();
    await instances[0].downloadLinkEnabledField.expectChecked();
    await instances[0].externalLinkEnabledField.expectChecked();
    await instances[0].downloadLinkEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(
      defaultDownloadLinkQualifier,
    );
    await instances[0].contextGranularity.allField.expectChecked();
    await instances[0].edgeConfig.inputMethodSelectRadio.click();
    await instances[0].edgeConfig.inputMethodSelect.fetchConfigsAlert.expectExists();
  },
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamsMocks.forbidden,
  datastreamMocks.forbidden,
)(
  "initializes form fields with free form input when, forbidden access for sandbox and no sandbox setting provided",
  async () => {
    await extensionViewController.init({
      settings: {
        components: defaultDisabledComponents,
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
            stagingEdgeConfigId: "",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            defaultConsent: "pending",
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false,
          },
        ],
      },
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
      "64c31a3b-d031-4a2f-8834-e96fc15d3030",
    );
    await instances[0].edgeConfig.inputMethodSelect.fetchConfigsAlert.expectNotExists();
    await extensionViewController.expectIsValid();
  },
);
test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamsMocks.forbidden,
  datastreamMocks.forbidden,
)(
  "initializes form fields with prod edge config disabled field, forbidden access for sandbox",
  async () => {
    await extensionViewController.init({
      settings: {
        components: defaultDisabledComponents,
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
            sandbox: "testsandbox2",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            defaultConsent: "pending",
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false,
          },
        ],
      },
    });

    await instances[0].nameField.expectValue("alloy1");

    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "PRODUCTION Test Sandbox 2 (VA7)",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamDisabledField.expectValue(
      "64c31a3b-d031-4a2f-8834-e96fc15d3030",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamDisabledField.expectDisabled();
    await extensionViewController.expectIsValid();

    await extensionViewController.expectSettings({
      components: defaultDisabledComponents,
      instances: [
        {
          clickCollectionEnabled: false,
          context: ["device", "placeContext"],
          defaultConsent: "pending",
          edgeBasePath: "ee-beta",
          edgeConfigId: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
          edgeDomain: "testedge.com",
          name: "alloy1",
          orgId: "ORG456@OtherCompanyOrg",
          prehidingStyle: "#container { display: none }",
          sandbox: "testsandbox2",
        },
      ],
    });
  },
);

test.requestHooks(
  sandboxesMocks.multipleWithDefault,
  datastreamsMocks.forbidden,
  datastreamsMocks.multiple,
)(
  "initializes clean form with select input and choose thru different sandboxes",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.selectOption(
      "PRODUCTION Test Sandbox 2 (VA7)",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamErrorFetchingAlert.expectExists();
    await extensionViewController.expectIsNotValid();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.selectOption(
      "PRODUCTION Test Sandbox 1 (VA7)",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.selectOption(
      "test datastream",
    );
    await extensionViewController.expectIsValid();
  },
);
test.requestHooks(
  sandboxesMocks.singleWithoutDefault,
  datastreamsMocks.forbidden,
)(
  "initializes clean form free form option selected by default, alert showed on the select form",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodSelectRadio.click();
    await instances[0].edgeConfig.inputMethodSelect.fetchConfigsAlert.expectExists();
    await extensionViewController.expectIsNotValid();
  },
);

test("is able to add and remove report suites from overrides", async () => {
  await extensionViewController.init();

  await instances[0].overrides.envTabs.development.expectSelected();
  await instances[0].overrides.comboBoxes.envEnabled.clear();
  await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");

  await instances[0].overrides.textFields.reportSuiteOverrides[0].expectExists();
  await instances[0].overrides.textFields.reportSuiteOverrides[0].typeText(
    "test1",
  );

  await instances[0].overrides.addReportSuiteButton.click();
  await instances[0].overrides.textFields.reportSuiteOverrides[1].expectExists();
  await instances[0].overrides.textFields.reportSuiteOverrides[1].typeText(
    "test2",
  );

  await instances[0].overrides.addReportSuiteButton.click();
  await instances[0].overrides.textFields.reportSuiteOverrides[2].expectExists();
  await instances[0].overrides.textFields.reportSuiteOverrides[2].typeText(
    "test3",
  );

  await instances[0].overrides.removeReportSuitesButtons[1].click();

  await extensionViewController.expectSettings({
    components: defaultDisabledComponents,
    instances: [
      {
        name: "alloy",
        edgeConfigOverrides: {
          development: {
            enabled: true,
            com_adobe_analytics: {
              reportSuites: ["test1", "test3"],
            },
          },
        },
      },
    ],
  });
});

test("copies overrides from one environment to another", async () => {
  await extensionViewController.init();

  await instances[0].overrides.envTabs.development.expectExists();
  await instances[0].overrides.envTabs.development.expectSelected();
  await instances[0].overrides.comboBoxes.envEnabled.clear();
  await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
  await instances[0].overrides.copyButtons.development.expectNotExists();
  await instances[0].overrides.copyButtons.staging.expectExists();
  await instances[0].overrides.copyButtons.production.expectExists();
  await instances[0].overrides.textFields.eventDatasetOverride.typeText(
    "6336ff95ba16ca1c07b4c0db",
  );
  await instances[0].overrides.textFields.idSyncContainerOverride.typeText(
    "23512312",
  );
  await instances[0].overrides.textFields.targetPropertyTokenOverride.typeText(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
  );
  await instances[0].overrides.textFields.reportSuiteOverrides[0].typeText(
    "unifiedjsqeonly2",
  );
  await instances[0].overrides.addReportSuiteButton.click();
  await instances[0].overrides.textFields.reportSuiteOverrides[1].typeText(
    "unifiedjsqeonly3",
  );

  await instances[0].overrides.envTabs.staging.click();
  await instances[0].overrides.envTabs.staging.expectSelected();
  await instances[0].overrides.copyButtons.production.expectExists();
  await instances[0].overrides.copyButtons.staging.expectNotExists();
  await instances[0].overrides.copyButtons.development.expectExists();
  await instances[0].overrides.copyButtons.development.click();

  await instances[0].overrides.textFields.eventDatasetOverride.expectValue(
    "6336ff95ba16ca1c07b4c0db",
  );
  await instances[0].overrides.textFields.idSyncContainerOverride.expectValue(
    "23512312",
  );
  await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
  );
  await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue(
    "unifiedjsqeonly2",
  );
  await instances[0].overrides.textFields.reportSuiteOverrides[1].expectValue(
    "unifiedjsqeonly3",
  );

  await instances[0].overrides.envTabs.production.click();
  await instances[0].overrides.envTabs.production.expectSelected();
  await instances[0].overrides.copyButtons.development.expectExists();
  await instances[0].overrides.copyButtons.staging.expectExists();
  await instances[0].overrides.copyButtons.production.expectNotExists();
  await instances[0].overrides.copyButtons.staging.click();
  await instances[0].overrides.textFields.eventDatasetOverride.expectValue(
    "6336ff95ba16ca1c07b4c0db",
  );
  await instances[0].overrides.textFields.idSyncContainerOverride.expectValue(
    "23512312",
  );
  await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue(
    "01dbc634-07c1-d8f9-ca69-b489a5ac5e94",
  );
  await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue(
    "unifiedjsqeonly2",
  );
  await instances[0].overrides.textFields.reportSuiteOverrides[1].expectValue(
    "unifiedjsqeonly3",
  );
});

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamsMocks.single,
  datastreamMocks.withConfigOverrides,
)("populates overrides dropdowns with Blackbird config data", async () => {
  await extensionViewController.init();

  await instances[0].nameField.expectValue("alloy");
  await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
  await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.selectOption(
    "Test Config Overrides",
  );
  await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.selectOption(
    "Test Config Overrides",
  );
  await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption(
    "Test Config Overrides",
  );

  await instances[0].overrides.comboBoxes.envEnabled.clear();
  await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
  await instances[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
  await instances[0].overrides.comboBoxes.eventDatasetOverride.openMenu();
  await instances[0].overrides.comboBoxes.eventDatasetOverride.expectMenuOptionLabels(
    ["6335faf30f5a161c0b4b1444"],
  );
  await instances[0].overrides.comboBoxes.eventDatasetOverride.selectMenuOption(
    "6335faf30f5a161c0b4b1444",
  );

  await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
  await instances[0].overrides.comboBoxes.idSyncContainerOverride.openMenu();
  await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectMenuOptionLabels(
    ["107756", "107757"],
  );
  await instances[0].overrides.comboBoxes.idSyncContainerOverride.selectMenuOption(
    "107756",
  );

  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.openMenu();
  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectMenuOptionLabels(
    [
      "aba5431a-9f59-f816-7d73-8e40c8f4c4fd",
      "65d186ff-be14-dfa0-75fa-546d93bebf91",
    ],
  );
  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.selectMenuOption(
    "aba5431a-9f59-f816-7d73-8e40c8f4c4fd",
  );

  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].openMenu();
  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectMenuOptionLabels(
    ["unifiedjsqeonly2", "unifiedjsqeonlylatest", "unifiedjsqeonlymobileweb"],
  );
  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].selectMenuOption(
    "unifiedjsqeonlylatest",
  );

  await extensionViewController.expectIsValid();
});

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamsMocks.single,
  datastreamMocks.withConfigOverrides,
)(
  "shows an error for custom overrides that are not in the dropdown",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.selectOption(
      "Test Config Overrides",
    );
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.selectOption(
      "Test Config Overrides",
    );
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption(
      "Test Config Overrides",
    );

    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
    await instances[0].overrides.comboBoxes.eventDatasetOverride.enterSearch(
      "foo",
    );
    // unblur/deselect the input to trigger validation
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectError();
    await instances[0].overrides.comboBoxes.eventDatasetOverride.clear();
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectNoError();

    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.enterSearch(
      "adobe",
    );
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectError();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.clear();
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectNoError();

    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.enterSearch(
      "alloy",
    );
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectError();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.clear();
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectNoError();

    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].enterSearch(
      "functional test",
    );
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectError();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].clear();
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectNoError();
    // make sure that comma-separated lists are validated correctly.
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].enterSearch(
      "unifiedjsqeonly2,unifiedjsqeonlylatest",
    );
    await t.pressKey("tab");
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectNoError();
  },
);

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamsMocks.single,
  datastreamMocks.withConfigOverrides,
)("does not show an error for overrides that are data elements", async () => {
  await extensionViewController.init();

  await instances[0].nameField.expectValue("alloy");
  await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
  await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
  await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
  await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.selectOption(
    "Test Config Overrides",
  );
  await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.selectOption(
    "Test Config Overrides",
  );
  await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption(
    "Test Config Overrides",
  );

  await instances[0].overrides.comboBoxes.envEnabled.clear();
  await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
  await instances[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
  await instances[0].overrides.comboBoxes.eventDatasetOverride.enterSearch(
    "%Alloy Data Element%",
  );
  // unblur/deselect the input to trigger validation
  await t.pressKey("tab");
  await instances[0].overrides.comboBoxes.eventDatasetOverride.expectNoError();

  await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
  await instances[0].overrides.comboBoxes.idSyncContainerOverride.enterSearch(
    "%Alloy Data Element%",
  );
  await t.pressKey("tab");
  await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectNoError();

  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.enterSearch(
    "%Alloy Data Element%",
  );
  await t.pressKey("tab");
  await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectNoError();

  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].enterSearch(
    "unifiedjsqeonly2, %Alloy Data Element%",
  );
  await t.pressKey("tab");
  await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectNoError();
});

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamsMocks.single,
  datastreamMocks.withConfigOverrides,
)(
  "does not populate override dropdowns after switching instances (because of different orgIDs)",
  async () => {
    await extensionViewController.init();

    await instances[0].nameField.expectValue("alloy");
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption(
      "Test Config Overrides",
    );
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectExists();
    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectIsComboBox();

    await addInstanceButton.click();
    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
    await instances[1].overrides.textFields.eventDatasetOverride.expectExists();
    await instances[1].overrides.textFields.eventDatasetOverride.expectIsTextField();
    await instances[1].overrides.textFields.idSyncContainerOverride.expectExists();
    await instances[1].overrides.textFields.idSyncContainerOverride.expectIsTextField();
    await instances[1].overrides.textFields.targetPropertyTokenOverride.expectExists();
    await instances[1].overrides.textFields.targetPropertyTokenOverride.expectIsTextField();
    await instances[1].overrides.textFields.reportSuiteOverrides[0].expectExists();
    await instances[1].overrides.textFields.reportSuiteOverrides[0].expectIsTextField();
  },
);

test("allows the setting of overrides in only a single environment", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "PR123",
  );
  await instances[0].overrides.envTabs.development.click();

  await instances[0].overrides.comboBoxes.envEnabled.clear();
  await instances[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
  await instances[0].overrides.textFields.eventDatasetOverride.typeText(
    "6336ff95ba16ca1c07b4c0db",
  );
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    components: defaultDisabledComponents,
    instances: [
      {
        edgeConfigId: "PR123",
        name: "alloy",
        edgeConfigOverrides: {
          development: {
            enabled: true,
            com_adobe_experience_platform: {
              datasets: {
                event: {
                  datasetId: "6336ff95ba16ca1c07b4c0db",
                },
              },
            },
          },
        },
      },
    ],
  });
});

test("allows the load of the view with overrides settings in only a single environment", async () => {
  await extensionViewController.init({
    settings: {
      components: {
        eventMerge: false,
      },
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          edgeConfigOverrides: {
            development: {
              enabled: true,
              com_adobe_experience_platform: {
                datasets: {
                  event: {
                    datasetId: "6336ff95ba16ca1c07b4c0db",
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  await instances[0].overrides.envTabs.development.expectExists();
});

test("makes the media collection fields required if one is filled", async () => {
  await extensionViewController.init();
  await instances[0].edgeConfig.inputMethodFreeformRadio.click();
  await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.typeText(
    "123",
  );
  await instances[0].streamingMedia.mediaChannelField.typeText("testChanel");

  await extensionViewController.expectIsNotValid();
  await instances[0].streamingMedia.mediaPlayerNameField.typeText(
    "testPlayerName",
  );
  await extensionViewController.expectIsValid();

  await extensionViewController.expectSettings({
    components: defaultDisabledComponents,
    instances: [
      {
        edgeConfigId: "123",
        name: "alloy",
        streamingMedia: {
          channel: "testChanel",
          playerName: "testPlayerName",
        },
      },
    ],
  });
});

test("has all components enabled by default", async () => {
  await extensionViewController.init();
  const settings = extensionViewController.getSettings();

  await t.expect(settings.components).notOk("components list is null");
});

test.skip("has disabled components added to components key with the false value", async () => {
  await extensionViewController.init();

  // TODO: Expand the disclosure header
  await spectrum.checkbox("consentComponentCheckbox").click();
  await spectrum.checkbox("personalizationComponentCheckbox").click();

  const settings = await extensionViewController.getSettings();

  await t.expect(settings.components).ok();
  await t.expect(settings.components).contains({
    personalization: false,
    privacy: false,
  });
});

test.skip("restores disabled components added to components key with the false value", async () => {
  await extensionViewController.init({
    settings: {
      components: {
        personalization: false,
      },
      instances: [
        {
          name: "alloy",
        },
      ],
    },
  });

  // TODO: Expand the disclosure header
  await t
    .expect(createTestIdSelector("personalizationComponentCheckbox").checked)
    .eql(false);

  await t
    .expect(createTestIdSelector("privacyComponentCheckbox").checked)
    .eql(true);
});

// Advertising Section Tests
test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "shows advertising section when component is enabled",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              dspEnabled: "Enabled",
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Verify the advertising section elements are visible
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.addAdvertiserButton.expectExists();
    await instances[0].advertising.id5PartnerIdField.expectExists();
    await instances[0].advertising.rampIdJSPathField.expectExists();
  },
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "allows SSC users to enable advertising with minimal configuration",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          ...defaultDisabledComponents,
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    // Verify dspEnabled field exists and is set to "Disabled"
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.dspEnabledField.expectValue("Disabled");

    // Verify other advertising elements are hidden for SSC users
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();

    // Verify the configuration settings structure and values
    await extensionViewController.expectSettings({
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          advertising: {
            dspEnabled: false,
          },
        },
      ],
      components: {
        ...defaultDisabledComponents,
        advertising: true,
      },
    });

    // Verify that the configuration is valid for SSC users
    await extensionViewController.expectIsValid();
  },
);

test.requestHooks(advertisersMocks.noAdvertisers)(
  "shows error alert when no advertisers are found and hides all DSP fields",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    // Step 1: Verify initial state - dspEnabled is disabled, all elements hidden
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.dspEnabledField.expectValue("Disabled");
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();

    // Step 2: User enables DSP (which will trigger the API call and show the error)
    await instances[0].advertising.dspEnabledField.openMenu();
    await instances[0].advertising.dspEnabledField.selectMenuOption("Enabled");

    // Step 3: Verify the "No DSP Advertiser Found" alert appears
    const alertSelector = Selector('[role="alert"]').withText(
      "No DSP Advertiser Found",
    );
    await t.expect(alertSelector.exists).ok();
    await t
      .expect(
        alertSelector.find("h3").withText("No DSP Advertiser Found").exists,
      )
      .ok();
    await t
      .expect(
        alertSelector
          .find("section")
          .withText(
            "No advertiser was found corresponding to this IMS org in Adobe Advertising DSP. Please connect with your DSP account manager to add advertiser to this IMS org in the DSP.",
          ).exists,
      )
      .ok();

    // Step 4: Verify all DSP-related UI fields remain hidden
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();
    await instances[0].advertising.advertiser0Field.expectNotExists();
    await instances[0].advertising.advertiserEnabled0Field.expectNotExists();

    // Step 5: Verify form is invalid
    await extensionViewController.expectIsNotValid();
  },
);

test.requestHooks(advertisersMocks.unauthorized)(
  "shows error alert when advertiser API fails due to permissions and hides all DSP fields",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    // Step 1: Verify initial state - dspEnabled is disabled, all elements hidden
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.dspEnabledField.expectValue("Disabled");
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();

    // Step 2: User enables DSP (which will trigger the API call and show the error)
    await instances[0].advertising.dspEnabledField.openMenu();
    await instances[0].advertising.dspEnabledField.selectMenuOption("Enabled");

    // Step 3: Verify the "Failed to load DSP advertiser data" alert appears
    const alertSelector = Selector('[role="alert"]').withText(
      "Failed to load DSP advertiser data",
    );
    await t.expect(alertSelector.exists).ok();
    await t
      .expect(
        alertSelector.find("h3").withText("Failed to load DSP advertiser data")
          .exists,
      )
      .ok();
    await t
      .expect(
        alertSelector
          .find("section")
          .withText(
            "Unable to retrieve advertiser data from DSP. Please try after some time. Please contact your DSP account manager if the issue persists.",
          ).exists,
      )
      .ok();

    // Step 4: Verify all DSP-related UI fields remain hidden
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();
    await instances[0].advertising.advertiser0Field.expectNotExists();
    await instances[0].advertising.advertiserEnabled0Field.expectNotExists();

    // Step 5: Verify form is invalid
    await extensionViewController.expectIsNotValid();
  },
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "properly loads prefilled advertising configuration in edit mode and allows changes",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          ...defaultDisabledComponents,
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              dspEnabled: true,
              advertiserSettings: [
                {
                  advertiserId: "12345",
                  enabled: true,
                },
                {
                  advertiserId: "67890",
                  enabled: false,
                },
              ],
              id5PartnerId: "original-id5-12345",
              rampIdJSPath: "https://original.example.com/ramp.js",
            },
          },
        ],
      },
    });

    // Step 1: Verify DSP is enabled and all fields are visible
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.dspEnabledField.expectValue("Enabled");
    await instances[0].advertising.addAdvertiserButton.expectExists();
    await instances[0].advertising.id5PartnerIdField.expectExists();
    await instances[0].advertising.rampIdJSPathField.expectExists();

    // Step 2: Verify prefilled advertiser settings are loaded correctly
    await instances[0].advertising.advertiser0Field.expectExists();
    await instances[0].advertising.advertiser0Field.expectValue(
      "Test Advertiser 1",
    ); // Should match advertiser_id "12345"
    await instances[0].advertising.advertiserEnabled0Field.expectExists();
    await instances[0].advertising.advertiserEnabled0Field.expectValue(
      "Enabled",
    );

    await instances[0].advertising.advertiser1Field.expectExists();
    await instances[0].advertising.advertiser1Field.expectValue(
      "Test Advertiser 2",
    ); // Should match advertiser_id "67890"
    await instances[0].advertising.advertiserEnabled1Field.expectExists();
    await instances[0].advertising.advertiserEnabled1Field.expectValue(
      "Disabled",
    );

    // Step 3: Verify prefilled text fields
    await instances[0].advertising.id5PartnerIdField.expectValue(
      "original-id5-12345",
    );
    await instances[0].advertising.rampIdJSPathField.expectValue(
      "https://original.example.com/ramp.js",
    );

    // Step 4: Make changes to test edit functionality
    // Change first advertiser to disabled
    await instances[0].advertising.advertiserEnabled0Field.openMenu();
    await instances[0].advertising.advertiserEnabled0Field.selectMenuOption(
      "Disabled",
    );

    // Change second advertiser to enabled
    await instances[0].advertising.advertiserEnabled1Field.openMenu();
    await instances[0].advertising.advertiserEnabled1Field.selectMenuOption(
      "Enabled",
    );

    // Update text fields
    await instances[0].advertising.id5PartnerIdField.clear();
    await instances[0].advertising.id5PartnerIdField.typeText(
      "updated-id5-67890",
    );

    await instances[0].advertising.rampIdJSPathField.clear();
    await instances[0].advertising.rampIdJSPathField.typeText(
      "https://updated.example.com/ramp.js",
    );

    // Step 5: Verify the updated settings reflect the changes
    await extensionViewController.expectSettings({
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          advertising: {
            dspEnabled: true,
            advertiserSettings: [
              {
                advertiserId: "12345",
                enabled: false, // Changed from true to false
              },
              {
                advertiserId: "67890",
                enabled: true, // Changed from false to true
              },
            ],
            id5PartnerId: "updated-id5-67890", // Updated value
            rampIdJSPath: "https://updated.example.com/ramp.js", // Updated value
          },
        },
      ],
      components: {
        ...defaultDisabledComponents,
        advertising: true,
      },
    });

    // Step 6: Verify form is still valid after changes
    await extensionViewController.expectIsValid();
  },
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "allows DSP users to configure advertising with full functionality",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          ...defaultDisabledComponents,
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    // Step 1: Verify initial state - dspEnabled is disabled, all elements hidden
    await instances[0].advertising.dspEnabledField.expectExists();
    await instances[0].advertising.dspEnabledField.expectValue("Disabled");
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();

    // Step 2: User enables DSP
    await instances[0].advertising.dspEnabledField.openMenu();
    await instances[0].advertising.dspEnabledField.selectMenuOption("Enabled");

    // Step 3: Verify all UI elements become visible after enabling DSP
    await instances[0].advertising.addAdvertiserButton.expectExists();
    await instances[0].advertising.id5PartnerIdField.expectExists();
    await instances[0].advertising.rampIdJSPathField.expectExists();

    // Step 4: Verify one advertiser row is visible by default
    await instances[0].advertising.advertiser0Field.expectExists();
    await instances[0].advertising.advertiserEnabled0Field.expectExists();

    // Step 5: User selects an advertiser from dropdown
    await instances[0].advertising.advertiser0Field.openMenu();
    await instances[0].advertising.advertiser0Field.selectMenuOption(
      "Test Advertiser 1",
    );

    // Step 7: User enters text in id5 field
    await instances[0].advertising.id5PartnerIdField.typeText("testId5");

    // Step 8: User enters text in rampId field
    await instances[0].advertising.rampIdJSPathField.typeText(
      "https://example.com/ramp.js",
    );

    // Step 9: Verify settings object contains all the configured values
    await extensionViewController.expectSettings({
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          advertising: {
            dspEnabled: true,
            advertiserSettings: [
              {
                advertiserId: "12345", // This matches the advertiser_id from the mock
                enabled: true,
              },
            ],
            id5PartnerId: "testId5",
            rampIdJSPath: "https://example.com/ramp.js",
          },
        },
      ],

      components: {
        ...defaultDisabledComponents,
        advertising: true,
      },
    });

    // Step 10: Verify form is valid
    await extensionViewController.expectIsValid();
  },
);

// Ensure new components are not included by default when creating a new configuration
// and also not added during an upgrade of an existing configuration.

test("does not include new components when creating a new configuration", async () => {
  await extensionViewController.init();

  await components.heading.click();
  await spectrum
    .checkbox("pushNotificationsComponentCheckbox")
    .expectUnchecked();
  await spectrum.checkbox("advertisingComponentCheckbox").expectUnchecked();

  await extensionViewController.expectSettings({
    components: {
      ...defaultDisabledComponents,
    },
    instances: [
      {
        name: "alloy",
      },
    ],
  });
});

test("does not include new components when upgrading existing configuration", async () => {
  await extensionViewController.init({
    settings: {
      components: {
        eventMerge: false,
      },
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
        },
      ],
    },
  });

  await components.heading.click();
  await spectrum
    .checkbox("pushNotificationsComponentCheckbox")
    .expectUnchecked();
  await spectrum.checkbox("advertisingComponentCheckbox").expectUnchecked();

  await extensionViewController.expectSettings({
    components: {
      ...defaultDisabledComponents,
    },
    instances: [
      {
        name: "alloy1",
        edgeConfigId: "PR123",
      },
    ],
  });
});
