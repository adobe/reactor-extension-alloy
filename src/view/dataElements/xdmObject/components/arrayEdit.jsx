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
import { FieldArray, useField } from "formik";
import { Radio, Button, Flex } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import FormikRadioGroup from "../../../components/formikReactSpectrum3/formikRadioGroup";
import FormikTextField from "../../../components/formikReactSpectrum3/formikTextField";
import DataElementSelector from "../../../components/dataElementSelector";
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
  <DataElementSelector>
    <FormikTextField
      data-test-id="valueField"
      name={`${fieldName}.value`}
      label="Data Element"
      description="This data element should resolve to an array."
      width="size-5000"
    />
  </DataElementSelector>
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
        <Flex
          gap="size-200"
          marginTop="size-200"
          direction="column"
          alignItems="start"
        >
          {items.map((itemNode, index) => {
            return (
              <div key={`${fieldName}.${index}`}>
                <Button
                  data-test-id={`item${index}SelectButton`}
                  isQuiet
                  variant="secondary"
                  onPress={() => onNodeSelect(itemNode.id)}
                >
                  Item {index + 1}
                </Button>
                <Button
                  data-test-id={`item${index}RemoveButton`}
                  isQuiet
                  variant="secondary"
                  minWidth={0}
                  aria-label="Delete"
                  onPress={() => arrayHelpers.remove(index)}
                >
                  <Delete />
                </Button>
              </div>
            );
          })}
          <Button
            data-test-id="addItemButton"
            onPress={() => {
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
            variant="primary"
          >
            Add Item
          </Button>
        </Flex>
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
  const { fieldName, onNodeSelect } = props;
  const [{ value: formStateNode }] = useField(fieldName);

  const {
    isPartsPopulationStrategySupported,
    populationStrategy,
    schema,
    items
  } = formStateNode;

  return (
    <div>
      {isPartsPopulationStrategySupported && (
        <FormikRadioGroup
          label="Population Strategy"
          name={`${fieldName}.populationStrategy`}
          orientation="horizontal"
        >
          <Radio data-test-id="partsPopulationStrategyField" value={PARTS}>
            Provide individual items
          </Radio>
          <Radio data-test-id="wholePopulationStrategyField" value={WHOLE}>
            Provide entire array
          </Radio>
        </FormikRadioGroup>
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
  fieldName: PropTypes.string.isRequired,
  onNodeSelect: PropTypes.func.isRequired
};

export default ArrayEdit;
