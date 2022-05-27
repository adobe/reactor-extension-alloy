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
import { Item } from "@adobe/react-spectrum";
import { useAsyncList } from "@react-stately/data";
import PropTypes from "prop-types";
import { useField } from "formik";
import FormikPicker from "../../../components/formikReactSpectrum3/formikPicker";
import FormikTextField from "../../../components/formikReactSpectrum3/formikTextField";
import usePrevious from "../../../utils/usePrevious";
import { findNamespace, getNamespaces } from "../utils/namespacesUtils";

const getSelectedNamespace = (namespaces, selectedNamespaceCode) => {
  if (namespaces.length < 1) {
    return undefined;
  }

  if (selectedNamespaceCode === "") {
    return "Select an option";
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

  return selectedNamespace ? (
    <FormikPicker
      data-test-id={`namespacePicker${index}Field`}
      label="Namespace"
      name={name}
      items={namespacesList.items}
      width="size-5000"
      isRequired
    >
      {namespace => <Item key={namespace.code}>{namespace.name}</Item>}
    </FormikPicker>
  ) : (
    <FormikTextField
      data-test-id={`namespace${index}Field`}
      label="Namespace"
      name={name}
      width="size-5000"
      isRequired
    />
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
