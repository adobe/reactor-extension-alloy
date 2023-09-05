import React from "react";
import PropTypes from "prop-types";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";

/**
 * This creates a form checkbox field.
 * @param {object} options
 * @param {string} options.name - The formik key to use for this field.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.description - The description to use for the field.
 * @param {boolean} [options.defaultValue=false] - The default value for the
 * checkbox.
 * @returns {FormPart}
 */
export default function checkbox({
  name,
  label,
  description,
  defaultValue = false
}) {
  const part = {
    getInitialValues({ initInfo }) {
      const { [name]: value = defaultValue } = initInfo.settings || {};
      return { [name]: value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[name] !== defaultValue) {
        settings[name] = values[name];
      }
      return settings;
    },
    validationSchema: {},
    Component: ({ namePrefix = "" }) => (
      <FormikCheckbox
        data-test-id={`${namePrefix}${name}Checkbox`}
        name={`${namePrefix}${name}`}
        description={description}
        width="size-5000"
      >
        {label}
      </FormikCheckbox>
    )
  };
  part.Component.propTypes = {
    namePrefix: PropTypes.string
  };
  return part;
}
