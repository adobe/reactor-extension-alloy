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
let edgeDomainField;
let edgeConfigInputMethodFreeformRadio;
let edgeConfigInputMethodSelectRadio;
let productionEnvironmentTextfield;
let stagingEnvironmentTextfield;
let developmentEnvironmentTextfield;
let productionDatastreamField;
let stagingDatastreamField;
let developmentDatastreamField;
let orgIdRestoreButton;
let edgeDomainRestoreButton;

describe("Config general settings and datastream section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    nameField = view.getByTestId("nameField");
    orgIdField = view.getByTestId("orgIdField");
    edgeDomainField = view.getByTestId("edgeDomainField");
    edgeConfigInputMethodFreeformRadio = view.getByTestId(
      "edgeConfigInputMethodFreeformRadio",
    );
    edgeConfigInputMethodSelectRadio = view.getByTestId(
      "edgeConfigInputMethodSelectRadio",
    );
    productionEnvironmentTextfield = view.getByTestId(
      "productionEnvironmentTextfield",
    );
    stagingEnvironmentTextfield = view.getByTestId(
      "stagingEnvironmentTextfield",
    );
    developmentEnvironmentTextfield = view.getByTestId(
      "developmentEnvironmentTextfield",
    );
    productionDatastreamField = view.getByTestId("productionDatastreamField");
    stagingDatastreamField = view.getByTestId("stagingDatastreamField");
    developmentDatastreamField = view.getByTestId("developmentDatastreamField");
    orgIdRestoreButton = view.getByTestId("orgIdRestoreButton");
    edgeDomainRestoreButton = view.getByTestId("edgeDomainRestoreButton");
  });

  afterEach(() => {
    cleanup();
  });

  it("sets free form values from settings", async () => {
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            orgId: "123456@AdobeOrg",
            edgeDomain: "custom.example.com",
            edgeConfigId: "prod-datastream-id",
            stagingEdgeConfigId: "staging-datastream-id",
            developmentEdgeConfigId: "dev-datastream-id",
          },
        ],
      },
    });

    await expect.element(nameField).toHaveValue("alloy");
    await expect.element(orgIdField).toHaveValue("123456@AdobeOrg");
    await expect.element(edgeDomainField).toHaveValue("custom.example.com");

    await expect.element(edgeConfigInputMethodFreeformRadio).toBeChecked();

    await expect
      .element(productionEnvironmentTextfield)
      .toHaveValue("prod-datastream-id");
    await expect
      .element(stagingEnvironmentTextfield)
      .toHaveValue("staging-datastream-id");
    await expect
      .element(developmentEnvironmentTextfield)
      .toHaveValue("dev-datastream-id");
  });

  it("sets list form values from settings", async () => {
    await driver.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            orgId: "123456@AdobeOrg",
            edgeDomain: "custom.example.com",
            edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            stagingEdgeConfigId: "0a106b4d-1937-4196-a64d-4a324e972459",
            developmentEdgeConfigId: "77469821-5ead-4045-97b6-acfd889ded6b",
          },
        ],
      },
    });

    await expect
      .element(productionDatastreamField)
      .toHaveTextContent(/analytics enabled/i);
    await expect
      .element(stagingDatastreamField)
      .toHaveTextContent(/aep-edge-samples/i);
    await expect
      .element(developmentDatastreamField)
      .toHaveTextContent(/datastream enabled/i);
  });

  it("updates free form values and saves to settings", async () => {
    await driver.init(buildSettings());

    await nameField.fill("customInstance");
    await orgIdField.fill("987654@AdobeOrg");
    await edgeDomainField.fill("firstparty.example.com");

    await edgeConfigInputMethodFreeformRadio.click();

    await productionEnvironmentTextfield.fill("new-prod-datastream");
    await stagingEnvironmentTextfield.fill("new-staging-datastream");
    await developmentEnvironmentTextfield.fill("new-dev-datastream");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0])
      .toMatchObject({
        name: "customInstance",
        orgId: "987654@AdobeOrg",
        edgeDomain: "firstparty.example.com",
        edgeConfigId: "new-prod-datastream",
        stagingEdgeConfigId: "new-staging-datastream",
        developmentEdgeConfigId: "new-dev-datastream",
      });
  });

  it("updates list form values and saves to settings", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeConfigId: "0a106b4d-1937-4196-a64d-4a324e972459",
            sandbox: "prod",
            stagingEdgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
            stagingSandbox: "prod",
            developmentEdgeConfigId: "77469821-5ead-4045-97b6-acfd889ded6b",
            developmentSandbox: "prod",
          },
        ],
      }),
    );

    await productionDatastreamField.selectOption("analytics enabled");
    await stagingDatastreamField.selectOption("datastream enabled");
    await developmentDatastreamField.selectOption("aep-edge-samples");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0])
      .toMatchObject({
        edgeConfigId: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
        stagingEdgeConfigId: "77469821-5ead-4045-97b6-acfd889ded6b",
        developmentEdgeConfigId: "0a106b4d-1937-4196-a64d-4a324e972459",
      });
  });

  it("shows default values when no settings are provided", async () => {
    await driver.init({ settings: null });

    await expect.element(nameField).toHaveValue("alloy");
    await expect.element(orgIdField).toHaveValue("1234@AdobeOrg");
    await expect.element(edgeDomainField).toHaveValue("edge.adobedc.net");
  });

  it("does not save default values to settings", async () => {
    await driver.init({ settings: null });

    await driver.expectSettings((s) => s.instances[0].name).toBe("alloy");
    await driver.expectSettings((s) => s.instances[0].orgId).toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].edgeDomain)
      .toBeUndefined();
  });

  it("allows data element in name field", async () => {
    await driver.init(buildSettings());

    await nameField.fill("%instanceName%");
    await driver.tab();

    await expect.element(nameField).toHaveValue("%instanceName%");

    await driver
      .expectSettings((s) => s.instances[0].name)
      .toBe("%instanceName%");
  });

  it("allows data element in IMS organization ID field", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            orgId: "%myOrgId%",
          },
        ],
      }),
    );

    await expect.element(orgIdField).toHaveValue("%myOrgId%");

    await driver.expectSettings((s) => s.instances[0].orgId).toBe("%myOrgId%");
  });

  it("allows data element in edge domain field", async () => {
    await driver.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            edgeDomain: "%myEdgeDomain%",
          },
        ],
      }),
    );

    await expect.element(edgeDomainField).toHaveValue("%myEdgeDomain%");

    await driver
      .expectSettings((s) => s.instances[0].edgeDomain)
      .toBe("%myEdgeDomain%");
  });

  ["production", "staging", "development"].forEach((name) => {
    it(`allows data element in ${name} datastream field`, async () => {
      await driver.init({
        settings: {
          components: {
            eventMerge: false,
          },
          instances: [
            {
              name: "alloy",
              [`${name === "production" ? "edgeConfigId" : `${name}EdgeConfigId`}`]: `%${name}Datastream%`,
            },
          ],
        },
      });

      await expect.element(edgeConfigInputMethodFreeformRadio).toBeChecked();

      const field = view.getByTestId(`${name}EnvironmentTextfield`);
      await expect.element(field).toHaveValue(`%${name}Datastream%`);

      await driver
        .expectSettings(
          (s) =>
            s.instances[0][
              `${name === "production" ? "edgeConfigId" : `${name}EdgeConfigId`}`
            ],
        )
        .toBe(`%${name}Datastream%`);
    });
  });

  it("sets default edge domain to tenant-specific domain when tenant ID is provided on new extension", async () => {
    await driver.init({
      company: {
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
        tenantId: "mytenant",
      },
      propertySettings: { id: "PR1234" },
      tokens: { imsAccess: "IMS_ACCESS" },
    });

    await expect
      .element(edgeDomainField)
      .toHaveValue("mytenant.data.adobedc.net");
  });

  it("sets default edge domain to edge.adobedc.net when editing existing instance without saved edgeDomain", async () => {
    await driver.init({
      company: {
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
        tenantId: "mytenant",
      },
      propertySettings: { id: "PR1234" },
      tokens: { imsAccess: "IMS_ACCESS" },
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    await expect.element(edgeDomainField).toHaveValue("edge.adobedc.net");
  });

  it("saves tenant-specific edge domain even when it matches the default on new extension", async () => {
    await driver.init({
      company: {
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
        tenantId: "mytenant",
      },
      propertySettings: { id: "PR1234" },
      tokens: { imsAccess: "IMS_ACCESS" },
    });

    await driver
      .expectSettings((s) => s.instances[0].edgeDomain)
      .toBe("mytenant.data.adobedc.net");
  });

  describe("validation", () => {
    it("validates that name is required", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await nameField.fill("");
      await driver.tab();

      await expect.element(nameField).not.toBeValid();
      await expect
        .element(nameField)
        .toHaveAccessibleDescription(/please specify a name/i);

      await driver.expectValidate().toBe(false);
    });

    it("validates that IMS organization ID is required", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await orgIdField.fill("");
      await driver.tab();

      await expect.element(orgIdField).not.toBeValid();
      await expect
        .element(orgIdField)
        .toHaveAccessibleDescription(/please specify an IMS organization ID/i);

      await driver.expectValidate().toBe(false);
    });

    it("validates that edge domain is required", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await edgeDomainField.fill("");
      await driver.tab();

      await expect.element(edgeDomainField).not.toBeValid();
      await expect
        .element(edgeDomainField)
        .toHaveAccessibleDescription(/please specify an edge domain/i);

      await driver.expectValidate().toBe(false);
    });

    it("validates that name cannot be all numeric", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await nameField.fill("123");
      await driver.tab();

      await expect.element(nameField).not.toBeValid();
      await expect
        .element(nameField)
        .toHaveAccessibleDescription(/please provide a non-numeric name/i);

      await driver.expectValidate().toBe(false);
    });

    it("validates that name cannot be property existing on window object", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await nameField.fill("addEventListener");
      await driver.tab();

      await expect.element(nameField).not.toBeValid();
      await expect
        .element(nameField)
        .toHaveAccessibleDescription(
          /please provide a name that does not conflict with a property already found on the window object/i,
        );

      await driver.expectValidate().toBe(false);
    });

    it("validates that production datastream is required in freeform mode", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await edgeConfigInputMethodFreeformRadio.click();

      await productionEnvironmentTextfield.fill("");
      await driver.tab();

      await expect.element(productionEnvironmentTextfield).not.toBeValid();
      await expect
        .element(productionEnvironmentTextfield)
        .toHaveAccessibleDescription(/please specify a datastream/i);

      await driver.expectValidate().toBe(false);
    });

    it("validates staging and development datastreams are optional", async () => {
      await driver.init(buildSettings());

      await driver.expectValidate().toBe(true);

      await edgeConfigInputMethodFreeformRadio.click();

      await productionEnvironmentTextfield.fill("prod-datastream-id");

      await stagingEnvironmentTextfield.fill("");
      await expect.element(stagingEnvironmentTextfield).toBeValid();

      await developmentEnvironmentTextfield.fill("");
      await expect.element(developmentEnvironmentTextfield).toBeValid();
      await driver.tab();

      await driver.expectValidate().toBe(true);
    });

    it("accepts data elements in all fields", async () => {
      await driver.init(buildSettings());

      await nameField.fill("%instanceName%");
      await orgIdField.fill("%myOrgId%");
      await edgeDomainField.fill("%myEdgeDomain%");

      await edgeConfigInputMethodFreeformRadio.click();

      await productionEnvironmentTextfield.fill("%prodDatastream%");
      await stagingEnvironmentTextfield.fill("%stagingDatastream%");
      await developmentEnvironmentTextfield.fill("%devDatastream%");
      await driver.tab();

      await driver.expectValidate().toBe(true);
    });
  });

  describe("restore default buttons", () => {
    it("restores default IMS organization ID when button is clicked", async () => {
      await driver.init(buildSettings());

      const originalOrgId = orgIdField.element().value;
      await orgIdField.fill("custom@AdobeOrg");
      await driver.tab();

      await expect.element(orgIdField).toHaveValue("custom@AdobeOrg");

      await orgIdRestoreButton.click();

      await expect.element(orgIdField).toHaveValue(originalOrgId);
    });

    it("restores default edge domain when button is clicked", async () => {
      await driver.init(buildSettings());

      const originalEdgeDomain = edgeDomainField.element().value;
      await edgeDomainField.fill("custom.example.com");
      await driver.tab();

      await expect.element(edgeDomainField).toHaveValue("custom.example.com");

      await edgeDomainRestoreButton.click();

      await expect.element(edgeDomainField).toHaveValue(originalEdgeDomain);
    });

    it("restores default edge domain to tenant-specific domain when restore button is clicked on new instance with tenant ID", async () => {
      await driver.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await edgeDomainField.fill("custom.example.com");
      await driver.tab();

      await edgeDomainRestoreButton.click();

      await expect
        .element(edgeDomainField)
        .toHaveValue("mytenant.data.adobedc.net");
    });

    it("restores to tenant-specific default when restore button is clicked on existing instance with tenant ID", async () => {
      await driver.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
        settings: {
          components: {
            eventMerge: false,
          },
          instances: [
            {
              name: "alloy",
              edgeConfigId: "PR123",
            },
          ],
        },
      });

      await edgeDomainField.fill("custom.example.com");
      await driver.tab();

      await edgeDomainRestoreButton.click();

      await expect
        .element(edgeDomainField)
        .toHaveValue("mytenant.data.adobedc.net");
    });
  });

  describe("name change alert", () => {
    it("shows alert when instance name is changed from persisted value", async () => {
      await driver.init(
        buildSettings({
          instances: [
            {
              name: "originalName",
            },
          ],
        }),
      );

      await nameField.fill("newName");
      await driver.tab();

      await expect
        .element(
          view.getByRole("heading", {
            name: /potential problems due to name change/i,
          }),
        )
        .toBeVisible();
    });

    it("does not show alert when name is changed on a new configuration", async () => {
      await driver.init({ settings: null });

      await nameField.fill("newName");
      await driver.tab();

      await expect
        .element(
          view.getByRole("heading", {
            name: /potential problems due to name change/i,
          }),
        )
        .not.toBeInTheDocument();
    });
  });

  describe("datastream input method switching", () => {
    it("can switch between select and freeform input methods", async () => {
      await driver.init(buildSettings());

      await expect.element(edgeConfigInputMethodSelectRadio).toBeChecked();

      await edgeConfigInputMethodFreeformRadio.click();

      await expect.element(edgeConfigInputMethodFreeformRadio).toBeChecked();

      await expect.element(productionEnvironmentTextfield).toBeVisible();

      await edgeConfigInputMethodSelectRadio.click();
      await expect.element(edgeConfigInputMethodSelectRadio).toBeChecked();
    });
  });
});
