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
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import InfoTipLayout from "./infoTipLayout";
import WrappedField from "./wrappedField";
import { getValue, setValue } from "../utils/nameUtils";
import ImperativeForm from "./imperativeForm";
import createValidateName from "../utils/createValidateName";
import { object, string } from "yup";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import { useField } from "formik";

export const DATA_ELEMENT = "dataElement";

const OptionsWithDataElement = ({
  label,
  description,
  options,
  defaultValue,
  id,
  "data-test-id": dataTestId,
  name
}) => {

  const radioName = `${name}.radio`;
  const dataElementName = `${name}.dataElement`;

  const getInitialValues = ({ initInfo }) => {
    const value = getValue(initInfo.settings, name);

    let radioValue, dataElementValue;

    if (typeof value === "string" && value.matches(DATA_ELEMENT_REGEX)) {
      radioValue = DATA_ELEMENT;
      dataElementValue = value;
    } else {
      const selectedItem = options.find(option => option.value === value);
      if (selectedItem) {
        radioValue = `${selectedItem.value}`;
        dataElementValue = "";
      } else {
        const defaultItem = options.find(option => option.value === defaultValue);
        if (defaultItem) {
          radioValue = `${defaultItem.key}`;
          dataElementValue = "";
        }
        throw new Error("No defaultValue specified matching an option.");
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
    setValue(settings, name, value);
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
      render={() => (
        <>
          <RadioGroup
            name={radioName}
            label={label}
          >
            {options.map(({ value, label }) => (
              <Radio
                key={`${value}`}
                value={`${value}`}
                label={label}
              />
            ))}
          </RadioGroup>
          { radioValue === DATA_ELEMENT && (
            <div className="FieldSubset">
              <DataElementSelector>
                <TextField
                  data-test-id={`${dataElementName}Field`}
                  name={dataElementName}
                  width="size-5000"
                  aria-label="Data Element"
                />
              </DataElementSelector>
            </div>
          )}
        </>
      )}
    />
  );
};
/*
    <div className="u-gapTop">
      <InfoTipLayout tip={infoTip}>
        <FieldLabel labelFor={`${id}RadioGroup`} label={label} />
      </InfoTipLayout>
      <WrappedField
        id={`${id}RadioGroup`}
        name={`${name}.radio`}
        component={RadioGroup}
        componentClassName="u-flexColumn"
      >
        {options.map(
          ({
            value: optionValue,
            label: optionLabel,
            testId: optionTestId
          }) => (
            <Radio
              key={optionValue}
              data-test-id={`${dataTestId}${optionTestId || optionLabel}Radio`}
              value={optionValue}
              label={optionLabel}
            />
          )
        )}
        <Radio
          data-test-id={`${dataTestId}DataElementRadio`}
          value={DATA_ELEMENT}
          label="Provided by data element"
        />
      </WrappedField>

      {values && values.radio === DATA_ELEMENT && (
        <div>
          <WrappedField
            id={`${id}DataElement`}
            data-test-id={`${dataTestId}DataElementField`}
            name={`${name}.dataElement`}
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement="replace"
          />
        </div>
      )}
    </div>
  );
};
*/
OptionsWithDataElement.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  infoTip: PropTypes.string,
  id: PropTypes.string,
  "data-test-id": PropTypes.string,
  name: PropTypes.string,
  values: PropTypes.object
};

export default OptionsWithDataElement;
