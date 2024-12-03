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

import { vi } from 'vitest';

/**
 * Creates a mock of the Reactor extension bridge for testing.
 * @returns {Object} The mocked extension bridge
 */
export const createExtensionBridgeMock = () => {
  const generateRandomValue = () => Math.round(Math.random() * 10000);

  const sharedViewMethodMocks = {
    openCodeEditor: vi.fn().mockImplementation(() => 
      Promise.resolve(`Edited Code ${generateRandomValue()}`)
    ),
    
    openRegexTester: vi.fn().mockImplementation(() => 
      Promise.resolve(`Edited Regex ${generateRandomValue()}`)
    ),
    
    openDataElementSelector: vi.fn().mockImplementation((options = {}) => {
      const value = `dataElement${generateRandomValue()}`;
      // Tokenize by default. The tokenize option must be set explicitly to false to disable it.
      return Promise.resolve(options.tokenize !== false ? `%${value}%` : value);
    })
  };

  const registeredExtensionMethods = {
    init: vi.fn(),
    getSettings: vi.fn(),
    validate: vi.fn().mockResolvedValue(true)
  };

  const extensionBridge = {
    register: vi.fn().mockReturnValue(registeredExtensionMethods),
    ...sharedViewMethodMocks
  };

  /**
   * Initialize an extension view.
   * @param {Object} options
   * @param {Object} options.initInfo - Initialization information
   * @param {Object} [options.sharedViewMethodMocks] - Methods typically provided by Reactor
   * @returns {Promise<{getSettings: Function, validate: Function}>}
   */
  const initializeExtensionView = async ({ initInfo, sharedViewMethodMocks: customMocks = {} }) => {
    Object.assign(sharedViewMethodMocks, customMocks);
    await registeredExtensionMethods.init(initInfo);

    // Simulate the rendered event
    setTimeout(() => {
      window.dispatchEvent(new Event('extension-reactor-alloy:rendered'));
    }, 0);

    return {
      getSettings: registeredExtensionMethods.getSettings,
      validate: registeredExtensionMethods.validate
    };
  };

  return {
    extensionBridge,
    initializeExtensionView,
    registeredExtensionMethods,
    sharedViewMethodMocks
  };
};

/**
 * Sets up the extension bridge mock in the global scope.
 * @param {Object} mockInstance - The mock instance returned by createExtensionBridgeMock
 */
export const setupGlobalExtensionBridge = (mockInstance) => {
  window.extensionBridge = mockInstance.extensionBridge;
  window.initializeExtensionView = mockInstance.initializeExtensionView;
};
