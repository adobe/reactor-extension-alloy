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
import { Flex, Item, TabList, TabPanels, Tabs } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import React, { useRef } from "react";

import {
  DEVELOPMENT,
  ENVIRONMENTS as OVERRIDE_ENVIRONMENTS,
  PRODUCTION,
  STAGING
} from "../../configuration/constants/environmentType";
import FormElementContainer from "../formElementContainer";
import HeaderContainer from "./headerContainer";
import OverrideInput from "./overrideInput";
import ReportSuitesOverride from "./reportSuiteOverrides";
import SettingsCopySection from "./settingsCopySection";
import {
  FIELD_NAMES,
  capitialize,
  createIsItemInArray,
  isDataElement,
  useFetchConfig
} from "./utils";

/**
 * A section of a form that allows the user to override datastream configuration
 *
 * @typedef {Object} OverridesProps
 * @property {Object} initInfo
 * @property {string?} options.instanceFieldName
 * The name of the Formik parent form. State will be stored as a nested object under the "edgeConfigOverrides" key.
 * @property {boolean} options.largeHeader Whether to use the large header. Defaults to false.
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
  largeHeader = false,
  showFields = [...Object.values(FIELD_NAMES)]
}) => {
  const prefix = instanceFieldName
    ? `${instanceFieldName}.edgeConfigOverrides`
    : "edgeConfigOverrides";
  const showFieldsSet = new Set(showFields);

  const requestCache = useRef({});
  const authOrgId = initInfo.company.orgId;
  const edgeConfigs = {
    [DEVELOPMENT]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: edgeConfigIds.developmentEnvironment.datastreamId,
      sandbox: edgeConfigIds.developmentEnvironment.sandbox,
      requestCache
    }),
    [STAGING]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: edgeConfigIds.stagingEnvironment.datastreamId,
      sandbox: edgeConfigIds.stagingEnvironment.sandbox,
      requestCache
    }),
    [PRODUCTION]: useFetchConfig({
      authOrgId,
      configOrgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: edgeConfigIds.productionEnvironment.datastreamId,
      sandbox: edgeConfigIds.productionEnvironment.sandbox,
      requestCache
    })
  };

  const [
    ,
    { value: edgeConfigOverrides },
    { setValue: setEdgeConfigOverrides }
  ] = useField(prefix);
  /**
   * Import the settings from the destination to the source
   *
   * @param {"production" | "staging" | "development"} source
   * @param {"production" | "staging" | "development"} destination
   */
  const onCopy = (source, destination) => {
    edgeConfigOverrides[destination] = edgeConfigOverrides[source];
    setEdgeConfigOverrides(edgeConfigOverrides);
  };

  return (
    <>
      <HeaderContainer
        largeHeader={largeHeader}
        learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/edge/extension/web-sdk-extension-configuration.html?lang=en#datastream-configuration-overrides"
      >
        Datastream Configuration Overrides
      </HeaderContainer>
      <FormElementContainer>
        <Tabs aria-label="Datastream Configuration Overrides">
          <TabList>
            {OVERRIDE_ENVIRONMENTS.map(env => (
              <Item key={env} data-test-id={`${env}OverridesTab`}>
                {capitialize(env)}
              </Item>
            ))}
          </TabList>
          <TabPanels>
            {OVERRIDE_ENVIRONMENTS.map(env => {
              const { result, isLoading, error } = edgeConfigs[env];
              const useManualEntry = !result || Boolean(error);

              const primaryEventDataset =
                result?.com_adobe_experience_platform?.datasets?.event?.find(
                  ({ primary }) => primary
                )?.datasetId ?? "";
              const eventDatasetOptions =
                result?.com_adobe_experience_platform?.datasets?.event?.filter(
                  ({ primary }) => !primary
                ) ?? [];
              let eventDatasetDescription =
                "The ID for the destination event dataset in the Adobe Experience Platform. The value must be a preconfigured secondary dataset from your datastream configuration.";
              if (primaryEventDataset) {
                eventDatasetDescription = `Overrides default dataset of "${primaryEventDataset}". ${eventDatasetDescription}`;
              }
              const itemIsInDatasetOptions = createIsItemInArray(
                eventDatasetOptions.map(({ datasetId }) => datasetId),
                { errorOnEmptyArray: false, errorOnEmptyItem: false }
              );
              const isValidDatasetOption = value =>
                isDataElement(value) || itemIsInDatasetOptions(value);

              const primaryIdSyncContainer = `${result?.com_adobe_identity
                ?.idSyncContainerId ?? ""}`;
              const idSyncContainers =
                result?.com_adobe_identity?.idSyncContainerId__additional?.map(
                  value => ({ value, label: `${value}` })
                ) ?? [];
              let idSyncContainerDescription =
                "The ID for the destination third-party ID sync container in Adobe Audience Manager. The value must be a preconfigured secondary container from your datastream configuration and overrides the primary container.";
              if (primaryIdSyncContainer) {
                idSyncContainerDescription = `Overrides default container of "${primaryIdSyncContainer}". ${idSyncContainerDescription}`;
              }
              const itemIsInIdSyncContainerOptions = createIsItemInArray(
                idSyncContainers.map(({ label }) => label),
                { errorOnEmptyArray: false, errorOnEmptyItem: false }
              );
              const isValidIdSyncContainerOption = value =>
                isDataElement(value) || itemIsInIdSyncContainerOptions(value);

              const primaryPropertyToken =
                result?.com_adobe_target?.propertyToken ?? "";
              const propertyTokenOptions =
                result?.com_adobe_target?.propertyToken__additional?.map(
                  value => ({ value, label: value })
                ) ?? [];
              let propertyTokenDescription =
                "The token for the destination property in Adobe Target. The value must be a preconfigured property override from your datastream configuration and overrides the primary property.";
              if (primaryPropertyToken) {
                propertyTokenDescription = `Overrides default property of "${primaryPropertyToken}". ${propertyTokenDescription}`;
              }
              const itemIsInPropertyTokenOptions = createIsItemInArray(
                propertyTokenOptions.map(({ value }) => value),
                { errorOnEmptyArray: false, errorOnEmptyItem: false }
              );
              const isValidPropertyTokenOption = value =>
                isDataElement(value) || itemIsInPropertyTokenOptions(value);

              /** @type {string[]} */
              const primaryReportSuites =
                result?.com_adobe_analytics?.reportSuites ?? [];
              const reportSuiteOptions =
                primaryReportSuites
                  .concat(result?.com_adobe_analytics?.reportSuites__additional)
                  .filter(Boolean)
                  .map(value => ({ value, label: value })) ?? [];
              const itemIsInReportSuiteOptions = createIsItemInArray(
                reportSuiteOptions.map(({ value }) => value),
                { errorOnEmptyArray: false, errorOnEmptyItem: false }
              );
              const isValidReportSuiteOption = value => {
                if (value?.includes(",")) {
                  return value
                    .split(",")
                    .map(v => v.trim())
                    .every(
                      v => isDataElement(v) || itemIsInReportSuiteOptions(v)
                    );
                }
                return (
                  isDataElement(value) || itemIsInReportSuiteOptions(value)
                );
              };

              return (
                <Item key={env}>
                  <Flex
                    direction="column"
                    marginX={largeHeader ? "" : "size-300"}
                    gap="size-100"
                  >
                    <SettingsCopySection currentEnv={env} onPress={onCopy} />
                    {showFieldsSet.has(FIELD_NAMES.eventDatasetOverride) && (
                      <OverrideInput
                        useManualEntry={
                          useManualEntry || eventDatasetOptions.length === 0
                        }
                        defaultItems={eventDatasetOptions}
                        data-test-id={FIELD_NAMES.eventDatasetOverride}
                        label="Event dataset"
                        description={eventDatasetDescription}
                        width="size-5000"
                        allowsCustomValue
                        isValid={isValidDatasetOption}
                        loadingState={isLoading}
                        name={`${prefix}.${env}.com_adobe_experience_platform.datasets.event.datasetId`}
                      >
                        {({ datasetId }) => (
                          <Item key={datasetId}>{datasetId}</Item>
                        )}
                      </OverrideInput>
                    )}
                    {showFieldsSet.has(FIELD_NAMES.idSyncContainerOverride) && (
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
                        isValid={isValidIdSyncContainerOption}
                        name={`${prefix}.${env}.com_adobe_identity.idSyncContainerId`}
                        inputMode="numeric"
                        width="size-5000"
                        pattern={/\d+/}
                        description={idSyncContainerDescription}
                      >
                        {({ value, label }) => <Item key={value}>{label}</Item>}
                      </OverrideInput>
                    )}
                    {showFieldsSet.has(
                      FIELD_NAMES.targetPropertyTokenOverride
                    ) && (
                      <OverrideInput
                        data-test-id={FIELD_NAMES.targetPropertyTokenOverride}
                        label="Target property token"
                        allowsCustomValue
                        overrideType="property token"
                        primaryItem={primaryPropertyToken}
                        isValid={isValidPropertyTokenOption}
                        defaultItems={propertyTokenOptions}
                        useManualEntry={
                          useManualEntry || propertyTokenOptions.length === 0
                        }
                        name={`${prefix}.${env}.com_adobe_target.propertyToken`}
                        description={propertyTokenDescription}
                        width="size-5000"
                      >
                        {({ value, label }) => <Item key={value}>{label}</Item>}
                      </OverrideInput>
                    )}
                    {showFieldsSet.has(FIELD_NAMES.reportSuitesOverride) && (
                      <ReportSuitesOverride
                        useManualEntry={useManualEntry}
                        isValid={isValidReportSuiteOption}
                        primaryItem={primaryReportSuites}
                        items={reportSuiteOptions}
                        prefix={`${prefix}.${env}`}
                      />
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
      datastreamId: PropTypes.string.isRequired,
      sandbox: PropTypes.string
    }),
    stagingEnvironment: PropTypes.shape({
      datastreamId: PropTypes.string.isRequired,
      sandbox: PropTypes.string
    }),
    productionEnvironment: PropTypes.shape({
      datastreamId: PropTypes.string.isRequired,
      sandbox: PropTypes.string
    })
  }).isRequired,
  configOrgId: PropTypes.string.isRequired,
  largeHeader: PropTypes.bool,
  showFields: PropTypes.arrayOf(PropTypes.oneOf(Object.values(FIELD_NAMES)))
};

export default Overrides;
