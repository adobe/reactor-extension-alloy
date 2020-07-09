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

import { Selector } from "testcafe";
import createExtensionViewController from "../helpers/createExtensionViewController";
import spectrum from "../helpers/spectrum";

const extensionViewController = createExtensionViewController(
  "configuration/configuration.html"
);

const addInstanceButton = spectrum.button("addInstanceButton");
const accordion = spectrum.accordion("instancesAccordion");

// We can't use data-test-id on Dialog because of a Spectrum bug.
// https://git.corp.adobe.com/React/react-spectrum-v2/issues/501
const resourceUsageDialog = spectrum.dialog(Selector("#resourceUsageDialog"));

const instances = [];

const environmentFields = env => {
  return {
    manualField: spectrum.textfield(`${env}ManualEdgeConfigIdField`),
    alert: spectrum.alert(`${env}EdgeConfigIdAlert`),
    field: spectrum.textfield(`${env}EdgeConfigIdField`),
    select: spectrum.select(`${env}EdgeConfigIdSelect`)
  };
};

for (let i = 0; i < 2; i += 1) {
  instances.push({
    nameField: spectrum.textfield("nameField"),
    nameChangeAlert: spectrum.alert("nameChangeAlert"),
    edgeConfigInputMethodSelectRadio: spectrum.radio(
      "edgeConfigInputMethodSelectRadio"
    ),
    edgeConfigInputMethodTextfieldRadio: spectrum.radio(
      "edgeConfigInputMethodTextfieldRadio"
    ),
    edgeConfigIdSelect: spectrum.select("edgeConfigIdSelect"),
    productionEnvironment: environmentFields("production"),
    stagingEnvironment: environmentFields("staging"),
    developmentEnvironment: environmentFields("development"),
    orgIdField: spectrum.textfield("orgIdField"),
    orgIdRestoreButton: spectrum.button("orgIdRestoreButton"),
    edgeDomainField: spectrum.textfield("edgeDomainField"),
    edgeDomainRestoreButton: spectrum.button("edgeDomainRestoreButton"),
    edgeBasePathField: spectrum.textfield("edgeBasePathField"),
    edgeBasePathRestoreButton: spectrum.button("edgeBasePathRestoreButton"),
    defaultConsent: {
      inField: spectrum.radio("defaultConsentInField"),
      pendingField: spectrum.radio("defaultConsentOutField")
    },
    idMigrationEnabled: spectrum.checkbox("idMigrationEnabledField"),
    thirdPartyCookiesEnabled: spectrum.checkbox(
      "thirdPartyCookiesEnabledField"
    ),
    // Due to limitations of the sandbox where tests are run,
    // testing prehiding style viewing/editing is limited.
    prehidingStyleEditorButton: spectrum.button("prehidingStyleEditorButton"),
    clickCollectionEnabledField: spectrum.checkbox(
      "clickCollectionEnabledField"
    ),
    downloadLinkQualifierField: spectrum.textfield(
      "downloadLinkQualifierField"
    ),
    downloadLinkQualifierRestoreButton: spectrum.button(
      "downloadLinkQualifierRestoreButton"
    ),
    downloadLinkQualifierTestButton: spectrum.button(
      "downloadLinkQualifierTestButton"
    ),
    onBeforeEventSendEditorButton: spectrum.button(
      "onBeforeEventSendEditorButton"
    ),
    contextGranularity: {
      allField: spectrum.radio("contextGranularityAllField"),
      specificField: spectrum.radio("contextGranularitySpecificField")
    },
    specificContext: {
      webField: spectrum.checkbox("contextWebField"),
      deviceField: spectrum.checkbox("contextDeviceField"),
      environmentField: spectrum.checkbox("contextEnvironmentField"),
      placeContextField: spectrum.checkbox("contextPlaceContextField")
    },
    deleteButton: spectrum.button("deleteInstanceButton")
  });
}

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Extension Configuration View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

const defaultEdgeDomain = "edge.adobedc.net";
const defaultEdgeBasePath = "ee";
const defaultDownloadLinkQualifier =
  "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$";

const defaultInitInfo = {
  company: {
    orgId: "ABC123@AdobeOrg"
  },
  tokens: {
    imsAccess: "Badtoken"
  }
};

