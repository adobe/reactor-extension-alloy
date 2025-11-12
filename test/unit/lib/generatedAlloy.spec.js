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

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Generated alloy.js (preinstalled mode)", () => {
  let mockWindow;
  let alloyExports;
  let mockAlloyInstance;

  beforeEach(async () => {
    vi.useFakeTimers();
    mockWindow = {};
    global.window = mockWindow;
    global.console = {
      warn: vi.fn(),
      error: vi.fn(),
      // eslint-disable-next-line no-console
      log: console.log, // Keep real log for debugging
    };
    mockAlloyInstance = vi.fn();

    // Build the empty alloy.js
    const distPath = path.resolve(__dirname, "../../../dist/lib");
    const alloyPath = path.join(distPath, "alloy.js");

    // Only build if file doesn't exist
    if (!fs.existsSync(alloyPath)) {
      // Ensure dist directory exists
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }

      // Build using the build script
      execSync(
        `node ${path.resolve(__dirname, "../../../scripts/buildEmptyAlloy.mjs")} -o ${distPath}`,
        { encoding: "utf-8" },
      );
    }

    // Load the generated alloy.js
    expect(fs.existsSync(alloyPath)).toBe(true);

    // Execute the generated code to get exports
    const alloyCode = fs.readFileSync(alloyPath, "utf-8");
    const moduleObj = { exports: {} };

    // Create a proper evaluation context
    // eslint-disable-next-line no-new-func
    const execute = new Function(
      "module",
      "console",
      "window",
      "setTimeout",
      "Date",
      "Promise",
      "Error",
      `${alloyCode}\nreturn module.exports;`,
    );

    alloyExports = execute(
      moduleObj,
      global.console,
      mockWindow,
      global.setTimeout,
      global.Date,
      global.Promise,
      global.Error,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.window;
  });

  describe("exports", () => {
    it("exports required functions and objects", () => {
      expect(alloyExports).toBeDefined();
      expect(alloyExports.createCustomInstance).toBeInstanceOf(Function);
      expect(alloyExports.components).toEqual({});
      expect(alloyExports.createEventMergeId).toBeInstanceOf(Function);
      expect(alloyExports.deepAssign).toBeInstanceOf(Function);
    });

    it("throws error when calling createEventMergeId directly", () => {
      expect(() => alloyExports.createEventMergeId()).toThrow(
        "createEventMergeId should not be called directly in preinstalled mode",
      );
    });

    it("throws error when calling deepAssign directly", () => {
      expect(() => alloyExports.deepAssign()).toThrow(
        "deepAssign should not be called directly in preinstalled mode",
      );
    });
  });

  describe("createCustomInstance", () => {
    it("returns a proxy function", () => {
      const proxy = alloyExports.createCustomInstance({ name: "testAlloy" });
      expect(proxy).toBeInstanceOf(Function);
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

    it("proxy logs warning if instance not found", async () => {
      const proxy = alloyExports.createCustomInstance({ name: "missingAlloy" });
      const commandPromise = proxy("test").catch((err) => err);

      await vi.advanceTimersByTimeAsync(1100);
      const result = await commandPromise;

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe(
        'Alloy instance "missingAlloy" not available',
      );
      expect(global.console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Alloy instance "missingAlloy" not found on window',
        ),
      );
    });

    it("proxy logs warning if instance not configured", async () => {
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
      expect(global.console.warn).toHaveBeenCalledWith(
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
      const alloyPath = path.resolve(__dirname, "../../../dist/lib/alloy.js");
      const stats = fs.statSync(alloyPath);
      const sizeKB = stats.size / 1024;

      // Should be less than 15KB (currently ~7KB)
      expect(sizeKB).toBeLessThan(15);
      // eslint-disable-next-line no-console
      console.log(`Generated alloy.js size: ${sizeKB.toFixed(2)} KB`);
    });
  });
});
