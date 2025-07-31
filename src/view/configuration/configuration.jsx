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
import { FieldArray, useField, useFormikContext } from "formik";
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
    libraryCode: initInfo.settings?.libraryCode || {
      type: "managed",
      managed: true,
    },
  };
};

const getSettings = async ({ values, initInfo }) => {
  const isPreinstalled = values.libraryCode?.type === "preinstalled";

  const settings = {
    ...componentsBridge.getSettings({ values, initInfo }),
    shouldBuildAlloy: !isPreinstalled,
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
  const { setFieldValue } = useFormikContext();

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
          onChange={(value) => {
            // Sync the managed boolean field with the type selection
            setFieldValue("libraryCode.managed", value === "managed");
          }}
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

  const validateFormikState = ({ values }) => {
    try {
      const { libraryCode, instances } = values || {};
      const isPreinstalled = libraryCode?.type === "preinstalled";

      // For preinstalled mode, only validate instance name (still required)
      if (isPreinstalled) {
        const errors = {};

        if (instances && Array.isArray(instances) && instances.length > 0) {
          errors.instances = [];

          instances.forEach((instance, index) => {
            if (!instance || typeof instance !== "object") {
              return;
            }

            const instanceErrors = {};

            // Instance name is always required, even in preinstalled mode
            if (!instance.name || instance.name.trim() === "") {
              instanceErrors.name = "Please specify an instance name.";
            }

            // Only add instanceErrors if there are actual errors
            if (Object.keys(instanceErrors).length > 0) {
              errors.instances[index] = instanceErrors;
            }
          });

          // Clean up instances array - remove undefined entries
          errors.instances = errors.instances.filter(
            (item) => item !== undefined,
          );
          if (errors.instances.length === 0) {
            delete errors.instances;
          }
        }
        return errors;
      }

      // For managed mode, manually check required fields
      const errors = {};

      if (instances && Array.isArray(instances) && instances.length > 0) {
        errors.instances = [];

        instances.forEach((instance, index) => {
          if (!instance || typeof instance !== "object") {
            return;
          }

          const instanceErrors = {};

          // Instance name is always required
          if (!instance.name || instance.name.trim() === "") {
            instanceErrors.name = "Please specify an instance name.";
          }

          // Check orgId - but only if the field exists in the form
          if (
            // eslint-disable-next-line no-prototype-builtins
            instance.hasOwnProperty("orgId") &&
            (!instance.orgId || instance.orgId.trim() === "")
          ) {
            instanceErrors.orgId = "Please specify an IMS Organization ID.";
          }

          // Check edgeDomain - but only if the field exists in the form
          if (
            // eslint-disable-next-line no-prototype-builtins
            instance.hasOwnProperty("edgeDomain") &&
            (!instance.edgeDomain || instance.edgeDomain.trim() === "")
          ) {
            instanceErrors.edgeDomain = "Please specify an edge domain.";
          }

          // Check datastream (complex nested structure) - but only if these fields exist
          let datastreamError = null;
          if (
            instance.edgeConfigInputMethod === "select" &&
            instance.edgeConfigSelectInputMethod
          ) {
            const datastreamId =
              instance.edgeConfigSelectInputMethod?.productionEnvironment
                ?.datastreamId;
            if (!datastreamId || datastreamId.trim() === "") {
              datastreamError = "Please specify a datastream.";
              // Need to set the error on the correct nested path
              if (!instanceErrors.edgeConfigSelectInputMethod) {
                instanceErrors.edgeConfigSelectInputMethod = {};
              }
              if (
                !instanceErrors.edgeConfigSelectInputMethod
                  .productionEnvironment
              ) {
                instanceErrors.edgeConfigSelectInputMethod.productionEnvironment =
                  {};
              }
              instanceErrors.edgeConfigSelectInputMethod.productionEnvironment.datastreamId =
                datastreamError;
            }
          } else if (
            instance.edgeConfigInputMethod === "freeform" &&
            instance.edgeConfigFreeformInputMethod
          ) {
            const edgeConfigId =
              instance.edgeConfigFreeformInputMethod?.edgeConfigId;
            if (!edgeConfigId || edgeConfigId.trim() === "") {
              datastreamError = "Please specify a datastream.";
              // Need to set the error on the correct nested path
              if (!instanceErrors.edgeConfigFreeformInputMethod) {
                instanceErrors.edgeConfigFreeformInputMethod = {};
              }
              instanceErrors.edgeConfigFreeformInputMethod.edgeConfigId =
                datastreamError;
            }
          }

          // Only add instanceErrors if there are actual errors
          if (Object.keys(instanceErrors).length > 0) {
            errors.instances[index] = instanceErrors;
          }
        });

        // Clean up instances array - remove undefined entries
        errors.instances = errors.instances.filter(
          (item) => item !== undefined,
        );
        if (errors.instances.length === 0) {
          delete errors.instances;
        }
      }
      return errors;
    } catch (error) {
      console.error(error);
      return {}; // Return empty errors on exception to prevent crash
    }
  };

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) =>
        getInitialValues({ initInfo, context })
      }
      getSettings={getSettings}
      validateFormikState={validateFormikState}
      render={({ initInfo }) => {
        return <Configuration initInfo={initInfo} context={context} />;
      }}
    />
  );
};
// Do not include padding because the accordion already has padding.
render(ConfigurationExtensionView, { noPadding: true });
