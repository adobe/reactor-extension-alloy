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
import { ComboBox } from "@react-spectrum/combobox";
import { Item } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import fetchSchemasMeta from "../helpers/fetchSchemasMeta";
import usePagedComboBox from "../../../utils/usePagedComboBox";
import useReportAsyncError from "../../../utils/useReportAsyncError";
import useIsFirstRender from "../../../utils/useIsFirstRender";
import usePrevious from "../../../utils/usePrevious";

const SchemaMetaSelector = ({
  defaultSelectedSchemaMeta,
  selectedSandbox,
  onSelectionChange,
  errorMessage,
  initInfo
}) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const isFirstRender = useIsFirstRender();
  const previousSelectedSandbox = usePrevious(selectedSandbox);
  const reportAsyncError = useReportAsyncError();
  const getKey = item => item?.$id;
  const getLabel = item => item?.title;
  const pagedComboBox = usePagedComboBox({
    defaultSelectedItem: defaultSelectedSchemaMeta,
    loadItems: async ({ filterText, cursor, signal }) => {
      let results;
      let nextPage;
      try {
        ({ results, nextPage } = await fetchSchemasMeta({
          orgId,
          imsAccess,
          sandboxName: selectedSandbox.name,
          search: filterText,
          start: cursor,
          signal
        }));
      } catch (e) {
        if (e.name !== "AbortError") {
          reportAsyncError(e);
        }
        // usePagedComboBox expects us to throw an error
        // if we can't produce a valid return object.
        throw e;
      }
      return {
        items: results,
        cursor: nextPage
      };
    },
    getKey,
    getLabel
  });

  useEffect(() => {
    if (!isFirstRender) {
      onSelectionChange(pagedComboBox.selectedItem);
    }
  }, [getKey(pagedComboBox.selectedItem)]);

  useEffect(() => {
    // Reset the selected schema meta if the user selects a different sandbox.
    if (previousSelectedSandbox && selectedSandbox) {
      pagedComboBox.clear();
      // Our combobox has a menu of schemas ready to go for when
      // the user next manually opens the menu. We need to reload
      // that list so the user doesn't see schemas related to
      // the previously selected sandbox.
    }
  }, [selectedSandbox ? selectedSandbox.name : null]);

  return (
    <ComboBox
      data-test-id="schemaField"
      label="Schema"
      description="Choose a schema for which to build a matching XDM object."
      placeholder="Select a schema"
      items={pagedComboBox.items}
      inputValue={pagedComboBox.inputValue}
      selectedKey={getKey(pagedComboBox.selectedItem) || null}
      loadingState={pagedComboBox.loadingState}
      validationState={errorMessage ? "invalid" : undefined}
      errorMessage={errorMessage}
      onInputChange={pagedComboBox.onInputChange}
      onSelectionChange={pagedComboBox.onSelectionChange}
      onOpenChange={pagedComboBox.onOpenChange}
      onLoadMore={pagedComboBox.onLoadMore}
      width="size-5000"
    >
      {item => <Item key={item.$id}>{item.title}</Item>}
    </ComboBox>
  );
};

SchemaMetaSelector.propTypes = {
  defaultSelectedSchemaMeta: PropTypes.object,
  selectedSandbox: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  initInfo: PropTypes.object
};

export default SchemaMetaSelector;
