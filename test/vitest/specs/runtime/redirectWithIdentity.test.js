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
import getReturnedEcid from '../../helpers/runtime/getReturnedEcid';
import { TEST_PAGE, SECONDARY_TEST_PAGE } from '../../helpers/runtime/constants/url';

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
    {
      id: "RL1653692204047",
      name: "Append identity to urls",
      events: [
        {
          modulePath: "sandbox/click.js",
          settings: {},
        },
      ],
      actions: [
        {
          modulePath:
            "adobe-alloy/dist/lib/actions/redirectWithIdentity/index.js",
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
    turbineBuildDate: "2022-05-27T22:57:44.929Z",
    buildDate: "2022-05-27T22:57:44.929Z",
    environment: "development",
  },
};

describe('Redirect with identity', () => {
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

  it.skip('redirects with an identity', async () => {
    await appendLaunchLibrary(container);

    // Add link to page
    await addHtmlToBody(`<a href="${SECONDARY_TEST_PAGE}"><div id="mylink">My link</div></a>`);

    // Wait for initial page load request
    await networkLogger.waitForRequestCount(1);

    // Simulate click event
    const link = document.getElementById('mylink');
    link.click();

    // Mock location change
    window.location.href = SECONDARY_TEST_PAGE;

    // Append launch library again (simulating page load on new page)
    await appendLaunchLibrary(container);

    // Wait for all requests (page load, link click, page load)
    await networkLogger.waitForRequestCount(3);

    // Get ECIDs from first and last requests
    const requests = networkLogger.getRequests();
    const pageLoad1Ecid = getReturnedEcid(requests[0]);
    const pageLoad2Ecid = getReturnedEcid(requests[2]);

    // Verify ECIDs match
    expect(pageLoad1Ecid).toBe(pageLoad2Ecid);
  });
}); 