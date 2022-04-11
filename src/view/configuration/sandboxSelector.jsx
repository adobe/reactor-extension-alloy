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

import React, { useEffect } from "react";
import { useAsyncList } from "@react-stately/data";
import { Item } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import useIsFirstRender from "../utils/useIsFirstRender";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";

const getKey = sandbox => sandbox && sandbox.name;
const getLabel = sandbox => {
  if (!sandbox) {
    return undefined;
  }
  const region = sandbox.region ? ` (${sandbox.region.toUpperCase()})` : "";
  return `${sandbox.type.toUpperCase()}  ${sandbox.title}${region}`;
};

const SandboxSelector = ({
  name,
  defaultSelectedSandbox,
  onSelectionChange,
  items,
  label,
  isDisabled,
  isHidden,
  isRequired
}) => {
  const isFirstRender = useIsFirstRender();

  const sandboxList = useAsyncList({
    async load() {
      return { items };
    },
    getKey,
    initialSelectedKeys: defaultSelectedSandbox
      ? new Set([getKey(defaultSelectedSandbox)])
      : new Set(),
    initialFilterText: defaultSelectedSandbox
      ? getLabel(defaultSelectedSandbox)
      : ""
  });

  let selectedSandbox;
  let selectedKey;

  if (sandboxList.selectedKeys.size) {
    selectedKey = sandboxList.selectedKeys.values().next().value;
    if (defaultSelectedSandbox && selectedKey === defaultSelectedSandbox.name) {
      selectedSandbox = defaultSelectedSandbox;
    } else {
      selectedSandbox = sandboxList.getItem(selectedKey);
    }
  }

  useEffect(() => {
    if (!isFirstRender) {
      onSelectionChange(selectedSandbox);
    }
  }, [selectedKey]);

  return (
    <FormikPicker
      name={name}
      data-test-id="sandboxField"
      placeholder="Select a sandbox"
      items={sandboxList.items}
      isLoading={sandboxList.isLoading}
      label={label}
      selectedKey={selectedKey}
      isDisabled={isDisabled}
      onSelectionChange={sandboxName => {
        sandboxList.setSelectedKeys(new Set([sandboxName]));
      }}
      width="size-5000"
      isHidden={isHidden}
      isRequired={isRequired}
    >
      {item => {
        return <Item key={item.name}>{getLabel(item)}</Item>;
      }}
    </FormikPicker>
  );
};

SandboxSelector.propTypes = {
  defaultSelectedSandbox: PropTypes.object,
  onSelectionChange: PropTypes.func,
  label: PropTypes.string,
  items: PropTypes.array,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  isRequired: PropTypes.bool
};

export default SandboxSelector;
