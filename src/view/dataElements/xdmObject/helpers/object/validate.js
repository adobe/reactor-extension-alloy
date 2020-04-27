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

import { WHOLE } from "../../constants/populationStrategy";
import isWholeValuePopulated from "../isWholeValuePopulated";
import singleDataElementRegex from "../../../../constants/singleDataElementRegex";

export default ({
  formStateNode,
  confirmDataPopulatedAtCurrentOrDescendantNode,
  validate
}) => {
  const { populationStrategy, wholeValue, properties } = formStateNode;

  if (populationStrategy === WHOLE) {
    if (isWholeValuePopulated(wholeValue)) {
      if (!singleDataElementRegex.test(wholeValue)) {
        return { wholeValue: "Value must be a data element." };
      }
      confirmDataPopulatedAtCurrentOrDescendantNode();
    }

    return undefined;
  }

  if (properties) {
    const propertyNames = Object.keys(properties);
    const propertyErrors = propertyNames.reduce((memo, propertyName) => {
      const propertyFormStateNode = properties[propertyName];
      const error = validate({
        formStateNode: propertyFormStateNode,
        isParentAnArray: false,
        notifyParentOfDataPopulation: confirmDataPopulatedAtCurrentOrDescendantNode
      });

      if (error) {
        memo[propertyName] = error;
      }
      return memo;
    }, {});

    if (Object.keys(propertyErrors).length) {
      return { properties: propertyErrors };
    }
  }

  return undefined;
};
