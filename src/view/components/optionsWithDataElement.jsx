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
import { Radio } from "@adobe/react-spectrum";
import { object, string } from "yup";
import { useField } from "formik";
import { RadioGroup, TextField } from "./formikReactSpectrum3";
import { getValue, setValue } from "../utils/nameUtils";
import ImperativeForm from "./partialForm";
import createValidateName from "../utils/createValidateName";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import DataElementSelector from "./dataElementSelector";

export const DATA_ELEMENT = "dataElement";

const OptionsWithDataElement = ({
  label,
  description,
  options,
  defaultValue,
  name,
  setting = name,
  dataTestIdPrefix = name
}) => {
  const radioName = `${name}.radio`;
  const dataElementName = `${name}.dataElement`;

  const getInitialValues = ({ initInfo }) => {
    const value = getValue(initInfo.settings, setting);

    let radioValue;
    let dataElementValue;

    if (typeof value === "string" && singleDataElementRegex.test(value)) {
      radioValue = DATA_ELEMENT;
      dataElementValue = value;
    } else {
      const selectedItem = options.find(option => option.value === value);
      if (selectedItem) {
        radioValue = `${selectedItem.value}`;
        dataElementValue = "";
      } else {
        const defaultItem = options.find(
          option => option.value === defaultValue
        );
        if (defaultItem) {
          radioValue = `${defaultItem.value}`;
          dataElementValue = "";
        } else {
          throw new Error("No defaultValue specified matching an option.");
        }
      }
    }

    const initialValues = {};
    setValue(initialValues, radioName, radioValue);
    setValue(initialValues, dataElementName, dataElementValue);
    return initialValues;
  };

  const getSettings = ({ values }) => {
    const radioValue = getValue(values, radioName);
    const dataElementValue = getValue(values, dataElementName);

    let value;
    if (radioValue === DATA_ELEMENT) {
      value = dataElementValue;
    } else {
      value = options.find(option => `${option.value}` === radioValue).value;
    }

    const settings = {};
    setValue(settings, setting, value);
    return settings;
  };

  const validateFormikState = createValidateName(
    name,
    object().shape({
      dataElement: string().when("radio", {
        is: DATA_ELEMENT,
        then: string()
          .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          .required(DATA_ELEMENT_REQUIRED)
      })
    })
  );

  const [{ value: radioValue }] = useField(radioName);

  return (
    <ImperativeForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validateFormikState={validateFormikState}
      name={name}
      render={() => {
        return (
          <>
            <RadioGroup name={radioName} label={label} isRequired>
              {options.map(({ value, label: optionLabel }) => (
                <Radio
                  value={`${value}`}
                  data-test-id={`${dataTestIdPrefix}${optionLabel}Radio`}
                  key={value}
                >
                  {optionLabel}
                </Radio>
              ))}
              <Radio
                value={DATA_ELEMENT}
                data-test-id={`${dataTestIdPrefix}DataElementRadio`}
              >
                Use a data element
              </Radio>
            </RadioGroup>
            {radioValue === DATA_ELEMENT && (
              <div className="FieldSubset">
                <DataElementSelector>
                  <TextField
                    data-test-id={`${dataTestIdPrefix}DataElementField`}
                    name={dataElementName}
                    width="size-5000"
                    aria-label="Data Element"
                    description={description}
                  />
                </DataElementSelector>
              </div>
            )}
          </>
        );
      }}
    />
  );
};

OptionsWithDataElement.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.any,
  name: PropTypes.string.isRequired,
  setting: PropTypes.string,
  dataTestIdPrefix: PropTypes.string
};

export default OptionsWithDataElement;
