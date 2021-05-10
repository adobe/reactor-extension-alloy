/*
Copyright 2021 Adobe. All rights reserved.
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
import { useFormContext } from "react-hook-form";
import Data from "@spectrum-icons/workflow/Data";
import { Button } from "@adobe/react-spectrum";
import "./dataElementSelector.styl";

const DataElementSelector = ({ children, name, augmentValue }) => {
  // We have to vertically nudge down the data element selector
  // button if the field has a label so the button aligns
  // with the input box.
  let adjustForLabel = false;
  React.Children.forEach(children, child => {
    if (Object.keys(child.props).includes("label")) {
      adjustForLabel = true;
    }
  });
  const { getValues, setValue } = useFormContext();
  const openDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector().then(dataElement => {
      const value = getValues(name);
      // Maybe field value is an integer of 0 or something else falsy? That's
      // why we check for undefined instead of a plain falsy check.
      const previousValue = value === undefined ? "" : value;
      const newValue = augmentValue
        ? `${previousValue}${dataElement}`
        : dataElement;
      setValue(name, newValue, {
        shouldValidate: true,
        shouldDirty: true
      });
    });
  };
  return (
    <div className="u-flex">
      <div>{children}</div>
      <Button
        variant="secondary"
        isQuiet
        onPress={openDataElementSelector}
        aria-label="Select data element"
        UNSAFE_className={
          adjustForLabel ? "DataElementSelector-buttonAdjustedForLabel" : ""
        }
        minWidth={0}
      >
        <Data />
      </Button>
    </div>
  );
};

DataElementSelector.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  augmentValue: PropTypes.bool
};

export default DataElementSelector;
