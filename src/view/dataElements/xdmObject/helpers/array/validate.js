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
  const { populationStrategy, wholeValue, items } = formStateNode;

  if (populationStrategy === WHOLE) {
    if (isWholeValuePopulated(wholeValue)) {
      if (!singleDataElementRegex.test(wholeValue)) {
        return { wholeValue: "Value must be a data element." };
      }
      confirmDataPopulatedAtCurrentOrDescendantNode();
    }

    return undefined;
  }

  if (items) {
    const itemErrors = items
      .map(itemFormStateNode => {
        return validate({
          formStateNode: itemFormStateNode,
          isParentAnArray: true,
          notifyParentOfDataPopulation: confirmDataPopulatedAtCurrentOrDescendantNode
        });
      })
      .filter(error => error);
    if (itemErrors.length) {
      return { items: itemErrors };
    }
  }

  return undefined;
};
