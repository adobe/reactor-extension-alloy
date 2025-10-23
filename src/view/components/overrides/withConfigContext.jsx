/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import fetchConfig from "../../configuration/utils/fetchConfig";
import deepAssign from "../../utils/deepAssign";
import { PRODUCTION, DEVELOPMENT, STAGING } from "../../configuration/constants/environmentType";

const updateContext = (context, settings) => {

  context.com_adobe_analytics = {
    reportSuites: [],
  };
  context.com_adobe_target = {
    propertyTokens: [],
  };
  context.com_adobe_identity = {
    idSyncContainerIds: [],
  };
  context.com_adobe_experience_platform = {
    eventDatasets: [],
  };

  if (settings.com_adobe_analytics?.reportSuites) {
    context.com_adobe_analytics.reportSuites.push(...settings.com_adobe_analytics.reportSuites);
  }
  if (settings.com_adobe_analytics?.reportSuites__additional) {
    context.com_adobe_analytics.reportSuites.push(...settings.com_adobe_analytics.reportSuites__additional);
  }

  if (settings.com_adobe_target?.propertyToken) {
    context.com_adobe_target.propertyTokens.push(settings.com_adobe_target.propertyToken);
  }
  if (settings.com_adobe_target?.propertyToken__additional) {
    context.com_adobe_target.propertyTokens.push(...settings.com_adobe_target.propertyToken__additional);
  }

  if (settings.com_adobe_identity?.idSyncContainerId) {
    context.com_adobe_identity.idSyncContainerIds.push(settings.com_adobe_identity.idSyncContainerId);
  }
  if (settings.com_adobe_identity?.idSyncContainerId__additional) {
    context.com_adobe_identity.idSyncContainerIds.push(...settings.com_adobe_identity.idSyncContainerId__additional);
  }

  if (settings.com_adobe_experience_platform?.datasets?.event) {
    context.com_adobe_experience_platform.eventDatasets =
      settings.com_adobe_experience_platform.datasets.event
        .map(dataset => dataset.datasetId);
  }
}

const getFormikValuesFromDatastreamConfig = (settings) => {

  const values = {
    com_adobe_experience_platform: {
      server: {
        enabled: true,
        datasetId: "",
      },
      com_adobe_edge_ode: {
        server: {
          enabled: true,
        }
      },
      com_adobe_edge_segmentation: {
        server: {
          enabled: true,
        }
      },
      com_adobe_edge_destinations: {
        server: {
          enabled: true,
        }
      },
      com_adobe_edge_ajo: {
        server: {
          enabled: true,
        }
      },
    },
    com_adobe_analytics: {
      server: {
        enabled: true,
        reportSuites: [],
      },
    },
    com_adobe_identity: {
      server: {
        enabled: true,
        idSyncContainerId: "",
      },
    },
    com_adobe_target: {
      server: {
        enabled: true,
        propertyTokens: "",
      },
    },
    com_adobe_audiencemanager: {
      server: {
        enabled: true,
      }
    },
    com_adobe_launch_ssf: {
      server: {
        enabled: true,
      }
    },
  };
  if (settings.com_adobe_experience_platform) {
    values.com_adobe_experience_platform.server.enabled = settings.com_adobe_experience_platform.enabled;
    if (settings.com_adobe_experience_platform.datasets?.event) {
      const primaryDataset = settings.com_adobe_experience_platform.datasets.event.find(dataset => dataset.primary);
      if (primaryDataset) {
        values.com_adobe_experience_platform.server.eventDatasetId = primaryDataset.datasetId;
      }
    }
  }
  if (settings.com_adobe_experience_platform_ode) {
    values.com_adobe_experience_platform.com_adobe_edge_ode.server.enabled = settings.com_adobe_experience_platform_ode.enabled;
  }
  if (settings.com_adobe_experience_platform_edge_segmentation) {
    values.com_adobe_experience_platform.com_adobe_edge_segmentation.server.enabled = settings.com_adobe_experience_platform_edge_segmentation.enabled;
  }
  if (settings.com_adobe_experience_platform_edge_destinations) {
    values.com_adobe_experience_platform.com_adobe_edge_destinations.server.enabled = settings.com_adobe_experience_platform_edge_destinations.enabled;
  }
  if (settings.com_adobe_experience_platform_ajo) {
    values.com_adobe_experience_platform.com_adobe_edge_ajo.server.enabled = settings.com_adobe_experience_platform_ajo.enabled;
  }
  if (settings.com_adobe_analytics) {
    values.com_adobe_analytics.server.enabled = settings.com_adobe_analytics.enabled;
    values.com_adobe_analytics.server.reportSuites = settings.com_adobe_analytics.reportSuites;
  }
  if (settings.com_adobe_target) {
    values.com_adobe_target.server.enabled = settings.com_adobe_target.enabled;
    values.com_adobe_target.server.propertyToken = settings.com_adobe_target.propertyToken;
  }
  if (settings.com_adobe_identity) {
    values.com_adobe_identity.server.enabled = settings.com_adobe_identity.idSyncEnabled;
    values.com_adobe_identity.server.idSyncContainerId = settings.com_adobe_identity.idSyncContainerId;
  }
  if (settings.com_adobe_audiencemanager) {
    values.com_adobe_audiencemanager.server.enabled = settings.com_adobe_audiencemanager.enabled;
  }
  if (settings.com_adobe_launch_ssf) {
    values.com_adobe_launch_ssf.server.enabled = settings.com_adobe_launch_ssf.enabled;
  }

  return values;
}

