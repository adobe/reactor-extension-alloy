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
import { Picker, Item } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import React from "react";
import DataElementSelector from "../dataElementSelector";
import FormikComboBox from "../formikReactSpectrum3/formikComboBox";
import FormikPicker from "../formikReactSpectrum3/formikPicker";
import FormikTextField from "../formikReactSpectrum3/formikTextField";

/**
 * The OverrideInput component is a wrapper around either a FormikComboBox or
 * FormikTextField. It is used to allow the user to override a value that is
 * being set in the rule. The component will display a popup that shows the
 * value that is being overridden.
 *
 * @param {Object} options
 * @param {boolean} options.useManualEntry If true, the component will be a text
 * field. If false, the component will be a combo box.
 * @param {Function} options.children A function that returns a React element
 * representing each option in the combo box.
 * @param {boolean} options.allowsCustomValue If true, the combo box will allow
 * the user to enter a custom value. If false, the combo box will only allow the
 * user to select from the options provided.
 * @returns {React.Element}
 */
const OverrideInput = ({
  useManualEntry,
  children,
  isDisabled,
  allowsCustomValue = false,
  ...otherProps
}) => {
  if (isDisabled) {
    return (
      <Picker selectedKey="Disabled" isDisabled {...otherProps}>
        <Item key="Disabled">Disabled</Item>
      </Picker>
    );
  }
  if (useManualEntry) {
    return (
      <DataElementSelector>
        <FormikTextField {...otherProps} />
      </DataElementSelector>
    );
  }
  if (!allowsCustomValue) {
    return <FormikPicker {...otherProps}>{children}</FormikPicker>;
  }
  return (
    <DataElementSelector>
      <FormikComboBox allowsCustomValue={allowsCustomValue} {...otherProps}>
        {children}
      </FormikComboBox>
    </DataElementSelector>
  );
};

OverrideInput.propTypes = {
  useManualEntry: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  allowsCustomValue: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default OverrideInput;
