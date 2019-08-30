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
import createExtensionViewController from "./helpers/createExtensionViewController";
import spectrum from "./helpers/spectrum";

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
    propertyIdField: spectrum.textfield(
      Selector(`[name='instances.${i}.propertyId']`)
    ),
    edgeDomainField: spectrum.textfield(
      Selector(`[name='instances.${i}.edgeDomain']`)
    ),
    errorsEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.errorsEnabled']`)
    ),
    optInEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.optInEnabled']`)
    ),
    idSyncsEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.idSyncsEnabled']`)
    ),
    idSyncContainerIdField: spectrum.textfield(
      Selector(`[name='instances.${i}.idSyncContainerId']`)
    ),
    destinationsEnabledField: spectrum.checkbox(
      Selector(`[name='instances.${i}.destinationsEnabled']`)
    ),
    // Due to limitations of the sandbox where tests are run,
    // testing prehding style viewing/editing is limited.
    prehidingStyleField: spectrum.button(
      Selector(`button`).withText("Open Editor")
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
    deleteButton: spectrum.button(
      Selector(`[data-test-id='instances.${i}.delete`)
    )
  });
}

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Extension Configuration View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full settings", async t => {
  await extensionViewController.init(t, {
    settings: {
      instances: [
        {
          name: "alloy1",
          propertyId: "PR123",
          edgeDomain: "testedge.com",
          errorsEnabled: false,
          optInEnabled: true,
          idSyncsEnabled: false,
          idSyncContainerId: 123,
          destinationsEnabled: false,
          prehidingStyle: "#container { display: none }",
          context: ["device", "placeContext"]
        },
        {
          name: "alloy2",
          propertyId: "PR456",
          edgeDomain: "testedge2.com",
          optInEnabled: false,
          idSyncsEnabled: false,
          context: []
        }
      ]
    }
  });

  await instances[0].nameField.expectValue(t, "alloy1");
  await instances[0].propertyIdField.expectValue(t, "PR123");
  await instances[0].edgeDomainField.expectValue(t, "testedge.com");
  await instances[0].errorsEnabledField.expectUnchecked(t);
  await instances[0].optInEnabledField.expectChecked(t);
  await instances[0].idSyncsEnabledField.expectUnchecked(t);
  await instances[0].idSyncContainerIdField.expectValue(t, "123");
  await instances[0].destinationsEnabledField.expectUnchecked(t);
  await instances[0].contextGranularity.specificField.expectChecked(t);
  await instances[0].specificContext.webField.expectUnchecked(t);
  await instances[0].specificContext.deviceField.expectChecked(t);
  await instances[0].specificContext.environmentField.expectUnchecked(t);
  await instances[0].specificContext.placeContextField.expectChecked(t);

  await accordion.clickHeader(t, "ALLOY2");

  await instances[1].nameField.expectValue(t, "alloy2");
  await instances[1].propertyIdField.expectValue(t, "PR456");
  await instances[1].edgeDomainField.expectValue(t, "testedge2.com");
  await instances[1].errorsEnabledField.expectChecked(t);
  await instances[1].optInEnabledField.expectUnchecked(t);
  await instances[1].idSyncsEnabledField.expectUnchecked(t);
  await instances[1].destinationsEnabledField.expectChecked(t);
  await instances[1].contextGranularity.specificField.expectChecked(t);
  await instances[1].specificContext.webField.expectUnchecked(t);
  await instances[1].specificContext.deviceField.expectUnchecked(t);
  await instances[1].specificContext.environmentField.expectUnchecked(t);
  await instances[1].specificContext.placeContextField.expectUnchecked(t);
});

test("initializes form fields with minimal settings", async t => {
  await extensionViewController.init(t, {
    settings: {
      instances: [
        {
          name: "alloy1",
          propertyId: "PR123"
        }
      ]
    }
  });

  await instances[0].nameField.expectValue(t, "alloy1");
  await instances[0].propertyIdField.expectValue(t, "PR123");
  await instances[0].edgeDomainField.expectValue(t, "");
  await instances[0].errorsEnabledField.expectChecked(t);
  await instances[0].optInEnabledField.expectUnchecked(t);
  await instances[0].idSyncsEnabledField.expectChecked(t);
  await instances[0].idSyncContainerIdField.expectValue(t, "");
  await instances[0].destinationsEnabledField.expectChecked(t);
  await instances[0].contextGranularity.allField.expectChecked(t);
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, {});

  await instances[0].nameField.expectValue(t, "alloy");
  await instances[0].propertyIdField.expectValue(t, "");
  await instances[0].edgeDomainField.expectValue(t, "");
  await instances[0].errorsEnabledField.expectChecked(t);
  await instances[0].optInEnabledField.expectUnchecked(t);
  await instances[0].idSyncsEnabledField.expectChecked(t);
  await instances[0].idSyncContainerIdField.expectValue(t, "");
  await instances[0].destinationsEnabledField.expectChecked(t);
  await instances[0].contextGranularity.allField.expectChecked(t);
});

