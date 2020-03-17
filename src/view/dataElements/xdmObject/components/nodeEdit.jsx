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
import ArrayEdit from "./arrayEdit";
import ObjectEdit from "./objectEdit";
import ObjectPropertyEdit from "./objectPropertyEdit";
import { ARRAY, OBJECT } from "../constants/schemaType";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";
import getNodeEditData from "../helpers/getNodeEditData";

/**
 * The form for editing a node in the XDM object. The form fields
 * that are shown depend on the node's type.
 */
const NodeEdit = props => {
  const { formState, onNodeSelect, selectedNodeId } = props;

  const { formStateNode, fieldName, breadcrumb } = selectedNodeId
    ? getNodeEditData({
        formState,
        nodeId: selectedNodeId
      })
    : {};

  let TypeSpecificNodeEdit;

  if (formStateNode.schema.type === ARRAY) {
    TypeSpecificNodeEdit = ArrayEdit;
  } else if (formStateNode.schema.type === OBJECT) {
    TypeSpecificNodeEdit = ObjectEdit;
  } else {
    TypeSpecificNodeEdit = ObjectPropertyEdit;
  }

  return (
    <div>
      <Breadcrumbs
        className="u-gapLeftNegative u-gapBottom2x"
        items={breadcrumb}
        onBreadcrumbClick={item => onNodeSelect(item.nodeId)}
      />
      <TypeSpecificNodeEdit
        formStateNode={formStateNode}
        fieldName={fieldName}
        onNodeSelect={onNodeSelect}
      />
    </div>
  );
};

NodeEdit.propTypes = {
  formState: formStateNodePropTypes.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string.isRequired
};

export default NodeEdit;
