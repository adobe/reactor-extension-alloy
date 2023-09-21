import React from "react";
import { string } from "yup";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";

/** @typedef {import("./form").Form} Form */
/**
 * This creates a form field for a text field and supports data elements.
 * @param {object} options - Options for the field.
 * @param {string} options.name - The formik key to use for this field.
 * @param {boolean} [options.isRequired] - Whether or not the field is
 * required.
 * @param {boolean} [options.dataElementSupported] - Whether or not a data
 * element button should be included.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.description - The description to use for the field.
 * @param options.name
 * @returns {Form} A form field for a text field.
 */
export default function textField({
  name,
  isRequired = false,
  dataElementSupported = true,
  label,
  description
}) {
  let validationSchema = string();
  if (isRequired) {
    validationSchema = validationSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
  }

  let Component;
  if (dataElementSupported) {
    const ComponentWithDataElement = ({ namePrefix = "" }) => (
      <DataElementSelector>
        <FormikTextField
          data-test-id={`${namePrefix}${name}TextField`}
          name={`${namePrefix}${name}`}
          label={label}
          isRequired={isRequired}
          description={description}
          width="size-5000"
        />
      </DataElementSelector>
    );
    ComponentWithDataElement.propTypes = {
      namePrefix: PropTypes.string
    };
    Component = ComponentWithDataElement;
  } else {
    const ComponentWithoutDataElement = ({ namePrefix = "" }) => (
      <FormikTextField
        data-test-id={`${namePrefix}${name}TextField`}
        name={`${namePrefix}${name}`}
        label={label}
        isRequired={isRequired}
        description={description}
        width="size-5000"
      />
    );
    ComponentWithoutDataElement.propTypes = {
      namePrefix: PropTypes.string
    };
    Component = ComponentWithoutDataElement;
  }

  return {
    getInitialValues({ initInfo }) {
      const { [name]: value = "" } = initInfo.settings || {};
      return { [name]: value };
    },
    getSettings({ values }) {
      const { [name]: value } = values;
      const settings = {};
      if (value) {
        settings[name] = value;
      }
      return settings;
    },
    validationShape: {
      [name]: validationSchema
    },
    Component
  };
}
