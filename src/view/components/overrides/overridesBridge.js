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
import deepSet from "../../utils/deepSet";
import deepGet from "../../utils/deepGet";
import { ENVIRONMENTS as OVERRIDE_ENVIRONMENTS } from "../../configuration/constants/environmentType";
import copyPropertiesIfValueDifferentThanDefault from "../../configuration/utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "../../configuration/utils/copyPropertiesWithDefaultFallback";
import trimValue from "../../utils/trimValues";
import {
  overridesKeys,
  containsDataElements,
  containsDataElementsRegex,
  SERVICE_OVERRIDE_FIELD_VALUES,
  isDataElement,
  isDataElementRegex,
  EXTENSION_OVERRIDE_FIELD_VALUES,
  ACTION_OVERRIDE_FIELD_VALUES,
} from "./utils";
import clone from "../../utils/clone";
import deepDelete from "../../utils/deepDelete";

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

const enabledOrDataElementValidator = lazy((value) =>
  typeof value === "string" && (value.includes("%") || value === "")
    ? string()
        .matches(isDataElementRegex, {
          message: "Please enter a valid data element.",
          excludeEmptyString: true,
        })
        .nullable()
    : mixed().oneOf(Object.values(SERVICE_OVERRIDE_FIELD_VALUES)).nullable(),
);
const enabledMatchOrDataElementValidator = lazy((value) =>
  typeof value === "string" && (value.includes("%") || value === "")
    ? string()
        .matches(isDataElementRegex, {
          message: "Please enter a valid data element.",
          excludeEmptyString: true,
        })
        .nullable()
    : mixed().oneOf(Object.values(ENABLED_MATCH_FIELD_VALUES)).nullable(),
);

/**
 * Convert older versions of settings to newer versions of settings.
 * @type {((instanceValues: { edgeConfigOverrides: ConfigOverridesLaunchSettings }) => { edgeConfigOverrides: ConfigOverridesLaunchSettings })[]}
 */
const migrations = [
  /**
   * Convert the environment-unaware settings into environment-aware settings.
   */
  (instanceValues) => {
    const oldOverrides = overridesKeys
      .filter((key) => deepGet(instanceValues, `edgeConfigOverrides.${key}`))
      .reduce((acc, key) => {
        deepSet(
          acc,
          key,
          deepGet(instanceValues, `edgeConfigOverrides.${key}`),
        );
        return acc;
      }, {});
    if (Object.keys(oldOverrides).length > 0) {
      const overrideSettings = { ...oldOverrides };
      instanceValues.edgeConfigOverrides = {};
      OVERRIDE_ENVIRONMENTS.forEach((env) => {
        instanceValues.edgeConfigOverrides[env] = clone(
          overrideSettings[env] ?? oldOverrides,
        );
      });
    }
    return instanceValues;
  },
  /**
   * Convert the com_adobe_audience_manager to com_adobe_audiencemanager.
   */
  (instanceValues) => {
    const oldProductName = "com_adobe_audience_manager";
    OVERRIDE_ENVIRONMENTS.map(
      (env) => `edgeConfigOverrides.${env}.${oldProductName}`,
    )
      .filter((key) => deepGet(instanceValues, key) !== undefined)
      .forEach((oldKey) => {
        const value = deepGet(instanceValues, oldKey);
        const newKey = oldKey.replace(
          oldProductName,
          "com_adobe_audiencemanager",
        );
        deepSet(instanceValues, newKey, value);
        deepSet(instanceValues, oldKey, undefined);
      });
    return instanceValues;
  },
];

