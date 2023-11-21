import React from "react";
import { string } from "yup";
import PropTypes from "prop-types";
import CodeField from "../components/codeField";

/** @typedef {import("./form").Form} Form */
/**
 * This creates a form field for a code field.
 * @param {object} options - Options for the field.
 * @param {string} options.name - The formik key to use for this field.
 * @param {boolean} [options.isRequired] - Whether or not the field is
 * required.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.description - The description to use for the field.
 * @param options.name
 * @returns {Form} A form field for a code field.
 */
export default function codeField({
  name,
  isRequired = false,
  label,
  description,
  placeholder,
  buttonLabelSuffix
}) {
  let validationSchema = string();
  if (isRequired) {
    validationSchema = validationSchema.required(
      `Please provide a ${label.toLowerCase()}.`
    );
  }

  const Component = ({ namePrefix = "" }) => (
    <CodeField
      data-test-id={`${namePrefix}${name}CodeButton`}
      label={label}
      buttonLabelSuffix={buttonLabelSuffix}
      name={`${namePrefix}${name}`}
      isRequired={isRequired}
      description={description}
      placeholder={placeholder}
      language="javascript"
      width="size-5000"
    />
  );
  Component.propTypes = {
    namePrefix: PropTypes.string
  };

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
