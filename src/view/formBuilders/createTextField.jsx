import React from "react";
import { string } from "yup";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";

/**
 * This creates a form field for a text field and supports data elements.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 * @param {boolean} [options.isRequired=false] - Whether or not the field is
 * required.
 * @param {boolean} [options.dataElementSupported=true] - Whether or not a data
 * element button should be included.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.description - The description to use for the field.
 * @returns {FormPart}
 */
export default ({
  key,
  isRequired = false,
  dataElementSupported = true,
  label,
  description
}) => {
  let validationSchema = string();
  if (isRequired) {
    validationSchema = validationSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
  }

  let Component;
  if (dataElementSupported) {
    const ComponentWithDataElement = ({ keyPrefix = "" }) => (
      <DataElementSelector>
        <FormikTextField
          data-test-id={`${keyPrefix}${key}TextField`}
          name={`${keyPrefix}${key}`}
          label={label}
          isRequired={isRequired}
          description={description}
          width="size-5000"
        />
      </DataElementSelector>
    );
    ComponentWithDataElement.propTypes = {
      keyPrefix: PropTypes.string
    };
    Component = ComponentWithDataElement;
  } else {
    const ComponentWithoutDataElement = ({ keyPrefix = "" }) => (
      <FormikTextField
        data-test-id={`${keyPrefix}${key}TextField`}
        name={`${keyPrefix}${key}`}
        label={label}
        isRequired={isRequired}
        description={description}
        width="size-5000"
      />
    );
    ComponentWithoutDataElement.propTypes = {
      keyPrefix: PropTypes.string
    };
    Component = ComponentWithoutDataElement;
  }

  return {
    getInitialValues({ initInfo }) {
      const { [key]: value = "" } = initInfo.settings || {};
      return { [key]: value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[key]) {
        settings[key] = values[key];
      }
      return settings;
    },
    validationSchema: {
      [key]: validationSchema
    },
    Component
  };
};
