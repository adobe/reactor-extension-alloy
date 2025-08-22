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
import { object, array } from "yup";
import { FieldArray, useField } from "formik";
import {
  Button,
  ButtonGroup,
  Content,
  DialogTrigger,
  Dialog,
  Flex,
  Heading as HeadingSlot,
  Item,
  Divider,
  Text,
  TabList,
  TabPanels,
  Tabs,
  View,
  Accordion,
  Disclosure,
  DisclosureTitle,
  DisclosurePanel,
} from "@adobe/react-spectrum";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import PropTypes from "prop-types";
import render from "../render";
import ExtensionView from "../components/extensionView";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
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
import AdvertisingSection, {
  bridge as advertisingSectionBridge,
} from "./advertisingSection";
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
import PushNotificationsSection, {
  bridge as pushNotificationsBridge,
} from "./pushNotificationsSection";

const sectionBridges = [
  basicSectionBridge,
  edgeConfigurationsSectionBridge,
  privacySectionBridge,
  identitySectionBridge,
  advertisingSectionBridge,
  personalizationSectionBridge,
  dataCollectionSectionBridge,
  overridesBridge,
  advancedSectionBridge,
  mediaBridge,
  pushNotificationsBridge,
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
  };
};

const getSettings = async ({ values, initInfo }) => {
  return {
    ...componentsBridge.getSettings({ values, initInfo }),
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
};

const validationSchema = object().shape({
  instances: array().of(
    sectionBridges.reduce((instanceSchema, bridge) => {
      return bridge.instanceValidationSchema
        ? instanceSchema.concat(bridge.instanceValidationSchema)
        : instanceSchema;
    }, object()),
  ),
});

const InstancesSection = ({ initInfo, context }) => {
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
                        />
                        <EdgeConfigurationsSection
                          instanceFieldName={instanceFieldName}
                          instanceIndex={index}
                          initInfo={initInfo}
                          context={context}
                        />
                        <PrivacySection instanceFieldName={instanceFieldName} />
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
                        <PushNotificationsSection
                          instanceFieldName={instanceFieldName}
                        />
                        <AdvertisingSection
                          instanceFieldName={instanceFieldName}
                          initInfo={initInfo}
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
                        {instances.length > 1 && (
                          <View marginTop="size-300">
                            <DialogTrigger>
                              <Button
                                data-test-id="deleteInstanceButton"
                                icon={<DeleteIcon />}
                                variant="secondary"
                                disabled={instances.length === 1}
                              >
                                Delete instance
                              </Button>
                              {(close) => (
                                <Dialog data-test-id="resourceUsageDialog">
                                  <HeadingSlot>Resource Usage</HeadingSlot>
                                  <Divider />
                                  <Content>
                                    <Text>
                                      Any rule components or data elements using
                                      this instance will no longer function as
                                      expected when running on your website. We
                                      recommend removing these resources or
                                      switching them to use a different instance
                                      before publishing your next library. Would
                                      you like to proceed?
                                    </Text>
                                  </Content>
                                  <ButtonGroup>
                                    <Button
                                      data-test-id="cancelDeleteInstanceButton"
                                      variant="secondary"
                                      onPress={close}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      data-test-id="confirmDeleteInstanceButton"
                                      variant="cta"
                                      onPress={() => {
                                        arrayHelpers.remove(index);
                                        setSelectedTabKey(String(index));
                                      }}
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </ButtonGroup>
                                </Dialog>
                              )}
                            </DialogTrigger>
                          </View>
                        )}
                      </Item>
                    );
                  })}
                </TabPanels>
              </Tabs>
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
};

const Configuration = ({ initInfo, context }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set(["instances"]));

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

  return (
    <Accordion
      expandedKeys={expandedKeys}
      onExpandedChange={setExpandedKeys}
      allowsMultipleExpanded
    >
      <Disclosure id="components" data-test-id="customBuildHeading">
        <DisclosureTitle>Custom build components</DisclosureTitle>
        <DisclosurePanel>
          <ComponentsSection />
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="instances" data-test-id="instancesHeading">
        <DisclosureTitle>SDK instances</DisclosureTitle>
        <DisclosurePanel>
          <InstancesSection initInfo={initInfo} context={context} />
        </DisclosurePanel>
      </Disclosure>
    </Accordion>
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
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => {
        return <Configuration initInfo={initInfo} context={context} />;
      }}
    />
  );
};
// Do not include padding because the accordion already has padding.
render(ConfigurationExtensionView, { noPadding: true });
