/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { CLIENT_ID, API_PRODUCTION_URL } from "../constants/api";

let fetchSettings = { imsOrgId: null, token: null };

export default (url, options = {}) =>
  new Promise((resolve, reject) => {
    options = Object.assign({}, { method: "GET", body: "" }, options);

    if (!fetchSettings.imsOrgId || !fetchSettings.token) {
      reject(
        new Error(
          JSON.stringify({
            errorMessage:
              "No settings were found. You need to call `updateFetchSettings` before using `fetch`."
          })
        )
      );
    }

    const xhr = new XMLHttpRequest();

    xhr.open(options.method, `${API_PRODUCTION_URL}${url}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-api-key", CLIENT_ID);
    xhr.setRequestHeader("x-gw-ims-org-id", fetchSettings.imsOrgId);
    xhr.setRequestHeader("Authorization", `Bearer ${fetchSettings.token}`);

    if (options.headers) {
      Object.keys(options.headers).forEach(headerName => {
        xhr.setRequestHeader(headerName, options.headers[headerName]);
      });
    }

    xhr.onload = function onload() {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        let response;
        try {
          response = JSON.parse(xhr.response);
        } catch (e) {
          response = {};
        }

        reject(
          new Error(
            JSON.stringify({
              statusCode: this.status,
              errorCode: response.error_code,
              errorMessage:
                response.message ||
                (response.report && response.report.message) ||
                xhr.statusText
            })
          )
        );
      }
    };

    xhr.onerror = function onerror() {
      reject(
        new Error(
          JSON.stringify({
            statusCode: this.status,
            errorMessage: xhr.statusText
          })
        )
      );
    };

    xhr.send(JSON.stringify(options.body));
  });

export const updateFetchSettings = settings => {
  fetchSettings = settings;
};

export const getFetchSettings = () => fetchSettings;
