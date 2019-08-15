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

const addAccountButton = spectrum.button(
  Selector(".spectrum-Button").withText("Add Account")
);
const accordion = spectrum.accordion(Selector(".spectrum-Accordion"));
const resourceUsageDialog = spectrum.dialog(Selector(".spectrum-Dialog"));

const accounts = [];

for (let i = 0; i < 2; i += 1) {
  accounts.push({
    propertyIdField: spectrum.textfield(
      Selector(`[name='accounts.${i}.propertyId']`)
    ),
    instanceNameField: spectrum.textfield(
      Selector(`[name='accounts.${i}.instanceName']`)
    ),
    edgeDomainField: spectrum.textfield(
      Selector(`[name='accounts.${i}.edgeDomain']`)
    ),
    errorsEnabledField: spectrum.checkbox(
      Selector(`[name='accounts.${i}.errorsEnabled']`)
    ),
    optInEnabledField: spectrum.checkbox(
      Selector(`[name='accounts.${i}.optInEnabled']`)
    ),
    idSyncsEnabledField: spectrum.checkbox(
      Selector(`[name='accounts.${i}.idSyncsEnabled']`)
    ),
    destinationsEnabledField: spectrum.checkbox(
      Selector(`[name='accounts.${i}.destinationsEnabled']`)
    ),
    contextGranularity: {
      allField: spectrum.radio(
        Selector(`[name='accounts.${i}.contextGranularity'][value=all]`)
      ),
      specificField: spectrum.radio(
        Selector(`[name='accounts.${i}.contextGranularity'][value=specific]`)
      )
    },
    specificContext: {
      webField: spectrum.checkbox(Selector("[value=web]")),
      deviceField: spectrum.checkbox(Selector("[value=device]")),
      environmentField: spectrum.checkbox(Selector("[value=environment]")),
      placeContextField: spectrum.checkbox(Selector("[value=placeContext]"))
    },
    deleteButton: spectrum.button(
      Selector(`[data-test-id='accounts.${i}.delete`)
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
      accounts: [
        {
          propertyId: "PR123",
          instanceName: "alloy1",
          edgeDomain: "testedge.com",
          errorsEnabled: false,
          optInEnabled: true,
          idSyncsEnabled: false,
          destinationsEnabled: false,
          context: ["device", "placeContext"]
        },
        {
          propertyId: "PR456",
          instanceName: "alloy2",
          edgeDomain: "testedge2.com",
          optInEnabled: false,
          idSyncsEnabled: false,
          context: []
        }
      ]
    }
  });

  await accounts[0].propertyIdField.expectValue(t, "PR123");
  await accounts[0].instanceNameField.expectValue(t, "alloy1");
  await accounts[0].edgeDomainField.expectValue(t, "testedge.com");
  await accounts[0].errorsEnabledField.expectUnchecked(t);
  await accounts[0].optInEnabledField.expectChecked(t);
  await accounts[0].idSyncsEnabledField.expectUnchecked(t);
  await accounts[0].destinationsEnabledField.expectUnchecked(t);
  await accounts[0].contextGranularity.specificField.expectChecked(t);
  await accounts[0].specificContext.webField.expectUnchecked(t);
  await accounts[0].specificContext.deviceField.expectChecked(t);
  await accounts[0].specificContext.environmentField.expectUnchecked(t);
  await accounts[0].specificContext.placeContextField.expectChecked(t);

  await accordion.clickHeader(t, "PR456");

  await accounts[1].propertyIdField.expectValue(t, "PR456");
  await accounts[1].instanceNameField.expectValue(t, "alloy2");
  await accounts[1].edgeDomainField.expectValue(t, "testedge2.com");
  await accounts[1].errorsEnabledField.expectChecked(t);
  await accounts[1].optInEnabledField.expectUnchecked(t);
  await accounts[1].idSyncsEnabledField.expectUnchecked(t);
  await accounts[1].destinationsEnabledField.expectChecked(t);
  await accounts[1].contextGranularity.specificField.expectChecked(t);
  await accounts[1].specificContext.webField.expectUnchecked(t);
  await accounts[1].specificContext.deviceField.expectUnchecked(t);
  await accounts[1].specificContext.environmentField.expectUnchecked(t);
  await accounts[1].specificContext.placeContextField.expectUnchecked(t);
});

test("initializes form fields with minimal settings", async t => {
  await extensionViewController.init(t, {
    settings: {
      accounts: [
        {
          propertyId: "PR123",
          instanceName: "alloy1"
        }
      ]
    }
  });

  await accounts[0].propertyIdField.expectValue(t, "PR123");
  await accounts[0].instanceNameField.expectValue(t, "alloy1");
  await accounts[0].edgeDomainField.expectValue(t, "");
  await accounts[0].errorsEnabledField.expectChecked(t);
  await accounts[0].optInEnabledField.expectUnchecked(t);
  await accounts[0].idSyncsEnabledField.expectChecked(t);
  await accounts[0].destinationsEnabledField.expectChecked(t);
  await accounts[0].contextGranularity.allField.expectChecked(t);
});

