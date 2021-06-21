import { string, object } from "yup";
import React from "react";
import { Radio } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { useField } from "formik";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import DataElementSelector from "./dataElementSelector";
import ImperativeForm from "./partialForm";
import { RadioGroup, TextField } from "./formikReactSpectrum3";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import { getValue, setValue } from "../utils/nameUtils";
import createValidateName from "../utils/createValidateName";

const CONSTANT = "constant";
const DATA_ELEMENT = "dataElement";

const DataElementRadioChoice = ({
  name,
  setting,
  dataTestIdPrefix = name,
  label,
  dataElementLabel,
  constantLabel,
  isRequired = false,
  children
}) => {
  const inputMethodName = `${name}.inputMethod`;
  const dataElementName = `${name}.dataElement`;

  const getInitialValues = ({ initInfo }) => {
    const value = getValue(initInfo.settings, setting);

    const initialValues = {};
    if (typeof value === "string") {
      setValue(initialValues, inputMethodName, DATA_ELEMENT);
      setValue(initialValues, dataElementName, value);
    } else {
      setValue(initialValues, inputMethodName, CONSTANT);
      setValue(initialValues, dataElementName, "");
    }
    return initialValues;
  };

  const getSettings = ({ values }) => {
    const inputMethod = getValue(values, inputMethodName);
    const dataElement = getValue(values, dataElementName);

    const settings = {};
    if (inputMethod === DATA_ELEMENT && dataElement !== "") {
      setValue(settings, setting, dataElement);
    }
    // if inputMethod is CONSTANT, let the children set the settings
    return settings;
  };

  let dataElementSchema = string().matches(
    singleDataElementRegex,
    DATA_ELEMENT_REQUIRED
  );
  if (isRequired) {
    dataElementSchema = dataElementSchema.required(DATA_ELEMENT_REQUIRED);
  }
  const validationSchema = object().shape({
    dataElement: dataElementSchema
  });
  const [{ value: inputMethod }] = useField(inputMethodName);

  let validate = () => ({});
  if (inputMethod === DATA_ELEMENT) {
    validate = createValidateName(name, validationSchema);
  }

  return (
    <ImperativeForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validateFormikState={validate}
      name={name}
      render={() => {
        return (
          <>
            <div className="u-gapBottom">
              <RadioGroup
                name={inputMethodName}
                orientation="horizontal"
                label={label}
                isRequired
              >
                <Radio
                  data-test-id={`${dataTestIdPrefix}ConstantRadio`}
                  value={CONSTANT}
                >
                  {constantLabel}
                </Radio>
                <Radio
                  data-test-id={`${dataTestIdPrefix}DataElementRadio`}
                  value={DATA_ELEMENT}
                >
                  {dataElementLabel}
                </Radio>
              </RadioGroup>
            </div>
            {inputMethod === DATA_ELEMENT && (
              <DataElementSelector>
                <TextField
                  data-test-id={`${dataTestIdPrefix}DataElementField`}
                  name={dataElementName}
                  width="size-5000"
                  aria-label="Data Element"
                />
              </DataElementSelector>
            )}
            {inputMethod === CONSTANT && children}
          </>
        );
      }}
    />
  );
};

DataElementRadioChoice.propTypes = {
  name: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,
  dataTestIdPrefix: PropTypes.string,
  label: PropTypes.string.isRequired,
  dataElementLabel: PropTypes.string.isRequired,
  constantLabel: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default DataElementRadioChoice;
