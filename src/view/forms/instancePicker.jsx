import React from "react";
import PropTypes from "prop-types";
import InstanceNamePicker from "../components/instanceNamePicker";

/** @typedef {import("./form").Form} Form */
/**
 * This creates a form field for an instance name picker.
 * @param {object} options - Options for the field.
 * @param {string} options.name - The formik key to use for this field.
 * @returns {Form} A form field for an instance name picker.
 */
export default function instancePicker({ name }) {
  const form = {
    getInitialValues({ initInfo }) {
      const { [name]: value = initInfo.extensionSettings.instances[0].name } =
        initInfo.settings || {};
      return { [name]: value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[name]) {
        settings[name] = values[name];
      }
      return settings;
    },
    Component({ namePrefix = "", initInfo }) {
      return (
        <InstanceNamePicker
          data-test-id={`${namePrefix}${name}Picker`}
          name={`${namePrefix}${name}`}
          initInfo={initInfo}
        />
      );
    }
  };

  form.Component.propTypes = {
    initInfo: PropTypes.object.isRequired,
    namePrefix: PropTypes.string
  };
  return form;
}
