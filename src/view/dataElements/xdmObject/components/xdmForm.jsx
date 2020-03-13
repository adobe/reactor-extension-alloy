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
import XdmArrayForm from "./xdmArrayForm";
import XdmObjectForm from "./xdmObjectForm";
import XdmPropertyForm from "./xdmPropertyForm";
import { ARRAY, OBJECT } from "../constants/schemaType";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";

const XdmForm = props => {
  const { formStateNode, fieldName, onSelect } = props;

  let NodeForm;

  if (formStateNode.schema.type === ARRAY) {
    NodeForm = XdmArrayForm;
  } else if (formStateNode.schema.type === OBJECT) {
    NodeForm = XdmObjectForm;
  } else {
    NodeForm = XdmPropertyForm;
  }

  return (
    <NodeForm
      formStateNode={formStateNode}
      fieldName={fieldName}
      onSelect={onSelect}
    />
  );
};

XdmForm.propTypes = {
  formStateNode: formStateNodePropTypes.isRequired,
  fieldName: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default XdmForm;
