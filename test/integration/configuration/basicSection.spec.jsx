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
// eslint-disable-next-line import/no-unresolved
import { page } from "vitest/browser";
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { waitForConfigurationViewToLoad } from "../helpers/ui";
import { spectrumTextField } from "../helpers/form";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

describe("Config basic section", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  describe("edge domain defaults", () => {
    it("sets default edge domain to edge.adobedc.net when no tenant ID is provided", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe("edge.adobedc.net");
    });

    it("sets default edge domain to tenant-specific domain when tenant ID is provided on new instance", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );
    });

    it("sets default edge domain to edge.adobedc.net when editing existing instance without saved edgeDomain", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
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

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe("edge.adobedc.net");
    });

    it("uses saved custom edge domain when provided", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              edgeDomain: "custom.example.com",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe("custom.example.com");
    });

    it("uses saved tenant-specific edge domain when provided", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              edgeDomain: "mytenant.data.adobedc.net",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );
    });
  });

  describe("edge domain restore button", () => {
    it("restores default edge domain value when restore button is clicked (no tenant)", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      await edgeDomainField.fill("custom.example.com");

      const restoreButton = page.getByTestId("edgeDomainRestoreButton");
      await restoreButton.click();

      expect(await edgeDomainField.getValue()).toBe("edge.adobedc.net");
    });

    it("restores default edge domain to tenant-specific domain when restore button is clicked on new instance with tenant ID", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      await edgeDomainField.fill("custom.example.com");

      const restoreButton = page.getByTestId("edgeDomainRestoreButton");
      await restoreButton.click();

      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );
    });

    it("restores to tenant-specific default when restore button is clicked on existing instance with tenant ID", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
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

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      await edgeDomainField.fill("custom.example.com");

      const restoreButton = page.getByTestId("edgeDomainRestoreButton");
      await restoreButton.click();

      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );
    });
  });

  describe("edge domain settings persistence", () => {
    it("saves tenant-specific edge domain even when it matches the default on new extension", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await waitForConfigurationViewToLoad(view);

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBe(
        "mytenant.data.adobedc.net",
      );
    });

    it("does not save legacy edge domain when it matches the default", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad(view);

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBeUndefined();
    });

    it("saves custom edge domain when different from default", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(buildSettings());

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      await edgeDomainField.fill("custom.example.com");

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBe("custom.example.com");
    });

    it("does not save legacy domain when user manually sets it on new extension with tenant ID", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
        company: {
          orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      await edgeDomainField.fill("edge.adobedc.net");

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBeUndefined();
    });
  });

  describe("integration scenarios", () => {
    it("handles brand new extension with tenantId", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init({
        company: {
          orgId: "TEST_ORG@AdobeOrg",
          tenantId: "mytenant",
        },
        propertySettings: { id: "PR1234" },
        tokens: { imsAccess: "IMS_ACCESS" },
      });

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBe(
        "mytenant.data.adobedc.net",
      );
    });

    it("handles loading old instance without saved edgeDomain", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "oldinstance",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe("edge.adobedc.net");

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBeUndefined();
    });

    it("handles loading instance with custom domain", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              edgeDomain: "custom.example.com",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe("custom.example.com");

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBe("custom.example.com");
    });

    it("handles loading instance with tenant-specific domain saved", async () => {
      const view = await renderView(ConfigurationView);

      extensionBridge.init(
        buildSettings({
          instances: [
            {
              name: "alloy",
              edgeDomain: "mytenant.data.adobedc.net",
            },
          ],
        }),
      );

      await waitForConfigurationViewToLoad(view);

      const edgeDomainField = spectrumTextField("edgeDomainField");
      expect(await edgeDomainField.getValue()).toBe(
        "mytenant.data.adobedc.net",
      );

      const settings = await extensionBridge.getSettings();
      expect(settings.instances[0].edgeDomain).toBe(
        "mytenant.data.adobedc.net",
      );
    });
  });
});
