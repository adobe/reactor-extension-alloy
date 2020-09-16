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
import Breadcrumbs from "@react/react-spectrum/Breadcrumbs";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";
import getNodeEditData from "../helpers/getNodeEditData";
import AutoPopulationAlert from "./autoPopulationAlert";
import {
  ARRAY,
  BOOLEAN,
  INTEGER,
  NUMBER,
  OBJECT
} from "../constants/schemaType";
import arrayEdit from "./arrayEdit";
import booleanEdit from "./booleanEdit";
import integerEdit from "./integerEdit";
import numberEdit from "./numberEdit";
import objectEdit from "./objectEdit";
import stringEdit from "./stringEdit";
import { ALWAYS, NONE } from "../constants/autoPopulationSource";

const getViewBySchemaType = schemaType => {
  switch (schemaType) {
    case ARRAY:
      return arrayEdit;
    case BOOLEAN:
      return booleanEdit;
    case INTEGER:
      return integerEdit;
    case NUMBER:
      return numberEdit;
    case OBJECT:
      return objectEdit;
    default:
      return stringEdit;
  }
};

/**
 * The form for editing a node in the XDM object. The form fields
 * that are shown depend on the node's type.
 */
const NodeEdit = props => {
  const { formState, onNodeSelect, selectedNodeId } = props;

  const { formStateNode, fieldName, breadcrumb } = getNodeEditData({
    formState,
    nodeId: selectedNodeId
  });

  const TypeSpecificNodeEdit = getViewBySchemaType(formStateNode.schema.type);

  return (
    <div>
      <Breadcrumbs
        className="u-gapLeftNegative u-gapBottom2x"
        items={breadcrumb}
        onBreadcrumbClick={item => onNodeSelect(item.nodeId)}
      />
      <div>
        {formStateNode.autoPopulationSource !== NONE && (
          <AutoPopulationAlert formStateNode={formStateNode} />
        )}
        {formStateNode.autoPopulationSource !== ALWAYS && (
          <TypeSpecificNodeEdit
            formStateNode={formStateNode}
            fieldName={fieldName}
            onNodeSelect={onNodeSelect}
          />
        )}
      </div>
    </div>
  );
};

NodeEdit.propTypes = {
  formState: formStateNodePropTypes.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string.isRequired
};

export default NodeEdit;
