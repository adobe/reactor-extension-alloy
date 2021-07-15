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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { object, array } from "yup";
import { FieldArray } from "formik";
import {
  Button,
  ButtonGroup,
  Content,
  DialogTrigger,
  Dialog,
  Flex,
  Heading,
  Item,
  ProgressCircle,
  Divider,
  Text,
  TabList,
  TabPanels,
  Tabs,
  View
} from "@adobe/react-spectrum";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import render from "../spectrum3Render";
import ExtensionView from "../components/spectrum3ExtensionView";
import ExtensionViewForm from "../components/extensionViewForm";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
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
import useReportAsyncError from "../utils/useReportAsyncError";

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

const Configuration = ({
  initInfo,
  formikProps,
  registerImperativeFormApi
}) => {
  const { values } = formikProps;
  const reportAsyncError = useReportAsyncError();
  const [selectedTabKey, setSelectedTabKey] = useState(0);

  useEffect(async () => {
    registerImperativeFormApi({
      getSettings,
      formikStateValidationSchema: validationSchema
    });
    let initialValues;
    try {
      initialValues = await getInitialValues({
        initInfo
      });
    } catch (e) {
      reportAsyncError(e);
      return;
    }
    formikProps.resetForm({ values: initialValues });
  }, []);

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

  if (!values) {
    return (
      <FillParentAndCenterChildren>
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </FillParentAndCenterChildren>
    );
  }

  return (
    <div>
      <FieldArray
        name="instances"
        render={arrayHelpers => {
          return (
            <div>
              <Flex alignItems="center">
                <Heading level={3}>SDK Instances</Heading>
                <Button
                  data-test-id="addInstanceButton"
                  variant="secondary"
                  onPress={async () => {
                    const newInstance = await getInstanceDefaults({
                      initInfo,
                      isFirstInstance: false
                    });
                    arrayHelpers.push(newInstance);
                    setSelectedTabKey(String(values.instances.length));
                  }}
                  marginStart="auto"
                >
                  Add Instance
                </Button>
              </Flex>
              <Tabs
                aria-label="SDK Instances"
                items={values.instances}
                selectedKey={selectedTabKey}
                onSelectionChange={setSelectedTabKey}
              >
                <TabList>
                  {values.instances.map((instance, index) => {
                    return (
                      <Item key={index}>
                        {instance.name || "Unnamed Instance"}
                      </Item>
                    );
                  })}
                </TabList>
                <TabPanels>
                  {values.instances.map((instance, index) => {
                    const instanceFieldName = `instances.${index}`;
                    return (
                      <Item key={index}>
                        <BasicSection instanceFieldName={instanceFieldName} />
                        <EdgeConfigurationsSection
                          instanceFieldName={instanceFieldName}
                          instanceIndex={index}
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
                        {values.instances.length > 1 && (
                          <View marginTop="size-300">
                            <DialogTrigger>
                              <Button
                                data-test-id="deleteInstanceButton"
                                icon={<DeleteIcon />}
                                variant="secondary"
                                disabled={values.instances.length === 1}
                              >
                                Delete Instance
                              </Button>
                              {close => (
                                <Dialog data-test-id="resourceUsageDialog">
                                  <Heading>Resource Usage</Heading>
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
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  registerImperativeFormApi: PropTypes.func
};

const ConfigurationExtensionView = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <ExtensionViewForm
            render={props => {
              return <Configuration {...props} />;
            }}
          />
        );
      }}
    />
  );
};
render(ConfigurationExtensionView);
