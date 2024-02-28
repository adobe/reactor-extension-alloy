/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import singleDataElementRegex from "../../../../constants/singleDataElementRegex";
import { WHOLE } from "../../constants/populationStrategy";

const checkKeyUniqueness = array => {
  const valuesAlreadySeen = {};

  for (let i = 0; i < array.length; i += 1) {
    const value = array[i];

    if (valuesAlreadySeen[value]) {
      return [false, value, i];
    }

    valuesAlreadySeen[value] = true;
  }

  return [true, null, null];
};

export default ({ formStateNode }) => {
  const { raw, items, populationStrategy } = formStateNode;

  if (populationStrategy === WHOLE) {
    if (raw !== "" && !singleDataElementRegex.test(raw)) {
      try {
        JSON.parse(raw);
      } catch ({ message = "" }) {
        return {
          raw: `Please enter a valid JSON or a data element. ${
            message ? ` ${message}.` : ""
          }`
        };
      }
    }

    return undefined;
  }

  const errors = { items: [] };

  items.reduce((e, { key, value }, index) => {
    if (!key && value) {
      e[index] = { key: "Please provide a key name." };
    }

    return e;
  }, errors.items);

  if (items.length > 1) {
    const [result, duplicatedValue, duplicatedIndex] = checkKeyUniqueness(
      items.map(({ key }) => key)
    );

    if (result === false) {
      errors.items[duplicatedIndex] = {
        key: `The key "${duplicatedValue}" is already present.`
      };
    }
  }

  if (Object.keys(errors.items).length > 0) {
    return errors;
  }

  return undefined;
};
