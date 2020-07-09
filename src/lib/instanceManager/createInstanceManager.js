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

module.exports = ({ turbine, window, runAlloy, orgId }) => {
  const { instances: instancesSettings } = turbine.getExtensionSettings();
  const instanceNames = instancesSettings.map(
    instanceSettings => instanceSettings.name
  );
  const instanceByName = {};
  let createEventMergeId;
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
        // The Alloy build we're using for this extension
        // provides a backdoor to perform certain operations
        // synchronously, because Reactor requires that data
        // elements be resolved synchronously for now.

        // In this case, the function exposed from Alloy for
        // creating an event merge ID is not instance-specific,
        // so there's no need to segregate it by instance.
        // This actually makes things a bit simpler, because
        // when a user is creating an event merge ID data element,
        // we don't need/want the user to have to bother with
        // selecting a specific instance.
        reactorRegisterCreateEventMergeId(_createEventMergeId) {
          createEventMergeId = _createEventMergeId;
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
