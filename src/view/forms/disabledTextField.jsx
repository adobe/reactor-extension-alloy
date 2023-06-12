import React from "react";
import { TextField } from "@adobe/react-spectrum";
import PropTypes from "prop-types";

/**
 * Form builder for a disabled text field. When getSettings is called, this always returns the same value.
 * @param {object} props
 * @param {string} props.name - The name of the field to include in settings.
 * @param {string} props.value - The value of the field to include in settings.
 * @param {string} props.valueLabel - The value to display in the text field.
 * @param {boolean} [props.isRequired=false] - If true, an asterisk is added
 * to the label, and the schema is updated to require the field.
 * @param {string} props.label - The label for the field.
 * @param {string} [props.description] - The description text to put under the
 * combo box.
 * @returns {FormFragment}
 */
export default function DisabledTextField({
  name,
  value,
  valueLabel,
  isRequired,
  label,
  description
}) {
  const Component = ({ namePrefix = "" }) => {
    return (
      <TextField
        data-test-id={`${namePrefix}${name}DisabledField`}
        value={valueLabel}
        width="size-5000"
        label={label}
        isRequired={isRequired}
        description={description}
        isDisabled
      />
    );
  };
  Component.propTypes = {
    namePrefix: PropTypes.string
  };

  return {
    getSettings() {
      return {
        [name]: value
      };
    },
    Component
  };
}
