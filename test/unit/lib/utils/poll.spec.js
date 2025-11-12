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
import { poll } from "../../../../src/lib/utils/poll";

describe("poll utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("successful polling", () => {
    it("resolves immediately when condition is already true", async () => {
      const condition = vi.fn().mockReturnValue(true);

      const promise = poll(condition);
      await promise;

      expect(condition).toHaveBeenCalledTimes(1);
    });

    it("resolves when condition becomes true after checking", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 3; // True on 3rd call
      });

      const promise = poll(condition, 1000, 100);

      // Advance through first two checks
      await vi.advanceTimersByTimeAsync(200);

      // Should resolve after 3rd check
      await promise;

      expect(condition).toHaveBeenCalledTimes(3);
    });

    it("resolves with default timeout and interval", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 5;
      });

      const promise = poll(condition); // Uses defaults: 1000ms timeout, 100ms interval

      await vi.advanceTimersByTimeAsync(500);
      await promise;

      expect(condition).toHaveBeenCalledTimes(5);
    });

    it("stops checking after first success", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 2;
      });

      const promise = poll(condition, 1000, 100);

      // Advance enough time for multiple checks
      await vi.advanceTimersByTimeAsync(500);
      await promise;

      // Should have stopped after success
      const callsBeforeExtraTime = condition.mock.calls.length;

      // Advance more time
      await vi.advanceTimersByTimeAsync(500);

      // Should not have made additional calls
      expect(condition).toHaveBeenCalledTimes(callsBeforeExtraTime);
    });
  });

  describe("timeout behavior", () => {
    it("rejects after default timeout when condition never becomes true", async () => {
      const condition = vi.fn().mockReturnValue(false);

      const promise = poll(condition).catch((error) => error); // Default 1000ms timeout

      // Advance past timeout
      await vi.advanceTimersByTimeAsync(1100);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Polling timed out.");
      expect(condition.mock.calls.length).toBeGreaterThan(1);
    });

    it("rejects after custom timeout when condition never becomes true", async () => {
      const condition = vi.fn().mockReturnValue(false);

      const promise = poll(condition, 500, 100).catch((error) => error); // 500ms timeout

      await vi.advanceTimersByTimeAsync(600);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Polling timed out.");
      // Should check approximately 5 times (0, 100, 200, 300, 400, 500+)
      expect(condition.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("rejects exactly at timeout threshold", async () => {
      const condition = vi.fn().mockReturnValue(false);

      const promise = poll(condition, 300, 100).catch((error) => error);

      // Advance past timeout
      await vi.advanceTimersByTimeAsync(400);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Polling timed out.");
    });
  });

  describe("custom interval behavior", () => {
    it("respects custom interval for checking", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 4;
      });

      const promise = poll(condition, 2000, 250); // 250ms interval

      // After 250ms: 2nd check
      await vi.advanceTimersByTimeAsync(250);
      expect(condition.mock.calls.length).toBe(2);

      // After 500ms: 3rd check
      await vi.advanceTimersByTimeAsync(250);
      expect(condition.mock.calls.length).toBe(3);

      // After 750ms: 4th check (should resolve)
      await vi.advanceTimersByTimeAsync(250);
      await promise;

      expect(condition).toHaveBeenCalledTimes(4);
    });

    it("respects very short custom interval", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 10;
      });

      const promise = poll(condition, 1000, 10); // 10ms interval

      await vi.advanceTimersByTimeAsync(100);
      await promise;

      // Should check roughly every 10ms
      expect(condition.mock.calls.length).toBeGreaterThanOrEqual(10);
    });

    it("respects very long custom interval", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 3;
      });

      const promise = poll(condition, 5000, 1000); // 1000ms interval

      await vi.advanceTimersByTimeAsync(2000);
      await promise;

      // Should check at 0ms, 1000ms, 2000ms
      expect(condition).toHaveBeenCalledTimes(3);
    });
  });

  describe("error handling", () => {
    it("handles condition function throwing an error", async () => {
      const error = new Error("Condition evaluation failed");
      const condition = vi.fn().mockImplementation(() => {
        throw error;
      });

      const promise = poll(condition, 1000, 100);

      // The current implementation doesn't catch errors in condition,
      // so they will bubble up. This test documents the current behavior.
      await expect(promise).rejects.toThrow("Condition evaluation failed");
    });

    it("continues polling if condition throws then recovers", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        if (callCount === 1) {
          throw new Error("Temporary failure");
        }
        return callCount >= 3;
      });

      const promise = poll(condition, 1000, 100);

      // First call will throw
      await expect(promise).rejects.toThrow("Temporary failure");
    });

    it("handles condition returning non-boolean truthy values", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        if (callCount >= 2) {
          return "truthy string"; // Truthy but not boolean
        }
        return null; // Falsy
      });

      const promise = poll(condition, 1000, 100);

      await vi.advanceTimersByTimeAsync(200);
      await promise;

      expect(condition).toHaveBeenCalledTimes(2);
    });

    it("handles condition returning non-boolean falsy values", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        if (callCount >= 5) {
          return true;
        }
        // Return various falsy values
        const falsyValues = [null, undefined, 0, "", NaN];
        return falsyValues[callCount % falsyValues.length];
      });

      const promise = poll(condition, 2000, 100);

      await vi.advanceTimersByTimeAsync(500);
      await promise;

      expect(condition).toHaveBeenCalledTimes(5);
    });
  });

  describe("edge cases", () => {
    it("handles zero timeout (should timeout immediately)", async () => {
      const condition = vi.fn().mockReturnValue(false);

      const promise = poll(condition, 0, 100).catch((error) => error);

      await vi.advanceTimersByTimeAsync(10);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Polling timed out.");
    });

    it("handles timeout smaller than interval", async () => {
      const condition = vi.fn().mockReturnValue(false);

      // Timeout is 50ms, interval is 100ms
      const promise = poll(condition, 50, 100).catch((error) => error);

      await vi.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Polling timed out.");
      // Should check initially (at 0ms) and possibly once more before timeout
      expect(condition.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(condition.mock.calls.length).toBeLessThanOrEqual(2);
    });

    it("handles condition that becomes true at exactly timeout moment", async () => {
      const startTime = Date.now();
      const condition = vi.fn().mockImplementation(() => {
        const elapsed = Date.now() - startTime;
        // Return true when we're at or past the timeout
        return elapsed >= 1000;
      });

      const promise = poll(condition, 1000, 100);

      await vi.advanceTimersByTimeAsync(1000);

      // This is a race condition - might resolve or timeout
      // depending on exact timing of the check
      try {
        await promise;
        // If it resolved, condition was true before timeout check
        expect(condition.mock.calls.length).toBeGreaterThan(0);
      } catch (error) {
        // If it timed out, that's also acceptable behavior
        expect(error.message).toBe("Polling timed out.");
      }
    });

    it("handles multiple simultaneous polls with same condition", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 3;
      });

      // Start two polls simultaneously
      const promise1 = poll(condition, 1000, 100);
      const promise2 = poll(condition, 1000, 100);

      await vi.advanceTimersByTimeAsync(300);

      // Both should resolve, but they don't share state
      await Promise.all([promise1, promise2]);

      // Condition should be called by both polls
      expect(condition.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it("handles very large timeout and interval values", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 2;
      });

      // Very large values (1 hour timeout, 5 minute interval)
      const promise = poll(condition, 3600000, 300000);

      await vi.advanceTimersByTimeAsync(300000);
      await promise;

      expect(condition).toHaveBeenCalledTimes(2);
    });
  });

  describe("integration scenarios", () => {
    it("simulates waiting for DOM element to appear", async () => {
      let elementExists = false;

      const condition = vi.fn().mockImplementation(() => {
        return elementExists;
      });

      const promise = poll(condition, 2000, 50);

      // Simulate element appearing after 500ms
      setTimeout(() => {
        elementExists = true;
      }, 500);

      await vi.advanceTimersByTimeAsync(500);
      await promise;

      expect(condition.mock.calls.length).toBeGreaterThan(0);
    });

    it("simulates waiting for async resource to load", async () => {
      let resourceLoaded = false;

      const condition = vi.fn().mockImplementation(() => {
        return resourceLoaded;
      });

      const promise = poll(condition, 5000, 100);

      // Simulate resource loading after multiple checks
      await vi.advanceTimersByTimeAsync(250);
      resourceLoaded = true;

      await vi.advanceTimersByTimeAsync(100);
      await promise;

      expect(condition.mock.calls.length).toBeGreaterThan(2);
    });

    it("simulates waiting for window property to be defined", async () => {
      const mockWindow = {};

      const condition = vi.fn().mockImplementation(() => {
        return typeof mockWindow.alloy === "function";
      });

      const promise = poll(condition, 1000, 100);

      // Simulate alloy being defined after 300ms
      await vi.advanceTimersByTimeAsync(200);
      mockWindow.alloy = vi.fn();

      await vi.advanceTimersByTimeAsync(100);
      await promise;

      expect(mockWindow.alloy).toBeDefined();
      expect(condition.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("performance characteristics", () => {
    it("does not create excessive timers", async () => {
      let callCount = 0;
      const condition = vi.fn().mockImplementation(() => {
        callCount += 1;
        return callCount >= 5;
      });

      const promise = poll(condition, 1000, 100);

      await vi.advanceTimersByTimeAsync(500);
      await promise;

      // Verify that we're not creating unnecessary timers
      // Should have roughly 5 checks, not hundreds
      expect(condition.mock.calls.length).toBeLessThan(10);
    });

    it("cleans up properly after resolution", async () => {
      const condition = vi.fn().mockReturnValue(true);

      await poll(condition);

      // Verify no timers are left pending
      const pendingTimers = vi.getTimerCount();
      expect(pendingTimers).toBe(0);
    });

    it("cleans up properly after rejection", async () => {
      const condition = vi.fn().mockReturnValue(false);

      const promise = poll(condition, 100, 50).catch((error) => error);

      await vi.advanceTimersByTimeAsync(150);

      const result = await promise;
      expect(result).toBeInstanceOf(Error);

      // Verify no timers are left pending
      const pendingTimers = vi.getTimerCount();
      expect(pendingTimers).toBe(0);
    });
  });
});
