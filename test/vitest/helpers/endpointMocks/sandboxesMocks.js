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

import { createHandler, createHandlers } from './setup';

const SANDBOXES_ENDPOINT_REGEX = /sandbox-management/;

export const unauthorized = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      error_code: '401013',
      message: 'Oauth token is not valid',
    }, 401)
  ]);
};

export const userRegionMissing = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      error_code: '403027',
      message: 'User region is missing',
    }, 403)
  ]);
};

export const nonJsonBody = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, 'non-json body', 200)
  ]);
};

export const empty = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [],
    })
  ]);
};

export const singleWithoutDefault = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [
        {
          name: 'testsandbox1',
          title: 'Test Sandbox 1',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
      ],
    })
  ]);
};

export const multipleWithDefault = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [
        {
          name: 'testsandbox1',
          title: 'Test Sandbox 1',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'testsandbox2',
          title: 'Test Sandbox 2',
          type: 'production',
          isDefault: true,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'testsandbox3',
          title: 'Test Sandbox 3',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'prod',
          title: 'Test Sandbox Prod',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
      ],
    })
  ]);
};

export const longLasting = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [
        {
          name: 'testsandbox1',
          title: 'Test Sandbox 1',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
      ],
    }, 200, 10000)
  ]);
};

export const multipleWithoutDefault = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [
        {
          name: 'testsandbox1',
          title: 'Test Sandbox 1',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'testsandbox2',
          title: 'Test Sandbox 2',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'testsandbox3',
          title: 'Test Sandbox 3',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
        {
          name: 'prod',
          title: 'Test Sandbox Prod',
          type: 'production',
          isDefault: false,
          region: 'VA7',
          state: 'active',
        },
      ],
    })
  ]);
};

export const singleDefault = () => {
  createHandlers([
    createHandler('GET', SANDBOXES_ENDPOINT_REGEX, {
      sandboxes: [
        {
          name: 'prod',
          title: 'Prod',
          type: 'production',
          isDefault: true,
          region: 'VA7',
          state: 'active',
        },
      ],
    })
  ]);
}; 