test("initializes form fields with no settings", async t => {
  await extensionViewController.init(t, {});

  await accounts[0].propertyIdField.expectValue(t, "");
  await accounts[0].instanceNameField.expectValue(t, "alloy");
  await accounts[0].edgeDomainField.expectValue(t, "");
  await accounts[0].errorsEnabledField.expectChecked(t);
  await accounts[0].optInEnabledField.expectUnchecked(t);
  await accounts[0].idSyncsEnabledField.expectChecked(t);
  await accounts[0].destinationsEnabledField.expectChecked(t);
  await accounts[0].contextGranularity.allField.expectChecked(t);
});

test("returns minimal valid settings", async t => {
  await extensionViewController.init(t, {});

  await accounts[0].propertyIdField.typeText(t, "PR123");
  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    accounts: [
      {
        propertyId: "PR123",
        instanceName: "alloy"
      }
    ]
  });
});

test("returns full valid settings", async t => {
  await extensionViewController.init(t, {});

  await accounts[0].propertyIdField.typeText(t, "PR123");
  await accounts[0].instanceNameField.typeText(t, "1");
  await accounts[0].edgeDomainField.typeText(t, "testedge.com");
  await accounts[0].errorsEnabledField.click(t);
  await accounts[0].optInEnabledField.click(t);
  await accounts[0].idSyncsEnabledField.click(t);
  await accounts[0].destinationsEnabledField.click(t);

  await addAccountButton.click(t);

  await accounts[1].propertyIdField.typeText(t, "PR456");
  await accounts[1].instanceNameField.typeText(t, "2");
  await accounts[1].edgeDomainField.typeText(t, "testedge2.com");
  await accounts[1].optInEnabledField.click(t);
  await accounts[1].contextGranularity.specificField.click(t);

  await extensionViewController.expectIsValid(t);
  await extensionViewController.expectSettings(t, {
    accounts: [
      {
        propertyId: "PR123",
        instanceName: "alloy1",
        edgeDomain: "testedge.com",
        errorsEnabled: false,
        optInEnabled: true,
        idSyncsEnabled: false,
        destinationsEnabled: false
      },
      {
        propertyId: "PR456",
        instanceName: "alloy2",
        edgeDomain: "testedge2.com",
        optInEnabled: true,
        context: ["web", "device", "environment", "placeContext"]
      }
    ]
  });
});

test("shows errors for empty required values", async t => {
  await extensionViewController.init(t, {});
  await extensionViewController.expectIsNotValid(t);
  await accounts[0].propertyIdField.expectError(t);
});

test("shows errors for duplicate property IDs", async t => {
  await extensionViewController.init(t, {});
  await accounts[0].propertyIdField.typeText(t, "PR123");
  await addAccountButton.click(t);
  await accounts[1].propertyIdField.typeText(t, "PR123");
  // We'll expand the first account before we validate to test that
  // validation expands the invalid account (in this case, the second one)
  await accordion.clickHeader(t, "PR123");
  await extensionViewController.expectIsNotValid(t);
  await accounts[1].propertyIdField.expectError(t);
});

test("shows errors for duplicate instance names", async t => {
  await extensionViewController.init(t, {});
  await accounts[0].propertyIdField.typeText(t, "PR123");
  await addAccountButton.click(t);
  await accounts[1].propertyIdField.typeText(t, "PR456");
  // We'll expand the first account before we validate to test that
  // validation expands the invalid account (in this case, the second one)
  await accordion.clickHeader(t, "PR123");
  await extensionViewController.expectIsNotValid(t);
  await accounts[1].instanceNameField.expectError(t);
});

test("deletes an account", async t => {
  await extensionViewController.init(t, {});
  await accounts[0].propertyIdField.typeText(t, "PR123");
  await t.expect(accounts[0].deleteButton.exists).notOk();
  await addAccountButton.click(t);
  await t.expect(accounts[1].deleteButton.selector.exists).ok();
  await accounts[1].propertyIdField.typeText(t, "PR456");
  await accordion.clickHeader(t, "PR123");
  await accounts[0].deleteButton.click(t);
  // Ensure that clicking cancel doesn't delete anything.
  await resourceUsageDialog.clickCancel(t);
  await t.expect(resourceUsageDialog.selector.exists).notOk();
  await accounts[0].propertyIdField.expectValue(t, "PR123");
  // Alright, delete for real.
  await accounts[0].deleteButton.click(t);
  await resourceUsageDialog.expectTitle(t, "Resource Usage");
  await resourceUsageDialog.clickConfirm(t);
  await accounts[0].propertyIdField.expectValue(t, "PR456");
});
