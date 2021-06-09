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
import render from "../spectrum2Render";
import ExtensionView from "../components/spectrum2ExtensionView";
import IdentityWrapper from "../components/identityWrapper";
import getDefaultIdentity from "../utils/getDefaultIdentity";
import "./identityMap.styl";
import { AMBIGUOUS } from "../utils/authenticatedState";
import fetchNamespaces from "./identityMap/fetchNamespaces";

const isNotECID = namespace => {
  return namespace.code !== "ECID";
};
const identitiesMapToArray = identityMap => {
  return Object.keys(identityMap)
    .sort((first, second) => first.localeCompare(second))
    .map(namespace => {
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

  return fetchNamespaces({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess
  }).then(response => {
    if (response.length > 0) {
      const namespaces = response
        .filter(isNotECID)
        .map(namespace => ({
          value: namespace.code,
          label: namespace.code
        }))
        .sort((first, second) => first.value.localeCompare(second.value));

      return {
        identities,
        namespaces
      };
    }

    return {
      identities,
      namespaces: []
    };
  });
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
        namespace: string()
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
      "namespace",
      "Please provide a unique namespace."
    );
  })
  .test("uniquePrimary", function uniquePrimary(settings) {
    return validateOnePrimary(
      this.createError.bind(this),
      settings.identities,
      "Only one namespace can be primary."
    );
  });

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
