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
const PLATFORM_HOST = "https://platform.adobe.io";

const schemaVersionRegexForContentType = /version=(\d+)/;

const getVersionFromSchemaRefContentType = contentType => {
  // contentType example: application/vnd.adobe.xed-full+json;version=1
  // The value that comes before "version" is not guaranteed, which is
  // why we can't use contentType directly for fetching a schema, but
  // instead must parse out the version.
  const match = contentType.match(schemaVersionRegexForContentType);
  return match[1];
};

const getBaseRequestHeaders = ({ orgId, imsAccess }) => {
  return {
    "x-api-key": "Activation-DTM",
    "x-gw-ims-org-id": orgId,
    Authorization: `Bearer ${imsAccess}`,
    "Content-Type": "application/json"
  };
};

const fetchDatasetIdFromEdgeConfig = ({ baseRequestHeaders, configId }) => {
  return fetch(
    `${EDGE_CONFIG_HOST}/configs/user/edge/${configId}/environments`,
    {
      headers: baseRequestHeaders
    }
  )
    .then(response => response.json())
    .then(responseBody => {
      // eslint-disable-next-line no-underscore-dangle
      if (!responseBody._embedded || !responseBody._embedded.environments) {
        return undefined;
      }

      // eslint-disable-next-line no-underscore-dangle
      const prodEnvironment = responseBody._embedded.environments.find(
        environment => environment.type === "production"
      );

      if (
        prodEnvironment &&
        prodEnvironment.settings &&
        prodEnvironment.settings.com_adobe_experience_platform &&
        prodEnvironment.settings.com_adobe_experience_platform.datasets &&
        prodEnvironment.settings.com_adobe_experience_platform.datasets.event
      ) {
        return prodEnvironment.settings.com_adobe_experience_platform.datasets
          .event.datasetId;
      }

      return undefined;
    });
};

const fetchSchemaRefFromDataSet = ({ baseRequestHeaders, datasetId }) => {
  return fetch(
    `${PLATFORM_HOST}/data/foundation/catalog/dataSets/${datasetId}`,
    {
      headers: baseRequestHeaders
    }
  )
    .then(response => response.json())
    .then(responseBody => responseBody[datasetId].schemaRef);
};

const fetchSchema = ({ baseRequestHeaders, schemaRef }) => {
  const schemaMajorVersion = getVersionFromSchemaRefContentType(
    schemaRef.contentType
  );
  return fetch(
    `${PLATFORM_HOST}/data/foundation/schemaregistry/tenant/schemas/${encodeURIComponent(
      schemaRef.id
    )}`,
    {
      headers: {
        ...baseRequestHeaders,
        Accept: `application/vnd.adobe.xed-full+json;version=${schemaMajorVersion}`
      }
    }
  )
    .then(response => response.json())
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
