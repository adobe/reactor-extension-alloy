import React from "react";
import PropTypes from "prop-types";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";

/**
 * This creates a form checkbox field.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.description - The description to use for the field.
 * @param {boolean} [options.defaultValue=false] - The default value for the
 * checkbox.
 * @returns {FormPart}
 */
export default ({ key, label, description, defaultValue = false }) => {
  const part = {
    getInitialValues({ initInfo }) {
      const { [key]: value = defaultValue } = initInfo.settings || {};
      return { [key]: value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[key] !== defaultValue) {
        settings[key] = values[key];
      }
      return settings;
    },
    validationSchema: {},
    Component: ({ keyPrefix = "" }) => (
      <FormikCheckbox
        data-test-id={`${keyPrefix}${key}Checkbox`}
        name={`${keyPrefix}${key}`}
        description={description}
        width="size-5000"
      >
        {label}
      </FormikCheckbox>
    )
  };
  part.Component.propTypes = {
    keyPrefix: PropTypes.string
  };
  return part;
};
