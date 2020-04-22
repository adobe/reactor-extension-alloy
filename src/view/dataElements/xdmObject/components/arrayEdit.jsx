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
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";
import { FieldArray } from "formik";
import Button from "@react/react-spectrum/Button";
import Delete from "@react/react-spectrum/Icon/Delete";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import WrappedField from "../../../components/wrappedField";
import getInitialFormState, {
  formStateNodePropTypes
} from "../helpers/getInitialFormState";
import { PARTS, WHOLE } from "../constants/populationStrategy";
import { ARRAY, OBJECT } from "../constants/schemaType";

/**
 * Displayed when the WHOLE population strategy is selected.
 * Allows the user to provide a value for the whole array.
 */
const WholePopulationStrategyForm = ({ fieldName }) => (
  <React.Fragment>
    <FieldLabel
      labelFor="wholeValueField"
      label="Data element providing array"
    />
    <WrappedField
      data-test-id="wholeValueField"
      id="wholeValueField"
      name={`${fieldName}.wholeValue`}
      component={Textfield}
      componentClassName="u-fieldLong"
      supportDataElement="replace"
    />
  </React.Fragment>
);

WholePopulationStrategyForm.propTypes = {
  fieldName: PropTypes.string.isRequired
};

/**
 * Displayed when the PARTS population strategy is selected.
 * Allows the user to provide individual items within the array.
 */
const PartsPopulationStrategyForm = ({
  fieldName,
  schema,
  items,
  onNodeSelect
}) => (
  <FieldArray
    name={`${fieldName}.items`}
    render={arrayHelpers => {
      return (
        <div>
          {items.map((itemNode, index) => {
            return (
              <div
                key={`${fieldName}.${index}`}
                className="u-gapTop u-flex u-alignItemsCenter"
              >
                <Button
                  data-test-id={`item${index}SelectButton`}
                  quiet
                  variant="action"
                  onClick={() => onNodeSelect(itemNode.id)}
                >
                  Item {index + 1}
                </Button>
                <Button
                  data-test-id={`item${index}RemoveButton`}
                  variant="tool"
                  icon={<Delete />}
                  aria-label="Delete"
                  className="u-gapLeft"
                  onClick={() => arrayHelpers.remove(index)}
                />
              </div>
            );
          })}
          <Button
            data-test-id="addItemButton"
            onClick={() => {
              const itemSchema = schema.items;
              let defaultValue;

              if (itemSchema.type === OBJECT) {
                defaultValue = {};
              } else if (itemSchema.type === ARRAY) {
                defaultValue = [];
              } else {
                defaultValue = "";
              }

              const itemFormStateNode = getInitialFormState({
                schema: itemSchema,
                value: defaultValue
              });
              arrayHelpers.push(itemFormStateNode);
            }}
            label="Add Item"
            className="u-gapTop2x"
          />
        </div>
      );
    }}
  />
);

PartsPopulationStrategyForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(formStateNodePropTypes).isRequired,
  onNodeSelect: PropTypes.func.isRequired
};

/**
 * The form for editing a node that is an array type.
 */
const ArrayEdit = props => {
  const { formStateNode, fieldName, onNodeSelect } = props;
  const {
    isPartsPopulationStrategySupported,
    populationStrategy,
    schema,
    items
  } = formStateNode;

  return (
    <div>
      {isPartsPopulationStrategySupported && (
        <WrappedField
          name={`${fieldName}.populationStrategy`}
          component={RadioGroup}
          className="u-gapBottom"
        >
          <Radio
            data-test-id="partsPopulationStrategyField"
            value={PARTS}
            label="Provide individual items"
          />
          <Radio
            data-test-id="wholePopulationStrategyField"
            value={WHOLE}
            label="Provide entire array"
            className="u-gapLeft2x"
          />
        </WrappedField>
      )}
      <div>
        {populationStrategy === WHOLE ? (
          <WholePopulationStrategyForm fieldName={fieldName} />
        ) : (
          <PartsPopulationStrategyForm
            fieldName={fieldName}
            schema={schema}
            items={items}
            onNodeSelect={onNodeSelect}
          />
        )}
      </div>
    </div>
  );
};

ArrayEdit.propTypes = {
  formStateNode: formStateNodePropTypes.isRequired,
  fieldName: PropTypes.string.isRequired,
  onNodeSelect: PropTypes.func.isRequired
};

export default ArrayEdit;
