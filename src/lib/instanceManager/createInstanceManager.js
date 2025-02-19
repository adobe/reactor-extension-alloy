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

module.exports = ({
  turbine,
  window,
  createCustomInstance,
  components,
  createEventMergeId,
  orgId,
  wrapOnBeforeEventSend,
  getConfigOverrides,
}) => {
  const { instances: instancesSettings } = turbine.getExtensionSettings();
  const instanceByName = {};

  const calledMonitors = {};

  window.__alloyMonitors = window.__alloyMonitors || [];
  // these are called before the monitors are added at runtime, we want to cache and trigger later
  window.__alloyMonitors.push({
    onInstanceCreated: (...args) => {
      calledMonitors.onInstanceCreated ||= [];
      calledMonitors.onInstanceCreated.push(args);
    },
    onInstanceConfigured: (...args) => {
      calledMonitors.onInstanceConfigured ||= [];
      calledMonitors.onInstanceConfigured.push(args);
    },
    onBeforeCommand(...args) {
      const { commandName } = args[0];
      if (commandName === "configure") {
        calledMonitors.onBeforeCommand ||= [];
        calledMonitors.onBeforeCommand.push(args);
      }
    },
  });

  instancesSettings.forEach(
    ({
      name,
      edgeConfigId,
      stagingEdgeConfigId,
      developmentEdgeConfigId,
      onBeforeEventSend,
      ...options
    }) => {
      const instance = createCustomInstance({ name, components });
      window[name] = instance;
      if (!window.__alloyNS) {
        window.__alloyNS = [];
      }
      window.__alloyNS.push(name);
      instanceByName[name] = instance;
      const environment = turbine.environment && turbine.environment.stage;

      const computedEdgeConfigId =
        (environment === "development" && developmentEdgeConfigId) ||
        (environment === "staging" && stagingEdgeConfigId) ||
        edgeConfigId;

      options.edgeConfigOverrides = getConfigOverrides(options);

      instance("configure", {
        ...options,
        datastreamId: computedEdgeConfigId,
        debugEnabled: turbine.debugEnabled,
        orgId: options.orgId || orgId,
        onBeforeEventSend: wrapOnBeforeEventSend(onBeforeEventSend),
      });
      turbine.onDebugChanged((enabled) => {
        instance("setDebug", { enabled });
      });
    },
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
    },
    addMonitor(newMonitor) {
      window.__alloyMonitors.push(newMonitor);
      Object.keys(calledMonitors).forEach((methodName) => {
        if (newMonitor[methodName]) {
          calledMonitors[methodName].forEach((args) => {
            newMonitor[methodName](...args);
          });
        }
      });
    },
  };
};
