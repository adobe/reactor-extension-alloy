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
import { FieldArray } from "formik";
import { array, boolean, object, string } from "yup";
import {
  Button,
  Flex,
  Heading,
  Item,
  ProgressCircle,
  Text,
  Well,
  TabList,
  TabPanels,
  Tabs,
  View
} from "@adobe/react-spectrum";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import render from "../render";
import ExtensionView from "../components/extensionView";
import ExtensionViewForm from "../components/extensionViewForm";
import getDefaultIdentity from "./identityMap/utils/getDefaultIdentity";
import fetchNamespaces from "./identityMap/utils/fetchNamespaces";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import NamespaceComponent from "../components/namespaceComponent";
import getDefaultIdentifier from "./identityMap/utils/getDefaultIdentifier";
import DataElementSelector from "../components/dataElementSelector";
import FormElementContainer from "../components/formElementContainer";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import * as AUTHENTICATED_STATE from "./identityMap/constants/authenticatedState";

const isNotECID = namespace => {
  return namespace.code !== "ECID";
};
const identitiesMapToArray = identityMap => {
  return Object.keys(identityMap)
    .sort((firstNamespaceCode, secondNamespaceCode) =>
      firstNamespaceCode.localeCompare(secondNamespaceCode)
    )
    .map(namespaceCode => {
      return {
        namespaceCode,
        identifiers: identityMap[namespaceCode]
      };
    });
};

const identitiesArrayToMap = identitiesArray => {
  return identitiesArray.reduce((identityMap, identity) => {
    const { namespaceCode, identifiers } = identity;
    identityMap[namespaceCode] = identifiers;
    return identityMap;
  }, {});
};

const getInitialValues = async ({ initInfo }) => {
  const identities = initInfo.settings
    ? identitiesMapToArray(initInfo.settings)
    : [getDefaultIdentity()];

  const namespaces = await fetchNamespaces({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess
  });

  if (namespaces.length > 0) {
    return {
      identities,
      namespaces: namespaces
        .filter(isNotECID)
        .sort((first, second) => first.name.localeCompare(second.name))
    };
  }

  return {
    identities,
    namespaces: []
  };
};

const getSettings = ({ values }) => {
  return identitiesArrayToMap(values.identities);
};

const validateDuplicateValue = (
  createError,
  identities,
  key,
  message,
  validateBooleanTrue
) => {
  const values = identities.map(identity =>
    // If the user didn't enter a value for the property
    // we're checking duplicates for, then the property will have
    // an undefined value (not an empty string).
    identity[key] ? identity[key].toUpperCase() : identity[key]
  );
  const duplicateIndex = values.findIndex(
    (value, index) =>
      values.indexOf(value) < index && (!validateBooleanTrue || value === true)
  );

  return (
    duplicateIndex === -1 ||
    createError({
      path: `identities[${duplicateIndex}].${key}`,
      message
    })
  );
};

const hasPrimary = identifier => identifier.primary;

const validateOnePrimary = (createError, identities, message) => {
  let primaries = 0;

  for (let i = 0; i < identities.length; i += 1) {
    const { identifiers = [] } = identities[i];

    for (let j = 0; j < identifiers.length; j += 1) {
      if (hasPrimary(identifiers[j])) {
        primaries += 1;
      }

      if (primaries > 1) {
        return createError({
          path: `identities[${i}].identifiers[${j}].primary`,
          message
        });
      }
    }
  }
  return true;
};

const validationSchema = object()
  .shape({
    identities: array().of(
      object().shape({
        namespaceCode: string()
          .required("Please select a namespace.")
          .test({
            name: "notECID",
            message: "ECID is not allowed",
            test(value) {
              return !value || value.toUpperCase() !== "ECID";
            }
          }),
        identifiers: array().of(
          object().shape({
            id: string().required("Please specify an ID."),
            authenticatedState: string().default(AUTHENTICATED_STATE.AMBIGUOUS),
            primary: boolean().default(false)
          })
        )
      })
    )
  })
  .test("uniqueNamespace", function uniqueNamespace(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.identities,
      "namespaceCode",
      "Please provide a unique namespace."
    );
  })
  .test("uniquePrimary", function uniquePrimary(settings) {
    return validateOnePrimary(
      this.createError.bind(this),
      settings.identities,
      "Only one identifier can be primary."
    );
  });

