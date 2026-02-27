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
import { VALID, ONLY_ONE_DATA_ELEMENT, REQUIRED } from "./errorCodes";

const dataElementModel = (defaultValue, { required = false } = {}) => {
  const validate = (value) => {
    const trimmedValue = value.trim();
    if (required && trimmedValue === "") {
      return REQUIRED;
    }
    if (trimmedValue !== "" && !singleDataElementRegex.test(trimmedValue)) {
      return ONLY_ONE_DATA_ELEMENT;
    }
    return VALID;
  };

  const model = simpleModel(defaultValue, {
    validate,
    transformValues: (value) => value.trim(),
  });
  return Object.freeze({
    ...model,
    type: "DataElementModel",
    required,
  });
};

export default withOptions(dataElementModel);
