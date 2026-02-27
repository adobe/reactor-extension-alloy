/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import singleDataElementRegex from "../constants/singleDataElementRegex";
import simpleModel from "./simpleModel";
import { withOptions } from "./options";

const enumModel = (
  defaultValue,
  {
    options = [],
    allowCustomValue = false,
    allowDataElement = false,
    required = false,
  } = {},
) => {
  const errorMessage = (() => {
    if (allowDataElement && allowCustomValue) {
      return "Please select an option, provide a data element or enter a custom value.";
    }
    if (allowCustomValue) {
      return "Please select an option or enter a custom value.";
    }
    if (allowDataElement) {
      return "Please select an option or provide a data element.";
    }
    return "Please select an option.";
  })();

  const validate = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      if (!required) {
        return "";
      }
      return errorMessage;
    }
    if (allowCustomValue) {
      return "";
    }
    if (allowDataElement && singleDataElementRegex.test(trimmedValue)) {
      return "";
    }
    if (options.find((option) => option.value === trimmedValue)) {
      return "";
    }
    return errorMessage;
  };

  const model = simpleModel(defaultValue, {
    validate,
    transformValues: (value) => value.trim(),
  });
  return Object.freeze({
    ...model,
    type: "EnumModel",
    options: Object.freeze(options),
    allowCustomValue,
    allowDataElement,
    required,
  });
};

export default withOptions(enumModel);
