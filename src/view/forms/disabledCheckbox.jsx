import React from "react";
import { Checkbox } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";

/** @typedef {import("./form").Form} Form */
/**
 * Form builder for a disabled text field. When getSettings is called, this always returns the same value.
 * @param {object} options - Options for the field.
 * @param {string} options.name - The name of the field to include in settings.
 * @param {string} options.value - The value of the field to include in settings.
 * @param {string} options.label - The label for the field.
 * @param {string} [options.description] - The description text to put under the
 * checkbox.
 * @returns {Form} A disabled checkbox form.
 */
export default function disabledCheckbox({ name, value, label, description }) {
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
}
