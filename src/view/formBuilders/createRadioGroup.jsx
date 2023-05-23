import React from "react";
import { string } from "yup";
import { Radio } from "@adobe/react-spectrum";
import { useField } from "formik";
import DataElementSelector from "../components/dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FieldSubset from "../components/fieldSubset";

/**
 * This creates a form field for a radio group and supports data elements.
 * @param {object} options
 * @param {string} options.key - The formik key to use for this field. The
 * following formik keys will be used:
 *  - `${key}` - The radio group field.
 *  - `${key}DataElement` - The data element field.
 * @param {boolean} [options.isRequired] - Whether or not the field is required.
 * @param {boolean} [options.dataElementSupported] - Whether or not a "Provide a
 * data element" option should be available.
 * @param {string} options.label - The label to use for the field.
 * @param {string} options.defaultValue - The default value to use for the radio
 * group.
 * @param {string} [options.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the values the
 * data element could resolve to.
 * @param {array} options.items - The items to use for the radio group. These
 * should be objects with keys "value" and "label".
 * @returns {FormPart}
 */
export default ({
  key,
  isRequired = false,
  dataElementSupported = true,
  label,
  dataElementDescription,
  items,
  defaultValue
}) => {
  const validationSchema = {};
  if (dataElementSupported) {
    validationSchema[`${key}DataElement`] = string().when(key, {
      is: "dataElement",
      then: schema =>
        schema
          .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          .required(DATA_ELEMENT_REQUIRED)
    });
  }

  return {
    getInitialValues({ initInfo }) {
      const { [key]: value = defaultValue } = initInfo.settings || {};
      const initialValues = {
        [key]: value,
        [`${key}DataElement`]: ""
      };
      if (value.match(singleDataElementRegex)) {
        initialValues[`${key}DataElement`] = value;
        initialValues[key] = "dataElement";
      }
      return initialValues;
    },
    getSettings({ values }) {
      const settings = {};
      if (values[key] === "dataElement") {
        settings[key] = values[`${key}DataElement`];
      } else if (values[key] !== defaultValue) {
        settings[key] = values[key];
      }
      return settings;
    },
    validationSchema,
    Component: () => {
      const [{ value }] = useField(key);
      return (
        <>
          <FormikRadioGroup
            data-test-id={`${key}Field`}
            name={key}
            label={label}
            isRequired={isRequired}
            width="size-5000"
          >
            {items.map(item => (
              <Radio
                value={item.value}
                key={item.value}
                data-test-id={`${key}${item.value}Option`}
              >
                {item.label}
              </Radio>
            ))}
            {dataElementSupported && (
              <Radio value="dataElement" data-test-id={`${key}DataElement`}>
                Provide a data element
              </Radio>
            )}
          </FormikRadioGroup>
          {value === "dataElement" && (
            <FieldSubset>
              <DataElementSelector>
                <FormikTextField
                  data-test-id={`${key}DataElementField`}
                  name={`${key}DataElement`}
                  aria-label={`${label} data element`}
                  description={dataElementDescription}
                  width="size-5000"
                />
              </DataElementSelector>
            </FieldSubset>
          )}
        </>
      );
    }
  };
};
