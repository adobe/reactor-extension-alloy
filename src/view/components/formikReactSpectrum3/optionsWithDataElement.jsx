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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { RadioGroup, Radio, TextField } from "@adobe/react-spectrum";
import { useField } from "formik";
import FieldDescriptionAndError from "../fieldDescriptionAndError";

const OptionsWithDataElement = ({ name, description, width, "data-test-id": dataTestId, ...otherProps }) => {
  const [{ value }, { error }, { setValue, setTouched }] = useField(name);

  let radioValue;
  let defaultDataElementValue = "";
  if (value === true) {
    radioValue = "yes";
  } else if (value === false) {
    radioValue = "no";
  } else {
    radioValue = "dataElement"
    defaultDataElementValue = value
  }

  const [dataElementValue, setDataElementValue] = useState(defaultDataElementValue);

  return (
    <FieldDescriptionAndError
      description={description}
      error={error}
      width={width}
    >
      <RadioGroup
        {...otherProps}
        value={radioValue}
        onChange={value => {
          if (value === "yes") {
            setValue(true);
          } else if (value === "no") {
            setValue(false);
          } else if (value === "dataElement") {
            setValue(dataElementValue)
          }
        }}
        validationState={error ? "invalid" : ""}
        width={width}
      >
        <Radio
          data-test-id={`${dataTestId}YesRadio`}
          value="yes"
          key="yes"
          onBlur={() => {
            setTouched(true)
          }}
        >
          Yes
        </Radio>
        <Radio
          data-test-id={`${dataTestId}NoRadio`}
          value="no"
          key="no"
          onBlur={() => {
            setTouched(true)
          }}
        >
          No
        </Radio>
        <Radio
          data-test-id={`${dataTestId}DataElementRadio`}
          value="dataElement"
          key="dataElement"
          onBlur={() => {
            setTouched(true);
          }}
        >
          Provided by data element
        </Radio>
      </RadioGroup>
      <TextField
        data-test-id={`${dataTestId}DataElementField`}
        width="size-5000"
        value={dataElementValue}
        onChange={newValue => {
          setDataElementValue(newValue);
          setValue(newValue);
        }}
        onBlur={() => {
          setTouched(true);
        }}
      />
    </FieldDescriptionAndError>
  );
};

OptionsWithDataElement.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  width: PropTypes.string
};

export default OptionsWithDataElement;
