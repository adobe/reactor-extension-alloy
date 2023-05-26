import React from "react";
import { array, string, object } from "yup";
import { FieldArray, useField } from "formik";
import { Flex, Radio, Button, Well } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import DataElementSelector from "../components/dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import {
  combineComponents,
  combineGetInitialValues,
  combineGetSettings,
  combineValidationSchemas
} from "./utils";

const FORM = "form";
const DATA_ELEMENT = "dataElement";

/**
 * This creates a form element that allows the user to create an array of
 * objects, or an object with string keys and object values. Any items with no
 * values filled in will be removed from the final settings.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field.
 *  - `${key}` will be used to store the array of objects.
 *  - `${key}InputMethod` will be used to determine whether or not to use a data
 *    element.
 *  - `${key}DataElement` will be used to store the data element value.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.singularLabel - The singular label to use for the add
 * button.
 * @param {string} [options.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the type the
 * data element should be.
 * @param {string} [options.objectKey] - If you want to create an object, use
 * this to specify the Formik key to use for the keys of the object. If you want
 * to create an array of objects, omit this.
 * @param {string} [options.objectLabelPlural] - If you have set `objectKey`,
 * this will be used to describe the object keys in the validation error message
 * to make sure they are unique.
 * @param {...FormPart} parts - The Form parts to use for the object. These will
 * be used to create the form for each object in the array. When rendering the
 * components, the `prefixKey` prop will be set to `${key}.${index}.`
 * @returns {FormPart}
 */
export default (
  {
    key,
    label,
    singularLabel,
    dataElementDescription,
    objectKey,
    objectLabelPlural
  },
  ...parts
) => {
  const getItemInitialValues = combineGetInitialValues(parts);
  const getItemSettings = combineGetSettings(parts);
  const buildDefaultItem = () =>
    getItemInitialValues({ initInfo: { settings: null } });

  let itemSchema = object().shape(combineValidationSchemas(parts));

  if (objectKey) {
    itemSchema = itemSchema.test(
      "unique",
      `Duplicate ${objectLabelPlural.toLowerCase()} are not allowed`,
      (value, context) => {
        if (!value || !value[objectKey]) {
          return true;
        }

        const { path, parent } = context;
        const items = [...parent];
        const currentIndex = items.indexOf(value);
        const previousItems = items.slice(0, currentIndex);

        if (previousItems.some(item => item[objectKey] === value[objectKey])) {
          throw context.createError({
            path: `${path}.${objectKey}`,
            message: `Duplicate ${objectLabelPlural.toLowerCase()} are not allowed`
          });
        }

        return true;
      }
    );
  }

  const validationSchema = {};
  validationSchema[key] = array()
    .compact(
      item => Object.keys(getItemSettings({ values: item })).length === 0
    )
    .when(`${key}InputMethod`, {
      is: FORM,
      then: schema => schema.of(itemSchema)
    });

  validationSchema[`${key}DataElement`] = string().when(`${key}InputMethod`, {
    is: DATA_ELEMENT,
    then: schema =>
      schema
        .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
        .required(DATA_ELEMENT_REQUIRED)
  });

  const CombinedComponent = combineComponents(parts);

  const formPart = {
    getInitialValues({ initInfo }) {
      const { [key]: value } = initInfo.settings || {};

      let transformedValue = value;
      if (transformedValue && objectKey) {
        transformedValue = Object.keys(transformedValue).reduce((acc, k) => {
          acc.push({ [objectKey]: k, ...transformedValue[k] });
          return acc;
        }, []);
      }
      if (transformedValue && Array.isArray(transformedValue)) {
        transformedValue = transformedValue.map(item =>
          getItemInitialValues({ initInfo: { settings: item } })
        );
      } else {
        transformedValue = [buildDefaultItem()];
      }

      const initialValues = {
        [key]: transformedValue,
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
        const itemSettings = values[key].map(getItemSettings);
        const filteredItems = itemSettings.filter(
          item => Object.keys(item).length > 0
        );
        if (filteredItems.length > 0) {
          if (objectKey) {
            settings[key] = filteredItems.reduce((acc, item) => {
              const { [objectKey]: settingKey, ...rest } = item;
              acc[settingKey] = rest;
              return acc;
            }, {});
          } else {
            settings[key] = filteredItems;
          }
        }
      } else {
        settings[key] = values[`${key}DataElement`];
      }
      return settings;
    },
    validationSchema,
    Component: ({ initInfo }) => {
      const [{ value: inputMethod }] = useField(`${key}InputMethod`);
      const [{ value: items }, , { setValue: setItems }] = useField(key);

      return (
        <>
          <FormikRadioGroup
            name={`${key}InputMethod`}
            orientation="horizontal"
            label={label}
          >
            <Radio data-test-id={`${key}FormOption`} value={FORM}>
              Use a form.
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
                  <>
                    {items.map((_, index) => {
                      return (
                        <Well
                          key={index}
                          alignSelf="flex-start"
                          direction="column"
                          gap="size-100"
                        >
                          <CombinedComponent
                            initInfo={initInfo}
                            keyPrefix={`${key}.${index}.`}
                          />
                          <Flex direction="row">
                            <Button
                              variant="secondary"
                              data-test-id={`${key}${index}RemoveButton`}
                              onPress={() => {
                                // using arrayHelpers.remove mangles the error message
                                setItems(
                                  items.filter((otherItem, i) => i !== index)
                                );
                              }}
                              isDisabled={items.length === 1}
                              marginStart="auto"
                            >
                              Remove {singularLabel.toLowerCase()}
                            </Button>
                          </Flex>
                        </Well>
                      );
                    })}
                    <div>
                      <Button
                        variant="secondary"
                        data-test-id={`${key}AddButton`}
                        onPress={() => arrayHelpers.push(buildDefaultItem())}
                      >
                        Add {singularLabel.toLowerCase()}
                      </Button>
                    </div>
                  </>
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
  formPart.Component.propTypes = {
    initInfo: PropTypes.object.isRequired
  };
  return formPart;
};
