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

const fetchConfigEnvironmentsFromEdgeConfig = ({
  edgeConfigId,
  baseRequestHeaders
}) => {
  return fetch(
    `${EDGE_CONFIG_HOST}/configs/user/edge/${edgeConfigId}/environments?size=100`,
    {
      headers: baseRequestHeaders
    }
  )
    .then(response => response.json())
    .then(responseBody => {
      const result = {
        edgeConfigId,
        production: [],
        staging: [],
        development: []
      };
      if (["nostaging", "nodev", "1dev", "3dev"].indexOf(edgeConfigId) > -1) {
        result.production.push({
          label: "My Production Env",
          value: `${edgeConfigId}:prod`
        });
      }
      if (["noprod", "nodev", "1dev", "3dev"].indexOf(edgeConfigId) > -1) {
        result.staging.push({
          label: "My Staging Env",
          value: `${edgeConfigId}:stage`
        });
      }
      if (["noprod", "nostaging", "1dev", "3dev"].indexOf(edgeConfigId) > -1) {
        result.development.push({
          label: "My Development Env 1",
          value: `${edgeConfigId}:dev1`
        });
      }
      if (edgeConfigId === "3dev") {
        result.development.push({
          label: "My Development Env 2",
          value: `${edgeConfigId}:dev2`
        });
        result.development.push({
          label: "My Development Env 3",
          value: `${edgeConfigId}:dev3`
        });
      }

      // eslint-disable-next-line no-underscore-dangle
      if (!responseBody._embedded || !responseBody._embedded.environments) {
        return result;
      }

      // eslint-disable-next-line no-underscore-dangle
      return responseBody._embedded.environments.reduce((memo, environment) => {
        if (memo[environment.type]) {
          memo[environment.type].push({
            value: environment.compositeId,
            label: environment.title
          });
        }
        return memo;
      }, result);
    });
};

/**
 * Retrieves the edge configurations that the user has access to.
 * @param {string} orgId Experience Cloud organization ID
 * @param {string} imsAccess IMS auth token
 * @returns {Promise} Promise to be resolved with an array of config objects
 */
export default ({ edgeConfigId, orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });
  return fetchConfigEnvironmentsFromEdgeConfig({
    edgeConfigId,
    baseRequestHeaders
  });
};
