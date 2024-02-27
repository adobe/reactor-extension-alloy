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

export default ({ formStateNode }) => {
  const { raw, items, populationStrategy } = formStateNode;

  if (populationStrategy === WHOLE) {
    if (raw !== "" && !singleDataElementRegex.test(raw)) {
      try {
        JSON.parse(raw);
      } catch {
        return { raw: "Please enter a valid JSON or a data element." };
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

  if (Object.keys(errors.items).length > 0) {
    return errors;
  }

  return undefined;
};
