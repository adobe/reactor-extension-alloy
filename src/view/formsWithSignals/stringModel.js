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
import simpleModel from "./simpleModel";
import anyDataElementRegex from "../constants/anyDataElementRegex";
import {
  REQUIRED,
  REGEX_FAILED,
  NO_DATA_ELEMENTS_ALLOWED,
  VALID,
} from "./errorCodes";

const stringModel = (
  defaultValue,
  { required = false, allowDataElements = true, regex } = {},
) => {
  const validate = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      if (required) {
        return REQUIRED;
      }
    } else {
      if (regex && !regex.test(trimmedValue)) {
        return REGEX_FAILED;
      }
      if (!allowDataElements && anyDataElementRegex.test(trimmedValue)) {
        return NO_DATA_ELEMENTS_ALLOWED;
      }
    }
    return VALID;
  };

  const model = simpleModel(defaultValue, {
    validate,
    transformValues: (value) => value.trim(),
  });
  return Object.freeze({
    ...model,
    type: "StringModel",
    required,
    allowDataElements,
  });
};

export default stringModel;
