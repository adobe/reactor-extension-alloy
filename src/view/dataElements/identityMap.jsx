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
  Form,
  Heading,
  Item,
  ProgressCircle,
  Text,
  Well
} from "@adobe/react-spectrum";
import { TabList, TabPanels, Tabs } from "@react-spectrum/tabs";
import DeleteIcon from "@spectrum-icons/workflow/Delete";
import render from "../spectrum3Render";
import ExtensionView from "../components/spectrum3ExtensionView";
import ExtensionViewForm from "../components/extensionViewForm";
import getDefaultIdentity from "../utils/getDefaultIdentity";
import fetchNamespaces from "./identityMap/fetchNamespaces";
import { AMBIGUOUS } from "../utils/authenticatedState";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import NamespaceComponent from "../components/namespaceComponent";
import getDefaultIdentifier from "../utils/getDefaultIdentifier";
import DataElementSelector from "../components/dataElementSelector";
import {
  Checkbox,
  Picker,
  TextField
} from "../components/formikReactSpectrum3";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";

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
            authenticatedState: string().default(AMBIGUOUS),
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
              <div className="u-alignRight">
                <Button
                  data-test-id="addIdentityButton"
                  variant="secondary"
                  onPress={() => {
                    arrayHelpers.push(getDefaultIdentity());
                    setSelectedTabKey(String(values.identities.length));
                  }}
                >
                  Add Identity
                </Button>
              </div>
              <Heading level={3}>Identities</Heading>
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
                        <div className="u-gapTop">
                          <NamespaceComponent
                            name={`identities.${index}.namespaceCode`}
                            selectedNamespaceCode={identity.namespaceCode}
                            namespaces={namespaces}
                            index={index}
                          />
                        </div>
                        <FieldArray
                          id={`identities.${index}.identifiers`}
                          name={`identities.${index}.identifiers`}
                          render={identityArrayHelpers => {
                            return (
                              <React.Fragment>
                                <div className="u-gapBottom u-alignRight">
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
                                </div>
                                {identity.identifiers.map(
                                  (identifier, identifierIndex) => (
                                    <Well
                                      key={`identity${index}identifier${identifierIndex}`}
                                      marginTop="size-250"
                                      marginBottom="size-250"
                                    >
                                      <Form>
                                        <DataElementSelector>
                                          <TextField
                                            data-test-id={`identity${index}idField${identifierIndex}`}
                                            label="ID"
                                            name={`identities.${index}.identifiers.${identifierIndex}.id`}
                                            isRequired
                                            width="size-5000"
                                          />
                                        </DataElementSelector>
                                        <Picker
                                          data-test-id={`identity${index}authenticatedStateField${identifierIndex}`}
                                          label="Authenticated State"
                                          name={`identities.${index}.identifiers.${identifierIndex}.authenticatedState`}
                                          items={authenticatedStateOptions}
                                          width="size-5000"
                                        >
                                          {item => (
                                            <Item key={item.value}>
                                              {item.label}
                                            </Item>
                                          )}
                                        </Picker>
                                        <Checkbox
                                          data-test-id={`identity${index}primaryField${identifierIndex}`}
                                          name={`identities.${index}.identifiers.${identifierIndex}.primary`}
                                          description="Adobe Experience Platform will use the identity as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected, but the ECID will be used as the primary identifier for stitching."
                                        >
                                          Primary
                                        </Checkbox>
                                      </Form>
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
                          <div className="u-gapTop">
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
                          </div>
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
