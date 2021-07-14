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

import React, { useEffect, useContext } from "react";
import { ComboBox } from "@react-spectrum/combobox";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import ExtensionViewContext from "../components/extensionViewContext";
import useIsFirstRender from "../utils/useIsFirstRender";
import usePagedComboBox from "../utils/usePagedComboBox";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";
import fetchEnvironments from "./utils/fetchEnvironments";
import useReportAsyncError from "../utils/useReportAsyncError";
import UserReportableError from "../errors/userReportableError";

const EnvironmentField = ({
  label,
  name,
  description,
  type,
  edgeConfigId,
  isDisabled,
  isRequired
}) => {
  const reportAsyncError = useReportAsyncError();
  const {
    initInfo: {
      company: { orgId },
      tokens: { imsAccess }
    }
  } = useContext(ExtensionViewContext);
  const [{ value }, , { setValue }] = useField(name);
  const isFirstRender = useIsFirstRender();
  const getKey = item => item?.compositeId;
  const getLabel = item => item?.title;
  const pagedComboBox = usePagedComboBox({
    defaultSelectedItem: value,
    loadItems: async ({ filterText, cursor, signal }) => {
      let results;
      let nextPage;
      try {
        ({ results, nextPage } = await fetchEnvironments({
          orgId,
          imsAccess,
          edgeConfigId,
          search: filterText,
          start: cursor,
          type,
          signal
        }));
      } catch (e) {
        if (e.name !== "AbortError") {
          reportAsyncError(
            new UserReportableError("Failed to load datastream environments.", {
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
      setValue(pagedComboBox.selectedItem);
    }
  }, [getKey(pagedComboBox.selectedItem)]);

  return (
    <FieldDescriptionAndError description={description}>
      <ComboBox
        label={label}
        placeholder="Select an environment"
        items={pagedComboBox.items}
        inputValue={pagedComboBox.inputValue}
        selectedKey={getKey(pagedComboBox.selectedItem) || null}
        loadingState={pagedComboBox.loadingState}
        onInputChange={pagedComboBox.onInputChange}
        onSelectionChange={pagedComboBox.onSelectionChange}
        onOpenChange={pagedComboBox.onOpenChange}
        onLoadMore={pagedComboBox.onLoadMore}
        isDisabled={isDisabled}
        isRequired={isRequired}
        width="size-5000"
      >
        {environment => (
          <Item key={environment.compositeId}>{environment.title}</Item>
        )}
      </ComboBox>
    </FieldDescriptionAndError>
  );
};

EnvironmentField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  edgeConfigId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool
};

export default EnvironmentField;
