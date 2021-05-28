/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import getBaseRequestHeaders from "./getBaseRequestHeaders";
import * as HTTP_STATUS from "../constants/httpStatus";

const PLATFORM_HOST_PROD = "https://platform.adobe.io";
const PLATFORM_HOST_STAGING = "https://platform-stage.adobe.io";

const IMS_HOST_PREFIX_PROD = "ims-na1";
const IMS_HOST_PREFIX_STAGING = "ims-na1-stg1";

const ERROR_CODE_INVALID_ACCESS_TOKEN = "401013";
const ERROR_CODE_USER_REGION_MISSING = "403027";

const ERROR_UNEXPECTED_SERVER_RESPONSE = "Unexpected server response.";
const ERROR_INVALID_ACCESS_TOKEN = "Your access token appears to be invalid.";
const ERROR_NO_AEP_ACCESS =
  "Your user account is not enabled for AEP access. Please contact your organization administrator.";
const ERROR_RESOURCE_NOT_FOUND = "Resource not found.";

/**
 * Returns the platform hostname appropriate for the token IMS environment
 * @return {string}
 */
const getHost = ({ imsAccess }) => {
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
};

export default async ({ orgId, imsAccess, path, params, headers, signal }) => {
  const host = getHost({ imsAccess });
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });
  const queryString = params ? `?${params.toString()}` : "";

  const response = await fetch(`${host}${path}${queryString}`, {
    headers: {
      ...baseRequestHeaders,
      ...headers
    },
    signal
  });

  if (response.status === HTTP_STATUS.NOT_FOUND) {
    throw new Error(ERROR_RESOURCE_NOT_FOUND);
  }

  let parsedBody;

  // Be aware that this can throw an error not only if the response
  // body is invalid JSON but also if the request has been aborted.
  try {
    parsedBody = await response.json();
  } catch (e) {
    if (e.name === "AbortError") {
      throw e;
    }
    throw new Error(ERROR_UNEXPECTED_SERVER_RESPONSE);
  }

  if (
    response.status === HTTP_STATUS.UNAUTHORIZED &&
    parsedBody.error_code === ERROR_CODE_INVALID_ACCESS_TOKEN
  ) {
    throw new Error(ERROR_INVALID_ACCESS_TOKEN);
  }

  if (
    response.status === HTTP_STATUS.FORBIDDEN &&
    parsedBody.error_code === ERROR_CODE_USER_REGION_MISSING
  ) {
    throw new Error(ERROR_NO_AEP_ACCESS);
  }

  if (!response.ok) {
    throw new Error(ERROR_UNEXPECTED_SERVER_RESPONSE);
  }

  return {
    status: response.status,
    parsedBody
  };
};
