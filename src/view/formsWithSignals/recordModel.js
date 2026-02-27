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
import arrayModel from "./arrayModel";
import complexModel from "./complexModel";
import stringModel from "./stringModel";
import withOptions from "./options";
import {
  AT_LEAST_ONE_REQUIRED,
  UNIQUE_KEY_REQUIRED,
  VALID,
} from "./errorCodes";

const isDuplicateKey = (keyValuePairsModel, keyModel) => {
  const trimmedKey = keyModel.signals.value.trim();
  return keyValuePairsModel.signals.items.value.find((item) => {
    const currentKeyModel = item.models.key;
    return (
      currentKeyModel !== keyModel &&
      currentKeyModel.signals.value.trim() === trimmedKey
    );
  });
};

const recordModel = (
  createValueModel,
  { atLeastOneErrorMessage = "", uniqueKeyErrorMessage = "" } = {},
) => {
  let keyValuePairsModel;
  const createItemModel = () => {
    const keyModel = stringModel("", {
      validate: (value) => {
        const trimmedValue = value.trim();
        if (
          atLeastOneErrorMessage &&
          trimmedValue === "" &&
          keyValuePairsModel.signals.items.value.filter(
            (item) => item.models.key.signals.value.trim() === "",
          ).length === 0
        ) {
          return AT_LEAST_ONE_REQUIRED;
        }
        if (
          uniqueKeyErrorMessage &&
          trimmedValue !== "" &&
          isDuplicateKey(keyValuePairsModel, this)
        ) {
          return UNIQUE_KEY_REQUIRED;
        }
        return VALID;
      },
    });
    const valueModel = createValueModel();
    const keyValueModel = complexModel(
      {
        key: keyModel,
        value: valueModel,
      },
      {
        transformValues: (values) => {
          if (values.key.trim() !== "") {
            return { [values.key.trim()]: values.value };
          }
          return undefined;
        },
      },
    );
    return keyValueModel;
  };

  keyValuePairsModel = arrayModel(createItemModel, {
    transformSettings: (settings) => {
      return Object.keys(settings).map((key) => {
        return {
          key,
          value: settings[key],
        };
      });
    },
    transformValues: (values) => {
      return values.reduce((acc, value) => {
        if (value) {
          return {
            ...acc,
            ...value,
          };
        }
        return acc;
      }, {});
    },
  });

  return Object.freeze({
    ...keyValuePairsModel,
    type: "RecordModel",
  });
};

export default withOptions(recordModel);
