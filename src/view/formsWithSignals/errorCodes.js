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
export const REQUIRED = "REQUIRED";
export const AT_LEAST_ONE_REQUIRED = "AT_LEAST_ONE_REQUIRED";
export const UNIQUE_KEY_REQUIRED = "UNIQUE_KEY_REQUIRED";
export const REGEX_FAILED = "REGEX_FAILED";
export const NO_DATA_ELEMENTS_ALLOWED = "NO_DATA_ELEMENTS_ALLOWED";
export const ONLY_ONE_DATA_ELEMENT = "ONLY_ONE_DATA_ELEMENT";
export const NO_CUSTOM_VALUE_ALLOWED = "NO_CUSTOM_VALUE_ALLOWED";

export const VALID = "";

const defaultErrorMessages = {
  [REQUIRED]: "This field is required.",
  [AT_LEAST_ONE_REQUIRED]: "Please enter at least one value.",
  [UNIQUE_KEY_REQUIRED]: "Duplicate keys are not allowed.|",
  [REGEX_FAILED]: "Please enter a valid value.",
  [NO_DATA_ELEMENTS_ALLOWED]: "This field does not allow data elements.",
  [ONLY_ONE_DATA_ELEMENT]: "This field does not allow multiple data elements.",
  [NO_CUSTOM_VALUE_ALLOWED]: "Please select an option from the list.",
};

export const translateErrorCode = (errorCode, errorMessages) => {
  return errorMessages[errorCode] || defaultErrorMessages[errorCode];
};
