/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { useEffect, useState } from "react";
import fetchConfig from "../../configuration/utils/fetchConfig";

/**
 * A custom React hook that calls the `fetchConfig` function to get the Blackbird
 * configuration for the specified org, sandbox, and edge config ID. Returns the
 * result as well as the loading state and any errors that arise.
 * @param {Object} options
 * @param {string} options.authOrgId The org ID tied to the authenticated user
 * @param {string} options.configOrgId The org ID tied to the datastream configuration.
 * @param {string} options.imsAccess The IMS access token.
 * @param {string} options.edgeConfigId The ID of the datastream.
 * @param {string} options.sandbox The sandbox containing the datastream.
 * @param {{ current: { [key: string]: any } }} options.requestCache
 * @returns {{ result: any, isLoading: boolean, error: any }}
 */
export const useFetchConfig = ({
  authOrgId,
  configOrgId,
  imsAccess,
  edgeConfigId,
  sandbox,
  requestCache,
}) => {
  const cacheKey = `${authOrgId}-${sandbox}-${edgeConfigId}`;
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (authOrgId !== configOrgId || !edgeConfigId || !sandbox || !imsAccess) {
      setResult(null);
      return;
    }
    setIsLoading(true);
    let request;
    if (requestCache.current[cacheKey]) {
      request = requestCache.current[cacheKey];
    } else {
      request = fetchConfig({
        orgId: authOrgId,
        imsAccess,
        edgeConfigId,
        sandbox,
        signal: null,
      });
      requestCache.current[cacheKey] = request;
    }
    request
      .then((response) => {
        const { data: { settings = {} } = {} } = response;
        setResult(settings);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [authOrgId, configOrgId, imsAccess, edgeConfigId, sandbox]);
  return { result, isLoading, error };
};
