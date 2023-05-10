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

/**
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
  const primaryText = Array.isArray(primaryItem)
    ? primaryItem.join(", ")
    : primaryItem;
  if (useManualEntry) {
    return (
      <DataElementSelector>
        <FormikTextField
          {...otherProps}
          contextualHelp={
            primaryText !== "" && (
              <ContextualHelp variant="info">
                <Heading>Overrides {overrideType}</Heading>
                <Content>
                  <Text>{primaryText}</Text>
                </Content>
              </ContextualHelp>
            )
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
          primaryText !== "" && (
            <ContextualHelp variant="info">
              <Heading>Overrides {overrideType}</Heading>
              <Content>
                <Text>{primaryText}</Text>
              </Content>
            </ContextualHelp>
          )
        }
      >
        {children}
      </FormikComboBox>
    </DataElementSelector>
  );
};

OverrideInput.propTypes = {
  useManualEntry: PropTypes.bool.isRequired,
  primaryItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  overrideType: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default OverrideInput;
