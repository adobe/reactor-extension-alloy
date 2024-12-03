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

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';
import { createExtensionBridgeMock, setupGlobalExtensionBridge } from '../mocks/extensionBridgeMock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preventSpecificErrorsFromFailingTestsPath = path.join(
  __dirname,
  '../../../functional/helpers/clientScripts/preventSpecificErrorsFromFailingTests.js'
);

const extensionBridgeMockPath = path.join(
  __dirname,
  '../../../functional/helpers/clientScripts/extensionBridgeMock.js'
);

/**
 * Creates a test fixture for extension view testing.
 * @param {Object} options The fixture options.
 * @param {string} options.title The title of the test suite.
 * @param {string} options.viewPath The path to the view HTML file.
 * @param {boolean} [options.requiresAdobeIOIntegration=false] Whether the view requires Adobe IO integration.
 * @param {Object[]} [options.requestHooks=[]] Additional request hooks for MSW.
 * @param {boolean} [options.only=false] Whether to run only this test suite.
 */
export default function createExtensionViewFixture({
  title,
  viewPath,
  requiresAdobeIOIntegration = false,
  requestHooks = [],
  only = false
}) {
  const testFn = only ? describe.only : describe;

  testFn(title, () => {
    const server = setupServer();
    let container;
    let mockInstance;

    beforeAll(() => {
      // Start MSW server
      server.listen({ onUnhandledRequest: 'error' });

      // Create test container
      container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);

      // Create and setup extension bridge mock
      mockInstance = createExtensionBridgeMock();
      setupGlobalExtensionBridge(mockInstance);

      // Mock extension bridge request
      server.use(
        rest.get(
          'https://assets.adobedtm.com/activation/reactor/extensionbridge/extensionbridge.min.js',
          (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.text(fs.readFileSync(extensionBridgeMockPath, 'utf-8'))
            );
          }
        )
      );

      // Add Adobe IO integration mock if needed
      if (requiresAdobeIOIntegration) {
        const adobeIMSScript = document.createElement('script');
        adobeIMSScript.textContent = `
          window.adobeIMS = {
            isSignedInUser: () => true,
            getAccessToken: () => 'test-token'
          };
        `;
        document.head.appendChild(adobeIMSScript);
      }

      // Add error handling
      const errorScript = document.createElement('script');
      errorScript.textContent = fs.readFileSync(preventSpecificErrorsFromFailingTestsPath, 'utf-8');
      document.head.appendChild(errorScript);

      // Add view HTML
      const viewHtml = fs.readFileSync(
        path.join(__dirname, '../../../../dist/view', viewPath),
        'utf-8'
      );
      container.innerHTML = viewHtml;

      // Add request hooks
      requestHooks.forEach(hook => server.use(hook));
    });

    beforeEach(() => {
      // Reset MSW handlers
      server.resetHandlers();
    });

    afterEach(() => {
      // Clean up DOM
      cleanup();
    });

    afterAll(() => {
      // Clean up
      server.close();
      container?.remove();
      delete window.adobeIMS;
      delete window.extensionBridge;
    });

    return {
      mockInstance,
      container
    };
  });
} 