const createBridge = (isExtensionConfig) => {
  const ENV_OVERRIDE_FIELD_VALUES = isExtensionConfig ? EXTENSION_OVERRIDE_FIELD_VALUES : ACTION_OVERRIDE_FIELD_VALUES;
  const DEFAULT_SERVICE_OVERRIDE = isExtensionConfig ? SERVICE_OVERRIDE_FIELD_VALUES.enabled : SERVICE_OVERRIDE_FIELD_VALUES.config;

  /**
   * Get the default formik state for the overrides form.
   * @returns {ConfigOverridesFormikState}
   */
  const getInstanceDefaults = () => ({
    edgeConfigOverrides: OVERRIDE_ENVIRONMENTS.reduce(
      (acc, env) => ({
        ...acc,
        [env]: {
          sandbox: "",
          datastreamId: "",
          datastreamIdInputMethod: "freeform",
          enabled: ENV_OVERRIDE_FIELD_VALUES.disabled,
          com_adobe_experience_platform: {
            enabled: DEFAULT_SERVICE_OVERRIDE,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: DEFAULT_SERVICE_OVERRIDE,
            },
            com_adobe_edge_segmentation: {
              enabled: DEFAULT_SERVICE_OVERRIDE,
            },
            com_adobe_edge_destinations: {
              enabled: DEFAULT_SERVICE_OVERRIDE,
            },
            com_adobe_edge_ajo: {
              enabled: DEFAULT_SERVICE_OVERRIDE,
            },
          },
          com_adobe_analytics: {
            enabled: DEFAULT_SERVICE_OVERRIDE,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: DEFAULT_SERVICE_OVERRIDE,
            propertyToken: "",
          },
          com_adobe_audiencemanager: {
            enabled: DEFAULT_SERVICE_OVERRIDE,
          },
          com_adobe_launch_ssf: {
            enabled: DEFAULT_SERVICE_OVERRIDE,
          },
        },
      }),
      {},
    ),
  });

  return {
    getInstanceDefaults,
    /**
     * Converts the saved Launch instance settings to the formik state.
     * @param {{ edgeConfigOverrides: ConfigOverridesLaunchSettings }} params
     * @returns {ConfigOverridesFormikState}
     */
    getInitialInstanceValues: ({ instanceSettings }) => {
      const instanceValues = {};
      const cleanedInstanceSettings = migrations.reduce(
        (acc, migration) => migration(acc),
        clone(instanceSettings),
      );

      // convert the 'enabled' settings from true/false to enabled/disabled
      OVERRIDE_ENVIRONMENTS.flatMap((env) =>
        overridesKeys.map((key) => `edgeConfigOverrides.${env}.${key}`),
      )
        .forEach((key) => {
          const value = deepGet(cleanedInstanceSettings, key);
          if (value.enabled === false) {
            deepSet(cleanedInstanceSettings, key, ENV_OVERRIDE_FIELD_VALUES.disabled);
          } else if (!isDataElement(value.enabled)) {
            deepSet(cleanedInstanceSettings, key, ENV_OVERRIDE_FIELD_VALUES.enabled);
          }
        });
      // convert the env-wide enabled/disabled from true/false to enabled/match datastream configuration
      OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}.enabled`)
        .filter((key) => deepGet(cleanedInstanceSettings, key) !== undefined)
        .filter((key) => !isDataElement(deepGet(cleanedInstanceSettings, key)))
        .forEach((key) => {
          const value = deepGet(cleanedInstanceSettings, key);
          deepSet(
            cleanedInstanceSettings,
            key,
            value
              ? ENV_OVERRIDE_FIELD_VALUES.enabled
              : ENV_OVERRIDE_FIELD_VALUES.disabled,
          );
        });

      // if any of the environments have values, set the environment to enabled
      OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}`)
        .filter((envKey) =>
          overridesKeys
            .map((override) => `${envKey}.${override}.enabled`)
            .some((serviceKey) => {
              const value = deepGet(cleanedInstanceSettings, serviceKey);
              return isDataElement(value) || value !== DEFAULT_SERVICE_OVERRIDE;
            })
        )
        .forEach((envKey) => {
          deepSet(
            cleanedInstanceSettings,
            `${envKey}.enabled`,
            ENV_OVERRIDE_FIELD_VALUES.enabled,
          );
        });
      // do the same for datastream ID overrides
      OVERRIDE_ENVIRONMENTS.filter((env) =>
        deepGet(
          cleanedInstanceSettings,
          `edgeConfigOverrides.${env}.datastreamId`,
        ),
      )
        .filter(
          (env) =>
            !isDataElement(
              deepGet(
                cleanedInstanceSettings,
                `edgeConfigOverrides.${env}.enabled`,
              ),
            ),
        )
        .forEach((env) => {
          deepSet(
            cleanedInstanceSettings,
            `edgeConfigOverrides.${env}.enabled`,
            ENV_OVERRIDE_FIELD_VALUES.enabled,
          );
        });

      copyPropertiesWithDefaultFallback({
        toObj: instanceValues,
        fromObj: cleanedInstanceSettings,
        defaultsObj: getInstanceDefaults(),
        keys: ["edgeConfigOverrides"],
      });

      OVERRIDE_ENVIRONMENTS.forEach((env) => {
        if (
          instanceValues.edgeConfigOverrides?.[env]?.com_adobe_identity
            ?.idSyncContainerId
        ) {
          // Launch UI components expect this to be a string
          instanceValues.edgeConfigOverrides[
            env
          ].com_adobe_identity.idSyncContainerId =
            `${instanceValues.edgeConfigOverrides[env].com_adobe_identity.idSyncContainerId}`;
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
      const instanceDefaults = getInstanceDefaults();

      // filter out the blank report suites
      OVERRIDE_ENVIRONMENTS.flatMap((env) => `edgeConfigOverrides.${env}.com_adobe_analytics.reportSuites`)
        .filter((reportSuiteKey) => deepGet(instanceValues, reportSuiteKey))
        .forEach((reportSuiteKey) => {
          const value1 = deepGet(instanceValues, reportSuiteKey);
          const value2 = value1.filter((rs) => rs !== "");
          // if there are no report suites, set it to one blank report suite so it matches the default
          const value3 = value2.length === 0 ? [""] : value2;
          deepSet(
            instanceSettings,
            reportSuiteKey,
            value3,
          );
        });

      // When the enabled field is set to the "config" value, update that whole service object to the default.
      // That way, the copyPropertiesIfValueDifferentThanDefault will empty the service object.
      // When the enabled field is set to the "disabled" value, update that whole service object to the default, but with
      // just the enabled field set. (For extension configuration, this IS the same value as the default.)
      OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}`)
        .map((envKey) => `edgeConfigOverrides.${envKey}.com_adobe_analytics.enabled`)
        .forEach((serviceKey) => {
          const enabledValue = trimValue(deepGet(instanceValues, `${serviceKey}.enabled`));
          if (enabledValue !== SERVICE_OVERRIDE_FIELD_VALUES.disabled) {
            const defaultValue = deepGet(instanceDefaults, serviceKey);
            deepSet(instanceSettings, serviceKey, defaultValue);
          }
          deepSet(instanceSettings, `${serviceKey}.enabled`, enabledValue);
        });

      copyPropertiesIfValueDifferentThanDefault({
        toObj: instanceSettings,
        fromObj: instanceValues,
        defaultsObj: instanceDefaults,
        keys: propertyKeysToCopy,
      });

      // get all the serviceKeys that are not the default values
      const nonDefaultServiceKeys = OVERRIDE_ENVIRONMENTS.flatMap((env) =>
        overridesKeys.map((key) => `edgeConfigOverrides.${env}.${key}`),
      ).filter((serviceKey) => {
        const value = deepGet(instanceSettings, serviceKey);
        return value !== undefined && value !== "";
      });

      // convert idSyncContainerId to a number if it is not a data element
      nonDefaultServiceKeys
        .map((serviceKey) => `${serviceKey}.idSyncContainerId`)
        .filter((serviceKey) => deepGet(instanceSettings, serviceKey))
        .filter((serviceKey) => {
          const value = deepGet(instanceSettings, serviceKey);
          return !containsDataElements(value) && value !== "";
        })
        .forEach((serviceKey) => {
          const value = deepGet(instanceSettings, serviceKey);
          deepSet(instanceSettings, serviceKey, parseInt(value, 10));
        });

      // convert service override values
      nonDefaultServiceKeys
        .map((serviceKey) => `${serviceKey}.enabled`)
        .filter((enabledKey) => deepGet(instanceSettings, enabledKey) !== undefined)
        .forEach((enabledKey) => {
          const value = deepGet(instanceSettings, enabledKey);
          if (value.trim() === SERVICE_OVERRIDE_FIELD_VALUES.enabled) {
            deepDelete(instanceSettings, enabledKey);
          } else if (value.trim() === SERVICE_OVERRIDE_FIELD_VALUES.disabled) {
            deepSet(instanceSettings, enabledKey, false);
          }
        });

      // convert env-wide "Enabled"/"Match Datastream Configuration" to true/false
      OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}.enabled`)
      .filter((key) => deepGet(instanceSettings, key) !== undefined)
      .filter((key) => !isDataElement(deepGet(instanceSettings, key)))
        .forEach((key) => {
          deepSet(
            instanceSettings,
            key,
            true, // If this was disabled, it would already have been removed
          );
        });

      // Return nothing if there is nothing different from the defaults
      return Object.keys(instanceSettings).length > 0 ? instanceSettings : undefined;
    },
    formikStateValidationSchema: object({
      edgeConfigOverrides: object(
        OVERRIDE_ENVIRONMENTS.reduce(
          (acc, env) => ({
            ...acc,
            [env]: object({
              enabled: enabledMatchOrDataElementValidator,
              datastreamId: string().nullable(),
              datastreamInputMethod: mixed()
                .oneOf(["freeform", "select"])
                .nullable(),
              sandbox: string().nullable(),
              com_adobe_experience_platform: object({
                enabled: enabledOrDataElementValidator,
                datasets: object({
                  event: object({
                    datasetId: string().nullable(),
                  }),
                  profile: object({
                    datasetId: string().nullable(),
                  }),
                }),
                com_adobe_edge_ode: object({
                  enabled: enabledOrDataElementValidator,
                }),
                com_adobe_edge_segmentation: object({
                  enabled: enabledOrDataElementValidator,
                }),
                com_adobe_edge_destinations: object({
                  enabled: enabledOrDataElementValidator,
                }),
                com_adobe_edge_ajo: object({
                  enabled: enabledOrDataElementValidator,
                }),
              }),
              com_adobe_analytics: object({
                enabled: enabledOrDataElementValidator,
                reportSuites: array(string()).nullable(),
              }),
              com_adobe_identity: object({
                idSyncContainerId: lazy((value) =>
                  typeof value === "string" &&
                  (value.includes("%") || value === "")
                    ? string()
                        .matches(containsDataElementsRegex, {
                          message: "Please enter a valid data element.",
                          excludeEmptyString: true,
                        })
                        .nullable()
                    : number()
                        .typeError("Please enter a number.")
                        .positive("Please enter a positive number.")
                        .integer("Please enter a whole number.")
                        .nullable(),
                ),
              }),
              com_adobe_target: object({
                enabled: enabledOrDataElementValidator,
                propertyToken: string().nullable(),
              }),
              com_adobe_audiencemanager: object({
                enabled: enabledOrDataElementValidator,
              }),
              com_adobe_launch_ssf: object({
                enabled: enabledOrDataElementValidator,
              }),
            }),
          }),
          {},
        ),
      ),
    }),
  };
};


export const actionBridge = createBridge(false);
export const extensionBridge = createBridge(true);