test("initializes form fields with full settings", async () => {
  await extensionViewController.init(
    Object.assign({}, defaultInitInfo, {
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
            clickCollectionEnabled: false
          },
          {
            name: "alloy2",
            edgeConfigId: "PR456",
            stagingEdgeConfigId: "PR456:stage",
            developmentEdgeConfigId: "PR456:dev3",
            defaultConsent: "in",
            idMigrationEnabled: false,
            thirdPartyCookiesEnabled: false,
            context: []
          }
        ]
      }
    })
  );

  // When initializing with multiple instances, the accordion should
  // be fully collapsed.
  await instances[0].nameField.expectNotExists();
  await instances[1].nameField.expectNotExists();

  await accordion.clickHeader("ALLOY1");

  await instances[0].nameField.expectValue("alloy1");
  await instances[0].edgeConfigInputMethodTextfieldRadio.expectChecked();
  await instances[0].edgeConfigInputMethodSelectRadio.expectUnchecked();
  await instances[0].edgeConfigIdSelect.expectNotExists();
  await instances[0].productionEnvironment.manualField.expectValue("PR123");
  await instances[0].productionEnvironment.alert.expectNotExists();
  await instances[0].productionEnvironment.field.expectNotExists();
  await instances[0].productionEnvironment.select.expectNotExists();
  await instances[0].stagingEnvironment.manualField.expectValue("PR123:stage");
  await instances[0].stagingEnvironment.alert.expectNotExists();
  await instances[0].stagingEnvironment.field.expectNotExists();
  await instances[0].stagingEnvironment.select.expectNotExists();
  await instances[0].developmentEnvironment.manualField.expectValue(
    "PR123:dev1"
  );
  await instances[0].developmentEnvironment.alert.expectNotExists();
  await instances[0].developmentEnvironment.field.expectNotExists();
  await instances[0].developmentEnvironment.select.expectNotExists();
  await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
  await instances[0].edgeDomainField.expectValue("testedge.com");
  await instances[0].edgeBasePathField.expectValue("ee-beta");
  await instances[0].defaultConsent.inField.expectUnchecked();
  await instances[0].defaultConsent.pendingField.expectChecked();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectUnchecked();
  await instances[0].contextGranularity.specificField.expectChecked();
  await instances[0].specificContext.webField.expectUnchecked();
  await instances[0].specificContext.deviceField.expectChecked();
  await instances[0].specificContext.environmentField.expectUnchecked();
  await instances[0].specificContext.placeContextField.expectChecked();

  await accordion.clickHeader("ALLOY2");

  await instances[1].nameField.expectValue("alloy2");
  await instances[1].edgeConfigInputMethodTextfieldRadio.expectNotExists();
  await instances[1].edgeConfigInputMethodSelectRadio.expectNotExists();
  await instances[1].edgeConfigIdSelect.expectNotExists();
  await instances[1].productionEnvironment.manualField.expectValue("PR456");
  await instances[1].productionEnvironment.alert.expectNotExists();
  await instances[1].productionEnvironment.field.expectNotExists();
  await instances[1].productionEnvironment.select.expectNotExists();
  await instances[1].stagingEnvironment.manualField.expectValue("PR456:stage");
  await instances[1].stagingEnvironment.alert.expectNotExists();
  await instances[1].stagingEnvironment.field.expectNotExists();
  await instances[1].stagingEnvironment.select.expectNotExists();
  await instances[1].developmentEnvironment.manualField.expectValue(
    "PR456:dev3"
  );
  await instances[1].developmentEnvironment.alert.expectNotExists();
  await instances[1].developmentEnvironment.field.expectNotExists();
  await instances[1].developmentEnvironment.select.expectNotExists();
  await instances[1].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[1].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[1].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[1].defaultConsent.inField.expectChecked();
  await instances[1].defaultConsent.pendingField.expectUnchecked();
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
});

