/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/**
 * Create the config overrides for the given environment.
 *
 * @typedef {Object} EdgeConfigOverrides
 *
 * @param {Object} settings
 * @param { { development: EdgeConfigOverrides, staging: EdgeConfigOverrides, production: EdgeConfigOverrides }= } settings.edgeConfigOverrides
 * @param {"development" | "staging" | "production"} environmentName
 * @returns {EdgeConfigOverrides?}
 */
const createGetConfigOverrides = environmentName => settings => {
  const { edgeConfigOverrides } = settings;
  if (!edgeConfigOverrides || !edgeConfigOverrides[environmentName]) {
    return undefined;
  }
  const computedConfigOverrides = { ...edgeConfigOverrides[environmentName] };

  if (computedConfigOverrides.com_adobe_analytics?.reportSuites?.length > 0) {
    computedConfigOverrides.com_adobe_analytics.reportSuites = computedConfigOverrides.com_adobe_analytics.reportSuites
      .flatMap(val => (val.includes(",") ? val.split(/,\s*/gi) : val))
      .map(rsid => rsid.trim())
      .filter(Boolean);
  }

  return computedConfigOverrides;
};

module.exports = createGetConfigOverrides;
