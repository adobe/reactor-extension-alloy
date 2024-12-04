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

import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { ReadableStream, WritableStream } from 'node:stream/web';

// Polyfill TransformStream and related classes
if (!global.TransformStream) {
  global.TransformStream = class TransformStream {
    constructor() {
      this.readable = new ReadableStream();
      this.writable = new WritableStream();
    }
  };
}

if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream;
}

if (!global.WritableStream) {
  global.WritableStream = WritableStream;
}

// Configure React Testing Library
configure({
  asyncUtilTimeout: 2000,
  testIdAttribute: 'data-test-id'
});

// Mock CSS modules
vi.mock('**/*.css', () => {
  return {
    default: new Proxy({}, {
      get: (_, prop) => prop
    })
  };
});

// Mock React DOM client
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn()
  }))
}));

// Mock React Spectrum components and theme
vi.mock('@adobe/react-spectrum', () => {
  return {
    Provider: ({ children }) => children,
    Item: ({ children }) => children,
    ActionButton: ({ children }) => children,
    Button: ({ children }) => children,
    Text: ({ children }) => children,
    TextField: ({ children }) => children,
    ComboBox: ({ children }) => children,
    Picker: ({ children }) => children,
    Radio: ({ children }) => children,
    RadioGroup: ({ children }) => children,
    Checkbox: ({ children }) => children,
    TextArea: ({ children }) => children,
    lightTheme: {},
    defaultTheme: {},
    spectrum: {}
  };
});

// Setup DOM environment for React
beforeEach(() => {
  // Create and append HTML structure
  document.body.innerHTML = `
    <div id="root"></div>
    <div id="app"></div>
    <div id="personalization-container"></div>
    <div id="test-container"></div>
  `;

  // Setup window mocks
  if (!global.window._satellite) {
    global.window._satellite = {
      container: {},
      logger: {
        log: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      },
    };
  }

  // Setup getComputedStyle mock
  const getPropertyValue = vi.fn().mockReturnValue('');
  const computedStyle = { getPropertyValue };
  global.window.getComputedStyle = vi.fn().mockReturnValue(computedStyle);

  // Add missing window properties
  if (!global.window.document.location) {
    global.window.document.location = { href: '' };
  }

  // Setup global fetch mock
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});

// Clean up after each test
afterEach(() => {
  // Clean up React Testing Library
  cleanup();

  // Clean up mocks
  vi.clearAllMocks();
  vi.restoreAllMocks();
  
  // Reset window mocks
  if (global.window._satellite) {
    global.window._satellite.logger.log.mockClear();
    global.window._satellite.logger.info.mockClear();
    global.window._satellite.logger.warn.mockClear();
    global.window._satellite.logger.error.mockClear();
  }

  // Clean up DOM
  document.body.innerHTML = '';
}); 