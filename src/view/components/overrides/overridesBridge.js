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
import { array, lazy, mixed, number, object, string } from "yup";
import { ENVIRONMENTS as OVERRIDE_ENVIRONMENTS } from "../../configuration/constants/environmentType";
import copyPropertiesIfValueDifferentThanDefault from "../../configuration/utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "../../configuration/utils/copyPropertiesWithDefaultFallback";
import trimValue from "../../utils/trimValues";
import { dataElementRegex } from "./utils";

/**
 * @typedef {Object} EnvironmentConfigOverrideFormikState
 * @property {string} [sandbox]
 * @property {string} [datastreamId]
 * @property {string} [datastreamIdInputMethod]
 * @property {Object} [com_adobe_experience_platform]
 * @property {Object} [com_adobe_experience_platform.datasets]
 * @property {Object} [com_adobe_experience_platform.datasets.event]
 * @property {string} [com_adobe_experience_platform.datasets.event.datasetId]
 * @property {Object} [com_adobe_experience_platform.datasets.profile]
 * @property {string} [com_adobe_experience_platform.datasets.profile.datasetId]
 * @property {Object} [com_adobe_analytics]
 * @property {string[]} [com_adobe_analytics.reportSuites]
 * @property {Object} [com_adobe_identity]
 * @property {string} [com_adobe_identity.idSyncContainerId]
 * @property {Object} [com_adobe_target]
 * @property {string} [com_adobe_target.propertyToken]
 *
 * @typedef {Object} ConfigOverridesFormikState
 * @property {EnvironmentConfigOverrideFormikState} [development]
 * @property {EnvironmentConfigOverrideFormikState} [staging]
 * @property {EnvironmentConfigOverrideFormikState} [production]
 *
 * @typedef {Object} EnvironmentConfigOverrideLaunchSettings
 * @property {string} [sandbox]
 * @property {string} [datastreamId]
 * @property {string} [datastreamIdInputMethod]
 * @property {Object} [com_adobe_experience_platform]
 * @property {Object} [com_adobe_experience_platform.datasets]
 * @property {Object} [com_adobe_experience_platform.datasets.event]
 * @property {string} [com_adobe_experience_platform.datasets.event.datasetId]
 * @property {Object} [com_adobe_experience_platform.datasets.profile]
 * @property {string} [com_adobe_experience_platform.datasets.profile.datasetId]
 * @property {Object} [com_adobe_analytics]
 * @property {string[]} [com_adobe_analytics.reportSuites]
 * @property {Object} [com_adobe_identity]
 * @property {number} [com_adobe_identity.idSyncContainerId]
 * @property {Object} [com_adobe_target]
 * @property {string} [com_adobe_target.propertyToken]
 *
 * @typedef {Object} ConfigOverridesLaunchSettings
 * @property {EnvironmentConfigOverrideLaunchSettings} [development]
 * @property {EnvironmentConfigOverrideLaunchSettings} [staging]
 * @property {EnvironmentConfigOverrideLaunchSettings} [production]
 */

