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

test("initializes form fields with full settings", async t => {
  await extensionViewController.init(
    t,
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
            prehidingStyle: "#container { display: none }",
            context: ["device", "placeContext"],
            clickCollectionEnabled: false
          },
          {
            name: "alloy2",
            configId: "PR456",
            optInEnabled: false,
            idMigrationEnabled: false,
            context: []
          }
        ]
      }
    })
  );

  // When initializing with multiple instances, the accordion should
  // be fully collapsed.
  await instances[0].nameField.expectNotExists(t);
  await instances[1].nameField.expectNotExists(t);

  await accordion.clickHeader(t, "ALLOY1");

  await instances[0].nameField.expectValue(t, "alloy1");
  await instances[0].configIdField.expectValue(t, "PR123");
  await instances[0].orgIdField.expectValue(t, "ORG456@OtherCompanyOrg");
  await instances[0].edgeDomainField.expectValue(t, "testedge.com");
  await instances[0].edgeBasePathField.expectValue(t, "ee-beta");
  await instances[0].errorsEnabledField.expectUnchecked(t);
  await instances[0].optInEnabledField.expectChecked(t);
  await instances[0].idMigrationEnabled.expectChecked(t);
  await instances[0].clickCollectionEnabledField.expectUnchecked(t);
  await instances[0].contextGranularity.specificField.expectChecked(t);
  await instances[0].specificContext.webField.expectUnchecked(t);
  await instances[0].specificContext.deviceField.expectChecked(t);
  await instances[0].specificContext.environmentField.expectUnchecked(t);
  await instances[0].specificContext.placeContextField.expectChecked(t);

  await accordion.clickHeader(t, "ALLOY2");

  await instances[1].nameField.expectValue(t, "alloy2");
  await instances[1].configIdField.expectValue(t, "PR456");
  await instances[1].orgIdField.expectValue(t, "ABC123@AdobeOrg");
  await instances[1].edgeDomainField.expectValue(t, defaultEdgeDomain);
  await instances[1].edgeBasePathField.expectValue(t, defaultEdgeBasePath);
  await instances[1].errorsEnabledField.expectChecked(t);
  await instances[1].optInEnabledField.expectUnchecked(t);
  await instances[1].idMigrationEnabled.expectUnchecked(t);
  await instances[1].clickCollectionEnabledField.expectChecked(t);
  await instances[1].downloadLinkQualifierField.expectValue(
    t,
    defaultDownloadLinkQualifier
  );
  await instances[1].contextGranularity.specificField.expectChecked(t);
  await instances[1].specificContext.webField.expectUnchecked(t);
  await instances[1].specificContext.deviceField.expectUnchecked(t);
  await instances[1].specificContext.environmentField.expectUnchecked(t);
  await instances[1].specificContext.placeContextField.expectUnchecked(t);
});

test("initializes form fields with minimal settings", async t => {
  await extensionViewController.init(
    t,
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

  await instances[0].nameField.expectValue(t, "alloy1");
  await instances[0].configIdField.expectValue(t, "PR123");
  await instances[0].orgIdField.expectValue(t, "ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(t, defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(t, defaultEdgeBasePath);
  await instances[0].errorsEnabledField.expectChecked(t);
  await instances[0].optInEnabledField.expectUnchecked(t);
  await instances[0].idMigrationEnabled.expectChecked(t);
  await instances[0].clickCollectionEnabledField.expectChecked(t);
  await instances[0].downloadLinkQualifierField.expectValue(
    t,
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked(t);
  await instances[0].onBeforeEventSendField.expectValue(t, "");
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, defaultInitInfo);

  await instances[0].nameField.expectValue(t, "alloy");
  await instances[0].configIdField.expectValue(t, "");
  await instances[0].orgIdField.expectValue(t, "ABC123@AdobeOrg");
  await instances[0].edgeDomainField.expectValue(t, defaultEdgeDomain);
  await instances[0].edgeBasePathField.expectValue(t, defaultEdgeBasePath);
  await instances[0].errorsEnabledField.expectChecked(t);
  await instances[0].optInEnabledField.expectUnchecked(t);
  await instances[0].idMigrationEnabled.expectChecked(t);
  await instances[0].clickCollectionEnabledField.expectChecked(t);
  await instances[0].downloadLinkQualifierField.expectValue(
    t,
    defaultDownloadLinkQualifier
  );
  await instances[0].contextGranularity.allField.expectChecked(t);
  await instances[0].onBeforeEventSendField.expectValue(t, "");
});

test("returns minimal valid settings", async t => {
  await extensionViewController.init(t, defaultInitInfo);

  await instances[0].configIdField.typeText(t, "PR123");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instances: [
      {
        configId: "PR123",
        name: "alloy"
      }
    ]
  });
});

