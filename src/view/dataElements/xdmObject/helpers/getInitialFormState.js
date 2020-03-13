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

import PropTypes from "prop-types";
import { WHOLE, PARTS } from "../constants/populationStrategy";
import { OBJECT, ARRAY } from "../constants/schemaType";
import autoPopulatedFields from "../constants/autoPopulatedFields";
import alwaysDisabledFields from "../constants/alwaysDisabledFields";

let lastGeneratedNodeId = 0;
const generateNodeId = () => {
  lastGeneratedNodeId += 1;
  return `node-${lastGeneratedNodeId}`;
};

const getNodePath = (parentNodePath, propertyOrIndexName) => {
  return parentNodePath
    ? `${parentNodePath}.${propertyOrIndexName}`
    : propertyOrIndexName;
};

/**
 * The model representing a node within the form state.
 * @typedef {Object} FormStateNode
 * @property {string} id A unique identifier for the node.
 * @property {Object} schema The XDM schema for the node.
 * @property {boolean} isAutoPopulated Whether the node's value
 * is auto-populated by Alloy.
 * @property {boolean} isAlwaysDisabled Whether editing the node's
 * value should always be disabled.
 * @property {Object} properties If the schema type is an object,
 * this will represent properties of the object.
 * @property {Object} properties If the schema type is "object"",
 * this will represent properties of the object as defined by the
 * schema. The keys are the property names and the values are their
 * respective form state nodes.
 * @property {Array} items If the schema type is "array"",
 * this will represent the items within the array as defined by
 * the user (the schema says what each item in an array must look like,
 * but the user adds the items to the array).
 * @property {boolean} isPartsPopulationStrategySupported Whether the
 * user should be able to populate parts of the node. In other words,
 * the node represents an object or an array and a schema has been
 * provided for the object's properties or the array's items.
 * @property {string} populationStrategy Indicates which population
 * strategy the user is taking to populate the node's value.
 * @property {string} wholeValue The value that a user has provided for
 * the whole node. This is only pertinent when the population strategy
 * is set to WHOLE. If the the user has set the population strategy to
 * PARTS, it will be ignored. We don't clear out wholeValue when the
 * user switches populationStrategy to PARTS, because the user might
 * switch back to WHOLE and we'd like to be able to show the value
 * they had previously entered.
 */

/**
 * Generates the initial form state. Note that parts of the state
 * aren't intended to be modified and have less to do with "values"
 * and more to do with constant metadata that corresponds to a
 * particular node (for example, the XDM schema that describes the node)
 * and is made available for convenient access so it doesn't have to
 * be repeatedly computed on every render.
 *
 * @param {Object} schema The XDM schema that describes the node.
 * @param {*} [value] The previously persisted value for the node. This
 * will only be defined when the user is reloading the extension view
 * with previously saved data.
 * @param {string} [nodePath] The dot-delimited path to the node within
 * the schema. For example, in an object that looks like this:
 * <code>{ foo: { bar: "abc" } }</code>
 * The path for bar would be "foo.bar".
 * @returns FormStateNode
 */
const getFormStateNode = ({ schema, value, nodePath }) => {
  const { type } = schema;

  const formStateNode = {
    // We generate an ID rather than use something like a schema path
    // or field path because those paths would need to incorporate indexes
    // of items, and indexes of items can change as items are removed
    // from their parent arrays. We want the ID to remain constant
    // for as long as the node exists.
    id: generateNodeId(),
    schema,
    isAutoPopulated: autoPopulatedFields.includes(nodePath),
    isAlwaysDisabled: alwaysDisabledFields.includes(nodePath)
  };

  let isPartsPopulationStrategySupported = false;

  if (type === OBJECT) {
    // Note if we aren't provided properties, we don't supported the
    // PARTS population strategy. The identityMap property on an
    // ExperienceEvent schema is one example of this.
    const { properties = {} } = schema;
    const propertyNames = Object.keys(properties);
    let propertyFormStateNodes;

    if (propertyNames.length) {
      isPartsPopulationStrategySupported = true;
      propertyFormStateNodes = propertyNames.reduce((memo, propertyName) => {
        const propertySchema = properties[propertyName];
        let propertyValue;

        if (typeof value === "object") {
          propertyValue = value[propertyName];
        }

        const propertyFormStateNode = getFormStateNode({
          schema: propertySchema,
          value: propertyValue,
          nodePath: getNodePath(nodePath, propertyName)
        });
        memo[propertyName] = propertyFormStateNode;
        return memo;
      }, {});
    }

    formStateNode.properties = propertyFormStateNodes || {};
  }

  if (type === ARRAY) {
    let itemFormStateNodes = [];
    // Note if we aren't provided a schema for the array items (a case which
    // may not exist), we don't supported the PARTS population strategy.
    if (schema.items) {
      isPartsPopulationStrategySupported = true;
      if (Array.isArray(value) && value.length) {
        itemFormStateNodes = value.map((itemValue, index) => {
          const itemSchema = schema.items;
          const itemFormStateNode = getFormStateNode({
            schema: itemSchema,
            value: itemValue,
            nodePath: getNodePath(nodePath, index)
          });
          return itemFormStateNode;
        });
      }
    }

    formStateNode.items = itemFormStateNodes || [];
  }

  formStateNode.isPartsPopulationStrategySupported = isPartsPopulationStrategySupported;

  // If value is a string, we know that a data element token (e.g., "%foo%") or static
  // string value (e.g., "foo") has been directly provided and the user is intending to use
  // the WHOLE population strategy. Otherwise, the user is using the PARTS population strategy
  // (if a value exists) or hasn't decided which strategy to use (if no value exists)
  // in which case we'll use the PARTS population strategy if it's supported for the
  // node. Note that if value is something else like a number or a boolean (anything that's
  // not a string, object, or array), it would mean the user created the action using the
  // Launch API. Because we currently have no way of representing numbers or booleans as
  // values in the UI, we discard the value. Users wanting to use this action's UI and
  // provide a non-string value like numbers or booleans will need to create data elements
  // for the values and reference those data elements unless/until we provide enhanced ways
  // of providing different types of constant values.
  if (typeof value === "string") {
    formStateNode.populationStrategy = WHOLE;
    formStateNode.wholeValue = value;
  } else {
    formStateNode.populationStrategy = formStateNode.isPartsPopulationStrategySupported
      ? PARTS
      : WHOLE;
    formStateNode.wholeValue = "";
  }

  return formStateNode;
};

// Avoid exposing all of getFormStateNode's parameters since
// they're only used internally for recursion.
export default ({ schema, value }) => {
  return getFormStateNode({ schema, value });
};

const formStateNodeShape = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.object,
  isAutoPopulated: PropTypes.bool.isRequired,
  isAlwaysDisabled: PropTypes.bool.isRequired,
  isPartsPopulationStrategySupported: PropTypes.bool.isRequired,
  wholeValue: PropTypes.string.isRequired,
  populationStrategy: PropTypes.oneOf([WHOLE, PARTS]).isRequired
};

export const formStateNodePropTypes = PropTypes.shape(formStateNodeShape);

// properties and items are recursive, which is why we have to do this weirdness.
// https://github.com/facebook/react/issues/5676
formStateNodeShape.properties = PropTypes.objectOf(formStateNodePropTypes);
formStateNodeShape.items = PropTypes.arrayOf(formStateNodePropTypes);
