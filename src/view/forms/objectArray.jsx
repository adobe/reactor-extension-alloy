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
import form from "./form";

const FORM = "form";
const DATA_ELEMENT = "dataElement";

/**
 * This creates a form element that allows the user to create an array of
 * objects, or an object with string keys and object values. Any items with no
 * values filled in will be removed from the final settings.
 * @param {object} props
 * @param {string} props.name - The formik key to use for this field.
 *  - `${key}` will be used to store the array of objects.
 *  - `${key}InputMethod` will be used to determine whether or not to use a data
 *    element.
 *  - `${key}DataElement` will be used to store the data element value.
 * @param {string} props.label - The label to use for the field.
 * @param {string} props.singularLabel - The singular label to use for the add
 * button.
 * @param {string} [props.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the type the
 * data element should be.
 * @param {string} [props.objectKey] - If you want to create an object, use
 * this to specify the Formik key to use for the keys of the object. If you want
 * to create an array of objects, omit this.
 * @param {string} [props.objectLabelPlural] - If you have set `objectKey`,
 * this will be used to describe the object keys in the validation error message
 * to make sure they are unique.
 * @param {Form[]} props.children - The Form parts to use for the object. These will
 * be used to create the form for each object in the array. When rendering the
 * components, the `prefixName` prop will be set to `${name}.${index}.`
 * @returns {Form}
 */
export default function ObjectArray({
  name,
  label,
  singularLabel,
  dataElementDescription,
  objectKey,
  objectLabelPlural,
  children
}) {
  const {
    getInitialValues: getItemInitialValues,
    getSettings: getItemSettings,
    validationShape: itemValidationShape,
    Component: ItemComponent
  } = form({ children });

  const buildDefaultItem = () =>
    getItemInitialValues({ initInfo: { settings: null } });

  let itemSchema = object().shape(itemValidationShape);

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

  const validationShape = {};
  validationShape[name] = array()
    .compact(
      item => Object.keys(getItemSettings({ values: item })).length === 0
    )
    .when(`${name}InputMethod`, {
      is: FORM,
      then: schema => schema.of(itemSchema)
    });

  validationShape[`${name}DataElement`] = string().when(`${name}InputMethod`, {
    is: DATA_ELEMENT,
    then: schema =>
      schema
        .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
        .required(DATA_ELEMENT_REQUIRED)
  });

  const formPart = {
    getInitialValues({ initInfo }) {
      const { [name]: value } = initInfo.settings || {};

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
        [name]: transformedValue,
        [`${name}InputMethod`]: FORM,
        [`${name}DataElement`]: ""
      };

      if (typeof value === "string") {
        initialValues[name] = [""];
        initialValues[`${name}InputMethod`] = DATA_ELEMENT;
        initialValues[`${name}DataElement`] = value;
      }
      return initialValues;
    },
    getSettings({ values }) {
      const settings = {};
      if (values[`${name}InputMethod`] === FORM) {
        const itemSettings = values[name].map(item =>
          getItemSettings({ values: item })
        );
        const filteredItems = itemSettings.filter(
          item => Object.keys(item).length > 0
        );
        if (filteredItems.length > 0) {
          if (objectKey) {
            settings[name] = filteredItems.reduce((acc, item) => {
              const { [objectKey]: settingKey, ...rest } = item;
              acc[settingKey] = rest;
              return acc;
            }, {});
          } else {
            settings[name] = filteredItems;
          }
        }
      } else {
        settings[name] = values[`${name}DataElement`];
      }
      return settings;
    },
    validationShape,
    Component: ({ namePrefix = "", ...props }) => {
      const [{ value: inputMethod }] = useField(
        `${namePrefix}${name}InputMethod`
      );
      const [{ value: items }, , { setValue: setItems }] = useField(
        `${namePrefix}${name}`
      );

      return (
        <>
          <FormikRadioGroup
            name={`${namePrefix}${name}InputMethod`}
            orientation="horizontal"
            label={label}
          >
            <Radio data-test-id={`${namePrefix}${name}FormOption`} value={FORM}>
              Use a form.
            </Radio>
            <Radio
              data-test-id={`${namePrefix}${name}DataElementOption`}
              value={DATA_ELEMENT}
            >
              Provide a data element.
            </Radio>
          </FormikRadioGroup>
          {inputMethod === FORM && (
            <FieldArray
              name={`${namePrefix}${name}`}
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
                          <ItemComponent
                            namePrefix={`${namePrefix}${name}.${index}.`}
                            {...props}
                          />
                          <Flex direction="row">
                            <Button
                              variant="secondary"
                              data-test-id={`${namePrefix}${name}${index}RemoveButton`}
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
                        data-test-id={`${namePrefix}${name}AddButton`}
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
                data-test-id={`${namePrefix}${name}DataElementField`}
                name={`${namePrefix}${name}DataElement`}
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
    namePrefix: PropTypes.string
  };
  return formPart;
}
