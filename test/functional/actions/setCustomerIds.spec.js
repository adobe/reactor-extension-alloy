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

import createExtensionViewController from "../helpers/createExtensionViewController";
import spectrum from "../helpers/spectrum";

const extensionViewController = createExtensionViewController(
  "actions/setCustomerIds.html"
);

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      edgeConfigId: "PR123"
    },
    {
      name: "alloy2",
      edgeConfigId: "PR456"
    }
  ]
};

const instanceNameField = spectrum.select("instanceNameField");
const addCustomerIdButton = spectrum.button("addCustomerIdButton");
const customerIds = [];

for (let i = 0; i < 2; i += 1) {
  customerIds.push({
    namespaceField: spectrum.textfield(`namespace${i}Field`),
    idField: spectrum.textfield(`id${i}Field`),
    hashEnabledField: spectrum.checkbox(`hashEnabled${i}Field`),
    authenticatedStateField: spectrum.select(`authenticatedState${i}Field`),
    primaryField: spectrum.checkbox(`primary${i}Field`),
    deleteButton: spectrum.button(`delete${i}Button`)
  });
}

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Set Customer IDs View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields with full valid settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy99",
      customerIds: [
        {
          namespace: "CORE",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hashEnabled: true
        },
        {
          namespace: "AAID",
          id: "zyx",
          authenticatedState: "authenticated",
          primary: true,
          hashEnabled: false
        }
      ]
    }
  });

  await instanceNameField.expectValue("alloy99");
  await customerIds[0].namespaceField.expectValue("CORE");
  await customerIds[0].idField.expectValue("wvg");
  await customerIds[0].hashEnabledField.expectChecked();
  await customerIds[0].authenticatedStateField.expectValue("loggedOut");
  await customerIds[0].primaryField.expectUnchecked();
  await customerIds[0].deleteButton.expectEnabled();
  await customerIds[1].namespaceField.expectValue("AAID");
  await customerIds[1].idField.expectValue("zyx");
  await customerIds[1].hashEnabledField.expectUnchecked();
  await customerIds[1].authenticatedStateField.expectValue("authenticated");
  await customerIds[1].primaryField.expectChecked();
  await customerIds[1].deleteButton.expectEnabled();
  await extensionViewController.expectIsValid();
});

test("initializes form fields with no settings", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings
  });

  await instanceNameField.expectValue("alloy1");
  await customerIds[0].namespaceField.expectValue("");
  await customerIds[0].idField.expectValue("");
  await customerIds[0].hashEnabledField.expectUnchecked();
  await customerIds[0].authenticatedStateField.expectValue("");
  await customerIds[0].primaryField.expectUnchecked();
  await customerIds[0].deleteButton.expectDisabled();
});

test("shows error for namespace value that is a duplicate", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy99",
      customerIds: [
        {
          namespace: "CORE",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hashEnabled: true
        }
      ]
    }
  });

  await addCustomerIdButton.click();
  await customerIds[1].namespaceField.typeText("CORE");
  await customerIds[1].idField.typeText("zyx");
  await customerIds[1].namespaceField.expectError();
});

test("shows error for primary value of true that is a duplicate", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy99",
      customerIds: [
        {
          namespace: "CORE",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: true,
          hashEnabled: true
        }
      ]
    }
  });

  await addCustomerIdButton.click();
  await customerIds[1].primaryField.click();
  await customerIds[1].idField.typeText("zyx");
  await customerIds[1].primaryField.expectError();
});

test("shows error for blank required fields", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: null
  });

  await extensionViewController.expectIsNotValid();
  await customerIds[0].namespaceField.expectError();
  await customerIds[0].idField.expectError();
  await customerIds[0].authenticatedStateField.expectError();
});

test("deletes customer id", async () => {
  await extensionViewController.init({
    extensionSettings: mockExtensionSettings,
    settings: {
      instanceName: "alloy99",
      customerIds: [
        {
          namespace: "CORE",
          id: "wvg",
          authenticatedState: "loggedOut",
          primary: false,
          hashEnabled: true
        },
        {
          namespace: "AAID",
          id: "zyx",
          authenticatedState: "authenticated",
          primary: true,
          hashEnabled: false
        }
      ]
    }
  });

  await customerIds[0].deleteButton.click();
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    instanceName: "alloy99",
    customerIds: [
      {
        namespace: "AAID",
        id: "zyx",
        authenticatedState: "authenticated",
        primary: true,
        hashEnabled: false
      }
    ]
  });
});
