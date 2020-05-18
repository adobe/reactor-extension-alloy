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

import isFormStateValuePopulated from "../isFormStateValuePopulated";
import { WHOLE } from "../../constants/populationStrategy";
import { FULL, PARTIAL } from "../../constants/populationAmount";
import computePopulationAmount from "../computePopulationAmount";

export default ({
  treeNode,
  formStateNode,
  treeNodeComponent,
  isAncestorUsingWholePopulationStrategy,
  isCurrentNodeTheHighestNodeUsingWholePopulationStrategy,
  doesHighestAncestorWithWholePopulationStrategyHaveAValue,
  confirmTouchedAtCurrentOrDescendantNode,
  errors,
  touched,
  getTreeNode
}) => {
  const { value, properties, populationStrategy } = formStateNode;

  if (properties) {
    const propertyNames = Object.keys(properties);
    if (propertyNames.length) {
      treeNode.children = propertyNames.sort().map(propertyName => {
        const propertyFormStateNode = properties[propertyName];
        const childNode = getTreeNode({
          formStateNode: propertyFormStateNode,
          treeNodeComponent,
          displayName: propertyName,
          isAncestorUsingWholePopulationStrategy:
            isAncestorUsingWholePopulationStrategy ||
            populationStrategy === WHOLE,
          doesHighestAncestorWithWholePopulationStrategyHaveAValue:
            (isAncestorUsingWholePopulationStrategy &&
              doesHighestAncestorWithWholePopulationStrategyHaveAValue) ||
            (isCurrentNodeTheHighestNodeUsingWholePopulationStrategy &&
              isFormStateValuePopulated(value)),
          notifyParentOfTouched: confirmTouchedAtCurrentOrDescendantNode,
          errors:
            errors && errors.properties
              ? errors.properties[propertyName]
              : undefined,
          touched:
            touched && touched.properties
              ? touched.properties[propertyName]
              : undefined
        });
        return childNode;
      });
    }
  }

  treeNode.populationAmount = computePopulationAmount({
    formStateNode,
    isAncestorUsingWholePopulationStrategy,
    doesHighestAncestorWithWholePopulationStrategyHaveAValue,
    childrenTreeNodes: treeNode.children
  });
};
