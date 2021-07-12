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
import { ActionButton, Text, TextArea, View } from "@adobe/react-spectrum";
import CodeIcon from "@spectrum-icons/workflow/Code";
import FieldDescriptionAndError from "./fieldDescriptionAndError";
import "./codePreview.styl";

const CodePreview = ({
  "data-test-id": dataTestId,
  label,
  buttonLabel,
  value,
  description,
  error,
  onPress
}) => {
  return (
    // To get this element to shrink to its contents, we had to use
    // alignSelf="flex-start" because this is currently a child of
    // a flex container (flex items are stretched by default).
    <View position="relative" alignSelf="flex-start">
      <FieldDescriptionAndError description={description} error={error}>
        <TextArea
          width="size-5000"
          height="size-1600"
          label={label}
          value={value}
          isDisabled
          UNSAFE_className="CodeField-textArea"
        />
      </FieldDescriptionAndError>
      <ActionButton
        data-test-id={dataTestId}
        onPress={onPress}
        UNSAFE_className="CodeField-openEditorButton"
      >
        <CodeIcon />
        <Text>{buttonLabel}</Text>
      </ActionButton>
    </View>
  );
};

CodePreview.propTypes = {
  "data-test-id": PropTypes.string,
  label: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.string,
  onPress: PropTypes.func.isRequired
};

export default CodePreview;
