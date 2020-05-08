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

import "regenerator-runtime"; // needed for some of react-spectrum
import React from "react";
import { array, object, string } from "yup";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import ExtensionView from "../components/extensionView";
import IdentityWrapper from "../components/identityWrapper";
import getDefaultIdentity from "../utils/getDefaultIdentifier";
import "./syncIdentity.styl";

const identifiersMapToArray = identifierMap => {
  return Object.keys(identifierMap).map(namespace => {
    return {
      namespace,
      ...identifierMap[namespace]
    };
  });
};

const identifiersArrayToMap = identifiersArray => {
  return identifiersArray.reduce((identifierMap, identifier) => {
    const { namespace, ...otherProperties } = identifier;
    identifierMap[identifier.namespace] = otherProperties;
    return identifierMap;
  }, {});
};

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  const identifiers = initInfo.settings
    ? identifiersMapToArray(initInfo.settings.identity)
    : [getDefaultIdentity()];

  return {
    instanceName,
    identifiers
  };
};

const getSettings = ({ values }) => {
  return {
    instanceName: values.instanceName,
    identity: identifiersArrayToMap(values.identifiers)
  };
};

const validateDuplicateValue = (
  createError,
  identifiers,
  key,
  message,
  validateBooleanTrue
) => {
  const values = identifiers.map(identifier => identifier[key]);
  const duplicateIndex = values.findIndex(
    (value, index) =>
      values.indexOf(value) < index && (!validateBooleanTrue || value === true)
  );

  return (
    duplicateIndex === -1 ||
    createError({
      path: `identifiers[${duplicateIndex}].${key}`,
      message
    })
  );
};

const validationSchema = object()
  .shape({
    instanceName: string().required("Please specify an instance name."),
    identifiers: array().of(
      object().shape({
        namespace: string()
          .required("Please select a namespace.")
          .test({
            name: "notECID",
            message: "ECID is not allowed",
            test(value) {
              return value !== "ECID";
            }
          }),
        id: string().required("Please specify an ID."),
        authenticatedState: string().required(
          "Please select an authenticated state."
        )
      })
    )
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniqueNamespace", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.identifiers,
      "namespace",
      "Please provide a unique namespace."
    );
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniquePrimary", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.identifiers,
      "primary",
      "Only one namespace can be primary.",
      true
    );
  });

const SyncIdentity = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps, initInfo }) => {
        const { values } = formikProps;

        return <IdentityWrapper values={values} initInfo={initInfo} />;
      }}
    />
  );
};

render(SyncIdentity);
