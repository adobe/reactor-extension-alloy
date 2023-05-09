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
  ActionButton,
  Button,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Item,
  View,
  Checkbox
} from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { FieldArray, useField } from "formik";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";

import FormElementContainer from "../formElementContainer";
import SectionHeader from "../sectionHeader";
import DataElementSelector from "../dataElementSelector";
import {
  DEVELOPMENT,
  PRODUCTION,
  STAGING,
  ENVIRONMENTS as OVERRIDE_ENVIRONMENTS
} from "../../configuration/constants/environmentType";
import FormikComboBox from "../formikReactSpectrum3/formikComboBox";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import fetchConfig from "../../configuration/utils/fetchConfig";

/**
 * The names of the different fields that can appear in the form. Used to pass
 * to the `showFields` prop of the `Overrides` component.
 */
export const FIELD_NAMES = {
  eventDatasetOverride: "eventDatasetOverride",
  idSyncContainerOverride: "idSyncContainerOverride",
  targetPropertyTokenOverride: "targetPropertyTokenOverride",
  reportSuitesOverride: "reportSuitesOverride"
};
/**
 * Takes a string and returns the a new string with the first letter capitalized.
 * @param {string} str
 * @returns {string}
 */
const capitialize = str => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * The section of the page that allows the user to input a variable number of
 * report suite overrides.
 *
 * @param {Object} props
 * @param {string} props.prefix The common prefix for all the data input
 * fields in the Formik state object.
 * @param {string[]} props.items The list of items to display in the dropdown
 * @param {boolean} props.useManualEntry If true, the input is a text field. If
 * false, the input is a combo box.
 * @returns
 */
const ReportSuitesOverride = ({ prefix, items, useManualEntry }) => {
  const fieldName = `${prefix}.com_adobe_analytics.reportSuites`;
  const [, { value: rsids }] = useField(fieldName);
  return (
    <FieldArray name={fieldName}>
      {({ remove, push }) => (
        <>
          <Flex direction="column" gap="size-100">
            {rsids.map((rsid, index) => (
              <Flex key={index} direction="row">
                <OverrideInput
                  useManualEntry={useManualEntry || items.length === 0}
                  data-test-id={`${FIELD_NAMES.reportSuitesOverride}.${index}`}
                  label={index === 0 && "Report suites"}
                  allowsCustomValue
                  items={items}
                  name={`${fieldName}.${index}`}
                  description={
                    index === rsids.length - 1 &&
                    "The IDs for the destination report suites in Adobe Analytics. The value must be a preconfigured override report suite from your datastream configuration and overrides the primary report suites."
                  }
                  width="size-5000"
                  key={index}
                >
                  {({ value, label }) => <Item key={value}>{label}</Item>}
                </OverrideInput>
                <ActionButton
                  isQuiet
                  isDisabled={rsids.length < 2}
                  marginTop={index === 0 && "size-300"}
                  data-test-id={`removeReportSuite.${index}`}
                  aria-label={`Remove report suite #${index + 1}`}
                  onPress={() => remove(index)}
                >
                  <Delete />
                </ActionButton>
              </Flex>
            ))}
          </Flex>
          <Button
            data-test-id="addReportSuite"
            variant="secondary"
            onPress={() => push("")}
            UNSAFE_style={{ maxWidth: "fit-content" }}
          >
            Add Report Suite
          </Button>
        </>
      )}
    </FieldArray>
  );
};

ReportSuitesOverride.propTypes = {
  prefix: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  useManualEntry: PropTypes.bool.isRequired
};

const HeaderContainer = ({ largeHeader = false, children, ...props }) => {
  if (largeHeader) {
    return <SectionHeader {...props}>{children}</SectionHeader>;
  }
  return (
    <Heading
      {...props}
      level={5}
      margin="0"
      UNSAFE_style={{
        fontWeight: "normal",
        color:
          "var(--spectrum-fieldlabel-text-color, var(--spectrum-alias-label-text-color) )"
      }}
    >
      {children}
    </Heading>
  );
};

HeaderContainer.propTypes = {
  largeHeader: PropTypes.bool,
  children: PropTypes.node.isRequired
};

/**
 * A section of the form that allows the user to copy all the overrides from the
 * current environment to the other two environments. Users select the destination
 * environments with checkboxes, then click the "Copy" button.
 *
 * @param {Object} props
 * @param {string} props.currentEnv The current environment.
 * @param {(source: string, destinations: string[]) => void} props.onPress The
 * function to call when the user clicks the "Copy" button.
 *
 * @returns {React.Element}
 */
