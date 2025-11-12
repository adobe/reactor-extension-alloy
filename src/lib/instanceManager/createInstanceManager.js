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

const { poll } = require("../utils/poll");

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
      useExistingAlloy,
      ...options
    }) => {
      // If the instance is using a self-hosted alloy.js instance, we need to verify that the
      // instance is properly loaded and configured.
      if (useExistingAlloy) {
        let realInstancePromise;

        // Polling for the real instance asynchronously.
        const getRealInstance = async () => {
          // Verify that the instance is loaded.
          try {
            await poll(() => typeof window[name] === "function");
            // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
          } catch (err) {
            turbine.logger.warn(
              `Alloy instance "${name}" not found on window after 1000ms. Make sure the instance is loaded before the Launch library.`,
            );
            return undefined;
          }

          // Verify that the instance is also configured.
          const instance = window[name];
          let configured = false;
          // getLibraryInfo only resolves after the instance is configured.
          instance("getLibraryInfo").then(() => {
            configured = true;
          });

          try {
            await poll(() => configured);
            // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
          } catch (err) {
            turbine.logger.warn(
              `Alloy instance "${name}" was not configured after 1000ms. Make sure the instance is configured before loading the Launch library.`,
            );
            return undefined;
          }

          // Latching: Overwrite the proxy in the map with the real instance.
          instanceByName[name] = instance;
          return instance;
        };

        // Use a proxy instance to wait for the real instance to be loaded and configured.
        const proxy = (...args) => {
          if (!realInstancePromise) {
            realInstancePromise = getRealInstance();
          }

          return realInstancePromise.then((instance) => {
            if (instance) {
              return instance(...args);
            }
            return undefined;
          });
        };

        instanceByName[name] = proxy;
        return;
      }

      const instance = createCustomInstance({ name, components });
      if (!window.__alloyNS) {
        window.__alloyNS = [];
      }
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

      if (window[name] && window[name].q) {
        const instanceFunction = ([resolve, reject, args]) => {
          instance(...args)
            .then(resolve)
            .catch(reject);
        };
        const queue = window[name].q;
        queue.push = instanceFunction;
        queue.forEach(instanceFunction);
      } else {
        window.__alloyNS.push(name);
        window[name] = instance;
      }
      instanceByName[name] = instance;
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
