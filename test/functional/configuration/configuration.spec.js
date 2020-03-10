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

const addInstanceButton = spectrum.button(
  Selector(".spectrum-Button").withText("Add Instance")
);
const accordion = spectrum.accordion(Selector(".spectrum-Accordion"));
const resourceUsageDialog = spectrum.dialog(Selector(".spectrum-Dialog"));

const instances = [];

for (let i = 0; i < 2; i += 1) {
  instances.push({
    nameField: spectrum.textfield(Selector(`[name='instances.${i}.name']`)),
    nameChangeAlert: spectrum.alert(Selector("#nameChangeAlert")),
    configIdField: spectrum.textfield(
      Selector(`[name='instances.${i}.configId']`)
    ),
    orgIdField: spectrum.textfield(Selector(`[name='instances.${i}.orgId']`)),
    orgIdRestoreButton: spectrum.button(Selector("#orgIdRestoreButton")),
    edgeDomainField: spectrum.textfield(
      Selector(`[name='instances.${i}.edgeDomain']`)
    ),
    edgeDomainRestoreButton: spectrum.button(
      Selector(`#edgeDomainRestoreButton`)
    ),
    edgeBasePathField: spectrum.textfield(
      Selector(`[name='instances.${i}.edgeBasePath']`)
    ),
    edgeBasePathRestoreButton: spectrum.button(
      Selector(`#edgeBasePathRestoreButton`)
    ),
    errorsEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.errorsEnabled']`)
    ),
    optInEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.optInEnabled']`)
    ),
    idMigrationEnabled: spectrum.checkbox(
      Selector(`[name='instances.${i}.idMigrationEnabled']`)
    ),
    thirdPartyCookiesEnabled: spectrum.checkbox(
      Selector(`[name='instances.${i}.thirdPartyCookiesEnabled']`)
    ),
    // Due to limitations of the sandbox where tests are run,
    // testing prehding style viewing/editing is limited.
    prehidingStyleField: spectrum.button(
      Selector(`button`).withText("Open Editor")
    ),
    clickCollectionEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.clickCollectionEnabled']`)
    ),
    downloadLinkQualifierField: spectrum.textfield(
      Selector(`[name='instances.${i}.downloadLinkQualifier']`)
    ),
    downloadLinkQualifierRestoreButton: spectrum.button(
      Selector(`#downloadLinkQualifierRestoreButton`)
    ),
    downloadLinkQualifierTestButton: spectrum.button(
      Selector(`#downloadLinkQualifierTestButton`)
    ),
    onBeforeEventSendField: spectrum.textfield(
      Selector(`[name='instances.${i}.onBeforeEventSend']`)
    ),
    contextGranularity: {
      allField: spectrum.radio(
        Selector(`[name='instances.${i}.contextGranularity'][value=all]`)
      ),
      specificField: spectrum.radio(
        Selector(`[name='instances.${i}.contextGranularity'][value=specific]`)
      )
    },
    specificContext: {
      webField: spectrum.checkbox(Selector("[value=web]")),
      deviceField: spectrum.checkbox(Selector("[value=device]")),
      environmentField: spectrum.checkbox(Selector("[value=environment]")),
      placeContextField: spectrum.checkbox(Selector("[value=placeContext]"))
    },
    deleteButton: spectrum.button(Selector("#deleteButton"))
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
  }
};

test("initializes form fields with full settings", async () => {
  await extensionViewController.init(
    Object.assign({}, defaultInitInfo, {
      settings: {
        instances: [
          {
            name: "alloy1",
            configId: "PR123",
            orgId: "ORG456@OtherCompanyOrg",
            edgeDomain: "testedge.com",
            edgeBasePath: "ee-beta",
            errorsEnabled: false,
            optInEnabled: true,
            idMigrationEnabled: true,
            thirdPartyCookiesEnabled: true,
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false
          },
          {
            name: "alloy2",
            configId: "PR456",
            optInEnabled: false,
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
  await instances[0].configIdField.expectValue("PR123");
  await instances[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
  await instances[0].edgeDomainField.expectValue("testedge.com");
  await instances[0].edgeBasePathField.expectValue("ee-beta");
  await instances[0].errorsEnabledField.expectUnchecked();
  await instances[0].optInEnabledField.expectChecked();
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
  await instances[1].configIdField.expectValue("PR456");
  await instances[1].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[1].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[1].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[1].errorsEnabledField.expectChecked();
  await instances[1].optInEnabledField.expectUnchecked();
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
            configId: "PR123"
          }
        ]
      }
    })
  );

  await instances[0].nameField.expectValue("alloy1");
  await instances[0].configIdField.expectValue("PR123");
  await instances[0].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].errorsEnabledField.expectChecked();
  await instances[0].optInEnabledField.expectUnchecked();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
  await instances[0].onBeforeEventSendField.expectValue("");
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init(defaultInitInfo);

  await instances[0].nameField.expectValue("alloy");
  await instances[0].configIdField.expectValue("");
  await instances[0].orgIdField.expectValue("ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
  await instances[0].errorsEnabledField.expectChecked();
  await instances[0].optInEnabledField.expectUnchecked();
  await instances[0].idMigrationEnabled.expectChecked();
  await instances[0].thirdPartyCookiesEnabled.expectChecked();
  await instances[0].clickCollectionEnabledField.expectChecked();
  await instances[0].downloadLinkQualifierField.expectValue(
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked();
  await instances[0].onBeforeEventSendField.expectValue("");
});

test("returns minimal valid settings", async () => {
  await extensionViewController.init(defaultInitInfo);

  await instances[0].configIdField.typeText("PR123");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        configId: "PR123",
        name: "alloy"
      }
    ]
  });
});

