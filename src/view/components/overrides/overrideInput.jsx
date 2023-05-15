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
import { Content, ContextualHelp, Heading, Text } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import React from "react";
import DataElementSelector from "../dataElementSelector";
import FormikComboBox from "../formikReactSpectrum3/formikComboBox";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import { capitialize } from "./utils";

/**
 *
 * @param {Object} params
 * @param {string} params.overrideType The type of value that is being overridden.
 * @param {string | string[]} params.primaryItem The value or values that are
 * being overridden by this field.
 * @returns {React.Element}
 */
const PrimaryValuePopup = ({ overrideType, primaryItem }) => {
  if (
    !primaryItem ||
    (Array.isArray(primaryItem) && primaryItem.length === 0)
  ) {
    return null;
  }
  return (
    <ContextualHelp variant="info">
      <Heading>{capitialize(overrideType)} being overridden:</Heading>
      <Content>
        <Text>
          {Array.isArray(primaryItem) ? (
            <ul>
              {primaryItem.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            primaryItem
          )}
        </Text>
      </Content>
    </ContextualHelp>
  );
};

PrimaryValuePopup.propTypes = {
  overrideType: PropTypes.string.isRequired,
  primaryItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

/**
 * The OverrideInput component is a wrapper around either a FormikComboBox or
 * FormikTextField. It is used to allow the user to override a value that is
 * being set in the rule. The component will display a popup that shows the
 * value that is being overridden.
 *
 * @param {Object} options
 * @param {boolean} options.useManualEntry If true, the component will be a text
 * field. If false, the component will be a combo box.
 * @param {string | string[]} options.primaryItems The value or values that are
 * being overridden by this field
 * @param {string} options.overrideType The type of value that is being overridden
 * @param {Function} options.children A function that returns a React element
 * representing each option in the combo box.
 * @returns {React.Element}
 */
const OverrideInput = ({
  useManualEntry,
  primaryItem,
  overrideType,
  children,
  ...otherProps
}) => {
  if (useManualEntry) {
    return (
      <DataElementSelector>
        <FormikTextField
          {...otherProps}
          contextualHelp={
            <PrimaryValuePopup
              primaryItem={primaryItem}
              overrideType={overrideType}
            />
          }
        />
      </DataElementSelector>
    );
  }
  return (
    <DataElementSelector>
      <FormikComboBox
        {...otherProps}
        contextualHelp={
          <PrimaryValuePopup
            primaryItem={primaryItem}
            overrideType={overrideType}
          />
        }
      >
        {children}
      </FormikComboBox>
    </DataElementSelector>
  );
};

OverrideInput.propTypes = {
  useManualEntry: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
  ...PrimaryValuePopup.propTypes
};

export default OverrideInput;
