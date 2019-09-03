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

module.exports = (window, runAlloy, imsOrgId) => {
  const accessorByInstanceName = {};
  const { instances } = turbine.getExtensionSettings();
  const names = instances.map(instance => instance.name);

  runAlloy(names);

  instances.forEach(({ name, ...options }) => {
    const accessor = {};
    window[name]("configure", {
      ...options,
      imsOrgId,
      // The Alloy build we're using for this extension
      // provides a backdoor to perform certain operations
      // synchronously, because Reactor requires that data
      // elements be resolved synchronously for now.
      reactorRegisterGetEcid(getEcid) {
        accessor.getEcid = getEcid;
      },
      reactorRegisterCreateEventMergeId(createEventMergeId) {
        accessor.createEventMergeId = createEventMergeId;
      }
    });
    accessor.instance = window[name];
    accessorByInstanceName[name] = accessor;
  });

  return {
    /**
     * @typedef {Object} Accessor
     * @property {Function} instance The Alloy instance.
     * @property {Function} getEcid A synchronous method for
     * accessing the ECID.
     * @property {Function} createEventMergeId A synchronous
     * method for creating an event merge ID.
     */
    /**
     * Returns an accessor for accessing instance-based things.
     * @param {string} name The name of the configured instance.
     * @returns {Accessor}
     */
    getAccessor(name) {
      return accessorByInstanceName[name];
    }
  };
};