test("returns full valid settings", async t => {
  await extensionViewController.init(t, defaultInitInfo, {
    openCodeEditor(options) {
      return Promise.resolve(
        // We include options.language in the result
        // just so we can assert that the code editor
        // was properly configured for editing CSS
        `#container { display: none } // ${options.language}`
      );
    }
  });

  await instances[0].nameField.typeText(t, "1");
  await instances[0].configIdField.typeText(t, "PR123");
  await instances[0].edgeDomainField.typeText(t, "2");
  await instances[0].edgeBasePathField.typeText(t, "-alpha");
  await instances[0].errorsEnabledField.click(t);
  await instances[0].optInEnabledField.click(t);
  await instances[0].idMigrationEnabled.click(t);
  await instances[0].prehidingStyleField.click(t);
  await instances[0].onBeforeEventSendField.typeText(t, "%foo%");
  await addInstanceButton.click(t);

  await instances[1].nameField.typeText(t, "2");
  await instances[1].configIdField.typeText(t, "PR456");
  await instances[1].orgIdField.typeText(t, "2");
  await instances[1].optInEnabledField.click(t);
  await instances[1].idMigrationEnabled.click(t);
  await instances[1].downloadLinkQualifierField.clear(t);
  await instances[1].downloadLinkQualifierField.typeText(t, "[]");
  await instances[1].contextGranularity.specificField.click(t);

  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instances: [
      {
        name: "alloy1",
        configId: "PR123",
        edgeDomain: `${defaultEdgeDomain}2`,
        edgeBasePath: `${defaultEdgeBasePath}-alpha`,
        errorsEnabled: false,
        optInEnabled: true,
        idMigrationEnabled: false,
        prehidingStyle: "#container { display: none } // css",
        onBeforeEventSend: "%foo%"
      },
      {
        name: "alloy2",
        configId: "PR456",
        orgId: "ABC123@AdobeOrg2",
        optInEnabled: true,
        idMigrationEnabled: false,
        context: ["web", "device", "environment", "placeContext"],
        downloadLinkQualifier: "[]"
      }
    ]
  });
});

test("shows error for empty required values", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].nameField.clear(t);
  await instances[0].orgIdField.clear(t);
  await instances[0].edgeDomainField.clear(t);
  await instances[0].edgeBasePathField.clear(t);
  await extensionViewController.expectIsNotValid(t);
  await instances[0].nameField.expectError(t);
  await instances[0].configIdField.expectError(t);
  await instances[0].orgIdField.expectError(t);
  await instances[0].edgeDomainField.expectError(t);
  await instances[0].edgeBasePathField.expectError(t);
});

test("shows error for duplicate name", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await addInstanceButton.click(t);
  await instances[1].configIdField.typeText(t, "PR456");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader(t, "ALLOY");
  await extensionViewController.expectIsNotValid(t);
  await instances[1].nameField.expectError(t);
});

test("shows error for name that matches key on window", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].nameField.clear(t);
  await instances[0].nameField.typeText(t, "addEventListener");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].nameField.expectError(t);
});

test("shows error for numeric name", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].nameField.clear(t);
  await instances[0].nameField.typeText(t, "123");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].nameField.expectError(t);
});

