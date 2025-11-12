/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND,, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Polls for a condition to be true.
 * @param {Function} condition A function that returns a boolean.
 * @param {number} timeout The maximum time to poll in milliseconds.
 * @param {number} interval The time to wait between checks in milliseconds.
 * @returns {Promise<void>} A promise that resolves when the condition is true,
 * or rejects when the timeout is reached.
 */
export const poll = (condition, timeout = 1000, interval = 100) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error("Polling timed out."));
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
};