test("returns minimal valid settings", async t => {
  await extensionViewController.init(t, {});

  await instances[0].propertyIdField.typeText(t, "PR123");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instances: [
      {
        propertyId: "PR123",
        name: "alloy"
      }
    ]
  });
});

test("returns full valid settings", async t => {
  await extensionViewController.init(
    t,
    {},
    {
      openCodeEditor(options) {
        return Promise.resolve(
          // We include options.language in the result
          // just so we can assert that the code editor
          // was properly configured for editing CSS
          `#container { display: none } // ${options.language}`
        );
      }
    }
  );

  await instances[0].nameField.typeText(t, "1");
  await instances[0].propertyIdField.typeText(t, "PR123");
  await instances[0].edgeDomainField.typeText(t, "testedge.com");
  await instances[0].errorsEnabledField.click(t);
  await instances[0].optInEnabledField.click(t);
  await instances[0].idSyncsEnabledField.click(t);
  await instances[0].idSyncContainerIdField.typeText(t, "123");
  await instances[0].destinationsEnabledField.click(t);
  await instances[0].prehidingStyleField.click(t);

  await addInstanceButton.click(t);

  await instances[1].nameField.typeText(t, "2");
  await instances[1].propertyIdField.typeText(t, "PR456");
  await instances[1].edgeDomainField.typeText(t, "testedge2.com");
  await instances[1].optInEnabledField.click(t);
  await instances[1].contextGranularity.specificField.click(t);

  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    instances: [
      {
        name: "alloy1",
        propertyId: "PR123",
        edgeDomain: "testedge.com",
        errorsEnabled: false,
        optInEnabled: true,
        idSyncsEnabled: false,
        idSyncContainerId: 123,
        destinationsEnabled: false,
        prehidingStyle: "#container { display: none } // css"
      },
      {
        name: "alloy2",
        propertyId: "PR456",
        edgeDomain: "testedge2.com",
        optInEnabled: true,
        context: ["web", "device", "environment", "placeContext"]
      }
    ]
  });
});

test("shows errors for empty required values", async t => {
  await extensionViewController.init(t, {});
  await instances[0].nameField.clear(t);
  await extensionViewController.expectIsNotValid(t);
  await instances[0].nameField.expectError(t);
  await instances[0].propertyIdField.expectError(t);
});

test("shows errors for duplicate property IDs", async t => {
  await extensionViewController.init(t, {});
  await instances[0].propertyIdField.typeText(t, "PR123");
  await addInstanceButton.click(t);
  // Make accordion header label unique
  await instances[1].nameField.typeText(t, "2");
  await instances[1].propertyIdField.typeText(t, "PR123");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  await accordion.clickHeader(t, "ALLOY");
  await extensionViewController.expectIsNotValid(t);
  await instances[1].propertyIdField.expectError(t);
});

test("shows errors for duplicate names", async t => {
  await extensionViewController.init(t, {});
  await instances[0].propertyIdField.typeText(t, "PR123");
  await addInstanceButton.click(t);
  await instances[1].propertyIdField.typeText(t, "PR456");
  // We'll expand the first instance before we validate to test that
  // validation expands the invalid instance (in this case, the second one)
  // Even though both accordion header labels are "alloy", this
  // will select the first one.
  await accordion.clickHeader(t, "ALLOY");
  await extensionViewController.expectIsNotValid(t);
  await instances[1].nameField.expectError(t);
});

test("shows error for negative ID sync container ID", async t => {
  await extensionViewController.init(t, {});
  await instances[0].propertyIdField.typeText(t, "PR123");
  await instances[0].idSyncContainerIdField.typeText(t, "-1");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].idSyncContainerIdField.expectError(t);
});

test("shows error for non-integer ID sync container ID", async t => {
  await extensionViewController.init(t, {});
  await instances[0].propertyIdField.typeText(t, "PR123");
  await instances[0].idSyncContainerIdField.typeText(t, "123.123");
  await extensionViewController.expectIsNotValid(t);
  await instances[0].idSyncContainerIdField.expectError(t);
});

test("deletes an instance", async t => {
  await extensionViewController.init(t, {});
  await instances[0].propertyIdField.typeText(t, "PR123");
  await t.expect(instances[0].deleteButton.exists).notOk();
  await addInstanceButton.click(t);
  await t.expect(instances[1].deleteButton.selector.exists).ok();
  // Make accordion header label unique
  await instances[1].nameField.typeText(t, "2");
  await instances[1].propertyIdField.typeText(t, "PR456");
  await accordion.clickHeader(t, "ALLOY");
  await instances[0].deleteButton.click(t);
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.clickCancel(t);
  await t.expect(resourceUsageDialog.selector.exists).notOk();
  await instances[0].propertyIdField.expectValue(t, "PR123");
  // Alright, delete for real.
  await instances[0].deleteButton.click(t);
  await resourceUsageDialog.expectTitle(t, "Resource Usage");
  await resourceUsageDialog.clickConfirm(t);
  await instances[0].propertyIdField.expectValue(t, "PR456");
});
