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
 *
 * @param {Object} instanceSettings
 * @returns {{
 *  developmentEnvironment: {
 *   datastreamId: string,
 *   sandbox?: string
 * },
 * stagingEnvironment: {
 *   datastreamId: string,
 *   sandbox?: string
 * },
 * productionEnvironment: {
 *   datastreamId: string,
 *   sandbox?: string
 * }}}
 */
export const getEdgeConfigIds = instanceSettings => {
  if (instanceSettings.edgeConfigInputMethod === "freeform") {
    return {
      developmentEnvironment: {
        datastreamId:
          instanceSettings.edgeConfigFreeformInputMethod.developmentEdgeConfigId
      },
      stagingEnvironment: {
        datastreamId:
          instanceSettings.edgeConfigFreeformInputMethod.stagingEdgeConfigId
      },
      productionEnvironment: {
        datastreamId:
          instanceSettings.edgeConfigFreeformInputMethod.edgeConfigId
      }
    };
  }
  return instanceSettings.edgeConfigSelectInputMethod;
};
