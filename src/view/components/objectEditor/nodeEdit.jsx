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
import {
  Breadcrumbs,
  Checkbox,
  Flex,
  Item,
  View,
  Text,
} from "@adobe/react-spectrum";
import getNodeEditData from "./helpers/getNodeEditData";
import AutoPopulationAlert from "./autoPopulationAlert";
import {
  ARRAY,
  BOOLEAN,
  INTEGER,
  NUMBER,
  OBJECT,
  OBJECT_JSON,
  OBJECT_ANALYTICS,
} from "./constants/schemaType";
import ArrayEdit from "./arrayEdit";
import BooleanEdit from "./booleanEdit";
import IntegerEdit from "./integerEdit";
import ObjectJsonEdit from "./objectJsonEdit";
import ObjectAnalyticsEdit from "./objectAnalyticsEdit";
import NumberEdit from "./numberEdit";
import ObjectEdit from "./objectEdit";
import StringEdit from "./stringEdit";
import Heading from "../typography/heading";
import { ALWAYS, NONE } from "./constants/autoPopulationSource";
import "./nodeEdit.css";
import FormikCheckbox from "../formikReactSpectrum3/formikCheckbox";
import FieldDescriptionAndError from "../fieldDescriptionAndError";

const getViewBySchemaType = (schemaType) => {
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
    case OBJECT_JSON:
      return ObjectJsonEdit;
    case OBJECT_ANALYTICS:
      return ObjectAnalyticsEdit;
    default:
      return StringEdit;
  }
};

/**
 * The form for editing a node in the XDM object. The form fields
 * that are shown depend on the node's type.
 */
const NodeEdit = (props) => {
  const { values: formState } = useFormikContext();
  const { onNodeSelect, selectedNodeId, verticalLayout = false } = props;

  const {
    formStateNode,
    fieldName,
    breadcrumb,
    displayName,
    hasClearedAncestor,
  } = getNodeEditData({
    formState,
    nodeId: selectedNodeId,
  });

  const TypeSpecificNodeEdit = getViewBySchemaType(formStateNode.schema.type);

  return (
    <Flex
      data-test-id="nodeEdit"
      gap="size-200"
      marginBottom="size-200"
      direction="column"
    >
      {!verticalLayout && (
        <>
          <View
            data-test-id="breadcrumb"
            UNSAFE_className="NodeEdit-breadcrumbs"
          >
            {
              // There's currently a known error that occurs when Breadcrumbs
              // is unmounted, but it doesn't seem to affect the UX.
              // https://github.com/adobe/react-spectrum/issues/1979
            }
            {breadcrumb.length > 1 && (
              <Breadcrumbs onAction={(nodeId) => onNodeSelect(nodeId)}>
                {breadcrumb.map((item) => (
                  <Item key={item.nodeId}>{item.label}</Item>
                ))}
              </Breadcrumbs>
            )}
          </View>
          <Heading data-test-id="heading" size="S">
            {displayName}
          </Heading>
          <Text>{formStateNode.schema.description}</Text>
          {"meta:enum" in formStateNode.schema && (
            <View>
              <Text>Valid values:</Text>
              <ul>
                {Object.entries(formStateNode.schema["meta:enum"]).map(
                  ([value, description]) => (
                    <li key={value}>
                      <strong>{value}</strong>: {description}
                    </li>
                  ),
                )}
              </ul>
            </View>
          )}
        </>
      )}
      {formStateNode.autoPopulationSource !== NONE && (
        <AutoPopulationAlert formStateNode={formStateNode} />
      )}
      {formStateNode.autoPopulationSource !== ALWAYS && (
        <>
          <TypeSpecificNodeEdit
            fieldName={fieldName}
            onNodeSelect={onNodeSelect}
            verticalLayout={verticalLayout}
          />
          {formStateNode.updateMode && hasClearedAncestor && (
            <FieldDescriptionAndError
              description="Checking this box will cause this field to be deleted before setting any values. A field further up in the object is already cleared. Fields that are cleared appear with a delete icon in the tree."
              messagePaddingTop="size-0"
              messagePaddingStart="size-300"
            >
              <Checkbox
                data-test-id="clearField"
                isSelected
                isDisabled
                width="size-5000"
              >
                Clear existing value
              </Checkbox>
            </FieldDescriptionAndError>
          )}
          {formStateNode.updateMode && !hasClearedAncestor && (
            <FormikCheckbox
              data-test-id="clearField"
              name={`${fieldName}.transform.clear`}
              description="Checking this box will cause this field to be deleted before setting any values. Fields that are cleared appear with a delete icon in the tree."
              width="size-5000"
              isDisabled={hasClearedAncestor}
            >
              Clear existing value
            </FormikCheckbox>
          )}
        </>
      )}
    </Flex>
  );
};

NodeEdit.propTypes = {
  onNodeSelect: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string.isRequired,
  verticalLayout: PropTypes.bool,
};

export default NodeEdit;
