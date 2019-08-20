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

const getInstanceNameByPropertyId = (accounts, propertyId) => {
  let matchingInstanceName;
  for (let i = 0; i < accounts.length; i += 1) {
    const account = accounts[i];
    if (account.propertyId === propertyId) {
      matchingInstanceName = account.instanceName;
      break;
    }
  }
  return matchingInstanceName;
};

module.exports = (window, runAlloy) => {
  const { accounts } = turbine.getExtensionSettings();
  const instanceNames = accounts.map(account => account.instanceName);

  runAlloy(instanceNames);

  accounts.forEach(({ instanceName, ...options }) => {
    window[instanceName]("configure", options);
  });

  return {
    getInstance(propertyId) {
      const instanceName = getInstanceNameByPropertyId(accounts, propertyId);
      return instanceName ? window[instanceName] : undefined;
    }
  };
};
