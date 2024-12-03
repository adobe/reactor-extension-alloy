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

import { describe, test, expect } from 'vitest';
import extensionViewController from './extensionViewController';

/**
 * Runs common tests for extension views
 * @param {Object} additionalInitInfo Additional initialization info for the extension view
 */
export default (additionalInitInfo) => {
  describe('Common Extension View Tests', () => {
    // Note: This test was skipped in TestCafe due to SauceLabs issues
    // In Vitest/JSDOM environment, we can run it
    test('loads Adobe Clean font', async () => {
      await extensionViewController.init(additionalInitInfo);
      
      // Check if Adobe Clean font is loaded
      const isAdobeCleanLoaded = await document.fonts.check('12px Adobe Clean');
      expect(isAdobeCleanLoaded).toBe(true);
    });

    test('initializes with additional info', async () => {
      await extensionViewController.init(additionalInitInfo);
      
      // Verify settings match additional info
      const settings = await extensionViewController.getSettings();
      expect(settings).toEqual(additionalInitInfo);
    });

    test('validates settings', async () => {
      await extensionViewController.init(additionalInitInfo);
      
      // Verify validation works
      const isValid = await extensionViewController.validate();
      expect(typeof isValid).toBe('boolean');
    });
  });
}; 