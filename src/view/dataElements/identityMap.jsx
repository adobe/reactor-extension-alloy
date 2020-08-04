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
import { array, boolean, object, string } from "yup";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import ExtensionView from "../components/extensionView";
import IdentityWrapper from "../components/identityWrapper";
import getDefaultIdentity from "../utils/getDefaultIdentity";
import "./identityMap.styl";
import { AMBIGUOUS } from "../utils/authenticatedState";

const identitiesMapToArray = identityMap => {
  return Object.keys(identityMap).map(namespace => {
    return {
      namespace,
      identifiers: identityMap[namespace]
    };
  });
};

const identitiesArrayToMap = identitiesArray => {
  return identitiesArray.reduce((identityMap, identity) => {
    const { namespace, identifiers } = identity;
    identityMap[namespace] = identifiers;
    return identityMap;
  }, {});
};

const getInitialValues = ({ initInfo }) => {
  const identities = initInfo.settings
    ? identitiesMapToArray(initInfo.settings)
    : [getDefaultIdentity()];

  return {
    identities
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
  const values = identities.map(identity => identity[key]);
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

const validationSchema = object()
  .shape({
    identities: array().of(
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
      "namespace",
      "Please provide a unique namespace."
    );
  });

/* will work on this as part of identityMap phase 2
 .test("uniquePrimary", function uniquePrimary(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.identities,
      "primary",
      "Only one namespace can be primary.",
      true
    );
  });*/

const IdentityMap = () => {
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

render(IdentityMap);