const SettingsCopySection = ({ currentEnv, onPress }) => {
  const [destinations, setDestinations] = React.useState([]);
  const availableDestinations = OVERRIDE_ENVIRONMENTS.filter(
    env => env !== currentEnv
  );

  const onCopy = () => {
    onPress(currentEnv, destinations);
    setDestinations([]);
  };

  return (
    <View>
      <HeaderContainer>Copy overrides to…</HeaderContainer>
      <FormElementContainer>
        <Flex direction="row">
          {availableDestinations.map(env => (
            <Checkbox
              key={env}
              data-test-id={`copyOverrides.${env}`}
              isSelected={destinations.includes(env)}
              onChange={isSelected => {
                if (isSelected) {
                  setDestinations([...destinations, env]);
                } else {
                  setDestinations(destinations.filter(d => d !== env));
                }
              }}
            >
              {capitialize(env)}
            </Checkbox>
          ))}
        </Flex>
      </FormElementContainer>
      <Button
        data-test-id="copyOverrides"
        variant="secondary"
        isDisabled={destinations.length === 0}
        marginTop="size-100"
        onPress={onCopy}
        UNSAFE_style={{ maxWidth: "fit-content" }}
      >
        Copy
      </Button>
    </View>
  );
};

SettingsCopySection.propTypes = {
  currentEnv: PropTypes.oneOf(OVERRIDE_ENVIRONMENTS).isRequired,
  onPress: PropTypes.func.isRequired
};

const getCurrentInstanceSettings = ({ initInfo, instanceName }) => {
  try {
    if (!instanceName) {
      instanceName = initInfo.settings.instanceName;
    }
    const instances =
      initInfo.extensionSettings?.instances ?? initInfo.settings?.instances;
    const instanceSettings = instances.find(
      instance => instance.name === instanceName
    );
    return instanceSettings;
  } catch (err) {
    console.error(err);
    return {};
  }
};

/**
 * A custom React hook that calls the `fetchConfig` function to get the Blackbird
 * configuration for the specified org, sandbox, and edge config ID. Returns the
 * result as well as the loading state and any errors that arise.
 * @param {Object} options
 * @param {string} options.orgId
 * @param {string} options.imsAccess
 * @param {string} options.edgeConfigId
 * @param {string} options.sandbox
 * @param {string?} options.signal
 * @param {{ current: { [key: string]: any } }} options.requestCache
 * @returns {{ result: any, isLoading: boolean, error: any }}
 */
const useFetchConfig = ({
  orgId,
  imsAccess,
  edgeConfigId,
  sandbox,
  signal,
  requestCache
}) => {
  const cacheKey = `${orgId}-${sandbox}-${edgeConfigId}`;
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (requestCache.current[cacheKey]) {
      setResult(requestCache.current[cacheKey]);
      setError(null);
      return;
    }
    setIsLoading(true);
    fetchConfig({ orgId, imsAccess, edgeConfigId, sandbox, signal })
      .then(response => {
        const { data: { settings = {} } = {} } = response;
        requestCache.current[cacheKey] = settings;
        setResult(settings);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orgId, imsAccess, edgeConfigId, sandbox]);
  return { result, isLoading, error };
};

/**
 *
 * @param {Object} options
 * @param {boolean} options.useManualEntry If true, the component will be a text
 * field. If false, the component will be a combo box.
 * @param {Function} options.children A function that returns a React element
 * representing each option in the combo box.
 * @returns {React.Element}
 */
const OverrideInput = ({ useManualEntry, children, ...otherProps }) => {
  if (useManualEntry) {
    return (
      <DataElementSelector>
        <FormikTextField {...otherProps} />
      </DataElementSelector>
    );
  }
  return (
    <DataElementSelector>
      <FormikComboBox {...otherProps}>{children}</FormikComboBox>
    </DataElementSelector>
  );
};

OverrideInput.propTypes = {
  useManualEntry: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
};

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
  console.log("CARTER - all hooks", {
    edgeConfigs,
    initInfo,
    instanceSettings
  });

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
      <HeaderContainer largeHeader={largeHeader}>
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
              const eventDatasetOptions =
                result?.com_adobe_experience_platform?.datasets?.event?.filter(
                  ({ primary }) => !primary
                ) ?? [];
              const idSyncContainers =
                result?.com_adobe_identity.idSyncContainerId__additional?.map(
                  value => ({ value, label: `${value}` })
                ) ?? [];
              const propertyTokenOptions =
                result?.com_adobe_target.propertyToken__additional?.map(
                  value => ({ value, label: value })
                ) ?? [];
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
                        items={eventDatasetOptions}
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
                        items={idSyncContainers}
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
                        items={propertyTokenOptions}
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
