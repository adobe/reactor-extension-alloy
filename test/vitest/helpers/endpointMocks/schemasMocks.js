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

const SCHEMAS_ENDPOINT_REGEX = /\/schemaregistry\/tenant\/schemas(\?|$)/;
const SCHEMAS_SEARCH_REGEX = /\/schemaregistry\/tenant\/schemas\?.*property=title/;

export const single = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_ENDPOINT_REGEX, {
      results: [
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/sch123',
          version: '1.0',
          title: 'Test Schema 1',
        },
      ],
      _page: {
        next: null,
      },
    })
  ]);
};

export const multiple = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_ENDPOINT_REGEX, {
      results: [
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/sch123',
          version: '1.0',
          title: 'Test Schema 1',
        },
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/sch124',
          version: '1.0',
          title: 'Test Schema 2',
        },
      ],
      _page: {
        next: null,
      },
    })
  ]);
};

export const sandbox2 = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_ENDPOINT_REGEX, {
      results: [
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/schema2a',
          version: '1.0',
          title: 'Test Schema 2A',
        },
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/schema2b',
          version: '1.0',
          title: 'Test Schema 2B',
        },
      ],
      _page: {
        next: null,
      },
    })
  ]);
};

export const sandbox3 = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_ENDPOINT_REGEX, {
      results: [
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/schema3a',
          version: '1.0',
          title: 'Test Schema 3A',
        },
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/schema3b',
          version: '1.0',
          title: 'Test Schema 3B',
        },
      ],
      _page: {
        next: null,
      },
    })
  ]);
};

export const search = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_SEARCH_REGEX, {
      results: [
        {
          $id: 'https://ns.adobe.com/unifiedjsqeonly/schemas/sch125',
          version: '1.0',
          title: 'XDM Object Data Element Tests',
        },
      ],
      _page: {
        next: null,
      },
    })
  ]);
};

export const empty = () => {
  createHandlers([
    createHandler('GET', SCHEMAS_ENDPOINT_REGEX, {
      results: [],
      _page: {
        next: null,
      },
    })
  ]);
};

export const pagingTitles = [
  'Ada', 'Agnus', 'Agnese', 'Alyssa', 'Amalie', 'Ardys', 'Aryn', 'Arynio',
  'Bettine', 'Cacilie', 'Camile', 'Caritta', 'Cassondra', 'Cherrita', 'Christal',
  'Clarice', 'Claudina', 'Clo', 'Concettina', 'Corene', 'Courtnay', 'Danny',
  'Delilah', 'Dorice', 'Drucie', 'Emma', 'Emylee', 'Ethel', 'Feliza', 'Fidelia',
  'Flo', 'Florence', 'Fredericka', 'Gertrud', 'Ginnie', 'Glynnis', 'Grier',
  'Gwenneth', 'Halette', 'Hallie', 'Hollie', 'Janeczka', 'Jany', 'Jasmina',
  'Jillayne', 'Jobi', 'Joleen', 'Jordan', 'Judy', 'Justina', 'Justinn', 'Karina',
  'Karlee', 'Kathi', 'Katleen', 'Kenna', 'Kial', 'Kirbee', 'Lanae', 'Laticia',
  'Lisette', 'Lita', 'Luci', 'Madalyn', 'Mady', 'Mamie', 'Marcelline',
  'Marguerite', 'Mariann', 'Marti', 'Mary', 'Miquela', 'Nanete', 'Natka',
  'Nikki', 'Noelle', 'Olpen', 'Olwen', 'Pamella', 'Paola'
]; 