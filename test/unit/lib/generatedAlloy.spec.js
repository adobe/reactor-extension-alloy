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

import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
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
  let alloyPath;

  // Build the alloy.js file once before all tests
  beforeAll(() => {
    const distPath = path.resolve(__dirname, "../../../dist");

    alloyPath = path.join(distPath, "alloyPreinstalled.js");
    expect(fs.existsSync(alloyPath)).toBe(true);

    // Load the generated code once
    alloyCode = fs.readFileSync(alloyPath, "utf-8");
  });

  beforeEach(async () => {
    mockWindow = {};
    mockAlloyInstance = vi.fn();

    // Execute the generated code to get exports (use preloaded code)
    // Create an isolated VM context to avoid variable collisions
    // In CommonJS, exports is a reference to module.exports
    const moduleObj = { exports: {} };
    const context = vm.createContext({
      module: moduleObj,
      window: mockWindow,
      globalThis: mockWindow,
      setTimeout: global.setTimeout,
      Date: global.Date,
      Promise: global.Promise,
      Error: global.Error,
      TypeError: global.TypeError,
      Object: global.Object,
      Array: global.Array,
      exports: moduleObj.exports,
    });

    // Execute the code in the isolated context
    vm.runInContext(alloyCode, context);

    alloyExports = context.module.exports;
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
    it("throws error if instance not found on window", () => {
      expect(() => {
        alloyExports.createCustomInstance({ name: "missingAlloy" });
      }).toThrow(
        'Alloy instance "missingAlloy" not found on window. Make sure the instance is loaded before the Launch library.',
      );
    });

    it("returns a proxy function when instance exists", () => {
      mockWindow.testAlloy = mockAlloyInstance;
      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      expect(typeof proxy).toBe("function");
    });

    it("proxy calls instance.push with arguments", () => {
      const mockPush = vi.fn();
      mockWindow.testAlloy = { push: mockPush };

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      proxy("sendEvent", { xdm: {} });

      expect(mockPush).toHaveBeenCalledWith("sendEvent", { xdm: {} });
    });

    it("proxy calls instance.push with multiple arguments", () => {
      const mockPush = vi.fn();
      mockWindow.testAlloy = { push: mockPush };

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      proxy("configure", { orgId: "test@AdobeOrg" }, { extra: "arg" });

      expect(mockPush).toHaveBeenCalledWith(
        "configure",
        { orgId: "test@AdobeOrg" },
        { extra: "arg" },
      );
    });

    it("proxy works with pre-existing alloy instance", async () => {
      const mockPush = vi.fn().mockReturnValue(Promise.resolve("success"));
      mockWindow.testAlloy = { push: mockPush };

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      const result = await proxy("getIdentity");

      expect(mockPush).toHaveBeenCalledWith("getIdentity");
      expect(result).toBe("success");
    });

    it("proxy can be called multiple times", () => {
      const mockPush = vi.fn();
      mockWindow.testAlloy = { push: mockPush };

      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      proxy("sendEvent", { xdm: { event: "1" } });
      proxy("sendEvent", { xdm: { event: "2" } });
      proxy("getIdentity");

      expect(mockPush).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenNthCalledWith(1, "sendEvent", {
        xdm: { event: "1" },
      });
      expect(mockPush).toHaveBeenNthCalledWith(2, "sendEvent", {
        xdm: { event: "2" },
      });
      expect(mockPush).toHaveBeenNthCalledWith(3, "getIdentity");
    });

    it("multiple proxies can be created for different instances", () => {
      const mockPush1 = vi.fn();
      const mockPush2 = vi.fn();
      mockWindow.alloy1 = { push: mockPush1 };
      mockWindow.alloy2 = { push: mockPush2 };

      const proxy1 = alloyExports.createCustomInstance({ name: "alloy1" });
      const proxy2 = alloyExports.createCustomInstance({ name: "alloy2" });

      proxy1("sendEvent", { xdm: {} });
      proxy2("configure", { orgId: "test" });

      expect(mockPush1).toHaveBeenCalledWith("sendEvent", { xdm: {} });
      expect(mockPush2).toHaveBeenCalledWith("configure", { orgId: "test" });
      expect(mockPush1).not.toHaveBeenCalledWith("configure", {
        orgId: "test",
      });
      expect(mockPush2).not.toHaveBeenCalledWith("sendEvent", { xdm: {} });
    });
  });

  describe("file size", () => {
    it("generated alloy.js is reasonably sized", () => {
      const stats = fs.statSync(alloyPath);
      const sizeKB = stats.size / 1024;

      // Should be less than 15KB (currently ~8KB)
      expect(sizeKB).toBeLessThan(15);
    });
  });
});
