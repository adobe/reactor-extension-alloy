import React from "react";
import { string } from "yup";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikComboBox from "../components/formikReactSpectrum3/formikComboBox";
import singleDataElementRegex from "../constants/singleDataElementRegex";

/**
 * Form builder for a combo box. Use this when you have a static list of items.
 * @param {object} options
 * @param {string} options.key - The formik key for the field.
 * @param {boolean} [options.isRequired=false] - If true, an asterisk is added
 * to the label, and the schema is updated to require the field.
 * @param {boolean} [options.dataElementSupported=true] - If true, the field
 * will support data elements.
 * @param {string} options.label - The label for the field.
 * @param {string} [options.description] - The description text to put under the
 * combo box.
 * @param {string} [options.dataElementDescription] - The description text to
 * put under the combo box when a data element is chosen. This is useful to tell
 * what the data element should resolve to.
 * @param {array} options.items - An array of objects with keys "value" and
 * "label". The "value" is the value that will be saved to the settings, and the
 * "label" is the text that will be shown in the combo box.
 */
export default ({
  key,
  isRequired = false,
  dataElementSupported = true,
  label,
  description,
  dataElementDescription,
  items
}) => {
  let validationSchema = string().test(
    key,
    `Please provide a valid ${label.toLowerCase()} or specify a single data element.`,
    value =>
      value &&
      (items.find(item => item.label === value) ||
        value.match(singleDataElementRegex))
  );
  if (isRequired) {
    validationSchema = validationSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
  }

  let Component;
  if (dataElementSupported) {
    const ComponentWithDataElement = ({ keyPrefix = "" }) => {
      const [{ value = "" }] = useField(`${keyPrefix}${key}`);
      return (
        <DataElementSelector>
          <FormikComboBox
            data-test-id={`${keyPrefix}${key}Field`}
            name={`${keyPrefix}${key}`}
            label={label}
            isRequired={isRequired}
            description={
              value.match(singleDataElementRegex)
                ? dataElementDescription
                : description
            }
            width="size-5000"
            items={items}
            allowsCustomValue
          >
            {item => (
              <Item key={item.value} data-test-id={item.value}>
                {item.label}
              </Item>
            )}
          </FormikComboBox>
        </DataElementSelector>
      );
    };
    ComponentWithDataElement.propTypes = {
      keyPrefix: PropTypes.string
    };
    Component = ComponentWithDataElement;
  } else {
    const ComponentWithoutDataElement = ({ keyPrefix = "" }) => {
      const [{ value = "" }] = useField(`${keyPrefix}${key}`);
      return (
        <FormikComboBox
          data-test-id={`${keyPrefix}${key}Field`}
          name={`${keyPrefix}${key}`}
          label={label}
          isRequired={isRequired}
          description={
            value.match(singleDataElementRegex)
              ? dataElementDescription
              : description
          }
          width="size-5000"
          items={items}
        >
          {item => (
            <Item key={item.value} data-test-id={item.value}>
              {item.label}
            </Item>
          )}
        </FormikComboBox>
      );
    };
    ComponentWithoutDataElement.propTypes = {
      keyPrefix: PropTypes.string
    };
    Component = ComponentWithoutDataElement;
  }

  return {
    getInitialValues({ initInfo }) {
      const { [key]: value = "" } = initInfo.settings || {};
      const item = items.find(({ value: v }) => v === value);
      return { [key]: item ? item.value : value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[key]) {
        const item = items.find(({ label: l }) => l === values[key]);
        settings[key] = item ? item.value : values[key];
      }
      return settings;
    },
    validationSchema: {
      [key]: validationSchema
    },
    Component
  };
};
