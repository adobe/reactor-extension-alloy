/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import { useField } from "formik";
import "./codeField.styl";
import PropTypes from "prop-types";
import CodePreview from "./codePreview";

/**
 * A button that, when clicked, opens the Launch code editor
 * which allows the user to edit code. When the user
 * closes the editor, this call onChange with the updated
 * code.
 */
const CodeField = ({
  "data-test-id": dataTestId,
  label,
  buttonLabelSuffix = label,
  name,
  description,
  language,
  placeholder
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name
  );
  const onPress = async () => {
    setTouched(true);

    const options = {
      code: value || placeholder || ""
    };

    if (language) {
      options.language = language;
    }

    let updatedCode = await window.extensionBridge.openCodeEditor(options);

    // If the user never changed placeholder code, don't save the placeholder code.
    if (placeholder && updatedCode === placeholder) {
      updatedCode = "";
    }

    setValue(updatedCode);
  };

  return (
    <CodePreview
      data-test-id={dataTestId}
      value={value}
      label={label}
      buttonLabel={`${value ? "Edit" : "Provide"} ${buttonLabelSuffix}`}
      description={description}
      error={touched && error ? error : undefined}
      onPress={onPress}
    />
  );
};

CodeField.propTypes = {
  "data-test-id": PropTypes.string,
  label: PropTypes.string,
  buttonLabelSuffix: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  language: PropTypes.string,
  placeholder: PropTypes.string
};

export default CodeField;
