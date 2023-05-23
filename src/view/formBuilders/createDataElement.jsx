import React from "react";
import { string } from "yup";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

/**
 * This creates a form field that is required to be a single data element.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 * @param {boolean} [options.isRequired=false] - Whether or not this field is required.
 * @param {string} options.label - The label to use for this field.
 * @param {string} [options.description] - The description to use for this field.
 * @returns {FormPart}
 */
export default ({ key, isRequired = false, label, description }) => {
  let validationSchema = string().matches(
    singleDataElementRegex,
    DATA_ELEMENT_REQUIRED
  );
  if (isRequired) {
    validationSchema = validationSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
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
    Component: () => {
      return (
        <DataElementSelector>
          <FormikTextField
            data-test-id={`${key}TextField`}
            name={key}
            label={label}
            isRequired={isRequired}
            description={description}
            width="size-5000"
          />
        </DataElementSelector>
      );
    }
  };
};
