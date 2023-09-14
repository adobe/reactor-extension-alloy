import React from "react";
import { string } from "yup";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

/**
 * This creates a form field that is required to be a single data element.
 * @param {object} options
 * @param {string} options.name - The formik key to use for this field.
 * @param {boolean} [options.isRequired=false] - Whether or not this field is required.
 * @param {string} options.label - The label to use for this field.
 * @param {string} [options.description] - The description to use for this field.
 * @returns {FormFragment}
 */
export default function dataElement({
  name,
  isRequired = false,
  label,
  description
}) {
  let fieldSchema = string().matches(
    singleDataElementRegex,
    DATA_ELEMENT_REQUIRED
  );
  if (isRequired) {
    fieldSchema = fieldSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
  }

  const part = {
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
      [name]: fieldSchema
    },
    Component: ({ namePrefix = "" }) => {
      return (
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
    }
  };
  part.Component.propTypes = {
    namePrefix: PropTypes.string
  };

  return part;
}