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

import React, { createRef } from "react";
import PropTypes from "prop-types";
import {
  RadioGroup as ReactSpectrumRadioGroup,
  Radio as ReactSpectrumRadio,
  TextField as ReactTextField
} from "@adobe/react-spectrum";
import { useField } from "formik";
import { string } from "yup";
import FieldDescriptionAndError from "../fieldDescriptionAndError";
import RawDataElementSelector from "../rawDataElementSelector";
import singleDataElementRegex from "../../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../../constants/validationErrorMessages";

export const createRadioGroupWithDataElementValidationSchema = name => {
  return string().when([`${name}DataElement`], {
    is: ({ isDataElement } = {}) => isDataElement,
    then: string()
      .required(DATA_ELEMENT_REQUIRED)
      .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
  });
};

const RadioGroupWithDataElement = ({
  name,
  children,
  description,
  dataElementDescription,
  width,
  dataTestIdPrefix = name,
  ...otherProps
}) => {
  const options = React.Children.map(children, child => {
    const { value } = child.props;
    return value;
  });
  const [{ value }, { error }, { setValue, setTouched }] = useField(name);
  const [
    { value: dataElementValue },
    { touched: dataElementTouched },
    { setValue: dataElementSetValue, setTouched: dataElementSetTouched }
  ] = useField(`${name}DataElement`);

  const radioGroupRef = createRef();

  const radioOnBlur = event => {
    // If the target that will receive focus is not a child of the
    // radio group, we know the radio group has lost focus.
    if (
      !radioGroupRef.current.UNSAFE_getDOMNode().contains(event.relatedTarget)
    ) {
      setTouched(true);
    }
  };

  // Not entirely sure this is the right approach, but there's
  // no onBlur prop for RadioGroup, so we wire up React Hook Form's
  // onBlur to every radio.
  const childrenWithOnBlur = React.Children.map(children, child => {
    return React.cloneElement(child, {
      onBlur: radioOnBlur
    });
  });

  let radioValue;
  let dataElementText;
  if (
    (dataElementValue === undefined &&
      options.some(option => option === value)) ||
    (dataElementValue !== undefined && !dataElementValue.isDataElement)
  ) {
    radioValue = value;
    dataElementText = "";
  } else {
    radioValue = "dataElement";
    dataElementText = value;
  }

  const setValues = (newRadioValue, newDataElement) => {
    // set the dataElement value first because the main field validation uses it
    dataElementSetValue(
      {
        isDataElement: newRadioValue === "dataElement",
        dataElement: newDataElement
      },
      false
    );
    setValue(newRadioValue === "dataElement" ? newDataElement : newRadioValue);
  };

  return (
    <FieldDescriptionAndError description={description} width={width}>
      <ReactSpectrumRadioGroup
        {...otherProps}
        ref={radioGroupRef}
        value={radioValue}
        onChange={newValue => {
          setValues(newValue, dataElementText);
        }}
        width={width}
      >
        {childrenWithOnBlur}
        <ReactSpectrumRadio
          data-test-id={`${dataTestIdPrefix}DataElementRadio`}
          value="dataElement"
          onBlur={radioOnBlur}
        >
          Use a data element
        </ReactSpectrumRadio>
      </ReactSpectrumRadioGroup>
      {radioValue === "dataElement" && (
        <RawDataElementSelector
          onChange={newValue => {
            setValues("dataElement", newValue);
            dataElementSetTouched(true);
          }}
        >
          <FieldDescriptionAndError
            description={dataElementDescription}
            error={dataElementTouched && error ? error : undefined}
            width={width}
          >
            <ReactTextField
              aria-label="Data Element"
              value={dataElementText}
              data-test-id={`${dataTestIdPrefix}DataElementField`}
              onChange={newValue => setValues("dataElement", newValue)}
              onBlur={() => dataElementSetTouched(true)}
              validationState={
                dataElementTouched && error ? "invalid" : undefined
              }
              width={width}
            />
          </FieldDescriptionAndError>
        </RawDataElementSelector>
      )}
    </FieldDescriptionAndError>
  );
};

RadioGroupWithDataElement.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  dataElementDescription: PropTypes.string,
  width: PropTypes.string,
  dataTestIdPrefix: PropTypes.string
};

export default RadioGroupWithDataElement;
