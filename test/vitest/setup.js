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

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure React Testing Library
configure({
  asyncUtilTimeout: 2000,
  eventWrapper: (cb) => {
    let result;
    act(() => {
      result = cb();
    });
    return result;
  },
});

// Mock CSS modules
vi.mock('**/*.css', () => {
  return {
    default: {},
  };
});

// Mock React Spectrum theme imports
vi.mock('@adobe/react-spectrum', async () => {
  const actual = await vi.importActual('@adobe/react-spectrum');
  return {
    ...actual,
    Provider: ({ children }) => children,
    lightTheme: {},
  };
});

// Setup global fetch mock
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Setup global window properties needed for runtime tests
global.window = {
  ...global.window,
  eval: (code) => {
    // eslint-disable-next-line no-eval
    return eval(code);
  },
  _satellite: {
    container: {},
    logger: {
      log: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    },
  },
  document: {
    ...global.window.document,
    location: {
      href: '',
    },
  },
};

// Clean up after each test
afterEach(async () => {
  await cleanup();
  vi.clearAllMocks();
}); 