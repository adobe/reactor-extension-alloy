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
import {
  ActionButton,
  LabeledValue,
  Text,
  TextArea,
  View,
} from "@adobe/react-spectrum";
import CodeIcon from "@spectrum-icons/workflow/Code";
import FieldDescriptionAndError from "./fieldDescriptionAndError";
import "./codePreview.styl";
import BetaBadge from "./betaBadge";

const CodePreview = ({
  "data-test-id": dataTestId,
  "aria-label": ariaLabel,
  label,
  buttonLabel,
  value,
  description,
  error,
  onPress,
  beta,
}) => {
  return (
    // To get this element to shrink to its contents, we had to use
    // alignSelf="flex-start" because this is currently a child of
    // a flex container (flex items are stretched by default).
    // Also, we use a labeledValue element instead of putting the
    // label on the textarea because there is a bug in react-spectrum
    // textarea sizing when there is a label on it.
    <View position="relative" alignSelf="flex-start">
      <LabeledValue label={label} aria-label={ariaLabel} />
      {beta && <BetaBadge />}
      <FieldDescriptionAndError description={description} error={error}>
        <TextArea
          width="size-5000"
          aria-label={label || ariaLabel}
          height="size-1600"
          value={value}
          isDisabled
          UNSAFE_className="CodePreview-textArea"
        />
      </FieldDescriptionAndError>
      <ActionButton
        data-test-id={dataTestId}
        onPress={onPress}
        UNSAFE_className="CodePreview-openEditorButton"
      >
        <CodeIcon />
        <Text>{buttonLabel}</Text>
      </ActionButton>
    </View>
  );
};

CodePreview.propTypes = {
  "data-test-id": PropTypes.string,
  "aria-label": PropTypes.string,
  label: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  description: PropTypes.node,
  error: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  beta: PropTypes.bool,
};

export default CodePreview;
