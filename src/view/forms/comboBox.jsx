/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import React from "react";
import { string } from "yup";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikKeyedComboBox from "../components/formikReactSpectrum3/formikKeyedComboBox";
import singleDataElementRegex from "../constants/singleDataElementRegex";

/** @typedef {import("./form").Form} Form */
/**
 * Form builder for a combo box. Use this when you have a static list of items.
 * @param {object} options - Options for the combo box.
 * @param {string} options.name - The formik key for the field.
 * @param {boolean} [options.isRequired] - If true, an asterisk is added
 * to the label, and the schema is updated to require the field.
 * @param {boolean} [options.dataElementSupported] - If true, the field
 * will support data elements.
 * @param {string} options.label - The label for the field.
 * @param {string} [options.description] - The description text to put under the
 * combo box.
 * @param {string} [options.dataElementDescription] - The description text to
 * put under the combo box when a data element is chosen. This is useful to tell
 * what the data element should resolve to.
 * @param {{ value: string, label: string }[]} options.items - An array of objects with keys "value" and
 * "label". The "value" is the value that will be saved to the settings, and the
 * "label" is the text that will be shown in the combo box.
 * @param {boolean} options.allowsCustomValue - If true, the user can type in
 * a custom value that will be saved to the settings.
 * @returns {Form} A combo box form.
 */
export default function comboBox({
  name,
  isRequired = false,
  dataElementSupported = true,
  label,
  description,
  dataElementDescription,
  items,
  allowsCustomValue = false
}) {
  let fieldSchema = string();
  if (!allowsCustomValue) {
    fieldSchema = fieldSchema.test(
      name,
      `Please choose a ${label.toLowerCase()} from the list or specify a single data element.`,
      value =>
        !value ||
        items.find(item => item.value === value) ||
        value.match(singleDataElementRegex)
    );
  }
  if (isRequired) {
    fieldSchema = fieldSchema.required(
      `Please choose a ${label.toLowerCase()}.`
    );
  }

  // DataElementSelector looks for name and label to do its calculations, so we have to have them here.
  const InnerComponent = ({
    name: innerName,
    label: innerLabel,
    description: innerDescription
  }) => {
    return (
      <FormikKeyedComboBox
        data-test-id={`${innerName}Field`}
        name={innerName}
        label={innerLabel}
        isRequired={isRequired}
        description={innerDescription}
        width="size-5000"
        items={items}
        allowsCustomValue={allowsCustomValue || dataElementSupported}
        getKey={item => item.value}
        getLabel={item => item.label}
      >
        {item => (
          <Item key={item.value} data-test-id={item.value}>
            {item.label}
          </Item>
        )}
      </FormikKeyedComboBox>
    );
  };
  InnerComponent.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    description: PropTypes.string
  };

  const part = {
    getInitialValues({ initInfo }) {
      const { [name]: value = "" } = initInfo.settings || {};
      const item = items.find(({ value: v }) => v === value);
      return { [name]: item ? item.value : value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[name]) {
        const item = items.find(({ label: l }) => l === values[name]);
        settings[name] = item ? item.value : values[name];
      }
      return settings;
    },
    validationShape: {
      [name]: fieldSchema
    },
    Component: ({ namePrefix = "" }) => {
      if (dataElementSupported) {
        const [{ value = "" }] = useField(`${namePrefix}${name}`);
        return (
          <DataElementSelector>
            <InnerComponent
              name={`${namePrefix}${name}`}
              label={label}
              description={
                value.match(singleDataElementRegex)
                  ? dataElementDescription
                  : description
              }
            />
          </DataElementSelector>
        );
      }
      return (
        <InnerComponent
          name={`${namePrefix}${name}`}
          label={label}
          description={description}
        />
      );
    }
  };
  part.Component.propTypes = {
    namePrefix: PropTypes.string
  };
  return part;
}
