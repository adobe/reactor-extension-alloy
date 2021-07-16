/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import { Radio } from "@adobe/react-spectrum";
import { object, string } from "yup";
import { useField } from "formik";
import fetchConfig from "./utils/fetchConfig";
import SectionHeader from "../components/sectionHeader";
import fetchEnvironments from "./utils/fetchEnvironments";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import EdgeConfigurationSelectInputMethod from "./edgeConfigurationSelectInputMethod";
import EdgeConfigurationFreeformInputMethod from "./edgeConfigurationFreeformInputMethod";
import fetchEnvironment from "./utils/fetchEnvironment";
import getPartsFromEnvironmentCompositeId from "./utils/getPartsFromEnvironmentCompositeId";
import fetchFirstPageOfEachEnvironmentType from "./utils/fetchFirstPageOfEachEnvironmentType";
import { PRODUCTION } from "./constants/environmentType";
import fetchConfigs from "./utils/fetchConfigs";
import FormElementContainer from "../components/formElementContainer";

const INPUT_METHOD = {
  SELECT: "select",
  FREEFORM: "freeform"
};

const getSelectInputMethodStateForExistingInstance = async ({
  orgId,
  imsAccess,
  instanceSettings
}) => {
  const selectInputMethodState = {
    edgeConfig: undefined,
    productionEnvironment: undefined,
    stagingEnvironment: undefined,
    developmentEnvironment: undefined
  };
  const promises = [];

  // Nothing is preventing a customer from saving the extension
  // with an environment composite ID for edgeConfigId. Consider that the
  // customer may have selected the "enter values" input method,
  // pasted in the production environment composite ID,
  // saved the extension, then re-loaded the extension view.
  // For this reason, we want to make sure we're really dealing with
  // an edge configuration ID rather than an environment's
  // composite ID.
  const { edgeConfigId } = getPartsFromEnvironmentCompositeId(
    instanceSettings.edgeConfigId
  );

  const edgeConfigPromise = fetchConfig({
    orgId,
    imsAccess,
    edgeConfigId
  }).then(edgeConfig => {
    selectInputMethodState.edgeConfig = edgeConfig;
  });
  promises.push(edgeConfigPromise);

  const productionEnvironmentPromise = fetchEnvironments({
    orgId,
    imsAccess,
    edgeConfigId,
    type: PRODUCTION
  }).then(({ results: productionEnvironments }) => {
    if (productionEnvironments.length === 1) {
      selectInputMethodState.productionEnvironment = productionEnvironments[0];
    }
  });
  promises.push(productionEnvironmentPromise);

  if (instanceSettings.stagingEdgeConfigId) {
    const { environmentName } = getPartsFromEnvironmentCompositeId(
      instanceSettings.stagingEdgeConfigId
    );
    const stagingEnvironmentPromise = fetchEnvironment({
      orgId,
      imsAccess,
      name: environmentName,
      edgeConfigId
    }).then(environment => {
      selectInputMethodState.stagingEnvironment = environment;
    });
    promises.push(stagingEnvironmentPromise);
  }

  if (instanceSettings.developmentEdgeConfigId) {
    const { environmentName } = getPartsFromEnvironmentCompositeId(
      instanceSettings.developmentEdgeConfigId
    );
    const developmentEnvironmentPromise = fetchEnvironment({
      orgId,
      imsAccess,
      name: environmentName,
      edgeConfigId
    }).then(environment => {
      selectInputMethodState.developmentEnvironment = environment;
    });
    promises.push(developmentEnvironmentPromise);
  }

  await Promise.all(promises);

  return selectInputMethodState;
};

let firstPageOfEdgeConfigs;
const getSelectInputMethodStateForNewInstance = async ({
  orgId,
  imsAccess
}) => {
  const selectInputMethodState = {
    edgeConfig: undefined,
    productionEnvironment: undefined,
    stagingEnvironment: undefined,
    developmentEnvironment: undefined
  };

  // We cache the first page of edge configs for optimization,
  // particularly so when a user clicks the Add Instance button,
  // they don't have to wait while the instance is created.
  if (!firstPageOfEdgeConfigs) {
    ({ results: firstPageOfEdgeConfigs } = await fetchConfigs({
      orgId,
      imsAccess
    }));
  }

  if (firstPageOfEdgeConfigs.length === 1) {
    const edgeConfig = firstPageOfEdgeConfigs[0];
    selectInputMethodState.edgeConfig = edgeConfig;

    const {
      production,
      staging,
      development
    } = await fetchFirstPageOfEachEnvironmentType({
      orgId,
      imsAccess,
      edgeConfigId: edgeConfig.id
    });

    if (production.length === 1) {
      selectInputMethodState.productionEnvironment = production[0];
    }

    if (staging.length === 1) {
      selectInputMethodState.stagingEnvironment = staging[0];
    }

    if (development.length === 1) {
      selectInputMethodState.developmentEnvironment = development[0];
    }
  }

  return selectInputMethodState;
};

