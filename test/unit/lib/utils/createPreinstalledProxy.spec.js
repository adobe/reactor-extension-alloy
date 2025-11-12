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

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createPreinstalledProxy } from "../../../../src/lib/utils/createPreinstalledProxy";

describe("createPreinstalledProxy", () => {
  let mockWindow;
  let onWarn;
  let onError;
  let mockAlloy;

  beforeEach(() => {
    vi.useFakeTimers();
    mockWindow = {};
    global.window = mockWindow;
    onWarn = vi.fn();
    onError = vi.fn();
    mockAlloy = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.window;
  });

  describe("successful instance detection", () => {
    it("creates a proxy that waits for instance to load", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });
      const commandPromise = proxy("sendEvent", { xdm: {} });

      // Instance not available yet
      await vi.advanceTimersByTimeAsync(300);

      // Make instance available
      mockWindow.alloy = mockAlloy;

      await vi.runAllTimersAsync();
      const result = await commandPromise;

      expect(result).toBe("result");
      expect(mockAlloy).toHaveBeenCalledWith("sendEvent", { xdm: {} });
      expect(mockAlloy).toHaveBeenCalledWith("getLibraryInfo");
      expect(onWarn).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it("works when instance is already available", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });
      const result = await proxy("getIdentity");

      await vi.runAllTimersAsync();

      expect(result).toBe("result");
      expect(mockAlloy).toHaveBeenCalledWith("getIdentity");
      expect(onWarn).not.toHaveBeenCalled();
    });

    it("handles multiple commands before instance is available", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve(`result-${cmd}`);
      });

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });

      // Queue multiple commands
      const cmd1 = proxy("sendEvent", { xdm: { test: 1 } });
      const cmd2 = proxy("getIdentity");
      const cmd3 = proxy("setDebug", { enabled: true });

      // Make instance available
      mockWindow.alloy = mockAlloy;

      await vi.runAllTimersAsync();

      const [result1, result2, result3] = await Promise.all([cmd1, cmd2, cmd3]);

      expect(result1).toBe("result-sendEvent");
      expect(result2).toBe("result-getIdentity");
      expect(result3).toBe("result-setDebug");
      // getLibraryInfo should only be called once
      expect(
        mockAlloy.mock.calls.filter((call) => call[0] === "getLibraryInfo")
          .length,
      ).toBe(1);
    });
  });

  describe("instance caching", () => {
    it("caches real instance after first successful lookup", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });

      // First command triggers lookup
      await proxy("cmd1");
      await vi.runAllTimersAsync();

      // Second command should use cached instance
      mockAlloy.mockClear();
      const result = await proxy("cmd2");

      expect(result).toBe("result");
      expect(mockAlloy).toHaveBeenCalledWith("cmd2");
      expect(mockAlloy).not.toHaveBeenCalledWith("getLibraryInfo");
    });

    it("uses cached instance for synchronous successive calls", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });

      await proxy("initial");
      await vi.runAllTimersAsync();

      // Multiple rapid calls after caching
      mockAlloy.mockClear();
      const promises = [proxy("a"), proxy("b"), proxy("c")];

      await Promise.all(promises);

      expect(mockAlloy).toHaveBeenCalledTimes(3);
      expect(mockAlloy).toHaveBeenCalledWith("a");
      expect(mockAlloy).toHaveBeenCalledWith("b");
      expect(mockAlloy).toHaveBeenCalledWith("c");
    });
  });

  describe("timeout and retry behavior", () => {
    it("retries after timeout if instance appears later", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      const proxy = createPreinstalledProxy("alloy", {
        timeout: 500,
        onWarn,
        onError,
      });

      // First command times out
      const cmd1 = proxy("test1").catch((err) => err);
      await vi.advanceTimersByTimeAsync(600);
      const result1 = await cmd1;

      expect(result1).toBeInstanceOf(Error);
      expect(result1.message).toBe('Alloy instance "alloy" not available');
      expect(onWarn).toHaveBeenCalledWith(
        expect.stringContaining("not found on window after 500ms"),
      );
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining("Cannot execute command"),
      );

      // Instance appears
      mockWindow.alloy = mockAlloy;
      onWarn.mockClear();
      onError.mockClear();

      // Second command should retry and succeed
      const cmd2 = proxy("test2");
      await vi.runAllTimersAsync();
      const result2 = await cmd2;

      expect(result2).toBe("result");
      expect(mockAlloy).toHaveBeenCalledWith("test2");
      expect(onError).not.toHaveBeenCalled();
    });

    it("respects custom timeout value", async () => {
      const proxy = createPreinstalledProxy("alloy", {
        timeout: 300,
        interval: 50,
        onWarn,
        onError,
      });

      const cmd = proxy("test").catch((err) => err);
      await vi.advanceTimersByTimeAsync(350);
      const result = await cmd;

      expect(result).toBeInstanceOf(Error);
      expect(onWarn).toHaveBeenCalledWith(
        expect.stringContaining("not found on window after 300ms"),
      );
    });

    it("respects custom polling interval", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      const proxy = createPreinstalledProxy("alloy", {
        timeout: 1000,
        interval: 200,
        onWarn,
        onError,
      });

      const cmd = proxy("test");

      // At 100ms, no instance yet
      await vi.advanceTimersByTimeAsync(100);
      // At 200ms, first check after initial
      await vi.advanceTimersByTimeAsync(100);

      mockWindow.alloy = mockAlloy;

      await vi.runAllTimersAsync();
      await cmd;

      expect(onWarn).not.toHaveBeenCalled();
    });
  });

  describe("configuration check", () => {
    it("waits for getLibraryInfo to resolve", async () => {
      let resolveLibraryInfo;
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") {
          return new Promise((resolve) => {
            resolveLibraryInfo = resolve;
          });
        }
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });
      const cmdPromise = proxy("test");

      await vi.advanceTimersByTimeAsync(200);

      // getLibraryInfo not resolved yet, command should wait
      mockAlloy.mockClear();
      const testCmd = proxy("another");

      // Resolve getLibraryInfo
      resolveLibraryInfo();
      await vi.runAllTimersAsync();

      await cmdPromise;
      await testCmd;

      // Both commands should have succeeded
      expect(mockAlloy).toHaveBeenCalledWith("test");
      expect(mockAlloy).toHaveBeenCalledWith("another");
    });

    it("handles getLibraryInfo rejection", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") {
          return Promise.reject(new Error("Not configured"));
        }
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });
      const cmd = proxy("test").catch((err) => err);

      await vi.runAllTimersAsync();
      const result = await cmd;

      expect(result).toBeInstanceOf(Error);
      expect(onWarn).toHaveBeenCalledWith(
        expect.stringContaining("failed configuration check"),
      );
    });

    it("times out getLibraryInfo after configTimeout", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") {
          // Never resolves
          return new Promise(() => {});
        }
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", {
        configTimeout: 2000,
        onWarn,
        onError,
      });

      const cmd = proxy("test").catch((err) => err);

      // Advance past config timeout
      await vi.advanceTimersByTimeAsync(2100);
      const result = await cmd;

      expect(result).toBeInstanceOf(Error);
      expect(onWarn).toHaveBeenCalledWith(
        expect.stringContaining("failed configuration check"),
      );
    });
  });

  describe("error handling", () => {
    it("forwards command errors from real instance", async () => {
      const commandError = new Error("Command failed");
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        if (cmd === "sendEvent") return Promise.reject(commandError);
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });

      await vi.runAllTimersAsync();
      await expect(proxy("sendEvent", {})).rejects.toThrow("Command failed");
    });

    it("calls custom onWarn callback", async () => {
      const customWarn = vi.fn();

      const proxy = createPreinstalledProxy("alloy", {
        timeout: 100,
        onWarn: customWarn,
        onError,
      });

      const cmd = proxy("test").catch((err) => err);
      await vi.advanceTimersByTimeAsync(150);
      await cmd;

      expect(customWarn).toHaveBeenCalledWith(
        expect.stringContaining('Alloy instance "alloy" not found'),
      );
    });

    it("calls custom onError callback", async () => {
      const customError = vi.fn();

      const proxy = createPreinstalledProxy("alloy", {
        timeout: 100,
        onWarn,
        onError: customError,
      });

      const cmd = proxy("test").catch((err) => err);
      await vi.advanceTimersByTimeAsync(150);
      await cmd;

      expect(customError).toHaveBeenCalledWith(
        expect.stringContaining("Cannot execute command"),
      );
    });
  });

  describe("edge cases", () => {
    it("handles instance being removed from window", async () => {
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      mockWindow.alloy = mockAlloy;

      const proxy = createPreinstalledProxy("alloy", { onWarn, onError });

      await proxy("cmd1");
      await vi.runAllTimersAsync();

      // Remove instance from window
      delete mockWindow.alloy;

      // Cached instance should still work
      const result = await proxy("cmd2");
      expect(result).toBe("result");
    });

    it("handles instance name with special characters", async () => {
      const specialName = "my-alloy-instance";
      mockAlloy.mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result");
      });

      mockWindow[specialName] = mockAlloy;

      const proxy = createPreinstalledProxy(specialName, { onWarn, onError });
      const result = await proxy("test");

      await vi.runAllTimersAsync();

      expect(result).toBe("result");
    });

    it("handles multiple proxies for different instances", async () => {
      const alloy1 = vi.fn().mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result1");
      });

      const alloy2 = vi.fn().mockImplementation((cmd) => {
        if (cmd === "getLibraryInfo") return Promise.resolve();
        return Promise.resolve("result2");
      });

      mockWindow.alloy1 = alloy1;
      mockWindow.alloy2 = alloy2;

      const proxy1 = createPreinstalledProxy("alloy1", { onWarn, onError });
      const proxy2 = createPreinstalledProxy("alloy2", { onWarn, onError });

      await vi.runAllTimersAsync();

      const [result1, result2] = await Promise.all([
        proxy1("test"),
        proxy2("test"),
      ]);

      expect(result1).toBe("result1");
      expect(result2).toBe("result2");
    });
  });
});
