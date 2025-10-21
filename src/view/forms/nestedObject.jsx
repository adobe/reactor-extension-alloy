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
import form from "./form";
import { object } from "yup";
import { Well, LabeledValue, View } from "@adobe/react-spectrum";

/** @typedef {import("./form").Form} Form */
/**
 * This function is used to create a form that conditionally renders
 * other form based on a conditional function.
 * @param {object} options The options for the conditional form.
 * @param {string} options.name The name of the nested object.
 * @param  {Form[]} children The form fragments that will be used to render the nested object.
 * @returns {Form} A form that renders a nested object.
 */
export default function nestedObject({ name, label = "", ...formOptions }, children) {
  const { getInitialValues, getSettings, getValidationShape, Component } = form(
    formOptions,
    children,
  );

  const parts = {
    async getInitialValues({ initInfo, context }) {
      const settings = initInfo.settings?.[name];
      const nestedContext = context?.[name];
      return { [name]: await getInitialValues({ initInfo: { ...initInfo, settings }, context: nestedContext }) };
    },
    getSettings({ values, context }) {
      const settings = getSettings({ values: values[name], context: context?.[name] });
      if (Object.keys(settings || {}).filter(key => settings[key] !== undefined).length === 0) {
        return {};
      }
      return { [name]: settings };
    },
    getValidationShape({ initInfo, existingValidationShape, context }) {
      const validationShape = getValidationShape({
        initInfo,
        existingValidationShape: {},
        context: context?.[name],
      });
      return { ...existingValidationShape, [name]: object().shape(validationShape) };
    },
    Component: (props) => {
      const { namePrefix = "" } = props;
      if (label) {
        return (
          <View>
            <LabeledValue label={label} />
            <Well alignSelf="flex-start" direction="column" marginTop="0">
              <Component {...props} namePrefix={`${namePrefix}${name}.`} />
            </Well>
          </View>
        )
      } else {
        return <Component {...props} namePrefix={`${namePrefix}${name}.`} />;
      }
    },
  };
  parts.Component.propTypes = {
    namePrefix: PropTypes.string,
  };

  return parts;
}