const getFreeformInputMethodStateForExistingInstance = ({
  instanceSettings
}) => {
  return {
    edgeConfigId: instanceSettings.edgeConfigId ?? "",
    stagingEdgeConfigId: instanceSettings.stagingEdgeConfigId ?? "",
    developmentEdgeConfigId: instanceSettings.developmentEdgeConfigId ?? ""
  };
};

const getFreeformInputStateForNewInstance = () => {
  return {
    edgeConfigId: "",
    stagingEdgeConfigId: "",
    developmentEdgeConfigId: ""
  };
};

export const bridge = {
  getInstanceDefaults: async ({ initInfo, isFirstInstance }) => {
    const {
      company: { orgId },
      tokens: { imsAccess }
    } = initInfo;

    const instanceDefaults = {
      edgeConfigInputMethod: isFirstInstance
        ? INPUT_METHOD.SELECT
        : INPUT_METHOD.FREEFORM,
      // We only display the edge configuration selection components on the first instance, which
      // might make this seem unnecessary for subsequent instances. However, it's possible for
      // the user to delete their first instance, which would make their second instance become
      // their first instance, which would cause the selection components to be displayable for that
      // instance. We want the state to be ready for this case.
      edgeConfigSelectInputMethod: await getSelectInputMethodStateForNewInstance(
        {
          orgId,
          imsAccess
        }
      ),
      edgeConfigFreeformInputMethod: getFreeformInputStateForNewInstance()
    };

    return instanceDefaults;
  },
  getInitialInstanceValues: async ({
    initInfo,
    isFirstInstance,
    instanceSettings
  }) => {
    const {
      company: { orgId },
      tokens: { imsAccess }
    } = initInfo;

    const instanceValues = await bridge.getInstanceDefaults({
      initInfo,
      isFirstInstance
    });

    let isSuccessfullyPopulatedForSelectInputMethod = false;

    if (isFirstInstance) {
      try {
        instanceValues.edgeConfigSelectInputMethod = await getSelectInputMethodStateForExistingInstance(
          {
            orgId,
            imsAccess,
            instanceSettings
          }
        );
        instanceValues.edgeConfigFreeformInputMethod = getFreeformInputStateForNewInstance();
        instanceValues.edgeConfigInputMethod = INPUT_METHOD.SELECT;
        isSuccessfullyPopulatedForSelectInputMethod = true;
      } catch (e) {
        // No nothing. We'll fall back to the freeform input method.
      }
    }

    if (!isSuccessfullyPopulatedForSelectInputMethod) {
      // We only display the edge configuration selection components on the first instance, which
      // might make this seem unnecessary for subsequent instances. However, it's possible for
      // the user to delete their first instance, which would make their second instance become
      // their first instance, which would cause the selection components to be displayable for that
      // instance. We want the state to be ready for this case.
      instanceValues.edgeConfigSelectInputMethod = await getSelectInputMethodStateForNewInstance(
        {
          orgId,
          imsAccess
        }
      );
      instanceValues.edgeConfigFreeformInputMethod = getFreeformInputMethodStateForExistingInstance(
        { instanceSettings }
      );
      instanceValues.edgeConfigInputMethod = INPUT_METHOD.FREEFORM;
    }

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};
    if (instanceValues.edgeConfigInputMethod === INPUT_METHOD.SELECT) {
      if (instanceValues.edgeConfigSelectInputMethod.edgeConfig) {
        instanceSettings.edgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.edgeConfig.id;
      }

      if (instanceValues.edgeConfigSelectInputMethod.stagingEnvironment) {
        instanceSettings.stagingEdgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.stagingEnvironment.compositeId;
      }

      if (instanceValues.edgeConfigSelectInputMethod.developmentEnvironment) {
        instanceSettings.developmentEdgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.developmentEnvironment.compositeId;
      }
    } else {
      if (instanceValues.edgeConfigFreeformInputMethod.edgeConfigId) {
        instanceSettings.edgeConfigId =
          instanceValues.edgeConfigFreeformInputMethod.edgeConfigId;
      }

      if (instanceValues.edgeConfigFreeformInputMethod.stagingEdgeConfigId) {
        instanceSettings.stagingEdgeConfigId =
          instanceValues.edgeConfigFreeformInputMethod.stagingEdgeConfigId;
      }

      if (
        instanceValues.edgeConfigFreeformInputMethod.developmentEdgeConfigId
      ) {
        instanceSettings.developmentEdgeConfigId =
          instanceValues.edgeConfigFreeformInputMethod.developmentEdgeConfigId;
      }
    }
    return instanceSettings;
  },
  instanceValidationSchema: object()
    .shape({
      edgeConfigSelectInputMethod: object().when("edgeConfigInputMethod", {
        is: INPUT_METHOD.SELECT,
        then: object().shape({
          edgeConfig: object().required("Please specify a datastream.")
        })
      }),
      edgeConfigFreeformInputMethod: object().when("edgeConfigInputMethod", {
        is: INPUT_METHOD.FREEFORM,
        then: object().shape({
          edgeConfigId: string().required("Please specify a datastream.")
        })
      })
    })
    // TestCafe doesn't allow this to be an arrow function because of
    // how it scopes "this".
    // eslint-disable-next-line func-names
    .test("uniqueEdgeConfigId", function(instance, testContext) {
      const { path: instancePath, parent: instances } = testContext;

      const getEdgeConfigIdFromInstance = inst => {
        return inst.edgeConfigInputMethod === INPUT_METHOD.SELECT
          ? inst.edgeConfigSelectInputMethod.edgeConfig?.id
          : inst.edgeConfigFreeformInputMethod.edgeConfigId;
      };

      const edgeConfigId = getEdgeConfigIdFromInstance(instance);

      if (!edgeConfigId) {
        return true;
      }

      const firstInstanceWithSameEdgeConfigId = instances.find(
        candidateInstance =>
          getEdgeConfigIdFromInstance(candidateInstance) === edgeConfigId
      );
      const isDuplicate = firstInstanceWithSameEdgeConfigId !== instance;

      const edgeConfigIdFieldName =
        instance.edgeConfigInputMethod === INPUT_METHOD.SELECT
          ? `edgeConfigSelectInputMethod.edgeConfig.id`
          : `edgeConfigFreeformInputMethod.edgeConfigId`;

      return (
        !isDuplicate ||
        this.createError({
          path: `${instancePath}.${edgeConfigIdFieldName}`,
          message:
            "Please provide a value unique from those used for other instances."
        })
      );
    })
};

