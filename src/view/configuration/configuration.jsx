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

import React, { useState } from "react";
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
  View
} from "@adobe/react-spectrum";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import PropTypes from "prop-types";
import render from "../render";
import ExtensionView from "../components/extensionView";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import Heading from "../components/typography/heading";
import BasicSection, { bridge as basicSectionBridge } from "./basicSection";
import EdgeConfigurationsSection, {
  bridge as edgeConfigurationsSectionBridge
} from "./edgeConfigurationsSection";
import PrivacySection, {
  bridge as privacySectionBridge
} from "./privacySection";
import IdentitySection, {
  bridge as identitySectionBridge
} from "./identitySection";
import PersonalizationSection, {
  bridge as personalizationSectionBridge
} from "./personalizationSection";
import DataCollectionSection, {
  bridge as dataCollectionSectionBridge
} from "./dataCollectionSection";
import AdvancedSection, {
  bridge as advancedSectionBridge
} from "./advancedSection";

const sectionBridges = [
  basicSectionBridge,
  edgeConfigurationsSectionBridge,
  privacySectionBridge,
  identitySectionBridge,
  personalizationSectionBridge,
  dataCollectionSectionBridge,
  advancedSectionBridge
];

/**
 * Produces a function that, when called, calls the method from
 * all section bridges and merges the result into a single object.
 */
const getMergedBridgeMethod = methodName => {
  return async params => {
    const bridgeMethodResults = await Promise.all(
      sectionBridges.map(bridge => {
        return bridge[methodName] ? bridge[methodName](params) : {};
      })
    );
    return Object.assign(...bridgeMethodResults);
  };
};

const getInstanceDefaults = getMergedBridgeMethod("getInstanceDefaults");
const getInitialInstanceValues = getMergedBridgeMethod(
  "getInitialInstanceValues"
);
const getInstanceSettings = getMergedBridgeMethod("getInstanceSettings");

const getInitialValues = async ({ initInfo }) => {
  const { instances: instancesSettings } = initInfo.settings || {};

  let instancesInitialValues;

  if (instancesSettings) {
    instancesInitialValues = await Promise.all(
      instancesSettings.map((instanceSettings, instanceSettingsIndex) => {
        return getInitialInstanceValues({
          initInfo,
          isFirstInstance: instanceSettingsIndex === 0,
          instanceSettings
        });
      })
    );
  } else {
    instancesInitialValues = [
      await getInstanceDefaults({ initInfo, isFirstInstance: true })
    ];
  }

  return {
    instances: instancesInitialValues
  };
};

const getSettings = async ({ values, initInfo }) => {
  return {
    instances: await Promise.all(
      values.instances.map(instanceValues => {
        return getInstanceSettings({
          initInfo,
          instanceValues
        });
      })
    )
  };
};

const validationSchema = object().shape({
  instances: array().of(
    sectionBridges.reduce((instanceSchema, bridge) => {
      return bridge.instanceValidationSchema
        ? instanceSchema.concat(bridge.instanceValidationSchema)
        : instanceSchema;
    }, object())
  )
});

const Configuration = ({ initInfo }) => {
  const [{ value: instances }] = useField("instances");
  const [selectedTabKey, setSelectedTabKey] = useState(0);

  useNewlyValidatedFormSubmission(errors => {
    // If the user just tried to save the configuration and there's
    // a validation error, make sure the first accordion item containing
    // an error is shown.
    if (errors && errors.instances) {
      const instanceIndexContainingErrors = errors.instances.findIndex(
        instance => instance
      );
      setSelectedTabKey(String(instanceIndexContainingErrors));
    }
  });

  return (
    <div>
      <FieldArray
        name="instances"
        render={arrayHelpers => {
          return (
            <div>
              <Flex alignItems="center">
                <Heading size="M">SDK instances</Heading>
                <Button
                  data-test-id="addInstanceButton"
                  variant="secondary"
                  onPress={async () => {
                    const newInstance = await getInstanceDefaults({
                      initInfo,
                      isFirstInstance: false
                    });
                    arrayHelpers.push(newInstance);
                    setSelectedTabKey(String(instances.length));
                  }}
                  marginStart="auto"
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
                              {close => (
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
    </div>
  );
};

Configuration.propTypes = {
  initInfo: PropTypes.object.isRequired
};

const ConfigurationExtensionView = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => {
        return <Configuration initInfo={initInfo} />;
      }}
    />
  );
};
render(ConfigurationExtensionView);
