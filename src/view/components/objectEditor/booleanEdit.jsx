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

import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import FormElementContainer from "../formElementContainer";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import FormikRadioGroup from "../formikReactSpectrum3/formikRadioGroup";
import DataElementSelector from "../dataElementSelector";

const inputMethods = {
  CONSTANT: "constant",
  DATA_ELEMENT: "dataElement"
};

/**
 * The form for editing a boolean field.
 */
const BooleanEdit = props => {
  const { fieldName } = props;
  const valueFieldName = `${fieldName}.value`;
  const [{ value }, , { setValue }] = useField(valueFieldName);

  // Notice that the input method (data element or constant) is stored as
  // local state rather than Formik state and the `value` stored in
  // Formik state is not partitioned between which input method is being used.
  // This reduces the complexity of the Formik state, but does complicate this
  // component a little more. Without adding more state management in this
  // component, it also means that when users switch input methods, the field's
  // value gets reset each time.
  const [inputMethod, setInputMethod] = useState("");

  useEffect(() => {
    const defaultInputMethod =
      typeof value === "boolean"
        ? inputMethods.CONSTANT
        : inputMethods.DATA_ELEMENT;
    setInputMethod(defaultInputMethod);
  }, [fieldName]);

  return (
    <FormElementContainer>
      <RadioGroup
        label="Input method"
        orientation="horizontal"
        value={inputMethod}
        onChange={newInputMethod => {
          setValue("");
          setInputMethod(newInputMethod);
        }}
      >
        <Radio
          data-test-id="dataElementInputMethodField"
          value={inputMethods.DATA_ELEMENT}
        >
          Provide data element
        </Radio>
        <Radio
          data-test-id="valueInputMethodField"
          value={inputMethods.CONSTANT}
        >
          Select value
        </Radio>
      </RadioGroup>
      {inputMethod === inputMethods.CONSTANT ? (
        <FormikRadioGroup
          label="Value"
          name={valueFieldName}
          orientation="horizontal"
        >
          <Radio data-test-id="constantNoValueField" value="">
            No value
          </Radio>
          <Radio data-test-id="constantTrueField" value>
            True
          </Radio>
          <Radio data-test-id="constantFalseField" value={false}>
            False
          </Radio>
        </FormikRadioGroup>
      ) : (
        <DataElementSelector>
          <FormikTextField
            data-test-id="dataElementValueField"
            label="Value"
            name={valueFieldName}
            width="size-5000"
          />
        </DataElementSelector>
      )}
    </FormElementContainer>
  );
};

BooleanEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default BooleanEdit;
