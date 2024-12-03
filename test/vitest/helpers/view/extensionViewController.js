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

/**
 * Gets the current settings from the extension view.
 * @returns {Promise<Object>} The current settings
 */
export const getSettings = async () => {
  return window.initializeExtensionViewPromise.then((extensionView) => {
    return extensionView.getSettings();
  });
};

/**
 * Initializes the extension view with the provided settings.
 * @param {Object} additionalInitInfo Additional initialization info
 * @returns {Promise<void>}
 */
export const init = async (additionalInitInfo = {}) => {
  // Mock the extension view initialization for Vitest
  window.initializeExtensionViewPromise = Promise.resolve({
    getSettings: () => Promise.resolve(additionalInitInfo),
    init: () => Promise.resolve(),
  });

  await window.initializeExtensionViewPromise;
};

/**
 * Validates the current settings.
 * @returns {Promise<boolean>} Whether the settings are valid
 */
export const validate = async () => {
  return window.initializeExtensionViewPromise.then((extensionView) => {
    return extensionView.validate();
  });
};

export default {
  getSettings,
  init,
  validate
}; 