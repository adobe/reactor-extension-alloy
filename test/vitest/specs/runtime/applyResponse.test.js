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

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import createNetworkLogger from '../../helpers/runtime/createNetworkLogger';
import addHtmlToBody from '../../helpers/runtime/addHtmlToBody';
import appendLaunchLibrary from '../../helpers/runtime/appendLaunchLibrary';
import { createTestPage } from '../../helpers/utils/testUtils';

const container = {
  extensions: {
    "adobe-alloy": {
      displayName: "Adobe Experience Platform Web SDK",
      settings: {
        instances: [
          {
            name: "alloy",
            edgeConfigId: "bc1a10e0-aee4-4e0e-ac5b-cdbb9abbec83:AditiTest",
            thirdPartyCookiesEnabled: false,
          },
        ],
      },
    },
  },
  dataElements: {
    responseBody: {
      settings: {
        path: "responseBody",
      },
      cleanText: false,
      forceLowerCase: false,
      modulePath: "sandbox/javascriptVariable.js",
      storageDuration: "",
    },
  },
  rules: [
    {
      id: "RL1651248059877",
      name: "Apply Response",
      events: [
        {
          modulePath: "sandbox/click.js",
          settings: {},
        },
      ],
      actions: [
        {
          modulePath: "adobe-alloy/dist/lib/actions/applyResponse/index.js",
          settings: {
            instanceName: "alloy",
            responseBody: "%responseBody%",
            renderDecisions: true,
          },
        },
      ],
    },
  ],
  property: {
    name: "Sandbox property",
    settings: {
      id: "PR12345",
      domains: ["adobe.com", "example.com"],
      undefinedVarsReturnEmpty: false,
    },
  },
  company: {
    orgId: "5BFE274A5F6980A50A495C08@AdobeOrg",
  },
  environment: {
    id: "EN00000000000000000000000000000000",
    stage: "development",
  },
  buildInfo: {
    turbineVersion: "27.2.1",
    turbineBuildDate: "2022-05-27T22:57:44.929Z",
    buildDate: "2022-05-27T22:57:44.929Z",
    environment: "development",
  },
};

describe('Apply Response', () => {
  const networkLogger = createNetworkLogger();
  
  beforeAll(() => {
    // Create test page
    createTestPage();
    // Start network logger
    networkLogger.start();
  });

  afterAll(() => {
    // Stop network logger
    networkLogger.stop();
  });

  afterEach(() => {
    // Reset network logger
    networkLogger.reset();
  });

  it('applies response with personalization content', async () => {
    try {
      // Add HTML container for personalization
      await addHtmlToBody('<div id="personalization-container">Original content</div>');
      
      // Setup response body directly on window
      window.responseBody = {
        requestId: "1483b3db-be86-41a9-8018-1afa88fa0a81",
        handle: [
          {
            payload: [
              {
                id: "AT:eyJhY3Rpdml0eUlkIjoiMTI3MDIwIiwiZXhwZXJpZW5jZUlkIjoiMCJ9",
                scope: "__view__",
                scopeDetails: {
                  decisionProvider: "TGT",
                  activity: {
                    id: "127020"
                  },
                  experience: {
                    id: "0"
                  },
                  strategies: [
                    {
                      algorithmID: "0",
                      trafficType: "0"
                    }
                  ],
                  characteristics: {
                    eventToken: "hrHwTaU9pLCYk0byWkq392qipfsIHvVzTQxHolz2IpTMromRrB5ztP5VMxjHbs7c6qPG9UF4rvQTJZniWgqbOw=="
                  }
                },
                items: [
                  {
                    id: "0",
                    schema: "https://ns.adobe.com/personalization/dom-action",
                    meta: {
                      experience: {
                        id: "0"
                      },
                      activity: {
                        id: "127020"
                      },
                      offer: {
                        name: "Default Content",
                        id: "0"
                      }
                    },
                    data: {
                      type: "setHtml",
                      format: "application/vnd.adobe.target.dom-action",
                      content: "This is personalized content.",
                      selector: "#personalization-container",
                      prehidingSelector: "#personalization-container"
                    }
                  }
                ]
              }
            ],
            type: "personalization:decisions"
          }
        ]
      };

      // Append launch library
      await appendLaunchLibrary(container);

      // Simulate click event
      const personalizationContainer = document.getElementById('personalization-container');
      personalizationContainer.click();

      // Wait for personalization to be applied
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify personalization content was applied
      expect(personalizationContainer.textContent).toBe('This is personalized content.');
    } catch (error) {
      throw new Error(`Failed to apply personalization: ${error.message}`);
    }
  });
}); 