test("initializes form fields with minimal settings", async () => {
  await extensionViewController.init(
    Object.assign({}, defaultInitInfo, {
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123"
          }
        ]
      }
    })
  );

  await instances[0].nameField.expectValue("alloy1");
  await instances[0].productionEnvironment.manualField.expectValue("PR123");
  await instances[0].stagingEnvironment.manualField.expectValue("");
  await instances[0].developmentEnvironment.manualField.expectValue("");
  await instances[0].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].defaultConsent.inField.expectChecked();
  await instances[0].defaultConsent.pendingField.expectUnchecked();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init(defaultInitInfo);

  await instances[0].nameField.expectValue("alloy");
  await instances[0].edgeConfigInputMethodTextfieldRadio.expectUnchecked();
  await instances[0].edgeConfigInputMethodSelectRadio.expectChecked();
  await instances[0].edgeConfigIdSelect.expectValue("");
  await instances[0].productionEnvironment.manualField.expectNotExists();
  await instances[0].productionEnvironment.alert.expectNotExists();
  await instances[0].productionEnvironment.field.expectNotExists();
  await instances[0].productionEnvironment.select.expectNotExists();
  await instances[0].stagingEnvironment.manualField.expectNotExists();
  await instances[0].stagingEnvironment.alert.expectNotExists();
  await instances[0].stagingEnvironment.field.expectNotExists();
  await instances[0].stagingEnvironment.select.expectNotExists();
  await instances[0].developmentEnvironment.manualField.expectNotExists();
  await instances[0].developmentEnvironment.alert.expectNotExists();
  await instances[0].developmentEnvironment.field.expectNotExists();
  await instances[0].developmentEnvironment.select.expectNotExists();
  await instances[0].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].defaultConsent.inField.expectChecked();
  await instances[0].defaultConsent.pendingField.expectUnchecked();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init(defaultInitInfo);

  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
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
  await extensionViewController.init(defaultInitInfo, {
    openCodeEditor(options) {
      return Promise.resolve(
        // We include options.language and options.code in the result
        // just so we can assert that the code editor was properly configured
        `language=${options.language};code=${options.code}`
      );
    }
  });

  await instances[0].nameField.typeText("1");
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await instances[0].stagingEnvironment.manualField.typeText("PR123:stage");
  await instances[0].developmentEnvironment.manualField.typeText("PR123:dev1");
  await instances[0].edgeDomainField.typeText("2");
  await instances[0].edgeBasePathField.typeText("-alpha");
  await instances[0].defaultConsent.pendingField.click();
  await instances[0].idMigrationEnabled.click();
  await instances[0].thirdPartyCookiesEnabled.click();
  await instances[0].prehidingStyleEditorButton.click();
  await addInstanceButton.click();

  await instances[1].nameField.typeText("2");
  await instances[1].productionEnvironment.manualField.typeText("PR456");
  await instances[1].stagingEnvironment.manualField.typeText("PR456:stage");
  await instances[1].developmentEnvironment.manualField.typeText("PR456:dev1");
  await instances[1].orgIdField.typeText("2");
  await instances[1].defaultConsent.pendingField.click();
  await instances[1].idMigrationEnabled.click();
  await instances[1].thirdPartyCookiesEnabled.click();
  await instances[1].onBeforeEventSendEditorButton.click();
  await instances[1].downloadLinkQualifierField.clear();
  await instances[1].downloadLinkQualifierField.typeText("[]");
  await instances[1].contextGranularity.specificField.click();

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
        defaultConsent: "pending",
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
        prehidingStyle:
          "language=css;code=/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/"
      },
      {
        name: "alloy2",
        edgeConfigId: "PR456",
        stagingEdgeConfigId: "PR456:stage",
        developmentEdgeConfigId: "PR456:dev1",
        orgId: "ABC123@AdobeOrg2",
        defaultConsent: "pending",
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
        onBeforeEventSend:
          'language=javascript;code=// Modify content.xdm as necessary. There is no need to wrap the code in a function\n// or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";',
        context: ["web", "device", "environment", "placeContext"],
        downloadLinkQualifier: "[]"
      }
    ]
  });
});

test("shows error for empty required values", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].nameField.clear();
  await instances[0].orgIdField.clear();
  await instances[0].edgeDomainField.clear();
  await instances[0].edgeBasePathField.clear();
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
  await instances[0].edgeConfigIdSelect.expectError();
  await instances[0].orgIdField.expectError();
  await instances[0].edgeDomainField.expectError();
  await instances[0].edgeBasePathField.expectError();
});

test("shows error on manual edgeConfigId entry", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await extensionViewController.expectIsNotValid();
  await instances[0].productionEnvironment.manualField.expectError();
});