test("shows a warning when name is changed on existing configuration", async t => {
  await extensionViewController.init(
    t,
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
  await instances[0].nameField.typeText(t, "123");
  await instances[0].nameChangeAlert.expectExists(t);
});

test("does not show a warning when name is changed on new configuration", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].nameField.typeText(t, "123");
  await instances[0].nameChangeAlert.expectNotExists(t);
});

test("shows error for duplicate property ID", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await addInstanceButton.click(t);
  await instances[1].configIdField.typeText(t, "PR123");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader(t, "ALLOY");
  await extensionViewController.expectIsNotValid(t);
  await instances[1].configIdField.expectError(t);
});

test("shows error for duplicate IMS org ID", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await addInstanceButton.click(t);
  await instances[1].configIdField.typeText(t, "PR456");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader(t, "ALLOY");
  await extensionViewController.expectIsNotValid(t);
  await instances[1].orgIdField.expectError(t);
});

test("shows error for invalid download link qualifier", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].downloadLinkQualifierField.clear(t);
  await instances[0].downloadLinkQualifierField.typeText(t, "[");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].downloadLinkQualifierField.expectError(t);
});

test("restores default IMS org ID value when restore button is clicked", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].orgIdField.typeText(t, "foo");
  await instances[0].orgIdRestoreButton.click(t);
  await instances[0].orgIdField.expectValue(t, "ABC123@AdobeOrg");
});

test("restores default edge domain value when restore button is clicked", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].edgeDomainField.typeText(t, "foo");
  await instances[0].edgeDomainRestoreButton.click(t);
  await instances[0].edgeDomainField.expectValue(t, defaultEdgeDomain);
});

test("restores default edge base path value when restore button is clicked", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].edgeBasePathField.typeText(t, "foo");
  await instances[0].edgeBasePathRestoreButton.click(t);
  await instances[0].edgeBasePathField.expectValue(t, defaultEdgeBasePath);
});

test("restores default download link qualifier when restore button is clicked", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].downloadLinkQualifierField.typeText(t, ".");
  await instances[0].downloadLinkQualifierRestoreButton.click(t);
  await instances[0].downloadLinkQualifierField.expectValue(
    t,
    defaultDownloadLinkQualifier
  );
});

test("sets download link qualifier when test button is clicked", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].downloadLinkQualifierTestButton.click(t);
  // openRegexTester returns Edited Regex ### in the sandbox environment
  await instances[0].downloadLinkQualifierField.expectMatch(t, /^Edited Regex/);
});

test("shows error for onBeforeEventSend value that is an arbitrary string", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await instances[0].onBeforeEventSendField.typeText(t, "123foo");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].onBeforeEventSendField.expectError(t);
});

test("shows error for onBeforeEventSend value that is multiple data elements", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await instances[0].onBeforeEventSendField.typeText(t, "%foo%%bar%");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].onBeforeEventSendField.expectError(t);
});

test("does not show error for onBeforeEventSend value that is a single data element", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await instances[0].onBeforeEventSendField.typeText(t, "%123foo%");
  await extensionViewController.expectIsValid(t);
});

test("deletes an instance", async t => {
  await extensionViewController.init(t, defaultInitInfo);
  await instances[0].configIdField.typeText(t, "PR123");
  await instances[0].deleteButton.expectDisabled(t);
  await addInstanceButton.click(t);
  await instances[1].deleteButton.expectEnabled(t);
  // Make accordion header label unique
  await instances[1].nameField.typeText(t, "2");
  await instances[1].configIdField.typeText(t, "PR456");
  await accordion.clickHeader(t, "ALLOY");
  await instances[0].deleteButton.click(t);
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.clickCancel(t);
  await resourceUsageDialog.expectNotExists(t);
  await instances[0].configIdField.expectValue(t, "PR123");
  // Alright, delete for real.
  await instances[0].deleteButton.click(t);
  await resourceUsageDialog.expectTitle(t, "Resource Usage");
  await resourceUsageDialog.clickConfirm(t);
  await instances[0].configIdField.expectValue(t, "PR456");
});
