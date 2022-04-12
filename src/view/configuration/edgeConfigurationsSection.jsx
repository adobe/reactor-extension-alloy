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
import SectionHeader from "../components/sectionHeader";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import EdgeConfigurationSelectInputMethod from "./edgeConfigurationSelectInputMethod";
import FormElementContainer from "../components/formElementContainer";
import fetchSandboxes from "../dataElements/xdmObject/helpers/fetchSandboxes";
import EdgeConfigurationFreeformInputMethod from "./edgeConfigurationFreeformInputMethod";
import fetchConfig from "./utils/fetchConfig";
import fetchConfigs from "./utils/fetchConfigs";
import getPartsFromEnvironmentCompositeId from "./utils/getPartsFromEnvironmentCompositeId";

const INPUT_METHOD = {
  SELECT: "select",
  FREEFORM: "freeform"
};
const NOT_FOUND_STATUS = "not_found";

const sandboxSettingsDoesNotExist = instanceSettings => {
  return !!(
    instanceSettings.sandbox ||
    instanceSettings.stagingSandbox ||
    instanceSettings.developmentSandbox
  );
};
const prepareDatastreamsMap = datastreams => {
  return datastreams.reduce((acc, datastream) => {
    // eslint-disable-next-line no-underscore-dangle
    const datastreamId = datastream._system.id;
    acc[datastreamId] = {
      sandbox: datastream.sandboxName,
      configId: datastreamId
    };
    return acc;
  }, {});
};

const createFindTheEdgeConfig = (orgId, imsAccess) => {
  return (sandbox, edgeConfigId) => {
    return fetchConfig({
      orgId,
      imsAccess,
      edgeConfigId,
      sandbox
    }).catch(() => {
      return {
        status: NOT_FOUND_STATUS
      };
    });
  };
};

const getEnvironmentEdgeConfigs = async (
  configId,
  datastreamsMap,
  decompositeId
) => {
  return new Promise((resolve, reject) => {
    if (datastreamsMap[configId]) {
      resolve({
        datastreamId: configId,
        sandbox: datastreamsMap[configId].sandbox
      });
      return;
    }
    if (datastreamsMap[decompositeId]) {
      resolve({
        datastreamId: configId,
        sandbox: datastreamsMap[decompositeId].sandbox
      });
      return;
    }

    reject(new Error("no datastream found"));
  });
};

const getSelectInputMethodStateForExistingInstance = async ({
  orgId,
  imsAccess,
  instanceSettings,
  sandboxes,
  datastreams
}) => {
  const selectInputMethodState = {
    productionEnvironment: undefined,
    stagingEnvironment: undefined,
    developmentEnvironment: undefined,
    sandboxes,
    datastreams
  };

  // this section is to fetch the edge configs and get the sandbox name for each environment
  // the old version of extension was fetching the datastreams and save
  // a composite datastream ID for each environment
  // we are trying to get the edge config and fetch the edge config details,
  // then we initialize the form with sandbox names and edge config IDs

  if (!sandboxSettingsDoesNotExist(instanceSettings)) {
    let datastreamsMap;
    // when only one sandbox per org we fetch all datastreams in get Instance defaults
    //  we re-use it here to create a map and prepopulate the form with sandbox names
    if (datastreams) {
      datastreamsMap = prepareDatastreamsMap(datastreams);

      if (instanceSettings.edgeConfigId) {
        selectInputMethodState.productionEnvironment = {
          datastreamId: instanceSettings.edgeConfigId,
          sandbox: datastreamsMap[instanceSettings.edgeConfigId].sandbox
        };
      }

      if (instanceSettings.stagingEdgeConfigId) {
        selectInputMethodState.stagingEnvironment = {
          datastreamId: instanceSettings.stagingEdgeConfigId,
          sandbox: datastreamsMap[instanceSettings.stagingEdgeConfigId].sandbox
        };
      }

      if (instanceSettings.developmentEdgeConfigId) {
        selectInputMethodState.developmentEnvironment = {
          datastreamId: instanceSettings.developmentEdgeConfigId,
          sandbox:
            datastreamsMap[instanceSettings.developmentEdgeConfigId].sandbox
        };
      }

      return selectInputMethodState;
    }
    const decompositeIds = {
      productionEnvironment: undefined,
      stagingEnvironment: undefined,
      developmentEnvironment: undefined
    };
    const findTheEdgeConfig = createFindTheEdgeConfig(orgId, imsAccess);
    // try to find the sandbox for each edge config to pre - populate the select dropdowns
    const promises = [];

    const { edgeConfigId } = getPartsFromEnvironmentCompositeId(
      instanceSettings.edgeConfigId
    );
    decompositeIds.productionEnvironment = edgeConfigId;

    const findProdEdgeConfigPromises = sandboxes.map(sandbox => {
      return findTheEdgeConfig(sandbox.name, edgeConfigId);
    });

    promises.push(...findProdEdgeConfigPromises);

    if (instanceSettings.stagingEdgeConfigId) {
      const stagingEdgeConfigId = getPartsFromEnvironmentCompositeId(
        instanceSettings.stagingEdgeConfigId
      ).edgeConfigId;
      if (stagingEdgeConfigId === edgeConfigId) {
        decompositeIds.stagingEnvironment = stagingEdgeConfigId;
      } else {
        const findStageEdgeConfigPromises = sandboxes.map(sandbox => {
          return findTheEdgeConfig(
            sandbox.name,
            instanceSettings.stagingEdgeConfigId
          );
        });
        promises.push(...findStageEdgeConfigPromises);
      }
    }
    if (instanceSettings.developmentEdgeConfigId) {
      const developmentEdgeConfigId = getPartsFromEnvironmentCompositeId(
        instanceSettings.developmentEdgeConfigId
      ).edgeConfigId;
      if (developmentEdgeConfigId === edgeConfigId) {
        decompositeIds.developmentEnvironment = developmentEdgeConfigId;
      } else {
        const findDevEdgeConfigPromises = sandboxes.map(sandbox => {
          return findTheEdgeConfig(
            sandbox.name,
            instanceSettings.developmentEdgeConfigId
          );
        });
        promises.push(...findDevEdgeConfigPromises);
      }
    }

    const edgeConfigs = (await Promise.all(promises)).filter(
      result => result.status !== NOT_FOUND_STATUS
    );

    datastreamsMap = prepareDatastreamsMap(edgeConfigs);

    if (instanceSettings.edgeConfigId) {
      selectInputMethodState.productionEnvironment = await getEnvironmentEdgeConfigs(
        instanceSettings.edgeConfigId,
        datastreamsMap,
        decompositeIds.productionEnvironment
      );
    }
    if (instanceSettings.stagingEdgeConfigId) {
      selectInputMethodState.stagingEnvironment = await getEnvironmentEdgeConfigs(
        instanceSettings.stagingEdgeConfigId,
        datastreamsMap,
        decompositeIds.stagingEnvironment
      );
    }
    if (instanceSettings.developmentEdgeConfigId) {
      selectInputMethodState.developmentEnvironment = await getEnvironmentEdgeConfigs(
        instanceSettings.developmentEdgeConfigId,
        datastreamsMap,
        decompositeIds.developmentEnvironment
      );
    }

    return selectInputMethodState;
  }

  if (instanceSettings.edgeConfigId) {
    selectInputMethodState.productionEnvironment = {
      datastreamId: instanceSettings.edgeConfigId,
      sandbox: instanceSettings.sandbox
    };
  }

  if (instanceSettings.stagingEdgeConfigId) {
    selectInputMethodState.stagingEnvironment = {
      datastreamId: instanceSettings.stagingEdgeConfigId,
      sandbox: instanceSettings.stagingSandbox
    };
  }

  if (instanceSettings.developmentEdgeConfigId) {
    selectInputMethodState.developmentEnvironment = {
      datastreamId: instanceSettings.developmentEdgeConfigId,
      sandbox: instanceSettings.developmentSandbox
    };
  }

  return selectInputMethodState;
};

