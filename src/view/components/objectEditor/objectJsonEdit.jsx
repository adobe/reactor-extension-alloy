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
import { Radio, ActionButton, Well, Flex } from "@adobe/react-spectrum";
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

const getEmptyItem = () => ({ key: "", value: "" });

/**
 * Displayed when the WHOLE population strategy is selected.
 * Allows the user to provide a value for the whole array.
 */
const WholePopulationStrategyForm = ({ fieldName, setTouched }) => (
  <DataElementSelector>
    <FormikTextArea
      data-test-id="valueField"
      name={`${fieldName}.value`}
      aria-label="Value"
      description={
        "You can provide Data Elements for individual fields within the JSON " +
        '(e.g. "%My Data%") or provide one data element for the entire object.'
      }
      width="size-6000"
      marginStart="size-300"
      onBlur={setTouched}
    />
  </DataElementSelector>
);

WholePopulationStrategyForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  setTouched: PropTypes.func.isRequired
};

/**
 * Displayed when the PARTS population strategy is selected.
 * Allows the user to provide individual items within the array.
 */
const PartsPopulationStrategyForm = ({ fieldName, items, setTouched }) => (
  <FieldArray
    name={`${fieldName}.items`}
    render={arrayHelpers => {
      return (
        <Well marginStart="size-300">
          <Flex gap="size-100" direction="column" alignItems="start">
            {items.map(({ key, value }, index) => {
              return (
                <Flex key={`${fieldName}.${index}`}>
                  <FormikTextField
                    data-test-id={`keyField${index}`}
                    name={`${fieldName}.items.${index}.key`}
                    aria-label="Key"
                    label={index === 0 ? "Key" : ""}
                    width="size-3000"
                    onBlur={setTouched}
                  />

                  <DataElementSelector>
                    <FormikTextField
                      data-test-id={`valueField${index}`}
                      name={`${fieldName}.items.${index}.value`}
                      aria-label="Value"
                      label={index === 0 ? "Value" : ""}
                      width="size-3000"
                      onBlur={setTouched}
                      marginStart="size-100"
                    />
                  </DataElementSelector>

                  <ActionButton
                    data-test-id={`item${index}RemoveButton`}
                    isQuiet
                    variant="secondary"
                    aria-label="Delete"
                    isDisabled={items.length === 1 && !key && !value}
                    marginTop={index === 0 ? "size-300" : ""}
                    onPress={() =>
                      items.length > 1
                        ? arrayHelpers.remove(index)
                        : arrayHelpers.replace(index, getEmptyItem())
                    }
                  >
                    <Delete />
                  </ActionButton>
                </Flex>
              );
            })}

            <ActionButton
              data-test-id="addPropertyButton"
              onPress={() => {
                arrayHelpers.push({ key: "", value: "" });
              }}
            >
              Add another property
            </ActionButton>
          </Flex>
        </Well>
      );
    }}
  />
);

PartsPopulationStrategyForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTouched: PropTypes.func.isRequired
};

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
    value,
    schema: { expandPaths }
  }
}) => {
  let variables = [];
  try {
    variables = addToVariablesFromEntity([], JSON.parse(value), {
      expandPaths
    });
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
  const [, , { setTouched, setValue }] = useField(`${fieldName}.value`);
  const [, , { setValue: setItemsValue }] = useField(`${fieldName}.items`);

  const {
    isPartsPopulationStrategySupported,
    populationStrategy,
    items
  } = formStateNode;

  const strategyOnChange = useCallback(
    currentValue => {
      if (currentValue === WHOLE) {
        updateJsonTextarea({ setValue, formStateNode });
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
          aria-label="Population strategy"
          name={`${fieldName}.populationStrategy`}
          orientation="horizontal"
          onChange={strategyOnChange}
        >
          <Radio data-test-id="partsPopulationStrategyField" value={PARTS}>
            Provide individual attributes
          </Radio>
          <Radio data-test-id="wholePopulationStrategyField" value={WHOLE}>
            Provide JSON or Data Element
          </Radio>
        </FormikRadioGroup>
      )}
      {populationStrategy === WHOLE ? (
        <WholePopulationStrategyForm
          fieldName={fieldName}
          setTouched={setTouched}
        />
      ) : (
        <PartsPopulationStrategyForm
          fieldName={fieldName}
          items={items}
          setTouched={setTouched}
        />
      )}
    </FormElementContainer>
  );
};

ObjectJsonEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default ObjectJsonEdit;
