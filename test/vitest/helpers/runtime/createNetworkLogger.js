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

const EDGE_ENDPOINT_REGEX = /edge\.adobedc\.net/;

const createRequestLogger = (endpoint = EDGE_ENDPOINT_REGEX) => {
  let requests = [];
  let isStarted = false;
  let server = null;

  const start = () => {
    if (!isStarted) {
      console.log('Starting request logger...');
      server = setupServer(
        http.all('*', async ({ request }) => {
          const url = new URL(request.url);
          console.log('Intercepted request to:', url.toString());
          
          if (endpoint instanceof RegExp ? endpoint.test(url.toString()) : url.toString().includes(endpoint)) {
            console.log('Request matches endpoint pattern');
            
            let requestBody;
            try {
              requestBody = await request.clone().json();
              console.log('Request body:', JSON.stringify(requestBody, null, 2));
            } catch (e) {
              console.log('Failed to parse request body:', e);
              requestBody = null;
            }
            
            const requestHeaders = Object.fromEntries(request.headers.entries());
            console.log('Request headers:', requestHeaders);
            
            const requestObj = {
              url: url.toString(),
              method: request.method,
              headers: requestHeaders,
              body: requestBody,
              json: async () => requestBody
            };
            
            requests.push(requestObj);
            console.log('Added request to log. Total requests:', requests.length);

            return HttpResponse.json({
              handle: [{
                type: "identity:result",
                payload: [{
                  id: "12581525282081748314129365414154872480",
                  namespace: {
                    code: "ECID"
                  }
                }]
              }],
              requestId: '1234567890',
              state: {
                entries: [],
                metadata: {}
              }
            }, {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
          
          console.log('Request does not match endpoint pattern');
          return null;
        })
      );
      
      server.listen({ onUnhandledRequest: 'bypass' });
      isStarted = true;
      console.log('Network logger started and listening');
    }
  };

  const stop = () => {
    if (isStarted && server) {
      console.log('Stopping request logger...');
      server.close();
      isStarted = false;
      server = null;
    }
  };

  const clearLogs = () => {
    console.log('Clearing request logger...');
    requests = [];
  };

  const waitForRequestCount = (count, timeout = 10000) => {
    console.log(`Waiting for ${count} requests...`);
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        const currentCount = requests.length;
        console.log('Current request count:', currentCount, 'waiting for:', count);
        
        if (currentCount >= count) {
          clearInterval(intervalId);
          console.log('Request count reached');
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(intervalId);
          console.log('Request count wait timed out');
          reject(new Error(`Timed out waiting for ${count} requests after ${timeout}ms`));
        }
      }, 100);
    });
  };

  return {
    start,
    stop,
    clearLogs,
    waitForRequestCount,
    edgeEndpointLogs: {
      get requests() {
        return requests;
      }
    }
  };
};

export default createRequestLogger; 