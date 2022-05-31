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

import React, { useEffect } from "react";
import { Flex, Item, View } from "@adobe/react-spectrum";
import { useAsyncList } from "@react-stately/data";
import PropTypes from "prop-types";
import { useField } from "formik";
import AlertIcon from "@spectrum-icons/workflow/Alert";
import usePrevious from "../../../utils/usePrevious";
import { findNamespace, getNamespaces } from "../utils/namespacesUtils";
import FormikComboBox from "../../../components/formikReactSpectrum3/formikComboBox";
import DataElementSelector from "../../../components/dataElementSelector";

const getSelectedNamespace = (namespaces, selectedNamespaceCode) => {
  if (namespaces.length < 1 || selectedNamespaceCode === "") {
    return undefined;
  }
  const found = findNamespace(namespaces, selectedNamespaceCode);

  return found ? found.code : undefined;
};

const getKey = namespace => namespace && namespace.code;

const NamespacesComponent = ({
  name,
  index,
  namespaces,
  selectedSandbox,
  initInfo
}) => {
  const [{ value: selectedNamespaceCode }] = useField(name);

  const previousSelectedSandbox = usePrevious(selectedSandbox);

  const namespacesList = useAsyncList({
    async load() {
      if (namespaces) {
        return {
          items: namespaces
        };
      }
      try {
        const result = await getNamespaces(initInfo, selectedSandbox);

        return { items: result };
      } catch (e) {
        return [];
      }
    },
    getKey
  });

  const selectedNamespace = getSelectedNamespace(
    namespacesList.items,
    selectedNamespaceCode
  );

  useEffect(() => {
    if (previousSelectedSandbox && selectedSandbox) {
      namespacesList.selectedKeys = null;
      namespacesList.reload();
    }
  }, [selectedSandbox || null]);

  return (
    <Flex direction="row" alignItems="center">
      <View>
        <DataElementSelector>
          <FormikComboBox
            data-test-id={`namespaceCombobox${index}Field`}
            name={name}
            items={namespacesList.items}
            width="size-5000"
            description={
              !selectedNamespace
                ? "We recommend using namespaces from the same sandbox across an identityMap."
                : ""
            }
            label="Namespace"
            allowsCustomValue
          >
            {namespace => <Item key={namespace.code}>{namespace.code}</Item>}
          </FormikComboBox>
        </DataElementSelector>
      </View>

      {!selectedNamespace && (
        <View>
          <AlertIcon color="warning" size="S" marginBottom="size-100" />
        </View>
      )}
    </Flex>
  );
};

NamespacesComponent.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  namespaces: PropTypes.array,
  selectedSandbox: PropTypes.string,
  initInfo: PropTypes.object.isRequired
};

export default NamespacesComponent;
