/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useState } from "react";
import PropTypes from "prop-types";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";

const OptionsWithDataElement = ({ options, value, onChange }) => {
  const valueIsString = !!(value && typeof value === "string");
  const [dataElementChecked, setDataElementChecked] = useState(valueIsString);
  const [dataElementValue, setDataElementValue] = useState(
    valueIsString ? value : ""
  );

  return (
    <div>
      <RadioGroup
        className="u-flexColumn"
        checkedValue={dataElementChecked ? "__dataElement__" : value}
        onChange={newValue => {
          if (newValue === "__dataElement__") {
            setDataElementChecked(true);
            onChange(dataElementValue);
          } else {
            setDataElementChecked(false);
            onChange(newValue);
          }
        }}
      >
        {options.map(
          (
            { value: optionValue, label: optionLabel, testId: optionTestId },
            index
          ) => (
            <Radio
              key={index}
              data-test-id={optionTestId}
              value={optionValue}
              label={optionLabel}
            />
          )
        )}
        <Radio value="__dataElement__" label="Provided by data element" />
      </RadioGroup>

      {dataElementChecked && (
        <Textfield
          className="u-fieldLong"
          onChange={newValue => {
            setDataElementValue(newValue);
            onChange(newValue);
          }}
        />
      )}
    </div>
  );
};

OptionsWithDataElement.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default OptionsWithDataElement;