const EdgeConfigurationsSection = ({
  instanceFieldName,
  instanceIndex,
  initInfo
}) => {
  const [{ value: inputMethod }] = useField(
    `${instanceFieldName}.edgeConfigInputMethod`
  );

  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/3eY91Er">
        Datastreams
      </SectionHeader>
      <FormElementContainer>
        {// Each instance must have a unique org ID. Typically, the first instance will have
        // the org ID that matches the Launch user's active org ID.
        // The Launch user's active org is that only org we can retrieve edge configurations
        // for via an API, so presenting edge configurations for the active org on an
        // instance configured for a different org would most likely confuse the user.
        // To prevent this confusion, we'll hide the radios on all but the first instance.
        instanceIndex === 0 && (
          <FormikRadioGroup
            label="Input Method"
            name={`${instanceFieldName}.edgeConfigInputMethod`}
            orientation="horizontal"
          >
            <Radio
              data-test-id="edgeConfigInputMethodSelectRadio"
              value={INPUT_METHOD.SELECT}
            >
              Choose from list
            </Radio>
            <Radio
              data-test-id="edgeConfigInputMethodFreeformRadio"
              value={INPUT_METHOD.FREEFORM}
            >
              Enter values
            </Radio>
          </FormikRadioGroup>
        )}

        {inputMethod === INPUT_METHOD.SELECT ? (
          <EdgeConfigurationSelectInputMethod
            name={`${instanceFieldName}.edgeConfigSelectInputMethod`}
            initInfo={initInfo}
          />
        ) : (
          <EdgeConfigurationFreeformInputMethod
            name={`${instanceFieldName}.edgeConfigFreeformInputMethod`}
          />
        )}
      </FormElementContainer>
    </>
  );
};

EdgeConfigurationsSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
  instanceIndex: PropTypes.number.isRequired,
  initInfo: PropTypes.object.isRequired
};

export default EdgeConfigurationsSection;
