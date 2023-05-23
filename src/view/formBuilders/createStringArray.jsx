import React from "react";
import Delete from "@spectrum-icons/workflow/Delete";
import { array, string } from "yup";
import { FieldArray, useField } from "formik";
import { Flex, Radio, ActionButton, Button } from "@adobe/react-spectrum";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import DataElementSelector from "../components/dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

const FORM = "form";
const DATA_ELEMENT = "dataElement";

/**
 * This creates a form that just supports an array of strings. Any fields not
 * filled in will be removed from the array. Each item in the array can be a
 * data element or the entire array can be a data element.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 * - `${key}` will be used to store the array of strings.
 * - `${key}InputMethod` will be used to determine whether or not to use a data
 *   element.
 * - `${key}DataElement` will be used to store the data element value.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.singularLabel - The singular label to use for the add
 * button.
 * @param {string} [options.description] - The description to use for the field.
 * This will appear bellow the last string field.
 * @param {string} [options.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the type the
 * data element should be.
 * @param {boolean} [options.isRequired=false] - Whether or not the field is
 * required. When required, the user will need to enter at least one string.
 * @returns {FormPart}
 */
export default ({
  key,
  isRequired = false,
  label,
  singularLabel,
  description,
  dataElementDescription
}) => {
  const validationSchema = {};
  if (isRequired) {
    validationSchema[key] = array()
      .compact()
      .when(`${key}InputMethod`, {
        is: FORM,
        then: schema =>
          schema.min(
            1,
            `Please provide at least one ${singularLabel.toLowerCase()}.`
          )
      });
  }
  validationSchema[`${key}DataElement`] = string().when(`${key}InputMethod`, {
    is: DATA_ELEMENT,
    then: schema =>
      schema
        .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
        .required(DATA_ELEMENT_REQUIRED)
  });

  return {
    getInitialValues({ initInfo }) {
      const { [key]: value = [""] } = initInfo.settings || {};

      const initialValues = {
        [key]: value,
        [`${key}InputMethod`]: FORM,
        [`${key}DataElement`]: ""
      };

      if (typeof value === "string") {
        initialValues[key] = [""];
        initialValues[`${key}InputMethod`] = DATA_ELEMENT;
        initialValues[`${key}DataElement`] = value;
      }
      return initialValues;
    },
    getSettings({ values }) {
      const settings = {};
      if (values[`${key}InputMethod`] === FORM) {
        const filteredValues = values[key].filter(value => value);
        if (filteredValues.length > 0) {
          settings[key] = filteredValues;
        }
      } else {
        settings[key] = values[`${key}DataElement`];
      }
      return settings;
    },
    validationSchema,
    Component: () => {
      const [{ value: inputMethod }] = useField(`${key}InputMethod`);
      const [
        { value: items },
        { touched: itemsTouched, error: itemsError },
        { setValue: setItems }
      ] = useField(key);

      return (
        <>
          <FormikRadioGroup
            name={`${key}InputMethod`}
            orientation="horizontal"
            label={label}
            isRequired={isRequired}
          >
            <Radio data-test-id={`${key}FormOption`} value={FORM}>
              Manually enter {label.toLowerCase()}.
            </Radio>
            <Radio
              data-test-id={`${key}DataElementOption`}
              value={DATA_ELEMENT}
            >
              Provide a data element.
            </Radio>
          </FormikRadioGroup>
          {inputMethod === FORM && (
            <FieldArray
              name={key}
              render={arrayHelpers => {
                return (
                  <div>
                    <Flex direction="column" gap="size-100" alignItems="start">
                      {items.map((item, index) => {
                        return (
                          <Flex key={index} alignItems="start">
                            <DataElementSelector>
                              <FormikTextField
                                data-test-id={`${key}${index}Field`}
                                aria-label={`${label} ${index + 1}`}
                                name={`${key}.${index}`}
                                width="size-5000"
                                marginTop="size-0"
                                description={
                                  index === items.length - 1
                                    ? description
                                    : undefined
                                }
                                error={
                                  index === items.length - 1 ? itemsError : ""
                                }
                                invalid={itemsError && itemsTouched}
                                touched={itemsTouched}
                              />
                            </DataElementSelector>
                            <ActionButton
                              data-test-id={`${key}${index}RemoveButton`}
                              isQuiet
                              isDisabled={items.length === 1}
                              variant="secondary"
                              onPress={() => {
                                // using arrayHelpers.remove mangles the error message
                                setItems(items.filter((_, i) => i !== index));
                              }}
                              aria-label={`Remove ${label} ${index + 1}`}
                              marginTop={0}
                            >
                              <Delete />
                            </ActionButton>
                          </Flex>
                        );
                      })}
                    </Flex>
                    <Button
                      variant="secondary"
                      data-test-id={`${key}AddButton`}
                      onPress={() => arrayHelpers.push("")}
                    >
                      Add {singularLabel.toLowerCase()}
                    </Button>
                  </div>
                );
              }}
            />
          )}
          {inputMethod === DATA_ELEMENT && (
            <DataElementSelector>
              <FormikTextField
                data-test-id={`${key}DataElementField`}
                name={`${key}DataElement`}
                description={dataElementDescription}
                width="size-5000"
                aria-label={`${label} data element`}
              />
            </DataElementSelector>
          )}
        </>
      );
    }
  };
};
