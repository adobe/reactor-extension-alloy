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
import { ComboBox } from "@adobe/react-spectrum";
import { useField } from "formik";

/**
 * @param {Object} params
 * @param {string} params.name
 * @param {string?} params.width
 * @param {((val: string) => boolean)?} params.isValid A function that is called with
 * the value of the input and expects boolean to be returned representing the
 * validity of the input.
 * @returns {React.Element}
 */
const FormikComboBox = ({
  name,
  width,
  isValid = () => true,
  ...otherProps
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name
  );
  return (
    <ComboBox
      {...otherProps}
      inputValue={value}
      onInputChange={setValue}
      onBlur={() => {
        setTouched(true);
      }}
      validationState={
        touched && (error || !isValid(value)) ? "invalid" : undefined
      }
      width={width}
      errorMessage={error}
    />
  );
};

FormikComboBox.propTypes = {
  name: PropTypes.string.isRequired,
  isValid: PropTypes.func,
  width: PropTypes.string
};

export default FormikComboBox;
