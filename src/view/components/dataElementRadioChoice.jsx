import singleDataElementRegex from "../constants/singleDataElementRegex";
import ExtensionViewForm from "./extensionViewForm";
import { string, object } from "yup";
import React, { useContext, useRef } from "react";
import ExtensionViewContext from "./extensionViewContext";
import DataElementSelector from "./dataElementSelector";
import TransientView from "./transientView";
import { RadioGroup, TextField } from "./formikReactSpectrum3";
import { Radio } from "@adobe/react-spectrum";
import PropTypes from "prop-types";

const CONSTANT = "constant";
const DATA_ELEMENT = "data_element";

const DataElementRadioChoice = ({
  name,
  label,
  dataElementLabel,
  constantLabel,
  isRequired = false,
  children
}) => {

  // TODO: get name off of Child?

  const { initInfo } = useContext(ExtensionViewContext);

  const getInitialValues = () => {
    const { [name]: value } = initInfo.settings || {};

    if (typeof value === "string") {
      return {
        inputMethod: DATA_ELEMENT,
        dataElement: value
      };
    }

    return {
      inputMethod: CONSTANT,
      dataElement: ""
    };
  };

  const getSettings = ({ values }) => {
    if (values.inputMethod === DATA_ELEMENT) {
      return { [name]: values.dataElement };
    }
    else {
      // Let the children set the settings for this name
      return {};
    }
  };

  let dataElementSchema = string().matches(
    singleDataElementRegex,
    "Please specify a data element"
  )
  if (isRequired) {
    dataElementSchema = dataElementSchema.required("Please specify a data element");
  }
  const validationSchema = object().shape({
    dataElement: string().when("inputMethod", {
      is: DATA_ELEMENT,
      then: dataElementSchema
    })
  });

  const memento = useRef();

  return (
    <ExtensionViewForm
      initialValues={getInitialValues()}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps }) => {
        return (
          <>
            <div className="u-gapBottom">
              <RadioGroup
                name="inputMethod"
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
            {formikProps.values.inputMethod === DATA_ELEMENT && (
              <div className="FieldSubset">
                <DataElementSelector>
                  <TextField
                    data-test-id={`${name}DataElementField`}
                    name="dataElement"
                    width="size-5000"
                    aria-label="Data Element"
                  />
                </DataElementSelector>
              </div>
            )}
            {formikProps.values.inputMethod === CONSTANT && (
              <div className="FieldSubset">
                <TransientView memento={memento}>
                  {children}
                </TransientView>
              </div>
            )}
          </>
        );
      }}
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
