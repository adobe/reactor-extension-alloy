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

import { WHOLE } from "../constants/populationStrategy";
import singleDataElementRegex from "../../../constants/singleDataElementRegex";
import {
  ARRAY,
  BOOLEAN,
  INTEGER,
  NUMBER,
  OBJECT
} from "../constants/schemaType";
import isWholeValuePopulated from "./isWholeValuePopulated";
import isNumberLike from "./isNumberLike";
import isIntegerLike from "./isIntegerLike";

/**
 * Validates the user's XDM input.
 * @param {FormStateNode} formStateNode
 * @param {boolean} isParentAnArray Whether the parent node is an array type.
 * @param {Function} notifyParentOfDataPopulation A function that should be called if
 * the current node or a descendant has been populated with a value.
 * @returns {Object} An errors object in the same structure as the formStateNode,
 * but where values within the object are any error messages that should be displayed.
 */
const validate = ({
  formStateNode,
  isParentAnArray = false,
  notifyParentOfDataPopulation = () => {}
}) => {
  const {
    schema,
    populationStrategy,
    wholeValue,
    properties,
    items,
    isAutoPopulated
  } = formStateNode;

  let isPopulatedAtCurrentOrDescendantNode = false;

  const confirmDataPopulatedAtCurrentOrDescendantNode = () => {
    if (!isPopulatedAtCurrentOrDescendantNode) {
      notifyParentOfDataPopulation();
      isPopulatedAtCurrentOrDescendantNode = true;
    }
  };

  if (populationStrategy === WHOLE) {
    if (isWholeValuePopulated(wholeValue)) {
      if (
        (schema.type === OBJECT || schema.type === ARRAY) &&
        !singleDataElementRegex.test(wholeValue)
      ) {
        return { wholeValue: "Value must be a data element." };
      }

      if (
        schema.type === NUMBER &&
        !singleDataElementRegex.test(wholeValue) &&
        !isNumberLike(wholeValue)
      ) {
        return { wholeValue: "Value must be a data element or number." };
      }

      if (
        schema.type === INTEGER &&
        !singleDataElementRegex.test(wholeValue) &&
        !isIntegerLike(wholeValue)
      ) {
        return { wholeValue: "Value must be a data element or integer." };
      }

      if (
        schema.type === BOOLEAN &&
        !singleDataElementRegex.test(wholeValue) &&
        typeof wholeValue !== "boolean"
      ) {
        return { wholeValue: "Value must be a data element." };
      }

      confirmDataPopulatedAtCurrentOrDescendantNode();
    }
  } else {
    if (schema.type === OBJECT && properties) {
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

    if (schema.type === ARRAY && items) {
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
  }

  if (
    isParentAnArray &&
    !isAutoPopulated &&
    !isPopulatedAtCurrentOrDescendantNode
  ) {
    return {
      wholeValue:
        "Items within arrays must not be empty. Please populate or remove the item."
    };
  }

  if (
    schema.isRequired &&
    !isAutoPopulated &&
    !isPopulatedAtCurrentOrDescendantNode
  ) {
    return { wholeValue: "This is a required field and must be populated." };
  }

  return undefined;
};

// Avoid exposing all of validate's parameters since
// they're only used internally for recursion.
export default formStateNode => {
  return validate({ formStateNode });
};
