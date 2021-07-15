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
import Data from "@spectrum-icons/workflow/Data";
import { ActionButton, Flex } from "@adobe/react-spectrum";

const RawDataElementSelector = ({
  children,
  augmentValue,
  value,
  onChange,
  adjustForLabel
}) => {
  // We have to vertically nudge down the data element selector
  // button if the field has a label so the button aligns
  // with the input box.
  const openDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector().then(dataElement => {
      // Maybe field value is an integer of 0 or something else falsy? That's
      // why we check for undefined instead of a plain falsy check.
      const previousValue = value === undefined ? "" : value;
      const newValue = augmentValue
        ? `${previousValue}${dataElement}`
        : dataElement;
      onChange(newValue);
    });
  };
  return (
    <Flex>
      {children}
      <ActionButton
        isQuiet
        onPress={openDataElementSelector}
        aria-label="Select data element"
        marginTop={adjustForLabel ? "size-300" : 0}
        minWidth={0}
      >
        <Data />
      </ActionButton>
    </Flex>
  );
};

// You only need to specify value if augmentValue is true
RawDataElementSelector.propTypes = {
  children: PropTypes.node.isRequired,
  augmentValue: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  adjustForLabel: PropTypes.bool
};

export default RawDataElementSelector;
