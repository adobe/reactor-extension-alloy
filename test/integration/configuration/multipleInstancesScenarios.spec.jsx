/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { describe, it, beforeEach, afterEach, expect } from "vitest";

import useView from "../helpers/useView";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { buildSettings } from "../helpers/settingsUtils";

let view;
let driver;
let cleanup;
let nameField;
let orgIdField;
let productionEnvironmentTextfield;
let addInstanceButton;
let deleteInstanceButton;
let cancelDeleteInstanceButton;
let confirmDeleteInstanceButton;

describe("Config Multiple Instances", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    nameField = view.getByTestId("nameField");
    orgIdField = view.getByTestId("orgIdField");
    productionEnvironmentTextfield = view.getByTestId(
      "productionEnvironmentTextfield",
    );
    addInstanceButton = view.getByTestId("addInstanceButton");
    deleteInstanceButton = view.getByTestId("deleteInstanceButton");
    cancelDeleteInstanceButton = view.getByTestId("cancelDeleteInstanceButton");
    confirmDeleteInstanceButton = view.getByTestId(
      "confirmDeleteInstanceButton",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("prevents creating two instances with the same name", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
          },
        ],
      }),
    );

    expect(await driver.validate()).toBe(true);

    await addInstanceButton.click();

    const secondTab = view.getByRole("tab", { name: "alloy2" });
    await secondTab.click();

    // Change the name back to "alloy" to create a duplicate
    await nameField.fill("alloy");

    expect(await driver.validate()).toBe(false);

    await expect.element(nameField).not.toBeValid();
    await expect
      .element(nameField)
      .toHaveAccessibleDescription(
        /please provide a name unique from those used for other instances/i,
      );
  });

  it("prevents creating two instances with the org name", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
          },
        ],
      }),
    );

    expect(await driver.validate()).toBe(true);

    await addInstanceButton.click();

    const secondTab = view.getByRole("tab", { name: "alloy" }).nth(1);
    await expect.element(secondTab).toBeVisible();
    await secondTab.click();

    await nameField.fill("alloy2");

    expect(await driver.validate()).toBe(false);

    await expect.element(orgIdField).not.toBeValid();
    await expect
      .element(orgIdField)
      .toHaveAccessibleDescription(
        /please provide an IMS organization ID unique from those used for other instances/i,
      );
  });

  it("prevents creating two instances with the same edge config id", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
          },
          {
            name: "alloy2",
            orgId: "x@AdobeOrg",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
          },
        ],
      }),
    );

    expect(await driver.validate()).toBe(true);

    const secondTab = view.getByRole("tab", { name: "alloy" }).nth(1);
    await expect.element(secondTab).toBeVisible();
    await secondTab.click();

    expect(await driver.validate()).toBe(true);

    await productionEnvironmentTextfield.fill(
      "2fdb3763-0507-42ea-8856-e91bf3b64faa",
    );

    expect(await driver.validate()).toBe(false);

    await expect.element(productionEnvironmentTextfield).not.toBeValid();
    await expect
      .element(productionEnvironmentTextfield)
      .toHaveAccessibleDescription(
        /please provide a value unique from those used for other instances/i,
      );
  });

  it("allows creating two instances with different names and different org ids", async () => {
    // Start with two instances that have different names, different orgIds, and valid configs
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
            orgId: "ORG1@AdobeOrg",
          },
          {
            name: "alloy2",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG2@AdobeOrg",
          },
        ],
      },
    });

    expect(await driver.validate()).toBe(true);

    const settings = await driver.getSettings();
    expect(settings.instances).toHaveLength(2);
    expect(settings.instances[0].name).toBe("alloy");
    expect(settings.instances[0].orgId).toBe("ORG1@AdobeOrg");
    expect(settings.instances[1].name).toBe("alloy2");
    expect(settings.instances[1].orgId).toBe("ORG2@AdobeOrg");
  });

  it("allows deleting an instance", async () => {
    // Start with two instances
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
            orgId: "ORG1@AdobeOrg",
          },
          {
            name: "alloy2",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG2@AdobeOrg",
          },
        ],
      },
    });

    expect(await driver.validate()).toBe(true);

    const firstTab = view.getByRole("tab", { name: "alloy" }).nth(0);
    await firstTab.click();

    await expect.element(deleteInstanceButton).toBeVisible();

    // Click the delete button on the first instance
    await deleteInstanceButton.click();

    // Verify the confirmation dialog appears
    await expect.element(cancelDeleteInstanceButton).toBeVisible();
    await expect.element(confirmDeleteInstanceButton).toBeVisible();

    // First, test canceling the deletion
    await cancelDeleteInstanceButton.click();

    // Verify we still have two instances after canceling
    let settings = await driver.getSettings();
    expect(settings.instances).toHaveLength(2);
    expect(settings.instances[0].name).toBe("alloy");
    expect(settings.instances[0].orgId).toBe("ORG1@AdobeOrg");
    expect(settings.instances[1].name).toBe("alloy2");
    expect(settings.instances[1].orgId).toBe("ORG2@AdobeOrg");

    // Now delete for real - click delete button again
    await deleteInstanceButton.click();

    // Confirm the deletion
    await confirmDeleteInstanceButton.click();

    // Verify we now have only one instance (the second one, "alloy2")
    settings = await driver.getSettings();
    expect(settings.instances).toHaveLength(1);
    expect(settings.instances[0].name).toBe("alloy2");
    expect(settings.instances[0].orgId).toBe("ORG2@AdobeOrg");

    // Verify the form is still valid
    expect(await driver.validate()).toBe(true);
  });

  it("allows deleting first instance", async () => {
    // Start with two instances
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
            orgId: "ORG1@AdobeOrg",
          },
          {
            name: "alloy2",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG2@AdobeOrg",
          },
          {
            name: "alloy3",
            edgeConfigId: "4fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG3@AdobeOrg",
          },
        ],
      },
    });

    expect(await driver.validate()).toBe(true);

    const firstTab = view.getByRole("tab", { name: "alloy" }).nth(0);
    await firstTab.click();

    await expect.element(deleteInstanceButton).toBeVisible();

    await deleteInstanceButton.click();

    await confirmDeleteInstanceButton.click();

    const settings = await driver.getSettings();

    expect(settings.instances).toHaveLength(2);
    expect(await driver.validate()).toBe(true);

    // Check that a tab is still visible in the page
    await expect.element(nameField).toHaveValue("alloy2");

    // Check that the confirmation dialog is closed
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    expect(() => {
      confirmDeleteInstanceButton.element();
    }).toThrow();
  });

  it("allows deleting last instance", async () => {
    // Start with two instances
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
            orgId: "ORG1@AdobeOrg",
          },
          {
            name: "alloy2",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG2@AdobeOrg",
          },
          {
            name: "alloy3",
            edgeConfigId: "4fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG3@AdobeOrg",
          },
        ],
      },
    });

    expect(await driver.validate()).toBe(true);

    const lastTab = view.getByRole("tab", { name: "alloy" }).nth(2);
    await lastTab.click();

    await expect.element(deleteInstanceButton).toBeVisible();

    await deleteInstanceButton.click();

    await confirmDeleteInstanceButton.click();

    const settings = await driver.getSettings();

    expect(settings.instances).toHaveLength(2);
    expect(await driver.validate()).toBe(true);

    // Check that a tab is still visible in the page
    await expect.element(nameField).toHaveValue("alloy2");

    // Check that the confirmation dialog is closed
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    expect(() => {
      confirmDeleteInstanceButton.element();
    }).toThrow();
  });

  it("allows deleting the middle instance", async () => {
    // Start with two instances
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            sandbox: "prod",
            orgId: "ORG1@AdobeOrg",
          },
          {
            name: "alloy2",
            edgeConfigId: "3fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG2@AdobeOrg",
          },
          {
            name: "alloy3",
            edgeConfigId: "4fdb3763-0507-42ea-8856-e91bf3b64fbb",
            sandbox: "prod",
            orgId: "ORG3@AdobeOrg",
          },
        ],
      },
    });

    expect(await driver.validate()).toBe(true);

    const middleTab = view.getByRole("tab", { name: "alloy" }).nth(1);
    await middleTab.click();

    await expect.element(deleteInstanceButton).toBeVisible();

    await deleteInstanceButton.click();

    await confirmDeleteInstanceButton.click();

    const settings = await driver.getSettings();

    expect(settings.instances).toHaveLength(2);
    expect(await driver.validate()).toBe(true);

    // Check that a tab is still visible in the page
    await expect.element(nameField).toHaveValue("alloy");

    // Check that the confirmation dialog is closed
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    expect(() => {
      confirmDeleteInstanceButton.element();
    }).toThrow();
  });
});
