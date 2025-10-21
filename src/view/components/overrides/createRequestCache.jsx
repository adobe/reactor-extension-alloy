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
 * Creates a request cache.
 * @returns {function} - A function that caches requests.
 */
export default () => {
  const cache = {};

  /**
   * Returns a promise that resolves to the result of the request.
   * If the request is already in the cache, it will return the cached promise.
   * If the request is not in the cache, it will create a new promise and add it to the cache.
   * If the signal is aborted, it will only abort the request if all other requests for the same key have been aborted.
   * @param {string} key - The key to cache the request under.
   * @param {AbortSignal} signal - The signal to abort the request if all other requests for the same key have been aborted.
   * @param {(signal: AbortSignal) => Promise<any>} makeRequest - The request function to cache.
   * @returns {Promise<any>}
   */
  return (key, signal, makeRequest) => {
    let cacheItem = cache[key];
    if (cacheItem) {
      cacheItem.activeCount++;
    } else {
      const abortController = new AbortController();
      cacheItem = {
        activeCount: 1,
        abortController,
        promise: makeRequest(abortController.signal),
      };
      cache[key] = cacheItem;
    }
    if (!cacheItem.abortController) {
      cacheItem.activeCount = 1;
      cacheItem.abortController = new AbortController();
      cacheItem.promise = makeRequest(cacheItem.abortController.signal);
    } else {
      cacheItem.activeCount++;
    }
    if (signal) {
      signal.addEventListener("abort", () => {
        cacheItem.activeCount -= 1;
        if (cacheItem.activeCount === 0) {
          cacheItem.abortController.abort();
        }
      });
    }
    return cacheItem.promise;
  }
}
