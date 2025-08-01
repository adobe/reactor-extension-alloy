/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useState, useRef } from "react";
import { FieldArray, useField } from "formik";
import {
  Button,
  Flex,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
  Accordion,
  Disclosure,
  DisclosureTitle,
  DisclosurePanel,
  Radio,
} from "@adobe/react-spectrum";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import PropTypes from "prop-types";
import { object, array, string } from "yup";
import render from "../render";
import ExtensionView from "../components/extensionView";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import BasicSection, { bridge as basicSectionBridge } from "./basicSection";
import EdgeConfigurationsSection, {
  bridge as edgeConfigurationsSectionBridge,
} from "./edgeConfigurationsSection";
import PrivacySection, {
  bridge as privacySectionBridge,
} from "./privacySection";
import IdentitySection, {
  bridge as identitySectionBridge,
} from "./identitySection";
import PersonalizationSection, {
  bridge as personalizationSectionBridge,
} from "./personalizationSection";
import DataCollectionSection, {
  bridge as dataCollectionSectionBridge,
} from "./dataCollectionSection";
import OverridesSection, {
  bridge as overridesBridge,
} from "../components/overrides";
import AdvancedSection, {
  bridge as advancedSectionBridge,
} from "./advancedSection";
import getEdgeConfigIds from "../utils/getEdgeConfigIds";
import { FIELD_NAMES } from "../components/overrides/utils";
import StreamingMediaSection, {
  bridge as mediaBridge,
} from "./streamingMediaSection";
import ComponentsSection, {
  bridge as componentsBridge,
} from "./componentsSection";

const sectionBridges = [
  basicSectionBridge,
  edgeConfigurationsSectionBridge,
  privacySectionBridge,
  identitySectionBridge,
  personalizationSectionBridge,
  dataCollectionSectionBridge,
  overridesBridge,
  advancedSectionBridge,
  mediaBridge,
];

/**
 * Produces a function that, when called, calls the method from
 * all section bridges and merges the result into a single object.
 */
const getMergedBridgeMethod = (methodName) => {
  return async (params) => {
    const bridgeMethodResults = await Promise.all(
      sectionBridges.map((bridge) => {
        return bridge[methodName] ? bridge[methodName](params) : {};
      }),
    );
    return Object.assign(...bridgeMethodResults);
  };
};

const getInstanceDefaults = getMergedBridgeMethod("getInstanceDefaults");
const getInitialInstanceValues = getMergedBridgeMethod(
  "getInitialInstanceValues",
);
const getInstanceSettings = getMergedBridgeMethod("getInstanceSettings");

/**
 * Creates the validation schema based on library type
 */
const createValidationSchema = () => {
  // Create full validation schema by merging all bridge schemas
  const fullInstanceSchema = sectionBridges.reduce((instanceSchema, bridge) => {
    return bridge.instanceValidationSchema
      ? instanceSchema.concat(bridge.instanceValidationSchema)
      : instanceSchema;
  }, object());

  // Create minimal schema for preinstalled mode (only name validation)
  const preinstalledInstanceSchema = object().shape({
    name: string()
      .required("Please specify a name.")
      .matches(/\D+/, "Please provide a non-numeric name.")
      .test({
        name: "notWindowPropertyName",
        message:
          "Please provide a name that does not conflict with a property already found on the window object.",
        test(value) {
          return !(value in window);
        },
      }),
  });

  return object().shape({
    libraryCode: object().shape({
      type: string().required(),
    }),
    instances: array().of(
      object().when("$parent.libraryCode.type", {
        is: "preinstalled",
        then: () => preinstalledInstanceSchema,
        otherwise: () => fullInstanceSchema,
      }),
    ),
  });
};

const getInitialValues = async ({ initInfo, context }) => {
  const { instances: instancesSettings } = initInfo.settings || {};

  let instancesInitialValues;

  if (instancesSettings) {
    instancesInitialValues = await Promise.all(
      instancesSettings.map((instanceSettings, instanceSettingsIndex) => {
        return getInitialInstanceValues({
          initInfo,
          isFirstInstance: instanceSettingsIndex === 0,
          instanceSettings,
          context,
        });
      }),
    );
  } else {
    instancesInitialValues = [
      await getInstanceDefaults({ initInfo, isFirstInstance: true, context }),
    ];
  }

  return {
    ...componentsBridge.getInitialValues({ initInfo }),
    instances: instancesInitialValues,
    libraryCode: initInfo.settings?.libraryCode || { type: "managed" },
  };
};

const getSettings = async ({ values, initInfo }) => {
  const settings = {
    ...componentsBridge.getSettings({ values, initInfo }),
    libraryCode: values.libraryCode,
    instances: await Promise.all(
      values.instances.map((instanceValues) => {
        return getInstanceSettings({
          initInfo,
          instanceValues,
          components: values.components,
        });
      }),
    ),
  };

  return settings;
};

