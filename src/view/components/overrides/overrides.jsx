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
import {
  Heading,
  Flex,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
} from "@adobe/react-spectrum";
import { useField, useFormikContext } from "formik";
import PropTypes from "prop-types";
import React, { useRef } from "react";

import {
  DEVELOPMENT,
  ENVIRONMENTS as OVERRIDE_ENVIRONMENTS,
  PRODUCTION,
  STAGING,
} from "../../configuration/constants/environmentType";
import FormElementContainer from "../formElementContainer";
import SandboxSelector from "../sandboxSelector";
import SectionHeader from "../sectionHeader";
import DatastreamOverrideSelector from "./datastreamOverrideSelector";
import { useFetchConfig } from "./hooks";
import OverrideInput from "./overrideInput";
import ReportSuitesOverride from "./reportSuiteOverrides";
import SettingsCopySection from "./settingsCopySection";
import {
  ENABLED_FIELD_VALUES,
  FIELD_NAMES,
  capitialize,
  combineValidatorWithContainsDataElements,
  createValidateItemIsInArray,
  enabledDisabledOrDataElementRegex,
  overridesKeys,
} from "./utils";
import deepGet from "../../utils/deepGet";

/**
 *
 * @param {{ children: React.Element[], name: string, [k: string]: unknown }} param0
 * @returns
 */
const ProductSubsection = ({ children, name, ...otherProps }) => (
  <View {...otherProps}>
    <Heading level={3} marginBottom="size-10">
      {name}
    </Heading>
    {children}
  </View>
);
ProductSubsection.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

/**
 * A section of a form that allows the user to override datastream configuration
 *
 * @typedef {Object} OverridesProps
 * @property {Object} initInfo
 * @property {string?} options.instanceFieldName
 * The name of the Formik parent form. State will be stored as a nested object under the "edgeConfigOverrides" key.
 * @property {Array<"eventDatasetOverride" | "idSyncContainerOverride" | "targetPropertyTokenOverride" | "targetPropertyTokenOverride" | "reportSuitesOverride">} options.showFields
 * Which fields to show. Defaults to showing all fields
 * @property {string} options.configOrgId The org id to use for fetching datastream configurations.
 * @property {{
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
 * }}} options.edgeConfigIds The edge config ids for each environment
 * @param {OverridesProps} options
 * @returns {React.Element}
 */
