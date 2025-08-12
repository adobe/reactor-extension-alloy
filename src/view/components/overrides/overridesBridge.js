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
  ENABLED_FIELD_VALUES,
  isDataElement,
  isDataElementRegex,
  ENABLED_MATCH_FIELD_VALUES,
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
    : mixed().oneOf(Object.values(ENABLED_FIELD_VALUES)).nullable(),
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
          enabled: ENABLED_MATCH_FIELD_VALUES.disabled,
          com_adobe_experience_platform: {
            enabled: ENABLED_FIELD_VALUES.enabled,
            datasets: {
              event: {
                datasetId: "",
              },
            },
            com_adobe_edge_ode: {
              enabled: ENABLED_FIELD_VALUES.enabled,
            },
            com_adobe_edge_segmentation: {
              enabled: ENABLED_FIELD_VALUES.enabled,
            },
            com_adobe_edge_destinations: {
              enabled: ENABLED_FIELD_VALUES.enabled,
            },
            com_adobe_edge_ajo: {
              enabled: ENABLED_FIELD_VALUES.enabled,
            },
          },
          com_adobe_analytics: {
            enabled: ENABLED_FIELD_VALUES.enabled,
            reportSuites: [""],
          },
          com_adobe_identity: {
            idSyncContainerId: undefined,
          },
          com_adobe_target: {
            enabled: ENABLED_FIELD_VALUES.enabled,
            propertyToken: "",
          },
          com_adobe_audiencemanager: {
            enabled: ENABLED_FIELD_VALUES.enabled,
          },
          com_adobe_launch_ssf: {
            enabled: ENABLED_FIELD_VALUES.enabled,
          },
        },
      }),
      {},
    ),
  }),
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
      overridesKeys.map((key) => `edgeConfigOverrides.${env}.${key}.enabled`),
    )
      .filter((key) => deepGet(cleanedInstanceSettings, key) !== undefined)
      .filter((key) => !isDataElement(deepGet(cleanedInstanceSettings, key)))
      .forEach((key) => {
        const value = deepGet(cleanedInstanceSettings, key);
        deepSet(
          cleanedInstanceSettings,
          key,
          value ? ENABLED_FIELD_VALUES.enabled : ENABLED_FIELD_VALUES.disabled,
        );
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
            ? ENABLED_MATCH_FIELD_VALUES.enabled
            : ENABLED_MATCH_FIELD_VALUES.disabled,
        );
      });

    // if any of the environments have values, set the environment to enabled
    OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}`)
      .filter((key) =>
        overridesKeys
          .map((override) => `${key}.${override}`)
          .some((override) => deepGet(cleanedInstanceSettings, override)),
      )
      .filter(
        (key) =>
          !isDataElement(deepGet(cleanedInstanceSettings, `${key}.enabled`)),
      )
      .forEach((key) => {
        deepSet(
          cleanedInstanceSettings,
          `${key}.enabled`,
          ENABLED_MATCH_FIELD_VALUES.enabled,
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
          ENABLED_MATCH_FIELD_VALUES.enabled,
        );
      });

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: cleanedInstanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
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

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: propertyKeysToCopy,
    });

    // Remove disabled env
    OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}`)
      .filter(
        (key) =>
          // undefined means default value aka disabled
          deepGet(instanceSettings, `${key}.enabled`) === undefined,
      )
      .forEach((key) => {
        deepDelete(instanceSettings, key);
      });

    const propertiesWithValues = OVERRIDE_ENVIRONMENTS.flatMap((env) =>
      overridesKeys.map((key) => `edgeConfigOverrides.${env}.${key}`),
    ).filter((key) => {
      const value = deepGet(instanceSettings, key);
      return value !== undefined && value !== "";
    });

    // convert idSyncContainerId to a number if it is not a data element
    propertiesWithValues
      .map((key) => `${key}.idSyncContainerId`)
      .filter((key) => deepGet(instanceSettings, key))
      .filter((key) => {
        const value = deepGet(instanceSettings, key);
        return !containsDataElements(value) && value !== "";
      })
      .forEach((key) => {
        const value = deepGet(instanceSettings, key);
        deepSet(instanceSettings, key, parseInt(value, 10));
      });

    // filter out the blank report suites
    propertiesWithValues
      .map((key) => `${key}.reportSuites`)
      .filter((key) => deepGet(instanceSettings, key))
      .forEach((key) => {
        const value = deepGet(instanceSettings, key);
        deepSet(
          instanceSettings,
          key,
          value.filter((rs) => rs !== ""),
        );
      });

    // convert "Enabled"/"Disabled" to true/false
    OVERRIDE_ENVIRONMENTS.flatMap((env) =>
      overridesKeys.map((key) => `edgeConfigOverrides.${env}.${key}`),
    )
      .map((key) => `${key}.enabled`)
      .filter((key) => deepGet(instanceSettings, key) !== undefined)
      .filter((key) => !isDataElement(deepGet(instanceSettings, key)))
      .forEach((key) => {
        const value = deepGet(instanceValues, key);
        deepSet(
          instanceSettings,
          key,
          value.trim() === ENABLED_FIELD_VALUES.enabled,
        );
      });

    // convert env-wide "Enabled"/"Match Datastream Configuration" to true/false
    OVERRIDE_ENVIRONMENTS.map((env) => `edgeConfigOverrides.${env}.enabled`)
      .filter((key) => deepGet(instanceSettings, key) !== undefined)
      .filter((key) => !isDataElement(deepGet(instanceSettings, key)))
      .forEach((key) => {
        const value = deepGet(instanceValues, key);
        deepSet(
          instanceSettings,
          key,
          value.trim() === ENABLED_MATCH_FIELD_VALUES.enabled,
        );
      });

    // Remove empty strings, objects, and arrays
    /** @type {{ edgeConfigOverrides: ConfigOverridesLaunchSettings }} */
    const trimmedInstanceSettings = trimValue(instanceSettings);
    // Remove the edgeConfigOverrides object if it is empty or has only the default sandbox setting
    if (
      trimmedInstanceSettings?.edgeConfigOverrides?.development?.sandbox ===
        "prod" &&
      Object.keys(trimmedInstanceSettings?.edgeConfigOverrides || {}).length ===
        1 &&
      Object.keys(
        trimmedInstanceSettings?.edgeConfigOverrides?.development || {},
      ).length === 1
    ) {
      delete trimmedInstanceSettings.edgeConfigOverrides;
    }

    // Remove an env if it is empty
    Object.keys(trimmedInstanceSettings?.edgeConfigOverrides || {}).forEach(
      (env) => {
        if (
          Object.keys(trimmedInstanceSettings?.edgeConfigOverrides[env] || {})
            .length === 0
        ) {
          delete trimmedInstanceSettings.edgeConfigOverrides[env];
        }
      },
    );

    // Remove the edgeConfigOverrides object if it is empty
    if (
      trimmedInstanceSettings?.edgeConfigOverrides &&
      Object.keys(trimmedInstanceSettings?.edgeConfigOverrides).length === 0
    ) {
      delete trimmedInstanceSettings.edgeConfigOverrides;
    }

    return trimmedInstanceSettings ?? {};
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
