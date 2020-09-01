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

const PLATFORM_HOST_PROD = "https://platform.adobe.io";
const PLATFORM_HOST_STAGING = "https://platform-stage.adobe.io";

const IMS_HOST_PREFIX_PROD = "ims-na1";
const IMS_HOST_PREFIX_STAGING = "ims-na1-stg1";

export default {
  /**
   * Returns the platform hostname appropriate for the token IMS environment
   * @return {string}
   */
  getHost: ({ imsAccess }) => {
    const tokenParts = imsAccess.split(".");
    if (!tokenParts[1]) {
      return PLATFORM_HOST_PROD;
    }

    /**
     * attempts to read `as` field from access token and use as environment reference
     * NOTE: assumes production
     */
    let environment;
    try {
      environment = imsAccess
        ? JSON.parse(atob(tokenParts[1])).as
        : IMS_HOST_PREFIX_PROD;
    } catch (e) {
      // catches json parsing issues
      // NOTE: this token is unlikely to work anyway
      environment = IMS_HOST_PREFIX_PROD;
    }

    // return platform host corresponding to IMS environment
    return environment === IMS_HOST_PREFIX_STAGING
      ? PLATFORM_HOST_STAGING
      : PLATFORM_HOST_PROD;
  },
  getDefaultSandboxName: () => {
    return "prod";
  }
};
