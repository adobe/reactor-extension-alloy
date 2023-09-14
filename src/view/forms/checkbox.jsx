/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
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