test("returns full valid settings", async () => {
  await extensionViewController.init(defaultInitInfo, {
    openCodeEditor(options) {
      return Promise.resolve(
        // We include options.language in the result
        // just so we can assert that the code editor
        // was properly configured for editing CSS
        `#container { display: none } // ${options.language}`
      );
    }
  });

  await instances[0].nameField.typeText("1");
  await instances[0].configIdField.typeText("PR123");
  await instances[0].edgeDomainField.typeText("2");
  await instances[0].edgeBasePathField.typeText("-alpha");
  await instances[0].errorsEnabledField.click();
  await instances[0].optInEnabledField.click();
  await instances[0].idMigrationEnabled.click();
  await instances[0].thirdPartyCookiesEnabled.click();
  await instances[0].prehidingStyleField.click();
  await instances[0].onBeforeEventSendField.typeText("%foo%");
  await addInstanceButton.click();

  await instances[1].nameField.typeText("2");
  await instances[1].configIdField.typeText("PR456");
  await instances[1].orgIdField.typeText("2");
  await instances[1].optInEnabledField.click();
  await instances[1].idMigrationEnabled.click();
  await instances[1].thirdPartyCookiesEnabled.click();
  await instances[1].downloadLinkQualifierField.clear();
  await instances[1].downloadLinkQualifierField.typeText("[]");
  await instances[1].contextGranularity.specificField.click();

  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instances: [
      {
        name: "alloy1",
        configId: "PR123",
        edgeDomain: `${defaultEdgeDomain}2`,
        edgeBasePath: `${defaultEdgeBasePath}-alpha`,
        errorsEnabled: false,
        optInEnabled: true,
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
        prehidingStyle: "#container { display: none } // css",
        onBeforeEventSend: "%foo%"
      },
      {
        name: "alloy2",
        configId: "PR456",
        orgId: "ABC123@AdobeOrg2",
        optInEnabled: true,
        idMigrationEnabled: false,
        thirdPartyCookiesEnabled: false,
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
  await instances[0].configIdField.expectError();
  await instances[0].orgIdField.expectError();
  await instances[0].edgeDomainField.expectError();
  await instances[0].edgeBasePathField.expectError();
});

test("shows error for duplicate name", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].configIdField.typeText("PR456");
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
            configId: "PR123"
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
  await instances[0].configIdField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].configIdField.typeText("PR123");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader("ALLOY");
  await extensionViewController.expectIsNotValid();
  await instances[1].configIdField.expectError();
});

test("shows error for duplicate IMS org ID", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await addInstanceButton.click();
  await instances[1].configIdField.typeText("PR456");
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

test("shows error for onBeforeEventSend value that is an arbitrary string", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await instances[0].onBeforeEventSendField.typeText("123foo");
  await extensionViewController.expectIsNotValid();
  await instances[0].onBeforeEventSendField.expectError();
});

test("shows error for onBeforeEventSend value that is multiple data elements", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await instances[0].onBeforeEventSendField.typeText("%foo%%bar%");
  await extensionViewController.expectIsNotValid();
  await instances[0].onBeforeEventSendField.expectError();
});

test("does not show error for onBeforeEventSend value that is a single data element", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await instances[0].onBeforeEventSendField.typeText("%123foo%");
  await extensionViewController.expectIsValid();
});

test("deletes an instance", async () => {
  await extensionViewController.init(defaultInitInfo);
  await instances[0].configIdField.typeText("PR123");
  await instances[0].deleteButton.expectDisabled();
  await addInstanceButton.click();
  await instances[1].deleteButton.expectEnabled();
  // Make accordion header label unique
  await instances[1].nameField.typeText("2");
  await instances[1].configIdField.typeText("PR456");
  await accordion.clickHeader("ALLOY");
  await instances[0].deleteButton.click();
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.clickCancel();
  await resourceUsageDialog.expectNotExists();
  await instances[0].configIdField.expectValue("PR123");
  // Alright, delete for real.
  await instances[0].deleteButton.click();
  await resourceUsageDialog.expectTitle("Resource Usage");
  await resourceUsageDialog.clickConfirm();
  await instances[0].configIdField.expectValue("PR456");
});
