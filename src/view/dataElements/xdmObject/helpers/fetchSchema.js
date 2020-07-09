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

import getBaseRequestHeaders from "../../../utils/getBaseRequestHeaders";
import platform from "./platform";

export default ({ orgId, imsAccess, schemaMeta }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });
  const schemaMajorVersion = schemaMeta.version.split(".")[0];

  return fetch(
    `${platform.getHost()}/data/foundation/schemaregistry/tenant/schemas/${encodeURIComponent(
      schemaMeta.$id
    )}`,
    {
      headers: {
        ...baseRequestHeaders,
        // The first part of this ensures all json-schema refs are resolved within the schema we retrieve.
        Accept: `application/vnd.adobe.xed-full+json;version=${schemaMajorVersion}`
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("Cannot fetch schema from schema registry");
      }
      return response.json();
    })
    .then(responseBody => responseBody);
};

/**
 * Retrieves the schema configured for the dataset that is configured
 * for an edge configuration.
 * @param {string} configId Edge configuration ID
 * @param {string} orgId Experience Cloud organization ID
 * @param {string} imsAccess IMS auth token
 * @returns {Promise} Promise to be resolved with the schema.
 */
export default ({ configId, orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });
  return fetchDatasetIdFromEdgeConfig({ baseRequestHeaders, configId })
    .then(datasetId => {
      return datasetId
        ? fetchSchemaRefFromDataSet({ baseRequestHeaders, datasetId })
        : undefined;
    })
    .then(schemaRef => {
      return schemaRef
        ? fetchSchema({ baseRequestHeaders, schemaRef })
        : undefined;
    });
};
