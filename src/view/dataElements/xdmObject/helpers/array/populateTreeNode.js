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
  const { value, items, populationStrategy } = formStateNode;

  const populationTally = {
    numChildren: 0,
    numPopulatedChildren: 0
  };

  if (items && items.length) {
    treeNode.children = items.map((itemFormStateNode, index) => {
      const childNode = getTreeNode({
        formStateNode: itemFormStateNode,
        treeNodeComponent,
        displayName: `Item ${index + 1}`,
        isAncestorUsingWholePopulationStrategy:
          isAncestorUsingWholePopulationStrategy ||
          populationStrategy === WHOLE,
        doesHighestAncestorWithWholePopulationStrategyHaveAValue:
          (isAncestorUsingWholePopulationStrategy &&
            doesHighestAncestorWithWholePopulationStrategyHaveAValue) ||
          (isCurrentNodeTheHighestNodeUsingWholePopulationStrategy &&
            isFormStateValuePopulated(value)),
        notifyParentOfTouched: confirmTouchedAtCurrentOrDescendantNode,
        errors: errors && errors.items ? errors.items[index] : undefined,
        touched: touched && touched.items ? touched.items[index] : undefined
      });

      populationTally.numChildren += 1;

      if (
        childNode.populationAmount === PARTIAL ||
        childNode.populationAmount === FULL
      ) {
        populationTally.numPopulatedChildren += 1;
      }

      return childNode;
    });
  }

  treeNode.populationAmount = computePopulationAmount({
    formStateNode,
    isAncestorUsingWholePopulationStrategy,
    doesHighestAncestorWithWholePopulationStrategyHaveAValue,
    populationTally
  });
};
