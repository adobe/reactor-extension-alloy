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

export default ({
  treeNode,
  formStateNode,
  isAncestorUsingWholePopulationStrategy,
  isUsingWholePopulationStrategy,
  reportPopulationTally,
  isHighestNodeUsingWholePopulationStrategy,
  doesHighestAncestorWithWholePopulationStrategyHaveAWholeValue,
  value,
  confirmTouchedAtCurrentOrDescendantNode,
  errors,
  touched,
  getTreeNode
}) => {
  const { properties } = formStateNode;

  const populationTally = {
    numLeafs: 0,
    numPopulatedLeafs: 0
  };

  const confirmPopulationTally = childPopulationTally => {
    populationTally.numLeafs += childPopulationTally.numLeafs;
    populationTally.numPopulatedLeafs += childPopulationTally.numPopulatedLeafs;
  };

  if (properties) {
    const propertyNames = Object.keys(properties);
    if (propertyNames.length) {
      treeNode.children = propertyNames.sort().map(propertyName => {
        const propertyFormStateNode = properties[propertyName];
        const childNode = getTreeNode({
          formStateNode: propertyFormStateNode,
          displayName: propertyName,
          isAncestorUsingWholePopulationStrategy:
            isAncestorUsingWholePopulationStrategy ||
            isUsingWholePopulationStrategy,
          doesHighestAncestorWithWholePopulationStrategyHaveAWholeValue:
            (isAncestorUsingWholePopulationStrategy &&
              doesHighestAncestorWithWholePopulationStrategyHaveAWholeValue) ||
            (isHighestNodeUsingWholePopulationStrategy && value),
          reportPopulationTally: confirmPopulationTally,
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

  if (isUsingWholePopulationStrategy) {
    if (isFormStateValuePopulated(value)) {
      populationTally.numPopulatedLeafs = populationTally.numLeafs;
    } else {
      populationTally.numPopulatedLeafs = 0;
    }
  }

  reportPopulationTally(populationTally);
};
