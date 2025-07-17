/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import { ListView, Item, IllustratedMessage, Content, Heading, View } from "@adobe/react-spectrum";
import { useField } from "formik";
import FieldDescriptionAndError from "../fieldDescriptionAndError";

/**
 * @param {object} params
 * @param {string} params.name
 * @param {string?} params.label Label text for the component
 * @param {string?} params.description Description text for the component
 * @param {string?} params.width
 * @param {string?} params.height
 * @param {Function?} params.onBlur
 * @param {(value: T) => undefined | string} params.validate A function that will be called to validate
 * the value entered by the user. The function should return an error message if
 * the value is invalid, or null if the value is valid.
 * @param {Array} params.items Array of items with value and label properties
 * @param {Function} params.getKey Function to get key from item
 * @param {Function} params.getLabel Function to get label from item
 * @param {string} params.loadingState Loading state: 'loading', 'idle', etc.
 * @param {boolean} params.isDisabled Whether the component is disabled
 * @returns {React.Element}
 */
const FormikListView = ({
  name,
  label,
  description,
  width = "100%",
  height = "250px",
  validate,
  onBlur = () => {},
  items = [],
  getKey,
  getLabel,
  loadingState = "idle",
  isDisabled = false,
  ...otherProps
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField({
    name,
    validate,
  });

  // Ensure value is always an array and convert to strings for ListView
  const selectedKeys = value ? (Array.isArray(value) ? value.map(id => String(id)) : [String(value)]) : [];

  const renderEmptyState = () => (
    <IllustratedMessage>
      <Heading>No advertisers available</Heading>
      <Content>No advertisers were found or failed to load.</Content>
    </IllustratedMessage>
  );

  // By providing a width directly similar to how FieldDescriptionAndError works
  const widthStyle = width
    ? `var(--spectrum-global-dimension-${width}, var(--spectrum-alias-${width}))`
    : `var(--spectrum-field-default-width)`;

  const listViewComponent = (
    <ListView
      {...otherProps}
      items={items && items.length > 0 ? items : []}
      selectionMode="multiple"
      maxWidth={width}
      height={height}
      aria-label={label || "Select items"}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        setValue(Array.from(keys).map(id => String(id)));
      }}
      onBlur={(...args) => {
        onBlur(...args);
        setTouched(true);
      }}
      isDisabled={isDisabled}
      renderEmptyState={renderEmptyState}
      loadingState={loadingState}
      validationState={touched && error ? "invalid" : undefined}
      errorMessage={error}
    >
      {(item) => (
        <Item key={String(getKey(item))} data-test-id={String(getKey(item))}>
          {getLabel(item)}
        </Item>
      )}
    </ListView>
  );

  return (
    <View UNSAFE_style={{ width: widthStyle }}>
      {label && (
        <View
          UNSAFE_style={{
            display: "block",
            marginBottom: "var(--spectrum-global-dimension-size-50)",
            color: "var(--spectrum-alias-label-text-color, var(--spectrum-global-color-gray-700))",
            fontSize: "var(--spectrum-alias-item-text-size-m, var(--spectrum-global-dimension-font-size-100))",
            fontWeight: "var(--spectrum-alias-body-text-font-weight, var(--spectrum-global-font-weight-regular))",
            lineHeight: "var(--spectrum-alias-component-text-line-height, var(--spectrum-global-font-line-height-small))",
          }}
          elementType="label"
          htmlFor={name}
        >
          {label}
        </View>
      )}
      <FieldDescriptionAndError
        description={description}
        error={touched && error ? error : undefined}
      >
        {listViewComponent}
      </FieldDescriptionAndError>
    </View>
  );
};

FormikListView.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  onBlur: PropTypes.func,
  validate: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
  items: PropTypes.array,
  getKey: PropTypes.func.isRequired,
  getLabel: PropTypes.func.isRequired,
  loadingState: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default FormikListView; 