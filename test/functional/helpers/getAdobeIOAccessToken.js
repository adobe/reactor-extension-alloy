/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import auth from "@adobe/jwt-auth";
import adobeIOClientCredentials from "./adobeIOClientCredentials";

let accessToken;

/**
 * Retrieves an access token for the Adobe I/O integration used for
 * running end-to-end tests.
 * @returns {Promise<string>}
 */
export default async () => {
  if (accessToken) {
    return accessToken;
  }
  const result = await auth(adobeIOClientCredentials);
  accessToken = result.access_token;
  return accessToken;
};