test("shows error for duplicate name", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].productionEnvironment.manualField.typeText("PR456");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader("ALLOY");
  await extensionViewController.expectIsNotValid();
  await instances[1].nameField.expectError();
});

test("shows error for name that matches key on window", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].nameField.clear();
  await instances[0].nameField.typeText("addEventListener");
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
});

test("shows error for numeric name", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].nameField.clear();
  await instances[0].nameField.typeText("123");
  await extensionViewController.expectIsNotValid();
  await instances[0].nameField.expectError();
});

test("shows a warning when name is changed on existing configuration", async () => {
  await extensionViewController.init(
    Object.assign({}, defaultInitInfo, {
      settings: {
        instances: [
          {
            name: "alloy",
            edgeConfigId: "PR123"
          }
        ]
      }
    })
  );
  await instances[0].nameField.typeText("123");
  await instances[0].nameChangeAlert.expectExists();
});

test("does not show a warning when name is changed on new configuration", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].nameField.typeText("123");
  await instances[0].nameChangeAlert.expectNotExists();
});

test("shows error for duplicate property ID", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].productionEnvironment.manualField.typeText("PR123");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader("ALLOY");
  await extensionViewController.expectIsNotValid();
  await instances[1].productionEnvironment.manualField.expectError();
});

test("shows error for duplicate IMS org ID", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].productionEnvironment.manualField.typeText("PR456");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader("ALLOY");
  await extensionViewController.expectIsNotValid();
  await instances[1].orgIdField.expectError();
});

test("shows error for invalid download link qualifier", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].downloadLinkQualifierField.clear();
  await instances[0].downloadLinkQualifierField.typeText("[");
  await extensionViewController.expectIsNotValid();
  await instances[0].downloadLinkQualifierField.expectError();
});

test("restores default IMS org ID value when restore button is clicked", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].orgIdField.typeText("foo");
  await instances[0].orgIdRestoreButton.click();
  await instances[0].orgIdField.expectValue("ABC123@AdobeOrg");
});

test("restores default edge domain value when restore button is clicked", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeDomainField.typeText("foo");
  await instances[0].edgeDomainRestoreButton.click();
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
});

test("restores default edge base path value when restore button is clicked", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeBasePathField.typeText("foo");
  await instances[0].edgeBasePathRestoreButton.click();
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
});

test("restores default download link qualifier when restore button is clicked", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].downloadLinkQualifierField.typeText(".");
  await instances[0].downloadLinkQualifierRestoreButton.click();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
});

test("sets download link qualifier when test button is clicked", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].downloadLinkQualifierTestButton.click();
  // openRegexTester returns Edited Regex ### in the sandbox environment
  await instances[0].downloadLinkQualifierField.expectMatch(/^Edited Regex/);
});

test("deletes an instance", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await instances[0].deleteButton.expectDisabled();
  await addInstanceButton.click();
  await instances[1].deleteButton.expectEnabled();
  // Make accordion header label unique
  await instances[1].nameField.typeText("2");
  await instances[1].productionEnvironment.manualField.typeText("PR456");
  await accordion.clickHeader("ALLOY");
  await instances[0].deleteButton.click();
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.clickCancel();
  await resourceUsageDialog.expectNotExists();
  await instances[0].productionEnvironment.manualField.expectValue("PR123");
  // Alright, delete for real.
  await instances[0].deleteButton.click();
  await resourceUsageDialog.clickConfirm();
  await instances[0].productionEnvironment.manualField.expectValue("PR456");
});

test("does not save prehidingStyle code if it matches placeholder", async () => {
  await extensionViewController.init(defaultInitInfo, {
    openCodeEditor() {
      return Promise.resolve(
        "/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/"
      );
    }
  });

  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await instances[0].prehidingStyleEditorButton.click();
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
  await extensionViewController.init(defaultInitInfo, {
    openCodeEditor() {
      return Promise.resolve(
        '// Modify content.xdm as necessary. There is no need to wrap the code in a function\n// or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";'
      );
    }
  });

  await instances[0].edgeConfigInputMethodTextfieldRadio.click();
  await instances[0].productionEnvironment.manualField.typeText("PR123");
  await instances[0].onBeforeEventSendEditorButton.click();
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
