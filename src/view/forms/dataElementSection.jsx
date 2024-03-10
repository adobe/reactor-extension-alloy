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
import React from "react";
import { useField } from "formik";
import { Radio } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { object, string } from "yup";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import DataElementSelector from "../components/dataElementSelector";
import form from "./form";
import SectionHeader from "../components/sectionHeader";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

const FORM = "form";
const DATA_ELEMENT = "dataElement";

/** @typedef {import("./form").Form} Form */
/**
 * This creates a form element that allows to create an object with string keys and values or a string data element. Any items with no
 * values filled in will be removed from the final settings.
 * @param {object} options - Options for the field.
 * @param {string} options.name - The formik key to use for this field.
 *  - `${key}` will be used to store the object.
 *  - `${key}InputMethod` will be used to determine whether to use a data
 *    element.
 *  - `${key}DataElement` will be used to store the data element value.
 * @param {string} options.label - The label to use for the field.
 * @param {string} [options.dataElementDescription] - The description to use for
 * the data element field. Usually you would use this to describe the type the
 * data element should be or what object it should return.
 * @param {string} [options.objectKey] - If you want to create an object, use
 * this to specify the Formik key to use for the keys of the object.
 * @param {Form[]} children - The Form parts to use for the object. These will
 * be used to create the form. When rendering the
 * components, the `prefixName` prop will be set to `${name}.`
 * @returns {Form} A form element that allows the user to create an object with string keys and values.
 */
export default function dataElementSection(
  { name, label, learnMoreUrl, dataElementDescription, objectKey },
  children = []
) {
  const {
    getInitialValues: getChildrenInitialValues,
    validationShape: childrenValidationShape,
    Component
  } = form({}, children);

  const buildDefaultValues = () =>
    getChildrenInitialValues({ initInfo: { settings: null } });

  const validationShape = {
    [name]: object().when(`${name}InputMethod`, {
      is: FORM,
      then: schema => schema.shape(childrenValidationShape)
    }),
    [`${name}DataElement`]: string().when(`${name}InputMethod`, {
      is: DATA_ELEMENT,
      then: schema =>
        schema
          .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          .required(DATA_ELEMENT_REQUIRED)
    })
  };

  const formPart = {
    getInitialValues({ initInfo }) {
      const { [name]: value } = initInfo.settings || {};

      const initialValues = {
        [name]: buildDefaultValues(),
        [`${name}InputMethod`]: FORM,
        [`${name}DataElement`]: ""
      };

      if (typeof value === "object" && value !== null) {
        initialValues[name] = value;
        initialValues[`${name}InputMethod`] = FORM;
      }

      if (typeof value === "string") {
        initialValues[name] = [""];
        initialValues[`${name}InputMethod`] = DATA_ELEMENT;
        initialValues[`${name}DataElement`] = value;
      }
      return initialValues;
    },
    getSettings({ values }) {
      const settings = {};
      if (values[`${name}InputMethod`] === DATA_ELEMENT) {
        settings[name] = values[`${name}DataElement`];
      }
      if (values[`${name}InputMethod`] === FORM) {
        settings[name] = values[name];
      }
      return settings;
    },
    validationShape,
    Component: ({ namePrefix = "", ...props }) => {
      const [{ value: inputMethod }] = useField(
        `${namePrefix}${name}InputMethod`
      );

      return (
        <>
          <SectionHeader learnMoreUrl={learnMoreUrl}>{label}</SectionHeader>
          <FormikRadioGroup
            name={`${namePrefix}${name}InputMethod`}
            orientation="horizontal"
          >
            <Radio data-test-id={`${namePrefix}${name}FormOption`} value={FORM}>
              Enter values manually
            </Radio>
            <Radio
              data-test-id={`${namePrefix}${name}DataElementOption`}
              value={DATA_ELEMENT}
            >
              Provide a data element.
            </Radio>
          </FormikRadioGroup>
          {inputMethod === FORM && (
            <Component
              name={name}
              namePrefix={`${namePrefix}${name}.`}
              {...props}
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
