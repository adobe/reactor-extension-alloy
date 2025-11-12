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

// eslint-disable-next-line import/extensions
import { poll } from "./poll.js";

/**
 * Creates a proxy function for a preinstalled Alloy instance.
 * The proxy waits for the external instance to be loaded and configured
 * before forwarding commands to it.
 *
 * @param {String} name - The instance name to look for on window
 * @param {Object} [options={}] - Configuration options
 * @param {Number} [options.timeout=1000] - Max time to wait for instance (ms)
 * @param {Number} [options.interval=100] - Polling interval (ms)
 * @param {Number} [options.configTimeout=5000] - Max time to wait for getLibraryInfo (ms)
 * @param {Function} [options.onWarn] - Warning callback (msg) => void
 * @param {Function} [options.onError] - Error callback (msg) => void
 * @return {Function} - Proxy function that forwards to real instance
 */
export const createPreinstalledProxy = (name, options = {}) => {
  const {
    timeout = 1000,
    interval = 100,
    configTimeout = 5000,
    // eslint-disable-next-line no-console
    onWarn = console.warn,
    onError = console.error,
  } = options;

  let realInstancePromise;
  let realInstance = null;

  const getRealInstance = async () => {
    // Verify that the instance is loaded on the window
    try {
      await poll(() => typeof window[name] === "function", timeout, interval);
      // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
    } catch (err) {
      onWarn(
        `Alloy instance "${name}" not found on window after ${timeout}ms. ` +
          `Make sure the instance is loaded before the Launch library.`,
      );
      return null;
    }

    const instance = window[name];

    // Verify that the instance is configured by calling getLibraryInfo
    try {
      await Promise.race([
        instance("getLibraryInfo"),
        new Promise((_, reject) =>
          // eslint-disable-next-line no-promise-executor-return
          setTimeout(
            () => reject(new Error("Configuration check timeout")),
            configTimeout,
          ),
        ),
      ]);
      // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
    } catch (err) {
      onWarn(
        `Alloy instance "${name}" failed configuration check. ` +
          `Make sure the instance is configured before loading the Launch library.`,
      );
      return null;
    }

    // Cache the real instance for direct access
    realInstance = instance;
    return instance;
  };

  // Return proxy function
  return (...args) => {
    // If we already have the real instance cached, use it directly
    if (realInstance) {
      return realInstance(...args);
    }

    // Otherwise, start polling (or reuse existing promise)
    if (!realInstancePromise) {
      realInstancePromise = getRealInstance().catch((err) => {
        // Reset promise on failure to allow retry on next command
        realInstancePromise = null;
        throw err;
      });
    }

    return realInstancePromise.then((instance) => {
      if (instance) {
        return instance(...args);
      }

      // Reset promise to allow retry on next command
      realInstancePromise = null;

      onError(
        `Cannot execute command on "${name}" - instance not available. ` +
          `Make sure alloy.js is loaded and configured before the Launch library.`,
      );

      return Promise.reject(
        new Error(`Alloy instance "${name}" not available`),
      );
    });
  };
};