export const bridge = {
  /**
   * Get the default formik state for the overrides form.
   * @returns {ConfigOverridesFormikState}
   */
  getInstanceDefaults: () => ({
    edgeConfigOverrides: OVERRIDE_ENVIRONMENTS.reduce(
      (acc, env) => ({
        ...acc,
        [env]: {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          com_adobe_experience_platform: {
            datasets: {
              event: {
                datasetId: ""
              }
            }
          },
          com_adobe_analytics: {
            reportSuites: [""]
          },
          com_adobe_identity: {
            idSyncContainerId: undefined
          },
          com_adobe_target: {
            propertyToken: ""
          }
        }
      }),
      {}
    )
  }),
  /**
   * Converts the saved Launch instance settings to the formik state.
   * @param {{ edgeConfigOverrides: ConfigOverridesLaunchSettings }} params
   * @returns {ConfigOverridesFormikState}
   */
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    // copy settings from the pre-per-environment schema
    const overridesKeys = [
      "com_adobe_identity",
      "com_adobe_target",
      "com_adobe_analytics",
      "com_adobe_experience_platform"
    ];
    const oldOverrides = overridesKeys.reduce((acc, key) => {
      if (instanceSettings.edgeConfigOverrides?.[key]) {
        acc[key] = instanceSettings.edgeConfigOverrides[key];
      }
      return acc;
    }, {});
    if (Object.keys(oldOverrides).length > 0) {
      const overrideSettings = { ...oldOverrides };
      instanceSettings.edgeConfigOverrides = {};
      OVERRIDE_ENVIRONMENTS.forEach(env => {
        instanceSettings.edgeConfigOverrides[env] =
          overrideSettings[env] ?? oldOverrides;
      });
    }

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["edgeConfigOverrides"]
    });

    OVERRIDE_ENVIRONMENTS.forEach(env => {
      if (
        instanceValues.edgeConfigOverrides?.[env]?.com_adobe_identity
          ?.idSyncContainerId
      ) {
        // Launch UI components expect this to be a string
        instanceValues.edgeConfigOverrides[
          env
        ].com_adobe_identity.idSyncContainerId = `${
          instanceValues.edgeConfigOverrides[env].com_adobe_identity
            .idSyncContainerId
        }`;
      }
    });

    return instanceValues;
  },
  /**
   * Converts the formik state to the Launch instance settings.
   * @param {{ instanceValues: { edgeConfigOverrides: ConfigOverridesFormikState }}} params
   * @returns {{ edgeConfigOverrides: ConfigOverridesLaunchSettings }}
   */
  getInstanceSettings: ({ instanceValues }) => {
    /** @type {{ edgeConfigOverrides?: ConfigOverridesLaunchSettings }} */
    const instanceSettings = {};
    const propertyKeysToCopy = ["edgeConfigOverrides"];

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: propertyKeysToCopy
    });

    OVERRIDE_ENVIRONMENTS.forEach(env => {
      /** @type {EnvironmentConfigOverrideLaunchSettings} */
      const overrides = instanceSettings.edgeConfigOverrides?.[env];
      if (!overrides || Object.keys(overrides).length === 0) {
        return;
      }
      // Alloy, Konductor, and Blackbird expect the idSyncContainerID to be a
      // number, unless it is a data element (/^%.+%$/gi)
      if (
        overrides.com_adobe_identity?.idSyncContainerId &&
        !dataElementRegex.test(overrides.com_adobe_identity.idSyncContainerId)
      ) {
        overrides.com_adobe_identity.idSyncContainerId = parseInt(
          overrides.com_adobe_identity.idSyncContainerId,
          10
        );
      }

      // filter out the blank report suites
      if (overrides.com_adobe_analytics?.reportSuites) {
        overrides.com_adobe_analytics.reportSuites = overrides.com_adobe_analytics.reportSuites.filter(
          rs => rs !== ""
        );
      }
    });

    /** @type {{ edgeConfigOverrides: ConfigOverridesLaunchSettings }} */
    const trimmedInstanceSettings = trimValue(instanceSettings);
    if (
      trimmedInstanceSettings?.edgeConfigOverrides?.development?.sandbox ===
        "prod" &&
      Object.keys(trimmedInstanceSettings?.edgeConfigOverrides || {}).length ===
        1 &&
      Object.keys(
        trimmedInstanceSettings?.edgeConfigOverrides?.development || {}
      ).length === 1
    ) {
      delete trimmedInstanceSettings.edgeConfigOverrides;
    }

    return trimmedInstanceSettings;
  },
  formikStateValidationSchema: object({
    edgeConfigOverrides: object(
      OVERRIDE_ENVIRONMENTS.reduce(
        (acc, env) => ({
          ...acc,
          [env]: object({
            datastreamId: string().nullable(),
            datastreamInputMethod: mixed()
              .oneOf(["freeform", "select"])
              .nullable(),
            sandbox: string().nullable(),
            com_adobe_experience_platform: object({
              datasets: object({
                event: object({
                  datasetId: string().nullable()
                }),
                profile: object({
                  datasetId: string().nullable()
                })
              })
            }),
            com_adobe_analytics: object({
              reportSuites: array(string()).nullable()
            }),
            com_adobe_identity: object({
              idSyncContainerId: lazy(value =>
                typeof value === "string" &&
                (value.includes("%") || value === "")
                  ? string()
                      .matches(dataElementRegex, {
                        message: "Please enter a valid data element.",
                        excludeEmptyString: true
                      })
                      .nullable()
                  : number()
                      .typeError("Please enter a number.")
                      .positive("Please enter a positive number.")
                      .integer("Please enter a whole number.")
                      .nullable()
              )
            }),
            com_adobe_target: object({
              propertyToken: string().nullable()
            })
          })
        }),
        {}
      )
    )
  })
};
