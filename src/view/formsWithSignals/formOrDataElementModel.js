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
import { computed } from "@preact/signals";
import simpleModel from "./simpleModel";
import complexModel from "./complexModel";
import { wrapModel, withOptions } from "./options";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { ONLY_ONE_DATA_ELEMENT, REQUIRED, VALID } from "./errorCodes";

const FORM = "form";
const DATA_ELEMENT = "dataElement";

export default withOptions((formModel, { required = false } = {}) => {
  const validateDataElement = (value) => {
    if (required && value === "") {
      return REQUIRED;
    }
    if (!singleDataElementRegex.test(value)) {
      return ONLY_ONE_DATA_ELEMENT;
    }
    return VALID;
  };

  const optionModel = simpleModel(FORM);
  const dataElementVisible = computed(
    () => optionModel.value.value === DATA_ELEMENT,
  );
  const formVisible = computed(() => optionModel.value.value === FORM);
  const dataElementModel = simpleModel("", {
    validate: validateDataElement,
    visible: dataElementVisible,
  });
  const wrappedModel = wrapModel(formModel, { visible: formVisible });
  const model = complexModel(
    {
      option: optionModel,
      dataElement: dataElementModel,
      form: wrappedModel,
    },
    {
      transformValues: (values) => {
        if (values.option === FORM) {
          return values.form;
        }
        return values.dataElement;
      },
      transformSettings: (settings) => {
        if (
          typeof settings === "string" &&
          singleDataElementRegex.test(settings)
        ) {
          return {
            option: DATA_ELEMENT,
            dataElement: settings,
            form: undefined,
          };
        }
        return { option: FORM, dataElement: "", form: settings };
      },
    },
  );
  return Object.freeze({
    ...model,
    type: "FormOrDataElementModel",
    required,
  });
});
