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

import React from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { Breadcrumbs, Item } from "@adobe/react-spectrum";
import getNodeEditData from "../helpers/getNodeEditData";
import AutoPopulationAlert from "./autoPopulationAlert";
import {
  ARRAY,
  BOOLEAN,
  INTEGER,
  NUMBER,
  OBJECT
} from "../constants/schemaType";
import ArrayEdit from "./arrayEdit";
import BooleanEdit from "./booleanEdit";
import IntegerEdit from "./integerEdit";
import NumberEdit from "./numberEdit";
import ObjectEdit from "./objectEdit";
import StringEdit from "./stringEdit";
import { ALWAYS, NONE } from "../constants/autoPopulationSource";
import "./nodeEdit.styl";

const getViewBySchemaType = schemaType => {
  switch (schemaType) {
    case ARRAY:
      return ArrayEdit;
    case BOOLEAN:
      return BooleanEdit;
    case INTEGER:
      return IntegerEdit;
    case NUMBER:
      return NumberEdit;
    case OBJECT:
      return ObjectEdit;
    default:
      return StringEdit;
  }
};

/**
 * The form for editing a node in the XDM object. The form fields
 * that are shown depend on the node's type.
 */
const NodeEdit = props => {
  const { values: formState } = useFormikContext();
  const { onNodeSelect, selectedNodeId } = props;

  const { formStateNode, fieldName, breadcrumb } = getNodeEditData({
    formState,
    nodeId: selectedNodeId
  });

  const TypeSpecificNodeEdit = getViewBySchemaType(formStateNode.schema.type);

  return (
    <div>
      <Breadcrumbs
        onAction={nodeId => onNodeSelect(nodeId)}
        UNSAFE_className="NodeEdit-breadcrumbs u-gapBottom2x"
      >
        {breadcrumb.map(item => (
          <Item key={item.nodeId}>{item.label}</Item>
        ))}
      </Breadcrumbs>
      <div>
        {formStateNode.autoPopulationSource !== NONE && (
          <AutoPopulationAlert formStateNode={formStateNode} />
        )}
        {formStateNode.autoPopulationSource !== ALWAYS && (
          <TypeSpecificNodeEdit
            fieldName={fieldName}
            onNodeSelect={onNodeSelect}
          />
        )}
      </div>
    </div>
  );
};

NodeEdit.propTypes = {
  onNodeSelect: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string.isRequired
};

export default NodeEdit;
