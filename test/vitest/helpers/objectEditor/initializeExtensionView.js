/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { vi } from "vitest";
import { mockExtensionBridge } from "../components/mockExtensionBridge";

/**
 * Initializes the extension view with the provided settings and schema.
 * @param {Object} settings The initial settings.
 * @param {Object} schema The XDM schema.
 * @returns {Promise<void>}
 */
export default async function initializeExtensionView(
  settings = null,
  schema = null,
) {
  const extensionBridge = mockExtensionBridge();

  // Mock the openCodeEditor method
  extensionBridge.openCodeEditor.mockImplementation(({ code }) => {
    return Promise.resolve(code);
  });

  // Mock the openDataElementSelector method
  extensionBridge.openDataElementSelector.mockImplementation(() => {
    return Promise.resolve("%dataElement%");
  });

  // Mock the init method
  extensionBridge.init.mockImplementation(() => {
    return Promise.resolve({
      settings,
      schema,
      propertySettings: {
        domains: ["example.com"],
      },
      company: {
        orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
      },
      tokens: {
        imsAccess: "test-token",
      },
    });
  });

  // Initialize the extension view
  window.initializeExtensionView = vi
    .fn()
    .mockImplementation(({ initInfo }) => {
      return Promise.resolve({
        init: extensionBridge.init,
        validate: vi.fn().mockResolvedValue(true),
        getSettings: vi.fn().mockResolvedValue(initInfo.settings),
      });
    });

  window.initializeExtensionViewPromise = window.initializeExtensionView({
    initInfo: { settings },
  });

  return window.initializeExtensionViewPromise;
}
