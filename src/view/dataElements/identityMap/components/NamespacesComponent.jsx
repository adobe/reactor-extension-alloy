/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import { Flex, Item, View } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { useField } from "formik";
import AlertIcon from "@spectrum-icons/workflow/Alert";
import { findNamespace } from "../utils/namespacesUtils";
import FormikComboBox from "../../../components/formikReactSpectrum3/formikComboBox";
import DataElementSelector from "../../../components/dataElementSelector";
import FormikTextField from "../../../components/formikReactSpectrum3/formikTextField";

const getSelectedNamespace = (namespaces, selectedNamespaceCode) => {
  if (namespaces.length < 1 || selectedNamespaceCode === "") {
    return undefined;
  }
  const found = findNamespace(namespaces, selectedNamespaceCode);

  return found ? found.code : undefined;
};

const NamespacesComponent = ({ name, index, namespaces }) => {
  const [{ value: selectedNamespaceCode }] = useField(name);

  const isNamespacePartOfSandboxNamespaces = getSelectedNamespace(
    namespaces,
    selectedNamespaceCode
  );
  const namespacesLearnMoreLink =
    "https://experienceleague.adobe.com/docs/experience-platform/identity/namespaces.html?lang=en";
  const description =
    "The namespace you have selected is missing from one or more of your sandboxes. Make sure to create this namespace by following the guide: ";

  return (
    <Flex direction="row" alignItems="center">
      <View>
        <DataElementSelector>
          {namespaces.length > 0 ? (
            <FormikComboBox
              data-test-id={`namespace${index}Combobox`}
              name={name}
              items={namespaces}
              width="size-5000"
              description={
                !isNamespacePartOfSandboxNamespaces && selectedNamespaceCode
                  ? description
                  : "More details on how to create a namespace can be found here: "
              }
              label="Namespace"
              learnMoreDescriptionLink={namespacesLearnMoreLink}
              allowsCustomValue
            >
              {namespace => <Item key={namespace.code}>{namespace.code}</Item>}
            </FormikComboBox>
          ) : (
            <FormikTextField
              description="We recommend using namespaces that are part of the configured extension sandboxes. Make sure to create this namespace by following the guide: "
              data-test-id={`namespace${index}Field`}
              label="Namespace"
              name={name}
              width="size-5000"
              learnMoreDescriptionLink={namespacesLearnMoreLink}
              isRequired
            />
          )}
        </DataElementSelector>
      </View>

      {namespaces.length > 0 &&
        !isNamespacePartOfSandboxNamespaces &&
        selectedNamespaceCode && (
          <View padding="size-10">
            <AlertIcon color="warning" size="S" />
          </View>
        )}
    </Flex>
  );
};

NamespacesComponent.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  namespaces: PropTypes.array
};

export default NamespacesComponent;
