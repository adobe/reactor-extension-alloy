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
import usePagedComboBox from "../utils/usePagedComboBox";
import fetchConfigs from "./utils/fetchConfigs";
import UserReportableError from "../errors/userReportableError";
import useIsFirstRender from "../utils/useIsFirstRender";
import useReportAsyncError from "../utils/useReportAsyncError";

const EdgeConfigurationField = ({
  defaultSelectedEdgeConfig,
  touched,
  error,
  setTouched,
  onSelectionChange,
  initInfo
}) => {
  const reportAsyncError = useReportAsyncError();
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const isFirstRender = useIsFirstRender();
  const getKey = item => item?.id;
  const getLabel = item => item?.title;
  const pagedComboBox = usePagedComboBox({
    defaultSelectedItem: defaultSelectedEdgeConfig,
    loadItems: async ({ filterText, cursor, signal }) => {
      let results;
      let nextPage;
      try {
        ({ results, nextPage } = await fetchConfigs({
          orgId,
          imsAccess,
          search: filterText,
          start: cursor,
          signal
        }));
      } catch (e) {
        if (e.name !== "AbortError") {
          reportAsyncError(
            new UserReportableError("Failed to load datastreams.", {
              originatingError: e
            })
          );
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

  return (
    <ComboBox
      data-test-id="edgeConfigComboBox"
      label="Datastream"
      placeholder="Select a datastream"
      items={pagedComboBox.items}
      inputValue={pagedComboBox.inputValue}
      selectedKey={getKey(pagedComboBox.selectedItem) || null}
      loadingState={pagedComboBox.loadingState}
      isRequired
      validationState={touched && error ? "invalid" : undefined}
      description="Data being sent by the SDK will be routed to Adobe solutions according to how the selected datastream has been configured."
      errorMessage={error}
      onBlur={() => {
        setTouched(true);
      }}
      onInputChange={pagedComboBox.onInputChange}
      onSelectionChange={pagedComboBox.onSelectionChange}
      onOpenChange={pagedComboBox.onOpenChange}
      onLoadMore={pagedComboBox.onLoadMore}
      width="size-5000"
    >
      {item => <Item key={item.id}>{item.title}</Item>}
    </ComboBox>
  );
};

EdgeConfigurationField.propTypes = {
  defaultSelectedEdgeConfig: PropTypes.object,
  touched: PropTypes.bool,
  error: PropTypes.string,
  setTouched: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  initInfo: PropTypes.object.isRequired
};

export default EdgeConfigurationField;
