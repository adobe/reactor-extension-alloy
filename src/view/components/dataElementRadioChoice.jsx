import singleDataElementRegex from "../constants/singleDataElementRegex";
import ExtensionViewForm from "./extensionViewForm";
import { string, object } from "yup";
import React, { useContext, useRef } from "react";
import ExtensionViewContext from "./extensionViewContext";
import DataElementSelector from "./dataElementSelector";
import ImperativeForm from "./imperativeForm";
import { RadioGroup, TextField } from "./formikReactSpectrum3";
import { Radio } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import { useField } from "formik";


const CONSTANT = "constant";
const DATA_ELEMENT = "dataElement";

const DataElementRadioChoice = ({
  name,
  label,
  dataElementLabel,
  constantLabel,
  isRequired = false,
  children
}) => {

  const inputMethodName = `${name}InputMethod`;
  const dataElementName = `${name}DataElement`;

  const getInitialValues = ({ initInfo }) => {
    console.log("getInitialValues of dataElementRadioChoice");
    const { [name]: value } = initInfo.settings || {};

    if (typeof value === "string") {
      return {
        [inputMethodName]: DATA_ELEMENT,
        [dataElementName]: value
      };
    }

    return {
      [inputMethodName]: CONSTANT,
      [dataElementName]: ""
    };
  };

  const getSettings = ({ values }) => {
    if (values[inputMethodName] === DATA_ELEMENT) {
      return { [name]: values[dataElementName] };
    }
    else {
      // Let the children set the settings for this name
      return {};
    }
  };

  let dataElementSchema = string().matches(
    singleDataElementRegex,
    DATA_ELEMENT_REQUIRED
  )
  if (isRequired) {
    dataElementSchema = dataElementSchema.required(DATA_ELEMENT_REQUIRED);
  }
  const validationSchema = object().shape({
    [dataElementName]: string().when(inputMethodName, {
      is: DATA_ELEMENT,
      then: dataElementSchema
    })
  });

  const [{ value: inputMethod }] = useField(inputMethodName);

  return (
    <ImperativeForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      name="consent"
      render={() => (
        <>
          <div className="u-gapBottom">
            <RadioGroup
              name={inputMethodName}
              orientation="horizontal"
              label={label}
            >
              <Radio data-test-id={`${name}ConstantOption`} value={CONSTANT}>
                {constantLabel}
              </Radio>
              <Radio data-test-id={`${name}DataElementOption`} value={DATA_ELEMENT}>
                {dataElementLabel}
              </Radio>
            </RadioGroup>
          </div>
          {inputMethod === DATA_ELEMENT && (
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
          {inputMethod === CONSTANT && (
            <div className="FieldSubset">
              {children}
            </div>
          )}
        </>
      )}
    />
  )

};

DataElementRadioChoice.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  dataElementLabel: PropTypes.string.isRequired,
  constantLabel: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default DataElementRadioChoice;