const getFormikValuesFromExtensionConfig = (settings) => {
  const values = {
    com_adobe_experience_platform: {
      extension: {},
      com_adobe_edge_ode: {
        extension: {}
      },
      com_adobe_edge_segmentation: {
        extension: {}
      },
      com_adobe_edge_destinations: {
        extension: {}
      },
      com_adobe_edge_ajo: {
        extension: {}
      },
    },
    com_adobe_analytics: {
      extension: {}
    },
    com_adobe_identity: {
      extension: {}
    },
    com_adobe_target: {
      extension: {}
    },
    com_adobe_audiencemanager: {
      extension: {}
    },
    com_adobe_launch_ssf: {
      extension: {}
    },
  };
  if (settings.com_adobe_experience_platform) {
    values.com_adobe_experience_platform.extension = settings.com_adobe_experience_platform;
  }
  if (settings.com_adobe_experience_platform_ode) {
    values.com_adobe_experience_platform.com_adobe_edge_ode.extension = settings.com_adobe_experience_platform_ode;
  }
  if (settings.com_adobe_experience_platform_edge_segmentation) {
    values.com_adobe_experience_platform.com_adobe_edge_segmentation.extension = settings.com_adobe_experience_platform_edge_segmentation;
  }
  if (settings.com_adobe_experience_platform_edge_destinations) {
    values.com_adobe_experience_platform.com_adobe_edge_destinations.extension = settings.com_adobe_experience_platform_edge_destinations;
  }
  if (settings.com_adobe_experience_platform_ajo) {
    values.com_adobe_experience_platform.com_adobe_edge_ajo.extension = settings.com_adobe_experience_platform_ajo;
  }
  if (settings.com_adobe_analytics) {
    values.com_adobe_analytics.extension = settings.com_adobe_analytics;
  }
  if (settings.com_adobe_target) {
    values.com_adobe_target.extension = settings.com_adobe_target;
  }
  if (settings.com_adobe_identity) {
    values.com_adobe_identity.extension = settings.com_adobe_identity;
  }
  if (settings.com_adobe_audiencemanager) {
    values.com_adobe_audiencemanager.extension = settings.com_adobe_audiencemanager;
  }
  if (settings.com_adobe_launch_ssf) {
    values.com_adobe_launch_ssf.extension = settings.com_adobe_launch_ssf;
  }

  return values;
}

const fetchConfigWithDefault = async ({
  orgId,
  imsAccess,
  imsAccessOrgId,
  edgeConfigId,
  sandbox,
  signal,
  requestCache
}) => {
  if (imsAccessOrgId !== orgId || !edgeConfigId || !sandbox) {
    console.log("fetchConfigWithDefault no orgId, sandbox, or edgeConfigId", imsAccessOrgId, orgId, edgeConfigId, sandbox);
    return {};
  };

  const key = `${orgId}-${sandbox}-${edgeConfigId}`;
  console.log("fetchConfigWithDefault", key);

  return requestCache(key, signal, async (innerSignal) => {
    const { data: { settings = {} } = {} } = await fetchConfig({
      orgId,
      imsAccess,
      edgeConfigId,
      sandbox,
      signal: innerSignal,
    });
    return settings;
  });
}

