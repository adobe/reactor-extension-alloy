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
import isFormStateValuePopulated from "../isFormStateValuePopulated";

export default ({ formStateNode, getValueFromFormState }) => {
  const { populationStrategy, value, properties } = formStateNode;

  if (populationStrategy === WHOLE) {
    return isFormStateValuePopulated(value) ? value : undefined;
  }

  if (!properties) {
    return undefined;
  }

  const computedValue = Object.keys(properties).reduce((memo, propertyName) => {
    const propertyFormStateNode = properties[propertyName];
    const propertyValue = getValueFromFormState({
      formStateNode: propertyFormStateNode
    });
    if (propertyValue !== undefined) {
      memo[propertyName] = propertyValue;
    }
    return memo;
  }, {});

  return Object.keys(computedValue).length ? computedValue : undefined;
};
