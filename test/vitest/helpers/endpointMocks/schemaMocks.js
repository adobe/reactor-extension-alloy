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

const SCHEMA_ENDPOINT_REGEX1 = /\/schemaregistry\/tenant\/schemas\/.*sch123$/;
const SCHEMA_ENDPOINT_REGEX2 = /\/schemaregistry\/tenant\/schemas\/.*sch456$/;
const SCHEMA_ENDPOINT_REGEX3 = /\/schemaregistry\/tenant\/schemas\/.*sch789$/;
const SCHEMA_ENDPOINT_REGEX4 = /\/schemaregistry\/tenant\/schemas\/.*sch10$/;
const SCHEMA_3B_REGEX = /\/schemaregistry\/tenant\/schemas\/.*schema3b$/;

export const basic = () => {
  createHandlers([
    createHandler('GET', SCHEMA_ENDPOINT_REGEX1, {
      $id: 'sch123',
      title: 'Test Schema 1',
      version: '1.0',
      type: 'object',
      properties: {
        testField: {
          title: 'Test Field',
          type: 'string',
        },
      },
    })
  ]);
};

export const other = () => {
  createHandlers([
    createHandler('GET', SCHEMA_ENDPOINT_REGEX2, {
      $id: 'sch456',
      title: 'Test Schema 2',
      version: '1.0',
      type: 'object',
      properties: {
        testField: {
          title: 'Test Field',
          type: 'string',
        },
        otherField: {
          title: 'Other Field',
          type: 'string',
        },
      },
    })
  ]);
};

export const basicArray = () => {
  createHandlers([
    createHandler('GET', SCHEMA_ENDPOINT_REGEX3, {
      $id: 'sch789',
      title: 'Test Schema 3',
      version: '1.0',
      type: 'array',
      items: {
        title: 'My Array',
        type: 'object',
        properties: {
          testField: {
            title: 'Test Field',
            type: 'string',
          },
        },
      },
    })
  ]);
};

export const otherArray = () => {
  createHandlers([
    createHandler('GET', SCHEMA_ENDPOINT_REGEX4, {
      $id: 'sch10',
      title: 'Test Schema 4',
      version: '1.0',
      type: 'array',
      items: {
        title: 'My Array',
        type: 'object',
        properties: {
          testField: {
            title: 'Test Field',
            type: 'string',
          },
          otherField: {
            title: 'Other Field',
            type: 'string',
          },
        },
      },
    })
  ]);
};

export const schema3b = () => {
  createHandlers([
    createHandler('GET', SCHEMA_3B_REGEX, {
      $id: 'sch123',
      title: 'Test Schema 1',
      version: '1.0',
      type: 'object',
      properties: {
        testField: {
          title: 'Test Field',
          type: 'string',
        },
      },
    })
  ]);
}; 