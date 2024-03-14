/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import React, { useEffect } from "react";
import { string, object } from "yup";
import { Radio } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import FieldSubset from "../components/fieldSubset";
import form from "./form";
import FormElementContainer from "../components/formElementContainer";
import FormikTextArea from "../components/formikReactSpectrum3/formikTextArea";

import {
  PARTS,
  WHOLE
} from "../components/objectEditor/constants/populationStrategy";

/** @typedef {import("./form").Form} Form */
/**
 * This creates a form field for a radio group and supports data elements.
 * @param {object} options - Options for the radio group.
 * @param {string} options.name - The formik key to use for this field. The
 * following formik keys will be used:
 *  - `${name}Option` - The radio group field.
 *  - `${name}DataElement` - The data element field.
 *  - `${name}` - The field for the child form.
 * @param {boolean} [options.isRequired] - Whether or not the field is required.
 * @param {boolean} [options.dataElementSupported] - Whether or not a "Provide a
 * data element" option should be available.
 * @param {string} options.label - The label to use for the field.
 * @param {string} [options.defaultValue] - The default value to use for the radio
 * group.
 * @param {string} [options.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the values the
 * data element could resolve to.
 * @param {{ value: string, label: string }[]} options.items - The items to use for the radio group.
 * @param {string} [options.description] - The description to use for the radio group.
 * @param {boolean} [options.beta] - If true, a beta badge will be shown next to the
 * radio group label.
 * @returns {Form} A form field for a radio group.
 */
export default function jsonOptionalEditor(
  {
    name,
    optionName = `${name}Option`,
    label,
    "aria-label": ariaLabel,
    description
  },
  children
) {
  const {
    getInitialValues: getChildrenInitialValues,
    getSettings: getChildrenSettings,
    validationShape: childrenValidationShape,
    Component: ChildrenComponent
  } = form({}, children);

  const validationShape = {};
  validationShape[`${name}Whole`] = string().when(optionName, {
    is: WHOLE,
    then: schema =>
      schema.test(
        "is-json-or-data-element",
        "Please provide a valid JSON object or a data element.",
        (value, context) => {
          if (value === "" || value.match(singleDataElementRegex)) {
            return true;
          }
          try {
            JSON.parse(value);
            return true;
          } catch ({ message = "" }) {
            context.createError({
              path: `${name}DataElement`,
              message: `Please provide a valid JSON object or a data element. ${message}`
            });
            return false;
          }
        }
      )
  });
  validationShape[name] = object().shape(childrenValidationShape);

  const formPart = {
    getInitialValues({ initInfo }) {
      const value = initInfo.settings || {};
      const initialValues = {
        [`${name}Whole`]: "",
        [optionName]: PARTS
      };
      if (typeof value === "string") {
        initialValues[`${name}Whole`] = value;
        initialValues[optionName] = WHOLE;
      }

      initialValues[name] = getChildrenInitialValues({
        initInfo: { settings: value }
      });
      return initialValues;
    },
    getSettings({ values }) {
      const settings = {};
      if (values[optionName] === WHOLE) {
        if (values[`${name}Whole`].match(singleDataElementRegex)) {
          settings[name] = values[`${name}Whole`];
        } else {
          try {
            settings[name] = JSON.parse(values[`${name}Whole`]);
          } catch (e) {
            // eslint-disable-next-line no-empty
          }
        }
      } else if (values[name] !== "") {
        settings[name] = getChildrenSettings({ values: values[name] });
      }
      return settings;
    },
    validationShape,
    Component: ({ namePrefix = "" }) => {
      const [{ value: optionValue }] = useField(`${namePrefix}${optionName}`);
      const [{ value }, , { setValue }] = useField(`${namePrefix}${name}`);
      const [{ value: wholeValue }, , { setValue: setWholeValue }] = useField(
        `${namePrefix}${name}Whole`
      );
      const lastOptionValue = React.useRef(optionValue);
      useEffect(() => {
        if (optionValue === PARTS && lastOptionValue.current === WHOLE) {
          try {
            setValue(
              getChildrenInitialValues({
                initInfo: { settings: JSON.parse(wholeValue) }
              })
            );
          } catch (e) {
            setValue(getChildrenInitialValues({ initInfo: { settings: {} } }));
          }
        } else if (optionValue === WHOLE && lastOptionValue.current === PARTS) {
          const v = JSON.stringify(
            getChildrenSettings({ values: value }),
            null,
            2
          );

          if (v !== "{}") {
            setWholeValue(v);
          }
        }
        lastOptionValue.current = optionValue;
      }, [optionValue]);
      return (
        <FormElementContainer>
          <FormikRadioGroup
            data-test-id={`${namePrefix}${name}Field`}
            name={`${namePrefix}${optionName}`}
            label={label}
            aria-label={label || ariaLabel}
            orientation="horizontal"
            description={description}
          >
            <Radio
              value={PARTS}
              data-test-id={`${namePrefix}${name}PartsOption`}
            >
              Provide individual attributes
            </Radio>
            <Radio value={WHOLE} data-test-id={`${namePrefix}${name}WholeOption`}>
              Provide JSON or Data Element
            </Radio>
          </FormikRadioGroup>
          {optionValue === WHOLE && (
            <FieldSubset>
              <DataElementSelector>
                <FormikTextArea
                  data-test-id={`${namePrefix}${name}Whole`}
                  name={`${namePrefix}${name}Whole`}
                  aria-label="Value"
                  description={
                    "You can provide Data Elements for individual fields within the JSON " +
                    '(e.g. "%My Data%") or provide one data element for the entire object.'
                  }
                  width="size-6000"
                />
              </DataElementSelector>
            </FieldSubset>
          )}
          {optionValue === PARTS && (
            <FieldSubset>
              <ChildrenComponent namePrefix={`${namePrefix}${name}.`} />
            </FieldSubset>
          )}
        </FormElementContainer>
      );
    }
  };

  formPart.Component.propTypes = {
    namePrefix: PropTypes.string
  };

  return formPart;
}
