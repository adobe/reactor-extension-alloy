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
  let computedConfigOverrides;
  if (!edgeConfigOverrides) {
    return undefined;
  }
  if (!edgeConfigOverrides[environmentName]) {
    // there are no settings for this current env, but there are settings for others
    if (
      edgeConfigOverrides.development ||
      edgeConfigOverrides.staging ||
      edgeConfigOverrides.production
    ) {
      return undefined;
    }
    // there are old settings
    computedConfigOverrides = edgeConfigOverrides;
  } else {
    computedConfigOverrides = { ...edgeConfigOverrides[environmentName] };
  }

  if (Object.keys(computedConfigOverrides).length === 0) {
    return undefined;
  }

  if (computedConfigOverrides.com_adobe_analytics?.reportSuites?.length > 0) {
    computedConfigOverrides.com_adobe_analytics.reportSuites = computedConfigOverrides.com_adobe_analytics.reportSuites
      .flatMap(val => (val.includes(",") ? val.split(/,\s*/gi) : val))
      .map(rsid => rsid.trim())
      .filter(Boolean);
  }

  return computedConfigOverrides;
};

module.exports = createGetConfigOverrides;
