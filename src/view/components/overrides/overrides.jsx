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
  getCurrentInstanceSettings,
  useFetchConfig
} from "./utils";

/**
 * A section of a form that allows the user to override datastream configuration
 *
 * @typedef {Object} OverridesProps
 * @property {Object} initInfo
 * @property {string?} options.instanceFieldName
 * The name of the Formik parent form. State will be stored as a nested object under the "edgeConfigOverrides" key.
 * @property {string} options.instanceName The name of the instance.
 * @property {boolean} options.largeHeader Whether to use the large header. Defaults to false.
 * @property {Array<"eventDatasetOverride" | "idSyncContainerOverride" | "targetPropertyTokenOverride" | "targetPropertyTokenOverride" | "reportSuitesOverride">} options.showFields
 * Which fields to show. Defaults to showing all fields
 * @param {OverridesProps} options
 * @returns {React.Element}
 */
const Overrides = ({
  initInfo,
  instanceFieldName,
  instanceName,
  largeHeader = false,
  showFields = [...Object.values(FIELD_NAMES)]
}) => {
  const prefix = instanceFieldName
    ? `${instanceFieldName}.edgeConfigOverrides`
    : "edgeConfigOverrides";
  const showFieldsSet = new Set(showFields);

  const instanceSettings = getCurrentInstanceSettings({
    initInfo,
    instanceName
  });
  const requestCache = useRef({});
  const edgeConfigs = {
    [DEVELOPMENT]: useFetchConfig({
      orgId: initInfo.company.orgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: instanceSettings.developmentEdgeConfigId,
      sandbox: instanceSettings.developmentSandbox,
      requestCache
    }),
    [STAGING]: useFetchConfig({
      orgId: initInfo.company.orgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: instanceSettings.stagingEdgeConfigId,
      sandbox: instanceSettings.stagingSandbox,
      requestCache
    }),
    [PRODUCTION]: useFetchConfig({
      orgId: initInfo.company.orgId,
      imsAccess: initInfo.tokens.imsAccess,
      edgeConfigId: instanceSettings.edgeConfigId,
      sandbox: instanceSettings.sandbox,
      requestCache
    })
  };

  const [
    ,
    { value: edgeConfigOverrides },
    { setValue: setEdgeConfigOverrides }
  ] = useField(prefix);
  const onCopy = (source, destinations) => {
    const newOverrides = destinations.reduce(
      (result, env) => ({ ...result, [env]: edgeConfigOverrides[source] }),
      edgeConfigOverrides
    );
    setEdgeConfigOverrides(newOverrides);
  };

  return (
    <>
      <HeaderContainer
        largeHeader={largeHeader}
        learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/edge/datastreams/overrides.html"
      >
        Datastream Configuration Overrides
      </HeaderContainer>
      <FormElementContainer>
        <Tabs aria-label="Datastream Configuration Overrides">
          <TabList>
            {OVERRIDE_ENVIRONMENTS.map(env => (
              <Item key={env}>{capitialize(env)}</Item>
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

              const primaryIdSyncContainer =
                `${result?.com_adobe_identity?.idSyncContainerId}` ?? "";
              const idSyncContainers =
                result?.com_adobe_identity.idSyncContainerId__additional?.map(
                  value => ({ value, label: `${value}` })
                ) ?? [];

              const primaryPropertyToken =
                result?.com_adobe_target.propertyToken ?? "";
              const propertyTokenOptions =
                result?.com_adobe_target.propertyToken__additional?.map(
                  value => ({ value, label: value })
                ) ?? [];

              const primaryReportSuites =
                result?.com_adobe_analytics?.reportSuites ?? [];
              const reportSuiteOptions =
                result?.com_adobe_analytics.reportSuites__additional?.map(
                  value => ({ value, label: value })
                ) ?? [];

              return (
                <Item key={env}>
                  <Flex
                    direction="column"
                    marginX={largeHeader ? "" : "size-300"}
                    gap="size-100"
                  >
                    {showFieldsSet.has(FIELD_NAMES.eventDatasetOverride) && (
                      <OverrideInput
                        useManualEntry={
                          useManualEntry || eventDatasetOptions.length === 0
                        }
                        primaryItem={primaryEventDataset}
                        defaultItems={eventDatasetOptions}
                        overrideType="event dataset"
                        data-test-id={FIELD_NAMES.eventDatasetOverride}
                        label="Event dataset"
                        description="The ID for the destination event dataset in the Adobe Experience Platform. The value must be a preconfigured secondary dataset from your datastream configuration and overrides the primary dataset."
                        width="size-5000"
                        allowsCustomValue
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
                        name={`${prefix}.${env}.com_adobe_identity.idSyncContainerId`}
                        inputMode="numeric"
                        width="size-5000"
                        pattern={/\d+/}
                        description="The ID for the destination third-party ID sync container in Adobe Audience Manager. The value must be a preconfigured secondary container from your datastream configuration and overrides the primary container."
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
                        defaultItems={propertyTokenOptions}
                        useManualEntry={
                          useManualEntry || propertyTokenOptions.length === 0
                        }
                        name={`${prefix}.${env}.com_adobe_target.propertyToken`}
                        description="The token for the destination property in Adobe Target. The value must be a preconfigured property override from your datastream configuration and overrides the primary property."
                        width="size-5000"
                      >
                        {({ value, label }) => <Item key={value}>{label}</Item>}
                      </OverrideInput>
                    )}
                    {showFieldsSet.has(FIELD_NAMES.reportSuitesOverride) && (
                      <ReportSuitesOverride
                        useManualEntry={useManualEntry}
                        primaryItem={primaryReportSuites}
                        items={reportSuiteOptions}
                        prefix={`${prefix}.${env}`}
                      />
                    )}
                    <SettingsCopySection currentEnv={env} onPress={onCopy} />
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
  instanceName: PropTypes.string.isRequired,
  largeHeader: PropTypes.bool,
  showFields: PropTypes.arrayOf(PropTypes.oneOf(Object.values(FIELD_NAMES)))
};

export default Overrides;
