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
import uniq from "uniq";

const EDGE_CONFIG_HOST = "https://edge.adobe.io";
const PLATFORM_HOST = "https://platform.adobe.io";

const schemaVersionRegexForContentType = /version=(\d+)/;

const getVersionFromSchemaRefContentType = contentType => {
  // Example: application/vnd.adobe.xed-full+json;version=1
  // The value that comes before "version" is not guaranteed.
  const match = contentType.match(schemaVersionRegexForContentType);
  return match[1];
};

const compareSchemaRefs = (schemaRef1, schemaRef2) => {
  return schemaRef1.id === schemaRef2.id &&
    schemaRef1.version === schemaRef2.version
    ? 0
    : -1;
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

const fetchInstancesMeta = ({ baseRequestHeaders, schemaRef }) => {
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
        // The first part of this ensures all json-schema refs are resolved within the schema we retrieve.
        Accept: `application/vnd.adobe.xed-full+json;version=${schemaMajorVersion}`
      }
    }
  )
    .then(response => response.json())
    .then(responseBody => responseBody);
};

const fetchSchemas = ({ baseRequestHeaders, schemaRefs }) => {
  const uniqueSchemaRefs = uniq(schemaRefs, compareSchemaRefs);
  const fetchSchemasPromises = uniqueSchemaRefs.map(schemaRef => {
    return fetchInstancesMeta({ baseRequestHeaders, schemaRef });
  });

  return Promise.all(fetchSchemasPromises).then(schemas => {
    return uniqueSchemaRefs.reduce((schemaBySchemaRefMap, schemaRef, index) => {
      schemaBySchemaRefMap.set(schemaRef, schemas[index]);
      return schemaBySchemaRefMap;
    }, new Map());
  });
};

const fetchSchemaRefsFromDatasets = ({ baseRequestHeaders, datasetIds }) => {
  const uniqueDatasetIds = uniq(datasetIds);
  const commaDelimitedDatasetIds = uniqueDatasetIds.join(",");
  return fetch(
    `${PLATFORM_HOST}/data/foundation/catalog/dataSets/${commaDelimitedDatasetIds}?properties=schemaRef`,
    {
      headers: baseRequestHeaders
    }
  )
    .then(response => {
      if (!response.ok) {
        // TODO
      }
      return response.json();
    })
    .then(responseBody => {
      return uniqueDatasetIds.reduce((schemaRefByDatasetId, datasetId) => {
        if (responseBody[datasetId]) {
          schemaRefByDatasetId[datasetId] = responseBody[datasetId].schemaRef;
        }
        return schemaRefByDatasetId;
      }, {});
    });
};

const fetchDatasetIdsFromEdgeConfigs = ({ baseRequestHeaders, configIds }) => {
  const uniqueConfigIds = uniq(configIds);
  const fetchDatasetIdsPromises = uniqueConfigIds.map(configId => {
    return fetchDatasetIdFromEdgeConfig({ baseRequestHeaders, configId });
  });
  // TODO What if we don't get a dataaset ID back for an edge config (which can happen!)
  return Promise.all(fetchDatasetIdsPromises).then(datasetIds => {
    return uniqueConfigIds.reduce(
      (datasetIdByEdgeConfigId, configId, index) => {
        datasetIdByEdgeConfigId[configId] = datasetIds[index];
        return datasetIdByEdgeConfigId;
      },
      {}
    );
  });
};

export default ({ extensionSettings, orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });

  const instancesMeta = extensionSettings.instances.map(instance => {
    return {
      name: instance.name,
      configId: instance.configId
    };
  });

  const configIds = extensionSettings.instances.map(
    instance => instance.configId
  );

  return fetchDatasetIdsFromEdgeConfigs({ baseRequestHeaders, configIds })
    .then(datasetIdByEdgeConfigId => {
      instancesMeta.forEach(instanceInfo => {
        instanceInfo.datasetId = datasetIdByEdgeConfigId[instanceInfo.configId];
      });

      const datasetIds = Object.values(datasetIdByEdgeConfigId);
      return fetchSchemaRefsFromDatasets({
        baseRequestHeaders,
        instancesInfo: instancesMeta,
        datasetIds
      });
    })
    .then(schemaRefByDataSet => {
      const schemaRefs = [];
      instancesMeta.forEach(instanceInfo => {
        instanceInfo.schemaRef = schemaRefByDataSet[instanceInfo.datasetId];
        schemaRefs.push(instanceInfo.schemaRef);
      });
      return fetchSchemas({ baseRequestHeaders, schemaRefs });
    })
    .then(schemasBySchemaRefMap => {
      instancesMeta.forEach(instanceInfo => {
        instanceInfo.schema = schemasBySchemaRefMap.get(instanceInfo.schemaRef);
      });

      return instancesMeta;
    });
};
