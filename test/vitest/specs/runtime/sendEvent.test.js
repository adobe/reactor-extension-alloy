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

import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import createNetworkLogger from '../../helpers/runtime/createNetworkLogger';
import appendLaunchLibrary from '../../helpers/runtime/appendLaunchLibrary';
import { createTestPage } from '../../helpers/utils/testUtils';
import { TEST_PAGE } from '../../helpers/runtime/constants/url';

const networkLogger = createNetworkLogger();

const container = {
  extensions: {
    "adobe-alloy": {
      displayName: "Adobe Experience Platform Web SDK",
      settings: {
        instances: [
          {
            name: "alloy",
            edgeConfigId: "bc1a10e0-aee4-4e0e-ac5b-cdbb9abbec83:AditiTest",
            stagingEdgeConfigId: "bc1a10e0-aee4-4e0e-ac5b-cdbb9abbec83:stage",
            debugEnabled: true,
          },
        ],
      },
    },
  },
  dataElements: {
    idmap: {
      settings: {
        AdCloud: [
          {
            id: "1234",
            authenticatedState: "ambiguous",
            primary: false,
          },
        ],
      },
      cleanText: false,
      forceLowerCase: false,
      modulePath: "adobe-alloy/dist/lib/dataElements/identityMap/index.js",
      storageDuration: "",
    },
  },
  rules: [
    {
      id: "RL1651248059877",
      name: "Page Top",
      events: [
        {
          modulePath: "sandbox/pageTop.js",
          settings: {},
        },
      ],
      actions: [
        {
          modulePath: "adobe-alloy/dist/lib/actions/sendEvent/index.js",
          settings: {
            instanceName: "alloy",
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
    turbineBuildDate: "2022-04-29T16:01:37.616Z",
    buildDate: "2022-04-29T16:01:37.616Z",
    environment: "development",
  },
};

describe('Send event', () => {
  beforeAll(() => {
    console.log('Setting up test environment...');
    // Create test page
    createTestPage();
    // Start network logger
    networkLogger.start();
    console.log('Network logger started');
  });

  afterAll(() => {
    console.log('Cleaning up test environment...');
    // Stop network logger
    networkLogger.stop();
  });

  afterEach(() => {
    // Reset network logger
    networkLogger.clearLogs();
  });

  test('sends an event', async () => {
    console.log('Starting send event test...');
    await appendLaunchLibrary(container);
    console.log('Launch library appended');

    try {
      console.log('Waiting for network request...');
      await networkLogger.waitForRequestCount(1, 10000);
      console.log('Network request detected');
      
      const request = networkLogger.edgeEndpointLogs.requests[0];
      expect(request.url).toMatch(/v1\/(interact|collect)/);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
}); 