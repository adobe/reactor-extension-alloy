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
import getTypeSpecificHelpers from "./getTypeSpecificHelpers";

/**
 * The model representing a node on the XDM tree.
 * @typedef {Object} TreeNode
 * @property {string} id A unique identifier for the node.
 * @property {string} displayName A user-friendly display for the node.
 * @property {string} type The JSON type that the node's value must be
 * @property {boolean} disabled Whether the user should be disallowed
 * from providing a value for the node.
 * @property {boolean} isPopulated Whether the node or one of its
 * descendants has been given a value.
 * @property {string} error If an error should be shown for the node,
 * this will be the error message.
 * @property {Array} children Children tree nodes, if any.
 */

/**
 * Generates an object representing a node on the XDM tree. The node
 * may contain child nodes.
 * @param {FormStateNode} formStateNode A node from the form state.
 * @param {string} [displayName] A user-friendly display name for the node.
 * @param {boolean} [isAncestorUsingWholePopulationStrategy=false] Whether any ancestor
 * node is using the WHOLE population strategy. If this is true, this node will
 * be disabled.
 * @param {Function} [notifyParentOfDataPopulation] When called, notifies the
 * parent node that this node or a descendant of this node has been populated
 * with a value by the user.
 * @param {Function} [notifyParentOfTouched] When called, notifies the parent
 * node that the "whole value" field of this node or a descendant node has
 * been touched by the user. This helps determine if validation errors should
 * be shown for the node. "Touched" here is according to Formik's definition.
 * @param {Object} [errors] Errors that were collected during validation.
 * The structure of the errors object matches the structure of the
 * formStateNode, though only properties with errors will exist.
 * @param {Object} [touched] A record of which fields have been touched by
 * the user. The structure of the touched object matches the structure of
 * formStateNode. "Touched" here is according to Formik's definition.
 * @returns TreeNode
 */
const getTreeNode = ({
  formStateNode,
  treeNodeComponent,
  displayName,
  isAncestorUsingWholePopulationStrategy = false,
  doesHighestAncestorWithWholePopulationStrategyHaveAValue = false,
  notifyParentOfTouched = () => {},
  errors,
  touched
}) => {
  const { id, schema, populationStrategy, isAlwaysDisabled } = formStateNode;

  const treeNode = {
    key: id,
    displayName,
    type: schema.type,
    disabled: isAlwaysDisabled || isAncestorUsingWholePopulationStrategy,
    // The Tree component, when rendering a tree node, will pass the treeNode
    // object into the component that renders the tree node, which is provided here.
    title: treeNodeComponent
  };

  const isCurrentNodeTheHighestNodeUsingWholePopulationStrategy =
    !isAncestorUsingWholePopulationStrategy && populationStrategy === WHOLE;

  let isTouchedAtCurrentOrDescendantNode = false;

  const confirmTouchedAtCurrentOrDescendantNode = () => {
    if (!isTouchedAtCurrentOrDescendantNode) {
      notifyParentOfTouched();
      isTouchedAtCurrentOrDescendantNode = true;
    }
  };

  if (touched && touched.wholeValue) {
    confirmTouchedAtCurrentOrDescendantNode();
  }

  getTypeSpecificHelpers(schema.type).populateTreeNode({
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
  });

  // To illustrate why we check for isTouchedAtCurrentOrDescendantNode,
  // if a user adds an item to an array node, we show an error if the
  // item is empty. However, we don't want to show the error until
  // we've given the user a chance to populate the item. For this reason,
  // we wait until the user has touched the node or its descendants or
  // has tried to save the data element (formik marks all fields as touched
  // upon save).
  if (isTouchedAtCurrentOrDescendantNode && errors) {
    treeNode.error = errors.value;
  }

  return treeNode;
};

// Avoid exposing all of getTreeNode's parameters since
// they're only used internally for recursion.
export default ({ treeNodeComponent, formState, errors, touched }) => {
  return getTreeNode({
    formStateNode: formState,
    treeNodeComponent,
    // Display name for the top-level node doesn't really
    // matter because it won't be shown in the tree anyway.
    displayName: "",
    errors,
    touched
  });
};
