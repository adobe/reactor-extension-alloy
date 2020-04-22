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

import { Field } from "formik";
import React, { useEffect, useState } from "react";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Select from "@react/react-spectrum/Select";
import Textfield from "@react/react-spectrum/Textfield";
import PropTypes from "prop-types";
import WrappedField from "../../../components/wrappedField";

const CONSTANT = "constant";
const DATA_ELEMENT = "dataElement";

// The Select component requires options whose values are strings.
const booleanOptions = [
  {
    label: "No Value",
    value: ""
  },
  {
    label: "True",
    value: "true"
  },
  {
    label: "False",
    value: "false"
  }
];

const convertActualValueToBooleanOptionValue = value => {
  if (value === true) {
    return "true";
  }

  if (value === false) {
    return "false";
  }

  return "";
};

const convertBooleanOptionValueToActualValue = booleanOptionValue => {
  if (booleanOptionValue === "true") {
    return true;
  }

  if (booleanOptionValue === "false") {
    return false;
  }

  return "";
};

const BooleanInput = props => {
  const { value, onChange, fieldName } = props;

  // Notice that the input method (constant or data element) is stored as
  // local state rather than Formik state and the `wholeValue` stored in
  // Formik state is not partitioned between which input method is being used.
  // This reduces the complexity of the Formik state, but does complicate this
  // component a little more. Without adding more state management in this
  // component, it also means that when users switch input methods, the field's
  // value gets reset each time.
  const [inputMethod, setInputType] = useState();

  useEffect(() => {
    const defaultInputMethod =
      typeof value === "boolean" ? CONSTANT : DATA_ELEMENT;
    setInputType(defaultInputMethod);
  }, [fieldName]);

  return (
    <div>
      <FieldLabel labelFor="inputMethodField" label="Input Method" />
      <RadioGroup
        id="inputMethodField"
        selectedValue={inputMethod}
        onChange={newInputMethod => {
          onChange("");
          setInputType(newInputMethod);
        }}
      >
        <Radio label="Data Element" value={DATA_ELEMENT} />
        <Radio className="u-gapLeft2x" label="Constant" value={CONSTANT} />
      </RadioGroup>
      {inputMethod === CONSTANT ? (
        <div>
          <FieldLabel labelFor="wholeValueField" label="Value" />
          <Select
            id="wholeValueField"
            value={convertActualValueToBooleanOptionValue(value)}
            options={booleanOptions}
            onChange={newValue => {
              onChange(convertBooleanOptionValueToActualValue(newValue));
            }}
          />
        </div>
      ) : (
        <div>
          <FieldLabel labelFor="wholeValueField" label="Value" />
          <WrappedField
            data-test-id="wholeValueField"
            id="wholeValueField"
            name={fieldName}
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement="replace"
          />
        </div>
      )}
    </div>
  );
};

BooleanInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
  fieldName: PropTypes.string
};

/**
 * The form for editing a boolean field.
 */
const BooleanEdit = props => {
  const { fieldName } = props;
  const wholeValueFieldName = `${fieldName}.wholeValue`;
  return (
    <Field
      name={wholeValueFieldName}
      render={({ field, form }) => {
        return (
          <BooleanInput
            fieldName={wholeValueFieldName}
            value={field.value}
            onChange={newValue => {
              form.setFieldValue(wholeValueFieldName, newValue);
            }}
          />
        );
      }}
    />
  );
};

BooleanEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default BooleanEdit;
