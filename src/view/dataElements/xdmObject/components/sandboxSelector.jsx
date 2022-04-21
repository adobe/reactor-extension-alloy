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
import { useListData } from "@react-stately/data";
import { Item, Picker } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import fetchSandboxes from "../helpers/fetchSandboxes";
import FieldDescriptionAndError from "../../../components/fieldDescriptionAndError";
import useReportAsyncError from "../../../utils/useReportAsyncError";
import useIsFirstRender from "../../../utils/useIsFirstRender";

const getKey = sandbox => sandbox && sandbox.name;
const getLabel = sandbox => {
  if (!sandbox) {
    return undefined;
  }
  const region = sandbox.region ? ` (${sandbox.region.toUpperCase()})` : "";
  return `${sandbox.type.toUpperCase()}  ${sandbox.title}${region}`;
};

const SandboxSelector = ({
  defaultSelectedSandbox,
  onSelectionChange,
  errorMessage,
  initInfo
}) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const reportAsyncError = useReportAsyncError();
  const isFirstRender = useIsFirstRender();

  const sandboxList = useListData({
    async load({ signal }) {
      let sandboxes;
      try {
        ({ results: sandboxes } = await fetchSandboxes({
          orgId,
          imsAccess,
          signal
        }));
      } catch (e) {
        if (e.name !== "AbortError") {
          reportAsyncError(e);
        }
        // useAsyncList expects us to throw an error
        // if we can't produce a valid return object.
        throw e;
      }

      return {
        items: sandboxes
      };
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
    <FieldDescriptionAndError
      description="Choose a sandbox containing the schema you wish to use."
      error={errorMessage}
    >
      <Picker
        data-test-id="sandboxField"
        label="Sandbox"
        placeholder="Select a sandbox"
        items={sandboxList.items}
        isLoading={sandboxList.isLoading}
        selectedKey={selectedKey}
        isDisabled={!sandboxList.isLoading && !sandboxList.items.length}
        onSelectionChange={sandboxName => {
          sandboxList.setSelectedKeys(new Set([sandboxName]));
        }}
        width="size-5000"
      >
        {item => {
          return <Item key={item.name}>{getLabel(item)}</Item>;
        }}
      </Picker>
    </FieldDescriptionAndError>
  );
};

SandboxSelector.propTypes = {
  defaultSelectedSandbox: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  initInfo: PropTypes.object
};

export default SandboxSelector;
