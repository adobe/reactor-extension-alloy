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

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const EDGE_ENDPOINT = /v1\/(interact|collect)\?configId=/;
const DEFAULT_TIMEOUT = 10000; // 10 seconds

export default function createNetworkLogger() {
  let requests = [];
  let responses = [];

  const server = setupServer(
    http.all('*', async ({ request }) => {
      // Only track edge endpoint requests
      if (EDGE_ENDPOINT.test(request.url)) {
        requests.push(request);
      }
      const response = await HttpResponse.json({});
      responses.push(response);
      return response;
    })
  );

  return {
    start() {
      server.listen();
    },

    stop() {
      server.close();
    },

    reset() {
      requests = [];
      responses = [];
      server.resetHandlers();
    },

    getRequests() {
      return requests;
    },

    getResponses() {
      return responses;
    },

    count() {
      return requests.length;
    },

    async waitForRequest(predicate = () => true, timeout = DEFAULT_TIMEOUT) {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timed out waiting for request after ${timeout}ms`));
        }, timeout);

        const checkRequests = () => {
          const request = requests.find(predicate);
          if (request) {
            clearTimeout(timeoutId);
            resolve(request);
          } else {
            setTimeout(checkRequests, 100);
          }
        };
        checkRequests();
      });
    },

    async waitForRequestCount(count, timeout = DEFAULT_TIMEOUT) {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timed out waiting for ${count} requests after ${timeout}ms`));
        }, timeout);

        const checkCount = () => {
          if (requests.length >= count) {
            clearTimeout(timeoutId);
            resolve();
          } else {
            setTimeout(checkCount, 100);
          }
        };
        checkCount();
      });
    }
  };
} 