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

import { render, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a test fixture for a React component
 * @param {Object} options Options for creating the fixture
 * @param {string} options.title The title of the test suite
 * @returns {Object} The test fixture
 */
const createComponentFixture = ({ title }) => {
  describe(title, () => {
    beforeEach(() => {
      // Create test container
      const container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);
    });

    afterEach(() => {
      // Clean up DOM
      cleanup();
      const container = document.getElementById('test-container');
      if (container) {
        container.remove();
      }
    });

    return {
      getContainer: () => document.getElementById('test-container'),
      getFixturePath: () => path.join(__dirname, '../../../../componentFixtureDist/fixture.html')
    };
  });
};

export default createComponentFixture; 