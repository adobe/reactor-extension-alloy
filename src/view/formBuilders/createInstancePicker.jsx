import React from "react";
import PropTypes from "prop-types";
import InstanceNamePicker from "../components/instanceNamePicker";
import { simpleGetSettings } from "./utils";

/**
 * This creates a form field for an instance name picker.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 * @returns {FormPart}
 */
export default ({ key }) => {
  const getSettings = simpleGetSettings({ key });
  const Component = ({ initInfo }) => {
    return (
      <InstanceNamePicker
        data-test-id={`${key}Picker`}
        name={key}
        initInfo={initInfo}
      />
    );
  };
  Component.propTypes = {
    initInfo: PropTypes.object.isRequired
  };

  return {
    getInitialValues({ initInfo }) {
      const { [key]: value = initInfo.extensionSettings.instances[0].name } =
        initInfo.settings || {};
      return { [key]: value };
    },
    getSettings,
    Component
  };
};
