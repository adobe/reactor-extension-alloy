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

// Type definitions for @adobe/jwt-auth 0.3
// Project: https://github.com/adobe/jwt-auth#readme

export = authorize;

declare function authorize(
  options: authorize.JWTAuthConfig
): Promise<authorize.JWTAuthResponse>;

declare namespace authorize {
  export interface JWTAuthConfig {
    clientId: string;
    technicalAccountId: string;
    orgId: string;
    clientSecret: string;
    privateKey: string;
    passphrase?: string;
    metaScopes: string | string[];
    ims?: string;
  }

  export interface JWTAuthResponse {
    token_type: "bearer";
    access_token: string;
    expires_in: number;
  }
}
