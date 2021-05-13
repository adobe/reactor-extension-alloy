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
import { ComboBox as ReactSpectrumComboBox } from "@react-spectrum/combobox";
import { useField } from "formik";
import FieldDescriptionAndError from "../fieldDescriptionAndError";

const ComboBox = ({ name, description, width, ...otherProps }) => {
  const [{ value, onBlur }, { error }, { setValue }] = useField(name);
  return (
    <FieldDescriptionAndError
      description={description}
      error={error}
      width={width}
    >
      <ReactSpectrumComboBox
        {...otherProps}
        inputValue={value}
        onInputChange={setValue}
        onBlur={onBlur}
        validationState={error ? "invalid" : ""}
        width={width}
      />
    </FieldDescriptionAndError>
  );
};

ComboBox.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  width: PropTypes.string
};

export default ComboBox;
