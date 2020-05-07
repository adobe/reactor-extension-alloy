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

const EDGE_CONFIG_HOST = "https://edge.adobe.io";

const getBaseRequestHeaders = ({ orgId, imsAccess }) => {
  return {
    "x-api-key": "Activation-DTM",
    "x-gw-ims-org-id": orgId,
    Authorization: `Bearer ${imsAccess}`,
    "Content-Type": "application/json"
  };
};

const fetchConfigsFromEdgeConfig = ({ baseRequestHeaders }) => {
  return fetch(`${EDGE_CONFIG_HOST}/configs/user/edge?size=100`, {
    headers: baseRequestHeaders
  })
    .then(response => response.json())
    .then(responseBody => {
      // eslint-disable-next-line no-underscore-dangle
      if (!responseBody._embedded || !responseBody._embedded.configs) {
        return [];
      }

      // eslint-disable-next-line no-underscore-dangle
      return responseBody._embedded.configs
        .map(config => ({
          label: config.title,
          value: config.id
        }));
    });
};

/**
 * Retrieves the edge configurations that the user has access to.
 * @param {string} orgId Experience Cloud organization ID
 * @param {string} imsAccess IMS auth token
 * @returns {Promise} Promise to be resolved with an array of config objects
 */
export default ({ orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });
  return fetchConfigsFromEdgeConfig({ baseRequestHeaders });
};
