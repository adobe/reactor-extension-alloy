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

const version = "__VERSION__";

module.exports = ({ turbine, window, runAlloy, createEventMergeId, orgId }) => {
  const { instances: instancesSettings } = turbine.getExtensionSettings();
  const instanceNames = instancesSettings.map(
    instanceSettings => instanceSettings.name
  );
  const instanceByName = {};
  runAlloy(instanceNames);

  instancesSettings.forEach(
    ({
      name,
      edgeConfigId,
      stagingEdgeConfigId,
      developmentEdgeConfigId,
      ...options
    }) => {
      const computedEdgeConfigId =
        (turbine.buildInfo.environment === "development" &&
          developmentEdgeConfigId) ||
        (turbine.buildInfo.environment === "staging" && stagingEdgeConfigId) ||
        edgeConfigId;

      const instance = window[name];
      instanceByName[name] = instance;
      instance("configure", {
        ...options,
        edgeConfigId: computedEdgeConfigId,
        debugEnabled: turbine.debugEnabled,
        orgId: options.orgId || orgId,
        onBeforeEventSend({ xdm }) {
          xdm.implementationDetails.name = `${xdm.implementationDetails.name}/reactor`;
          xdm.implementationDetails.version = `${xdm.implementationDetails.version}+${version}`;
        }
      });
      turbine.onDebugChanged(enabled => {
        instance("setDebug", { enabled });
      });
    }
  );

  return {
    /**
     * Returns an instance by name.
     * @param name
     * @returns {Function}
     */
    getInstance(name) {
      return instanceByName[name];
    },
    /**
     * Synchronously creates an event merge ID.
     * @returns {string}
     */
    createEventMergeId() {
      return createEventMergeId();
    }
  };
};