const runEnvironment = async ({
  context,
  extensionOverrides,
  ...fetchConfigArgs
}) => {

  const settings = await fetchConfigWithDefault(fetchConfigArgs);

  updateContext(context, settings);

  const values1 = getFormikValuesFromDatastreamConfig(settings);
  if (!extensionOverrides) {
    return values1;
  }

  const values2 = getFormikValuesFromExtensionConfig(extensionOverrides);
  deepAssign(values1, values2);
  return values1;
}

export const getActionDependencies = (env) => {
  return [
    "instanceName",
    `edgeConfigOverrides.${env}.datastreamId`,
    `edgeConfigOverrides.${env}.sandbox`,
  ];
}
export const runFromAction = (env, requestCache) => async ({ initInfo, dependencies: [instanceName, edgeConfigId, sandbox], context, signal}) => {

  context.edgeConfigOverrides ||= {};
  context.edgeConfigOverrides[env] ||= {};

  console.log("runFromAction", initInfo, instanceName, edgeConfigId, sandbox);

  const extensionInstance = (initInfo.extensionSettings?.instances || []).find(instance => instance.name === instanceName);
  const instanceOrgId = extensionInstance?.orgId;
  let instanceEdgeConfigId, instanceSandbox;
  if (env === DEVELOPMENT && extensionInstance?.developmentEdgeConfigId) {
    edgeConfigId = extensionInstance.developmentEdgeConfigId;
    sandbox = extensionInstance.developmentSandbox;
  } else if ((env === DEVELOPMENT || env === STAGING) && extensionInstance?.stagingEdgeConfigId) {
    edgeConfigId = extensionInstance.stagingEdgeConfigId;
    sandbox = extensionInstance.stagingSandbox;
  } else {
    edgeConfigId = extensionInstance?.edgeConfigId;
    sandbox = extensionInstance?.sandbox;
  }

  const extensionOverrides = env === PRODUCTION ? extensionInstance?.edgeConfigOverrides
    : extensionInstance?.edgeConfigOverrides?.[env];

  const values = await runEnvironment({
    orgId: instanceOrgId,
    imsAccess: initInfo.tokens.imsAccess,
    imsAccessOrgId: initInfo.company.orgId,
    edgeConfigId: edgeConfigId || instanceEdgeConfigId,
    sandbox: edgeConfigId ? sandbox : instanceSandbox,
    signal,
    context: context.edgeConfigOverrides[env],
    extensionOverrides,
    requestCache,
  });

  return {
    edgeConfigOverrides: {
      [env]: values,
    }
  };
};

export const getConfigurationDependencies = (env) => {
  const dependencies = ["imsOrgId"];
  if (env === DEVELOPMENT) {
    dependencies.push("developmentEdgeConfigId", "developmentSandbox");
  }
  if (env === STAGING || env === DEVELOPMENT) {
    dependencies.push("stagingEdgeConfigId", "stagingSandbox");
  }
  dependencies.push("edgeConfigId", "sandbox");
  return dependencies;
};

export const runFromConfiguration = (env, requestCache) => async ({ initInfo, dependencies: [imsOrgId, ...edgeConfigIds], context, signal}) => {

  context.edgeConfigOverrides ||= {};
  context.edgeConfigOverrides[env] ||= {};

  // find the first non-empty edgeConfigId with its corresponding sandbox
  const index = edgeConfigIds.findIndex((value, index) => index % 2 === 0 && value);
  let edgeConfigId, sandbox;
  if (index !== -1) {
    edgeConfigId = edgeConfigIds[index * 2];
    sandbox = edgeConfigIds[index * 2 + 1];
  }

  const values = await runEnvironment({
    orgId: imsOrgId,
    imsAccess: initInfo.imsAccess,
    imsAccessOrgId: initInfo.imsOrgId,
    edgeConfigId,
    sandbox,
    signal,
    context: context.edgeConfigOverrides[env],
    requestCache,
  });

  return {
    edgeConfigOverrides: {
      [env]: values,
    }
  };
};