const Overrides = ({
  initInfo,
  instanceFieldName,
  edgeConfigIds,
  configOrgId,
  hideFields = [],
}) => {
  const prefix = instanceFieldName
    ? `${instanceFieldName}.edgeConfigOverrides`
    : "edgeConfigOverrides";
  const hideFieldsSet = new Set(hideFields);

  /** @type {{value: import("./overridesBridge").EnvironmentConfigOverrideFormikState}[] } */
  const [{ value: edgeConfigOverrides }] = useField(prefix);
  const formikContext = useFormikContext();
  /**
   * Import the settings from the destination to the source
   *
   * @param {"production" | "staging" | "development"} source
   * @param {"production" | "staging" | "development"} destination
   */
  const onCopy = (source, destination) => {
    [FIELD_NAMES.sandbox, "datastreamId", ...overridesKeys]
      .filter(
        (field) =>
          deepGet(edgeConfigOverrides[source], field) !==
          deepGet(edgeConfigOverrides[destination], field),
      )
      .forEach((field) => {
        formikContext.setFieldValue(
          `${prefix}.${destination}.${field}`,
          deepGet(edgeConfigOverrides[source], field),
          true,
        );
        formikContext.setFieldTouched(
          `${prefix}.${destination}.${field}`,
          true,
          true,
        );
      });
  };

  const requestCache = useRef({});
  const authOrgId = initInfo.company.orgId;
  const edgeConfigs = {
    [DEVELOPMENT]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId:
        edgeConfigOverrides.development?.datastreamId ||
        edgeConfigIds.developmentEnvironment.datastreamId,
      sandbox: edgeConfigOverrides.development?.datastreamId
        ? edgeConfigOverrides.development.sandbox
        : edgeConfigIds.developmentEnvironment.sandbox,
      requestCache,
    }),
    [STAGING]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId:
        edgeConfigOverrides.staging?.datastreamId ||
        edgeConfigIds.stagingEnvironment?.datastreamId,
      sandbox: edgeConfigOverrides.staging?.datastreamId
        ? edgeConfigOverrides.staging?.sandbox
        : edgeConfigIds.stagingEnvironment?.sandbox,
      requestCache,
    }),
    [PRODUCTION]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId:
        edgeConfigOverrides.production?.datastreamId ||
        edgeConfigIds.productionEnvironment.datastreamId,
      sandbox: edgeConfigOverrides.production?.datastreamId
        ? edgeConfigOverrides.production.sandbox
        : edgeConfigIds.productionEnvironment.sandbox,
      requestCache,
    }),
  };

  return (
    <>
      <SectionHeader learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/edge/extension/web-sdk-extension-configuration.html?lang=en#datastream-configuration-overrides">
        Datastream configuration overrides
      </SectionHeader>
      <FormElementContainer>
        <Tabs aria-label="Datastream configuration overrides">
          <TabList>
            {OVERRIDE_ENVIRONMENTS.map((env) => (
              <Item key={env} data-test-id={`${env}OverridesTab`}>
                {capitialize(env)}
              </Item>
            ))}
          </TabList>
          <TabPanels>
            {OVERRIDE_ENVIRONMENTS.map((env) => {
              const { result, isLoading, error } = edgeConfigs[env];
              const useManualEntry = !result || Boolean(error);

              // If a service is disabled in the datastream configuration, do not
              // allow the user to override the configuration. If we do not know
              // the datastream configuration, assume the service is enabled.
              const serviceStatus = Object.freeze({
                com_adobe_experience_platform:
                  deepGet(result, "com_adobe_experience_platform.enabled") ??
                  true,
                com_adobe_edge_ode:
                  deepGet(
                    result,
                    "com_adobe_experience_platform_ode.enabled",
                  ) ?? true,
                com_adobe_edge_segmentation:
                  deepGet(
                    result,
                    "com_adobe_experience_platform_edge_segmentation.enabled",
                  ) ?? true,
                com_adobe_edge_destinations:
                  deepGet(
                    result,
                    "com_adobe_experience_platform_edge_destinations.enabled",
                  ) ?? true,
                com_adobe_edge_ajo:
                  deepGet(
                    result,
                    "com_adobe_experience_platform_ajo.enabled",
                  ) ?? true,
                com_adobe_analytics:
                  deepGet(result, "com_adobe_analytics.enabled") ?? true,
                com_adobe_target:
                  deepGet(result, "com_adobe_target.enabled") ?? true,
                com_adobe_audience_manager:
                  deepGet(result, "com_adobe_audience_manager.enabled") ?? true,
                com_adobe_launch_ssf:
                  deepGet(result, "com_adobe_launch_ssf.enabled") ?? true,
              });

              const envEdgeConfigIds = edgeConfigIds[`${env}Environment`];

              const validateEnabledDisabledOrDataElement =
                combineValidatorWithContainsDataElements(
                  createValidateItemIsInArray(
                    Object.values(ENABLED_FIELD_VALUES),
                    "The value must be either 'Enabled' or 'Disabled' or a single data element.",
                  ),
                  false,
                );

              const primaryEventDataset =
                result?.com_adobe_experience_platform?.datasets?.event?.find(
                  ({ primary }) => primary,
                )?.datasetId ?? "";
              const eventDatasetOptions =
                result?.com_adobe_experience_platform?.datasets?.event?.filter(
                  ({ primary }) => !primary,
                ) ?? [];
              let eventDatasetDescription =
                "The ID for the destination event dataset in the Adobe Experience Platform.  The value must be a preconfigured secondary dataset from your datastream configuration.";
              if (primaryEventDataset) {
                eventDatasetDescription = `Overrides the default dataset (${primaryEventDataset}). ${eventDatasetDescription}`;
              }
              const validateItemIsInDatasetsList = createValidateItemIsInArray(
                eventDatasetOptions.map(({ datasetId }) => datasetId),
                "The value must be one of the preconfigured datasets.",
              );
              const validateDatasetOption =
                combineValidatorWithContainsDataElements(
                  validateItemIsInDatasetsList,
                );

              const primaryIdSyncContainer = `${
                result?.com_adobe_identity?.idSyncContainerId ?? ""
              }`;
              const idSyncContainers =
                result?.com_adobe_identity?.idSyncContainerId__additional?.map(
                  (value) => ({ value, label: `${value}` }),
                ) ?? [];
              let idSyncContainerDescription =
                "The ID for the destination third-party ID sync container in Adobe Audience Manager. The value must be a preconfigured secondary container from your datastream configuration and overrides the primary container.";
              if (primaryIdSyncContainer) {
                idSyncContainerDescription = `Overrides the default container (${primaryIdSyncContainer}). ${idSyncContainerDescription}`;
              }
              const validateItemIsInContainersList =
                createValidateItemIsInArray(
                  idSyncContainers.map(({ label }) => label),
                  "The value must be one of the preconfigured ID sync containers.",
                );
              const validateIdSyncContainerOption = (value) => {
                if (typeof value === "string" && value?.includes("%")) {
                  // can only contain numbers and data elements
                  if (/^(\d*(%[^%\n]+%)+\d*)+$/.test(value)) {
                    return undefined;
                  }
                  return "The value must contain one or more valid data elements.";
                }
                try {
                  // forbid empty string but allow other falsey inputs
                  if (value === "" || value === undefined || value === null) {
                    return undefined;
                  }
                  const parsedValue = parseInt(value, 10);
                  if (Number.isNaN(parsedValue)) {
                    return "The value must positive, whole number.";
                  }
                  if (parsedValue < 0) {
                    return "The value must be a positive number.";
                  }
                  if (value.includes(".")) {
                    return "The value must whole number.";
                  }
                } catch (e) {
                  return "The value must positive, whole number.";
                }
                return validateItemIsInContainersList(value);
              };

              const primaryPropertyToken =
                result?.com_adobe_target?.propertyToken ?? "";
              const propertyTokenOptions =
                result?.com_adobe_target?.propertyToken__additional?.map(
                  (value) => ({ value, label: value }),
                ) ?? [];
              let propertyTokenDescription =
                "The token for the destination property in Adobe Target. The value must be a preconfigured property override from your datastream configuration and overrides the primary property.";
              if (primaryPropertyToken) {
                propertyTokenDescription = `Overrides the default property (${primaryPropertyToken}). ${propertyTokenDescription}`;
              }
              const itemIsInPropertyTokenOptions = createValidateItemIsInArray(
                propertyTokenOptions.map(({ value }) => value),
                "The value must be one of the preconfigured property tokens.",
              );
              const validatePropertyTokenOption =
                combineValidatorWithContainsDataElements(
                  itemIsInPropertyTokenOptions,
                );

              /** @type {string[]} */
              const primaryReportSuites =
                result?.com_adobe_analytics?.reportSuites ?? [];
              const reportSuiteOptions =
                primaryReportSuites
                  .concat(result?.com_adobe_analytics?.reportSuites__additional)
                  .filter(Boolean)
                  .map((value) => ({ value, label: value })) ?? [];
              const validateItemIsInReportSuiteOptions =
                createValidateItemIsInArray(
                  reportSuiteOptions.map(({ value }) => value),
                  "The value must be one of the preconfigured report suites.",
                );
              /**
               * @param {string} value
               * @returns {string | undefined}
               */
              const validateReportSuiteOption = (value = "") =>
                value
                  .split(",")
                  .map((v) => v.trim())
                  .filter((v) => Boolean(v))
                  .map(
                    combineValidatorWithContainsDataElements(
                      validateItemIsInReportSuiteOptions,
                    ),
                  )
                  .filter((v) => Boolean(v))[0];
              const sandboxFieldName = `${prefix}.${env}.${FIELD_NAMES.sandbox}`;
              const [{ value: sandbox }] = useField(sandboxFieldName);

              return (
                <Item key={env}>
                  <Flex direction="column" gap="size-100">
                    <SettingsCopySection currentEnv={env} onPress={onCopy} />
                    {!hideFieldsSet.has(FIELD_NAMES.datastreamId) && (
                      <>
                        <SandboxSelector
                          data-test-id={FIELD_NAMES.sandbox}
                          initInfo={initInfo}
                          label="Sandbox"
                          name={sandboxFieldName}
                          width="size-5000"
                        />
                        <DatastreamOverrideSelector
                          data-test-id={FIELD_NAMES.datastreamId}
                          label="Datastream"
                          description={`Override the configured datastream${
                            envEdgeConfigIds.datastreamId
                              ? ` (${envEdgeConfigIds.datastreamId})`
                              : ""
                          }.`}
                          orgId={configOrgId}
                          imsAccess={initInfo.tokens.imsAccess}
                          name={`${prefix}.${env}.datastreamId`}
                          sandbox={sandbox}
                          width="size-5000"
                        />
                      </>
                    )}
                    {!hideFieldsSet.has(FIELD_NAMES.reportSuitesOverride) && (
                      <ProductSubsection name="Adobe Analytics">
                        <OverrideInput
                          aria-label="Enable or disable Adobe Analytics"
                          data-test-id={FIELD_NAMES.analyticsEnabled}
                          allowsCustomValue
                          validate={validateEnabledDisabledOrDataElement}
                          name={`${prefix}.${env}.com_adobe_analytics.enabled`}
                          width="size-5000"
                          pattern={enabledDisabledOrDataElementRegex}
                          isDisabled={!serviceStatus.com_adobe_analytics}
                          description="Enable or disable the Adobe Analytics destination."
                        >
                          {Object.values(ENABLED_FIELD_VALUES).map((value) => (
                            <Item key={value}>{value}</Item>
                          ))}
                        </OverrideInput>
                        <ReportSuitesOverride
                          useManualEntry={useManualEntry}
                          validate={validateReportSuiteOption}
                          primaryItem={primaryReportSuites}
                          isDisabled={!serviceStatus.com_adobe_analytics}
                          items={reportSuiteOptions}
                          prefix={`${prefix}.${env}`}
                        />
                      </ProductSubsection>
                    )}
                    {!hideFieldsSet.has(
                      FIELD_NAMES.idSyncContainerOverride,
                    ) && (
                      <ProductSubsection name="Adobe Audience Manager">
                        <OverrideInput
                          data-test-id={FIELD_NAMES.idSyncContainerOverride}
                          label="Third-party ID sync container"
                          useManualEntry={
                            useManualEntry || idSyncContainers.length === 0
                          }
                          allowsCustomValue
                          overrideType="third-party ID sync container"
                          primaryItem={primaryIdSyncContainer}
                          defaultItems={idSyncContainers}
                          isDisabled={!serviceStatus.com_adobe_audience_manager}
                          validate={validateIdSyncContainerOption}
                          name={`${prefix}.${env}.com_adobe_identity.idSyncContainerId`}
                          inputMode="numeric"
                          width="size-5000"
                          pattern={/\d+/}
                          description={idSyncContainerDescription}
                        >
                          {({ value, label }) => (
                            <Item key={value}>{label}</Item>
                          )}
                        </OverrideInput>
                      </ProductSubsection>
                    )}
                    {!hideFieldsSet.has(FIELD_NAMES.eventDatasetOverride) && (
                      <ProductSubsection name="Adobe Experience Platform">
                        <OverrideInput
                          useManualEntry={
                            useManualEntry || eventDatasetOptions.length === 0
                          }
                          defaultItems={eventDatasetOptions}
                          data-test-id={FIELD_NAMES.eventDatasetOverride}
                          label="Event dataset"
                          description={eventDatasetDescription}
                          width="size-5000"
                          isDisabled={
                            !serviceStatus.com_adobe_experience_platform
                          }
                          allowsCustomValue
                          validate={validateDatasetOption}
                          loadingState={isLoading}
                          name={`${prefix}.${env}.com_adobe_experience_platform.datasets.event.datasetId`}
                        >
                          {({ datasetId }) => (
                            <Item key={datasetId}>{datasetId}</Item>
                          )}
                        </OverrideInput>
                      </ProductSubsection>
                    )}
                    {!hideFieldsSet.has(
                      FIELD_NAMES.targetPropertyTokenOverride,
                    ) && (
                      <ProductSubsection name="Adobe Target">
                        <OverrideInput
                          data-test-id={FIELD_NAMES.targetPropertyTokenOverride}
                          label="Target property token"
                          allowsCustomValue
                          overrideType="property token"
                          primaryItem={primaryPropertyToken}
                          isDisabled={!serviceStatus.com_adobe_target}
                          validate={validatePropertyTokenOption}
                          defaultItems={propertyTokenOptions}
                          useManualEntry={
                            useManualEntry || propertyTokenOptions.length === 0
                          }
                          name={`${prefix}.${env}.com_adobe_target.propertyToken`}
                          description={propertyTokenDescription}
                          width="size-5000"
                        >
                          {({ value, label }) => (
                            <Item key={value}>{label}</Item>
                          )}
                        </OverrideInput>
                      </ProductSubsection>
                    )}
                  </Flex>
                </Item>
              );
            })}
          </TabPanels>
        </Tabs>
      </FormElementContainer>
    </>
  );
};

Overrides.propTypes = {
  initInfo: PropTypes.object.isRequired,
  instanceFieldName: PropTypes.string,
  edgeConfigIds: PropTypes.shape({
    developmentEnvironment: PropTypes.shape({
      datastreamId: PropTypes.string,
      sandbox: PropTypes.string,
    }),
    stagingEnvironment: PropTypes.shape({
      datastreamId: PropTypes.string,
      sandbox: PropTypes.string,
    }),
    productionEnvironment: PropTypes.shape({
      datastreamId: PropTypes.string,
      sandbox: PropTypes.string,
    }),
  }).isRequired,
  configOrgId: PropTypes.string.isRequired,
  hideFields: PropTypes.arrayOf(PropTypes.oneOf(Object.values(FIELD_NAMES))),
};

export default Overrides;