let firstPageOfSandboxes;
let firstPageOfDatastreams;
const getSelectInputMethodStateForNewInstance = async ({
  orgId,
  imsAccess
}) => {
  const selectInputMethodState = {
    productionEnvironment: undefined,
    stagingEnvironment: undefined,
    developmentEnvironment: undefined
  };

  // We cache the first page of edge configs for optimization,
  // particularly so when a user clicks the Add Instance button,
  // they don't have to wait while the instance is created.
  if (!firstPageOfSandboxes) {
    ({ results: firstPageOfSandboxes } = await fetchSandboxes({
      orgId,
      imsAccess
    }));
  }

  selectInputMethodState.sandboxes = firstPageOfSandboxes;

  // checking if this is a organization with one sandbox ( default sandbox )
  if (firstPageOfSandboxes.length === 1) {
    // eslint-disable-next-line prefer-const
    ({ results: firstPageOfDatastreams } = await fetchConfigs({
      orgId,
      imsAccess,
      limit: 1000,
      sandbox: firstPageOfSandboxes[0].name
    }));

    selectInputMethodState.productionEnvironment = {
      sandbox: firstPageOfSandboxes[0].name
    };
    selectInputMethodState.stagingEnvironment = {
      sandbox: firstPageOfSandboxes[0].name
    };
    selectInputMethodState.developmentEnvironment = {
      sandbox: firstPageOfSandboxes[0].name
    };

    selectInputMethodState.datastreams = firstPageOfDatastreams;
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
    const {
      sandboxes,
      datastreams
    } = instanceValues.edgeConfigSelectInputMethod;
    let isSuccessfullyPopulatedForSelectInputMethod = false;

    if (isFirstInstance) {
      try {
        instanceValues.edgeConfigSelectInputMethod = await getSelectInputMethodStateForExistingInstance(
          {
            orgId,
            imsAccess,
            instanceSettings,
            sandboxes,
            datastreams
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
      if (
        instanceValues?.edgeConfigSelectInputMethod?.productionEnvironment
          ?.datastreamId
      ) {
        instanceSettings.edgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.productionEnvironment.datastreamId;
        instanceSettings.sandbox =
          instanceValues.edgeConfigSelectInputMethod.productionEnvironment.sandbox;
      }

      if (
        instanceValues?.edgeConfigSelectInputMethod?.stagingEnvironment
          ?.datastreamId
      ) {
        instanceSettings.stagingEdgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.stagingEnvironment.datastreamId;
        instanceSettings.stagingSandbox =
          instanceValues.edgeConfigSelectInputMethod.stagingEnvironment.sandbox;
      }

      if (
        instanceValues?.edgeConfigSelectInputMethod?.developmentEnvironment
          ?.datastreamId
      ) {
        instanceSettings.developmentEdgeConfigId =
          instanceValues.edgeConfigSelectInputMethod.developmentEnvironment.datastreamId;
        instanceSettings.developmentSandbox =
          instanceValues.edgeConfigSelectInputMethod.developmentEnvironment.sandbox;
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
          productionEnvironment: object().shape({
            datastreamId: string().required("Please specify a datastream."),
            sandbox: string().required("Please specify a sandbox.")
          })
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
          ? inst.edgeConfigSelectInputMethod.edgeConfigId
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
  const [{ value: edgeConfigSelectInputOptions }] = useField(
    `${instanceFieldName}.edgeConfigSelectInputMethod`
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
            label="Input method"
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
            initialConfigs={edgeConfigSelectInputOptions}
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
