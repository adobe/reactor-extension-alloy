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
import { ARRAY, NUMBER, INTEGER, OBJECT } from "../constants/schemaType";
import isWholeValuePopulated from "./isWholeValuePopulated";
import singleDataElementRegex from "../../../constants/singleDataElementRegex";

/**
 * Computes and returns the user-provided value from a form state node. If the
 * value is (1) an empty string (2) an object that has no properties with defined
 * values or (3) an array that has no items, undefined will be returned.
 * The purpose is to trim down the amount of cruft in the final computed value.
 *
 * @param {FormStateNode} formStateNode
 * @returns {*}
 */
const getValueFromFormState = ({ formStateNode }) => {
  const {
    populationStrategy,
    wholeValue,
    properties,
    items,
    schema
  } = formStateNode;

  if (populationStrategy === WHOLE) {
    if (!isWholeValuePopulated(wholeValue)) {
      return undefined;
    }

    if (schema.type === NUMBER || schema.type === INTEGER) {
      if (singleDataElementRegex.test(wholeValue)) {
        return wholeValue;
      }

      return Number(wholeValue);
    }

    return wholeValue;
  }

  if (schema.type === OBJECT) {
    if (!properties) {
      return undefined;
    }

    const value = Object.keys(properties).reduce((memo, propertyName) => {
      const propertyFormStateNode = properties[propertyName];
      const propertyValue = getValueFromFormState({
        formStateNode: propertyFormStateNode
      });
      if (propertyValue !== undefined) {
        memo[propertyName] = propertyValue;
      }
      return memo;
    }, {});

    return Object.keys(value).length ? value : undefined;
  }

  if (schema.type === ARRAY) {
    if (!items) {
      return undefined;
    }

    const value = items.reduce((memo, itemFormStateNode) => {
      const itemValue = getValueFromFormState({
        formStateNode: itemFormStateNode
      });
      if (itemValue !== undefined) {
        memo.push(itemValue);
      }
      return memo;
    }, []);

    return value.length ? value : undefined;
  }

  return undefined;
};

export default getValueFromFormState;
