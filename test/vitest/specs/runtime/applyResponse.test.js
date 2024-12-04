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

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mockRuntime, cleanupMockRuntime, flushPromises } from '../../testUtils';
import applyResponse from '../../../../src/view/actions/applyResponse';

describe('Apply Response', () => {
  let container;

  beforeEach(() => {
    container = mockRuntime();
  });

  afterEach(() => {
    cleanupMockRuntime();
  });

  test('applies response with personalization content', async () => {
    const settings = {
      instanceName: 'alloy',
      response: {
        handle: [
          {
            type: 'personalization:decisions',
            payload: [
              {
                id: 'AT:eyJhY3Rpdml0eUlkIjoiMTExMTExIiwiZXhwZXJpZW5jZUlkIjoiMCJ9',
                scope: 'sample-json-offer',
                items: [
                  {
                    schema: 'https://ns.adobe.com/personalization/dom-action',
                    data: {
                      type: 'setHtml',
                      selector: '#personalization-container',
                      content: 'Hello World',
                      prehidingSelector: '#personalization-container'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    await applyResponse({ settings });
    await flushPromises();

    // Verify content was applied
    const container = document.getElementById('personalization-container');
    expect(container.innerHTML).toBe('Hello World');
  }, { timeout: 5000 });
}); 