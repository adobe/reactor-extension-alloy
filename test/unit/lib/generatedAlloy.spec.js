/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Integration tests for the generated alloy.js file in preinstalled mode.
 * This ensures the bundled proxy logic works correctly.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import vm from "vm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Generated alloy.js (preinstalled mode)", () => {
  let mockWindow;
  let alloyExports;
  let mockAlloyInstance;
  let alloyCode;

  // Build the alloy.js file once before all tests
  beforeAll(() => {
    // Use a test-specific directory to avoid conflicts
    const distPath = path.resolve(__dirname, "../../../test-dist");

    // Clean and recreate dist directory
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }
    fs.mkdirSync(distPath, { recursive: true });

    // Build using the build script (force preinstalled mode)
    // Use cwd option instead of cd command to avoid shell injection risks
    const repoRoot = path.resolve(__dirname, "../../..");
    execSync("node ./scripts/buildEmptyAlloy.mjs -o test-dist", {
      cwd: repoRoot,
      encoding: "utf-8",
    });

    const alloyPath = path.join(distPath, "alloy.js");
    expect(fs.existsSync(alloyPath)).toBe(true);

    // Load the generated code once
    alloyCode = fs.readFileSync(alloyPath, "utf-8");
  });

  beforeEach(async () => {
    vi.useFakeTimers();
    mockWindow = {};
    global.window = mockWindow;
    global.console = {
      error: vi.fn(),
      // eslint-disable-next-line no-console
      log: console.log, // Keep real log for debugging
    };
    mockAlloyInstance = vi.fn();

    // Execute the generated code to get exports (use preloaded code)
    // Create an isolated VM context to avoid variable collisions
    const context = vm.createContext({
      module: { exports: {} },
      console: global.console,
      window: mockWindow,
      setTimeout: global.setTimeout,
      Date: global.Date,
      Promise: global.Promise,
      Error: global.Error,
      exports: {},
    });

    // Execute the code in the isolated context
    vm.runInContext(alloyCode, context);

    alloyExports = context.module.exports;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.window;
  });

  describe("exports", () => {
    it("exports required functions and objects", () => {
      expect(alloyExports).toBeDefined();
      expect(typeof alloyExports.createCustomInstance).toBe("function");
      expect(alloyExports.components).toEqual({});
      expect(typeof alloyExports.createEventMergeId).toBe("function");
      expect(typeof alloyExports.deepAssign).toBe("function");
    });

    it("throws error when calling createEventMergeId directly", () => {
      expect(() => alloyExports.createEventMergeId()).toThrow(
        "createEventMergeId should not be called directly in preinstalled mode",
      );
    });

    it("deepAssign is a functional utility", () => {
      // deepAssign should work in preinstalled mode for Update Variable actions
      expect(() => alloyExports.deepAssign({}, { a: 1 })).not.toThrow();
      expect(alloyExports.deepAssign({}, { a: 1 })).toEqual({ a: 1 });
    });
  });

  describe("createCustomInstance", () => {
    it("returns a proxy function", () => {
      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      expect(typeof proxy).toBe("function");
    });

    it("proxy waits for external instance to load", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("success");
      });

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      const commandPromise = proxy("sendEvent", { xdm: {} });

      // Instance not available yet
      await vi.advanceTimersByTimeAsync(300);

      // Make instance available
      mockWindow.testAlloy = mockAlloyInstance;

      await vi.runAllTimersAsync();
      const result = await commandPromise;

      expect(result).toBe("success");
      expect(mockAlloyInstance).toHaveBeenCalledWith("sendEvent", { xdm: {} });
      expect(mockAlloyInstance).toHaveBeenCalledWith("getLibraryInfo");
    });

    it("proxy logs error if instance not found", async () => {
      const proxy = alloyExports.createCustomInstance({ name: "missingAlloy" });
      const commandPromise = proxy("test").catch((err) => err);

      await vi.advanceTimersByTimeAsync(1100);
      const result = await commandPromise;

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe(
        'Alloy instance "missingAlloy" not available',
      );
      expect(global.console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Alloy instance "missingAlloy" not found on window',
        ),
      );
    });

    it("proxy logs error if instance not configured", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") {
          return Promise.reject(new Error("Not configured"));
        }
        return Promise.resolve("result");
      });

      mockWindow.testAlloy = mockAlloyInstance;

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      const commandPromise = proxy("test").catch((err) => err);

      await vi.runAllTimersAsync();
      const result = await commandPromise;

      expect(result).toBeInstanceOf(Error);
      expect(global.console.error).toHaveBeenCalledWith(
        expect.stringContaining("failed configuration check"),
      );
    });

    it("proxy caches instance after first successful lookup", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("cached-result");
      });

      mockWindow.testAlloy = mockAlloyInstance;

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });

      // First command
      await proxy("cmd1");
      await vi.runAllTimersAsync();

      // Second command should use cached instance
      mockAlloyInstance.mockClear();
      const result = await proxy("cmd2");

      expect(result).toBe("cached-result");
      expect(mockAlloyInstance).toHaveBeenCalledWith("cmd2");
      expect(mockAlloyInstance).not.toHaveBeenCalledWith("getLibraryInfo");
    });

    it("proxy handles multiple commands before instance available", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve(`result-${cmd}`);
      });

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });

      const cmd1 = proxy("sendEvent", {});
      const cmd2 = proxy("getIdentity");
      const cmd3 = proxy("setDebug", { enabled: true });

      // Make instance available
      mockWindow.testAlloy = mockAlloyInstance;

      await vi.runAllTimersAsync();

      const [result1, result2, result3] = await Promise.all([cmd1, cmd2, cmd3]);

      expect(result1).toBe("result-sendEvent");
      expect(result2).toBe("result-getIdentity");
      expect(result3).toBe("result-setDebug");
    });

    it("proxy retries after timeout if instance appears later", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("retry-success");
      });

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });

      // First command times out
      const cmd1 = proxy("test1").catch((err) => err);
      await vi.advanceTimersByTimeAsync(1100);
      const result1 = await cmd1;

      expect(result1).toBeInstanceOf(Error);

      // Instance appears
      mockWindow.testAlloy = mockAlloyInstance;

      // Second command should retry and succeed
      const cmd2 = proxy("test2");
      await vi.runAllTimersAsync();
      const result2 = await cmd2;

      expect(result2).toBe("retry-success");
    });

    it("works with instance that is already available", async () => {
      mockAlloyInstance.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("immediate-result");
      });

      // Instance already on window
      mockWindow.testAlloy = mockAlloyInstance;

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      const result = await proxy("test");

      await vi.runAllTimersAsync();

      expect(result).toBe("immediate-result");
    });
  });

  describe("file size", () => {
    it("generated alloy.js is reasonably sized", () => {
      const alloyPath = path.resolve(__dirname, "../../../test-dist/alloy.js");
      const stats = fs.statSync(alloyPath);
      const sizeKB = stats.size / 1024;

      // Should be less than 15KB (currently ~8KB)
      expect(sizeKB).toBeLessThan(15);
      // eslint-disable-next-line no-console
      console.log(`Generated alloy.js size: ${sizeKB.toFixed(2)} KB`);
    });
  });

  describe("deepAssign utility", () => {
    it("exports deepAssign function", () => {
      expect(alloyExports.deepAssign).toBeDefined();
      expect(typeof alloyExports.deepAssign).toBe("function");
    });

    it("performs shallow merge for simple objects", () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = alloyExports.deepAssign(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).toBe(target); // Should modify target
    });

    it("performs deep merge for nested objects", () => {
      const target = { a: { x: 1, y: 2 }, b: 3 };
      const source = { a: { y: 4, z: 5 }, c: 6 };
      const result = alloyExports.deepAssign(target, source);

      expect(result).toEqual({ a: { x: 1, y: 4, z: 5 }, b: 3, c: 6 });
      expect(result.a).toBe(target.a); // Nested objects should be modified
    });

    it("handles multiple source objects", () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      const result = alloyExports.deepAssign(target, source1, source2);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("throws error for null target", () => {
      expect(() => {
        alloyExports.deepAssign(null, { a: 1 });
      }).toThrow('deepAssign "target" cannot be null or undefined');
    });

    it("throws error for undefined target", () => {
      expect(() => {
        alloyExports.deepAssign(undefined, { a: 1 });
      }).toThrow('deepAssign "target" cannot be null or undefined');
    });

    it("handles empty objects", () => {
      const result = alloyExports.deepAssign({}, {});
      expect(result).toEqual({});
    });

    it("handles arrays by overwriting", () => {
      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };
      const result = alloyExports.deepAssign(target, source);

      expect(result.arr).toEqual([4, 5]);
    });

    it("works with XDM-like objects (real use case)", () => {
      const target = {
        xdm: {
          web: {
            webPageDetails: {
              name: "Homepage",
            },
          },
        },
      };

      const source = {
        xdm: {
          web: {
            webPageDetails: {
              URL: "https://example.com",
            },
            webReferrer: {
              URL: "https://google.com",
            },
          },
          commerce: {
            order: {
              purchaseID: "12345",
            },
          },
        },
      };

      const result = alloyExports.deepAssign(target, source);

      expect(result.xdm.web.webPageDetails).toEqual({
        name: "Homepage",
        URL: "https://example.com",
      });
      expect(result.xdm.web.webReferrer).toEqual({
        URL: "https://google.com",
      });
      expect(result.xdm.commerce).toEqual({
        order: {
          purchaseID: "12345",
        },
      });
    });

    it("protects against prototype pollution via __proto__", () => {
      const target = {};
      const maliciousSource = JSON.parse('{"__proto__":{"polluted":"yes"}}');

      alloyExports.deepAssign(target, maliciousSource);

      // Should not pollute Object.prototype
      expect({}.polluted).toBeUndefined();
      expect(Object.prototype.polluted).toBeUndefined();
    });

    it("protects against prototype pollution via constructor", () => {
      const target = {};
      const maliciousSource = {
        constructor: {
          prototype: {
            polluted: "yes",
          },
        },
      };

      alloyExports.deepAssign(target, maliciousSource);

      // Should not pollute Object.prototype
      expect({}.polluted).toBeUndefined();
    });

    it("protects against prototype pollution via prototype", () => {
      const target = {};
      const maliciousSource = {
        prototype: {
          polluted: "yes",
        },
      };

      alloyExports.deepAssign(target, maliciousSource);

      // Should not add prototype property
      expect(target.prototype).toBeUndefined();
    });
  });
});
