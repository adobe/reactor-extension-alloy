import React from "react";
import { Checkbox } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";

/**
 * Form builder for a disabled text field. When getSettings is called, this always returns the same value.
 * @param {object} props
 * @param {string} props.name - The name of the field to include in settings.
 * @param {string} props.value - The value of the field to include in settings.
 * @param {string} props.label - The label for the field.
 * @param {string} [props.description] - The description text to put under the
 * checkbox.
 * @returns {Form}
 */
export default ({ name, value, label, description }) => {
  const Component = ({ namePrefix = "" }) => {
    return (
      <FieldDescriptionAndError
        description={description}
        messagePaddingTop="size-0"
        messagePaddingStart="size-300"
      >
        <Checkbox
          data-test-id={`${namePrefix}${name}DisabledCheckbox`}
          isSelected={value}
          width="size-5000"
          isDisabled
        >
          {label}
        </Checkbox>
      </FieldDescriptionAndError>
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
};