const InstancesSection = ({ initInfo, context, isPreinstalled }) => {
  const [{ value: instances }] = useField("instances");
  const [selectedTabKey, setSelectedTabKey] = useState("0");

  useNewlyValidatedFormSubmission((errors) => {
    // If the user just tried to save the configuration and there's
    // a validation error, make sure the first accordion item containing
    // an error is shown.
    if (errors && errors.instances) {
      const instanceIndexContainingErrors = errors.instances.findIndex(
        (instance) => instance,
      );
      setSelectedTabKey(String(instanceIndexContainingErrors));
    }
  });
  return (
    <Flex direction="column" gap="size-50">
      <FieldArray
        name="instances"
        render={(arrayHelpers) => {
          return (
            <div>
              <Flex alignItems="center">
                <Button
                  data-test-id="addInstanceButton"
                  variant="secondary"
                  onPress={async () => {
                    const newInstance = await getInstanceDefaults({
                      initInfo,
                      isFirstInstance: false,
                      context,
                    });
                    arrayHelpers.push(newInstance);
                    setSelectedTabKey(String(instances.length));
                  }}
                  position="absolute"
                  top="12px"
                  right="16px"
                >
                  Add instance
                </Button>
              </Flex>
              <Tabs
                aria-label="SDK instances"
                items={instances}
                selectedKey={selectedTabKey}
                onSelectionChange={setSelectedTabKey}
              >
                <TabList marginBottom="size-200">
                  {instances.map((instance, index) => {
                    return (
                      <Item key={index}>
                        {instance.name || "Unnamed instance"}
                      </Item>
                    );
                  })}
                </TabList>
                <TabPanels>
                  {instances.map((instance, index) => {
                    const instanceFieldName = `instances.${index}`;
                    const edgeConfigIds = getEdgeConfigIds(instance);
                    return (
                      <Item key={index}>
                        <BasicSection
                          instanceFieldName={instanceFieldName}
                          initInfo={initInfo}
                          isPreinstalled={isPreinstalled}
                        />
                        {!isPreinstalled && (
                          <>
                            <EdgeConfigurationsSection
                              instanceFieldName={instanceFieldName}
                              instanceIndex={index}
                              initInfo={initInfo}
                              context={context}
                            />
                            <PrivacySection
                              instanceFieldName={instanceFieldName}
                            />
                            <IdentitySection
                              instanceFieldName={instanceFieldName}
                            />
                            <PersonalizationSection
                              instanceFieldName={instanceFieldName}
                            />
                            <DataCollectionSection
                              instanceFieldName={instanceFieldName}
                            />
                            <StreamingMediaSection
                              instanceFieldName={instanceFieldName}
                            />
                            <OverridesSection
                              initInfo={initInfo}
                              instanceFieldName={instanceFieldName}
                              edgeConfigIds={edgeConfigIds}
                              configOrgId={instance.orgId}
                              hideFields={[FIELD_NAMES.datastreamId]}
                            />
                            <AdvancedSection
                              instanceFieldName={instanceFieldName}
                            />
                          </>
                        )}
                      </Item>
                    );
                  })}
                </TabPanels>
              </Tabs>
              {instances.length > 1 && (
                <View marginTop="size-300">
                  <Button
                    data-test-id="deleteInstanceButton"
                    variant="negative"
                    onPress={() => {
                      arrayHelpers.remove(Number(selectedTabKey));

                      const newSelectedTabKey = Math.max(
                        0,
                        Number(selectedTabKey) - 1,
                      ).toString();

                      setSelectedTabKey(newSelectedTabKey);
                    }}
                    icon={<DeleteIcon />}
                  >
                    Delete instance
                  </Button>
                </View>
              )}
            </div>
          );
        }}
      />
    </Flex>
  );
};

InstancesSection.propTypes = {
  initInfo: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  isPreinstalled: PropTypes.bool.isRequired,
};

const Configuration = ({ initInfo, context }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set(["instances"]));
  const [{ value: libraryCode }] = useField("libraryCode");

  useNewlyValidatedFormSubmission((errors) => {
    if (errors) {
      const alreadyOpenOrErrorKeys = ["components", "instances"].filter(
        (key) => {
          return !!errors[key] || expandedKeys.has(key);
        },
      );
      setExpandedKeys(new Set(alreadyOpenOrErrorKeys));
    }
  });

  const isPreinstalled = libraryCode?.type === "preinstalled";

  return (
    <Flex direction="column" gap="size-200">
      <View marginStart="size-200">
        <FormikRadioGroup
          data-test-id="libraryCodeField"
          name="libraryCode.type"
          label="Alloy library configuration"
          description="Choose how the Alloy library should be loaded"
          orientation="horizontal"
        >
          <Radio value="managed">Managed by Launch (default)</Radio>
          <Radio value="preinstalled">
            Use existing alloy.js instance (self-hosted)
          </Radio>
        </FormikRadioGroup>
      </View>
      <Accordion
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        allowsMultipleExpanded
      >
        {!isPreinstalled && (
          <Disclosure id="components">
            <DisclosureTitle data-test-id="custom-build-heading">
              Custom build components
            </DisclosureTitle>
            <DisclosurePanel>
              <ComponentsSection />
            </DisclosurePanel>
          </Disclosure>
        )}
        <Disclosure id="instances">
          <DisclosureTitle>SDK instances</DisclosureTitle>
          <DisclosurePanel>
            <InstancesSection
              initInfo={initInfo}
              context={context}
              isPreinstalled={isPreinstalled}
            />
          </DisclosurePanel>
        </Disclosure>
      </Accordion>
    </Flex>
  );
};

Configuration.propTypes = {
  initInfo: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};

const ConfigurationExtensionView = () => {
  const context = useRef();

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) =>
        getInitialValues({ initInfo, context })
      }
      getSettings={getSettings}
      formikStateValidationSchema={createValidationSchema()}
      render={({ initInfo }) => {
        return <Configuration initInfo={initInfo} context={context} />;
      }}
    />
  );
};
// Do not include padding because the accordion already has padding.
render(ConfigurationExtensionView, { noPadding: true });
