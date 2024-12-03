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

const DATA_ELEMENT_1_REGEX = /data_elements\/DE1/;
const DATA_ELEMENT_2_REGEX = /data_elements\/DE2/;
const DATA_SOLUTIONS_ELEMENT_1_REGEX = /data_elements\/SDE1/;

const testDataVariable1 = {
  id: 'DE1',
  attributes: {
    name: 'Test data variable 1',
    delegate_descriptor_id: 'adobe-alloy::dataElements::variable',
    settings: JSON.stringify({
      sandbox: {
        name: 'prod',
      },
      schema: {
        id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489',
        version: '1.2',
      },
    }),
  },
};

const testDataVariable2 = {
  id: 'DE2',
  attributes: {
    name: 'Test data variable 2',
    delegate_descriptor_id: 'adobe-alloy::dataElements::variable',
    settings: JSON.stringify({
      sandbox: {
        name: 'prod',
      },
      schema: {
        id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489',
        version: '1.1',
      },
    }),
  },
};

const testSolutionsVariable1 = {
  id: 'SDE1',
  attributes: {
    name: 'Test solutions variable 1',
    delegate_descriptor_id: 'adobe-alloy::dataElements::variable',
    settings: JSON.stringify({
      solutions: ['analytics', 'target', 'audiencemanager'],
    }),
  },
};

export const element1 = () => {
  createHandlers([
    createHandler('GET', DATA_ELEMENT_1_REGEX, {
      data: testDataVariable1
    })
  ]);
};

export const element2 = () => {
  createHandlers([
    createHandler('GET', DATA_ELEMENT_2_REGEX, {
      data: testDataVariable2
    })
  ]);
};

export const solutionsElement1 = () => {
  createHandlers([
    createHandler('GET', DATA_SOLUTIONS_ELEMENT_1_REGEX, {
      data: testSolutionsVariable1
    })
  ]);
}; 