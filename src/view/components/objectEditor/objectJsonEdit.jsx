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

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { FieldArray, useField } from "formik";
import {
  Radio,
  Button,
  Flex,
  View,
  Heading,
  Divider
} from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import FormikRadioGroup from "../formikReactSpectrum3/formikRadioGroup";
import FormikTextArea from "../formikReactSpectrum3/formikTextArea";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import DataElementSelector from "../dataElementSelector";
import { PARTS, WHOLE } from "./constants/populationStrategy";
import FormElementContainer from "../formElementContainer";
import {
  addToEntityFromVariables,
  addToVariablesFromEntity
} from "./helpers/entityVariablesConverter";

/**
 * Displayed when the WHOLE population strategy is selected.
 * Allows the user to provide a value for the whole array.
 */
const WholePopulationStrategyForm = ({ fieldName }) => (
  <DataElementSelector>
    <FormikTextArea
      data-test-id="valueField"
      name={`${fieldName}.raw`}
      label="Data element"
      description="A valid JSON object or a data element."
      width="100%"
      minWidth="size-4600"
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
const PartsPopulationStrategyForm = ({ fieldName, items }) => (
  <FieldArray
    name={`${fieldName}.items`}
    render={arrayHelpers => {
      return (
        <Flex gap="size-200" direction="column" alignItems="start">
          <Flex
            direction="row"
            gap="size-200"
            width="100%"
            position="relative"
            top="size-200"
          >
            <View flex>
              <Heading
                level="4"
                marginStart="size-100"
                marginTop="size-100"
                marginBottom="size-50"
              >
                KEY
              </Heading>
            </View>
            <View flex>
              <Heading
                level="4"
                marginStart="size-100"
                marginTop="size-100"
                marginBottom="size-50"
              >
                VALUE
              </Heading>
            </View>
            <View width="size-450" />
          </Flex>

          <Divider size="S" marginStart="0" />

          {items.map((itemNode, index) => {
            return (
              <Flex
                gap="size-200"
                key={`${fieldName}.${index}`}
                alignItems="start"
                width="100%"
              >
                <View flex>
                  <FormikTextField
                    data-test-id={`keyField${index}`}
                    name={`${fieldName}.items.${index}.key`}
                    aria-label="Key"
                    description="&nbsp;"
                    width="100%"
                  />
                </View>

                <View flex>
                  <DataElementSelector>
                    <FormikTextField
                      data-test-id={`valueField${index}`}
                      name={`${fieldName}.items.${index}.value`}
                      aria-label="Value"
                      width="100%"
                    />
                  </DataElementSelector>
                </View>

                <View width="size-450">
                  {items.length > 1 && (
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
                  )}
                </View>
              </Flex>
            );
          })}
          <Button
            data-test-id="addItemButton"
            onPress={() => {
              arrayHelpers.push({ key: "", value: "" });
            }}
            variant="primary"
          >
            Add item
          </Button>
        </Flex>
      );
    }}
  />
);

PartsPopulationStrategyForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

const getEmptyItem = () => ({ key: "", value: "" });

const updateJsonTextarea = ({
  setValue,
  formStateNode: {
    items,
    schema: { expandPaths }
  }
}) => {
  if (items.length > 1 || items[0].key) {
    let entity = JSON.stringify(
      addToEntityFromVariables({}, items, { expandPaths }),
      null,
      2
    );

    if (entity === "{}") {
      entity = "";
    }

    setValue(entity, true);
  }
};

const updateRows = ({
  setValue,
  formStateNode: {
    raw,
    schema: { expandPaths }
  }
}) => {
  let variables = [];
  try {
    variables = addToVariablesFromEntity([], JSON.parse(raw), { expandPaths });
  } catch (e) {
    // Don't do anything
  }

  if (variables.length === 0) {
    variables.push(getEmptyItem());
  }

  setValue(variables, true);
};

/**
 * The form for editing a node that is an object that contains JSON.
 */
const ObjectJsonEdit = props => {
  const { fieldName } = props;
  const [{ value: formStateNode }] = useField(fieldName);
  const [, , { setValue: setRawValue }] = useField(`${fieldName}.raw`);
  const [, , { setValue: setItemsValue }] = useField(`${fieldName}.items`);

  const {
    isPartsPopulationStrategySupported,
    populationStrategy,
    items
  } = formStateNode;

  const strategyOnChange = useCallback(
    currentValue => {
      if (currentValue === WHOLE) {
        updateJsonTextarea({ setValue: setRawValue, formStateNode });
      } else {
        updateRows({ setValue: setItemsValue, formStateNode });
      }
    },
    [formStateNode]
  );

  return (
    <FormElementContainer>
      {isPartsPopulationStrategySupported && (
        <FormikRadioGroup
          label="Population strategy"
          name={`${fieldName}.populationStrategy`}
          orientation="horizontal"
          onChange={strategyOnChange}
        >
          <Radio data-test-id="partsPopulationStrategyField" value={PARTS}>
            Provide individual attributes
          </Radio>
          <Radio data-test-id="wholePopulationStrategyField" value={WHOLE}>
            Provide entire object
          </Radio>
        </FormikRadioGroup>
      )}
      {populationStrategy === WHOLE ? (
        <WholePopulationStrategyForm fieldName={fieldName} />
      ) : (
        <PartsPopulationStrategyForm fieldName={fieldName} items={items} />
      )}
    </FormElementContainer>
  );
};

ObjectJsonEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default ObjectJsonEdit;
