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
