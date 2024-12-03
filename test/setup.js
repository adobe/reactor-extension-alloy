// Add fetch polyfill for tests
require("whatwg-fetch");

// Add common globals that might be needed in tests
global.beforeAll = beforeAll;
global.beforeEach = beforeEach;
global.afterAll = afterAll;
global.afterEach = afterEach;
global.describe = describe;
global.it = test;
global.expect = expect;

// Mock window properties that are not available in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