function IdentityMap({ initInfo, formikProps, registerImperativeFormApi }) {
  const { values } = formikProps;
  const [selectedTabKey, setSelectedTabKey] = useState();

  useEffect(async () => {
    registerImperativeFormApi({
      getSettings,
      formikStateValidationSchema: validationSchema
    });
    const initialValues = await getInitialValues({ initInfo });
    formikProps.resetForm({ values: initialValues });
  }, []);

  useNewlyValidatedFormSubmission(errors => {
    // If the user just tried to save the configuration and there's
    // a validation error, make sure the first accordion item containing
    // an error is shown.
    if (errors && errors.identities) {
      const identityIndexContainingErrors = errors.identities.findIndex(
        identity => identity
      );
      setSelectedTabKey(String(identityIndexContainingErrors));
    }
  });

  if (!values) {
    return (
      <FillParentAndCenterChildren>
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </FillParentAndCenterChildren>
    );
  }

  const { namespaces } = values;

  return (
    <React.Fragment>
      <FieldArray
        name="identities"
        render={arrayHelpers => {
          return (
            <React.Fragment>
              <Flex alignItems="center">
                <Heading level={3}>Identities</Heading>
                <Button
                  data-test-id="addIdentityButton"
                  variant="secondary"
                  onPress={() => {
                    arrayHelpers.push(getDefaultIdentity());
                    setSelectedTabKey(String(values.identities.length));
                  }}
                  marginStart="auto"
                >
                  Add Identity
                </Button>
              </Flex>
              {/*
                There is an issue where the heavy line under the selected
                tab doesn't update in position or width when the label changes,
                which can occur when the user is changing an identity's namespace.
                This is a reported bug in React-Spectrum.
                https://github.com/adobe/react-spectrum/issues/2004
                */}
              <Tabs
                aria-label="Identities"
                items={values.identities}
                selectedKey={selectedTabKey}
                onSelectionChange={setSelectedTabKey}
              >
                <TabList>
                  {values.identities.map((identity, index) => {
                    return (
                      <Item key={index}>
                        {identity.namespaceCode || "Unnamed Identity"}
                      </Item>
                    );
                  })}
                </TabList>
                <TabPanels>
                  {values.identities.map((identity, index) => {
                    return (
                      <Item key={index}>
                        <FieldArray
                          id={`identities.${index}.identifiers`}
                          name={`identities.${index}.identifiers`}
                          render={identityArrayHelpers => {
                            return (
                              <React.Fragment>
                                <Flex
                                  marginTop="size-100"
                                  alignItems="flex-end"
                                  justifyContent="space-between"
                                >
                                  <NamespaceComponent
                                    name={`identities.${index}.namespaceCode`}
                                    selectedNamespaceCode={
                                      identity.namespaceCode
                                    }
                                    namespaces={namespaces}
                                    index={index}
                                  />
                                  <Button
                                    data-test-id={`addIdentifier${index}Button`}
                                    variant="secondary"
                                    onPress={() => {
                                      identityArrayHelpers.push(
                                        getDefaultIdentifier()
                                      );
                                    }}
                                  >
                                    Add Identifier
                                  </Button>
                                </Flex>
                                {identity.identifiers.map(
                                  (identifier, identifierIndex) => (
                                    <Well
                                      key={`identity${index}identifier${identifierIndex}`}
                                      marginTop="size-250"
                                      marginBottom="size-250"
                                    >
                                      <FormElementContainer>
                                        <DataElementSelector>
                                          <FormikTextField
                                            data-test-id={`identity${index}idField${identifierIndex}`}
                                            label="ID"
                                            name={`identities.${index}.identifiers.${identifierIndex}.id`}
                                            isRequired
                                            width="size-5000"
                                          />
                                        </DataElementSelector>
                                        <FormikPicker
                                          data-test-id={`identity${index}authenticatedStateField${identifierIndex}`}
                                          label="Authenticated State"
                                          name={`identities.${index}.identifiers.${identifierIndex}.authenticatedState`}
                                          width="size-5000"
                                        >
                                          <Item
                                            key={AUTHENTICATED_STATE.AMBIGUOUS}
                                          >
                                            Ambiguous
                                          </Item>
                                          <Item
                                            key={
                                              AUTHENTICATED_STATE.AUTHENTICATED
                                            }
                                          >
                                            Authenticated
                                          </Item>
                                          <Item
                                            key={AUTHENTICATED_STATE.LOGGED_OUT}
                                          >
                                            Logged Out
                                          </Item>
                                          {item => (
                                            <Item key={item.value}>
                                              {item.label}
                                            </Item>
                                          )}
                                        </FormikPicker>
                                        <FormikCheckbox
                                          data-test-id={`identity${index}primaryField${identifierIndex}`}
                                          name={`identities.${index}.identifiers.${identifierIndex}.primary`}
                                          description="Adobe Experience Platform will use the identity as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected, but the ECID will be used as the primary identifier for stitching."
                                        >
                                          Primary
                                        </FormikCheckbox>
                                      </FormElementContainer>
                                      {values.identities[index].identifiers
                                        .length > 1 && (
                                        <Button
                                          data-test-id={`deleteIdentifier${index}Button${identifierIndex}`}
                                          variant="secondary"
                                          onPress={() => {
                                            identityArrayHelpers.remove(
                                              identifierIndex
                                            );
                                          }}
                                          marginTop="size-150"
                                        >
                                          <DeleteIcon />
                                          <Text>Delete Identifier</Text>
                                        </Button>
                                      )}
                                    </Well>
                                  )
                                )}
                              </React.Fragment>
                            );
                          }}
                        />
                        {values.identities.length > 1 && (
                          <View marginTop="size-100">
                            <Button
                              data-test-id={`deleteIdentity${index}Button`}
                              variant="secondary"
                              onClick={() => {
                                arrayHelpers.remove(index);
                                setSelectedTabKey("0");
                              }}
                            >
                              <DeleteIcon />
                              Delete Identity
                            </Button>
                          </View>
                        )}
                      </Item>
                    );
                  })}
                </TabPanels>
              </Tabs>
            </React.Fragment>
          );
        }}
      />
    </React.Fragment>
  );
}

IdentityMap.propTypes = {
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  registerImperativeFormApi: PropTypes.func
};

const IdentityMapExtensionView = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <ExtensionViewForm
            render={props => {
              return <IdentityMap {...props} />;
            }}
          />
        );
      }}
    />
  );
};

render(IdentityMapExtensionView);
