import React from "react";
import { FieldArray, useField } from "formik";
import { Button, Item, Flex, Well, Text } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { array, mixed, object, string } from "yup";
import { TextField, Picker } from "./formikReactSpectrum3";
import PartialForm from "./partialForm";
import OptionsWithDataElement from "./optionsWithDataElement";
import DataElementSelector from "./dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

const ADOBE = { value: "adobe", label: "Adobe" };
const IAB_TCF = { value: "iab_tcf", label: "IAB TCF" };
const VERSION_1_0 = { value: "1.0", label: "1.0" };
const VERSION_2_0 = { value: "2.0", label: "2.0" };
const IN = { value: "in", label: "In" };
const OUT = { value: "out", label: "Out" };
const YES = { value: true, label: "Yes" };
const NO = { value: false, label: "No" };

const createDefaultConsentObject = () => {
  return {
    standard: ADOBE.value,
    adobeVersion: VERSION_1_0.value,
    iabVersion: "2.0",
    value: "",
    iabValue: ""
  };
};

const ConsentObjects = () => {
  const getInitialValues = ({ initInfo }) => {
    const { consent } = initInfo.settings || {};

    if (!Array.isArray(consent)) {
      return { consent: [createDefaultConsentObject()] };
    }

    return {
      consent: consent.map(({ standard, version, value }) => {
        const consentObject = createDefaultConsentObject();
        if (standard === ADOBE.label) {
          consentObject.standard = ADOBE.value;
          consentObject.adobeVersion = version;
        }
        if (standard === ADOBE.label && version === VERSION_2_0.value) {
          consentObject.value = value;
        }
        if (standard === IAB_TCF.label) {
          consentObject.standard = IAB_TCF.value;
          consentObject.iabVersion = version;
          consentObject.iabValue = value;
        }
        return consentObject;
      })
    };
  };

  const getSettings = ({ values }) => {
    const consent = values.consent.map(
      ({ standard, adobeVersion, value, iabVersion, iabValue }) => {
        if (standard === ADOBE.value && adobeVersion === VERSION_1_0.value) {
          return { standard: ADOBE.label, version: adobeVersion };
        }
        if (standard === ADOBE.value) {
          return { standard: ADOBE.label, version: adobeVersion, value };
        }
        return {
          standard: IAB_TCF.label,
          version: iabVersion,
          value: iabValue
        };
      }
    );
    return { consent };
  };

  const [{ value: consent }] = useField("consent");

  const validationSchema = object().shape({
    consent: array().of(
      object().shape({
        standard: string().required("Please specify a standard."),
        value: mixed().when(["standard", "adobeVersion"], {
          is: (standard, adobeVersion) =>
            standard === ADOBE.value && adobeVersion !== "1.0",
          then: string()
            .required(DATA_ELEMENT_REQUIRED)
            .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
        }),
        iabVersion: mixed().when(["standard"], {
          is: IAB_TCF.value,
          then: string().required("Please specify a version.")
        }),
        iabValue: mixed().when(["standard"], {
          is: IAB_TCF.value,
          then: string().required("Please specify a value.")
        })
      })
    )
  });

  return (
    <PartialForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      name="consentObjects"
      render={() => {
        return (
          <FieldArray
            name="consent"
            render={arrayHelpers => {
              return (
                <>
                  <Flex>
                    <Button
                      variant="primary"
                      data-test-id="addConsentButton"
                      onPress={() => {
                        arrayHelpers.push(createDefaultConsentObject());
                      }}
                      marginStart="auto"
                    >
                      Add Consent Object
                    </Button>
                  </Flex>
                  {consent.map((value, index) => {
                    return (
                      <div key={index}>
                        <Well data-test-id={`consentObject${index}`}>
                          <Flex direction="column">
                            <Picker
                              data-test-id="standardPicker"
                              name={`consent[${index}].standard`}
                              label="Standard"
                              description="The consent standard for this consent object"
                              items={[ADOBE, IAB_TCF]}
                              width="size-5000"
                              isRequired
                            >
                              {item => (
                                <Item key={item.value}>{item.label}</Item>
                              )}
                            </Picker>
                            {value.standard === ADOBE.value && (
                              <Picker
                                data-test-id="adobeVersionPicker"
                                name={`consent[${index}].adobeVersion`}
                                label="Version"
                                description="The consent standard version for this consent object"
                                items={[VERSION_1_0, VERSION_2_0]}
                                width="size-5000"
                                isRequired
                              >
                                {item => (
                                  <Item key={item.value}>{item.label}</Item>
                                )}
                              </Picker>
                            )}
                            {value.standard === ADOBE.value &&
                              value.adobeVersion === VERSION_1_0.value && (
                                <OptionsWithDataElement
                                  label="General Consent"
                                  description="The general consent level."
                                  dataTestIdPrefix="general"
                                  name={`consent[${index}].general`}
                                  setting={`consent[${index}].value.general`}
                                  options={[IN, OUT]}
                                  defaultValue={IN.value}
                                />
                              )}
                            {value.standard === ADOBE.value &&
                              value.adobeVersion !== VERSION_1_0.value && (
                                <DataElementSelector>
                                  <TextField
                                    data-test-id="valueField"
                                    name={`consent[${index}].value`}
                                    label="Value"
                                    description="Provide a data element containing the Adobe consent XDM object"
                                    width="size-5000"
                                    isRequired
                                  />
                                </DataElementSelector>
                              )}
                            {value.standard === IAB_TCF.value && (
                              <>
                                <TextField
                                  data-test-id="iabVersionField"
                                  name={`consent[${index}].iabVersion`}
                                  label="Version"
                                  description="The IAB TCF standard version"
                                  width="size-5000"
                                  isRequired
                                />
                                <DataElementSelector>
                                  <TextField
                                    data-test-id="iabValueField"
                                    name={`consent[${index}].iabValue`}
                                    label="Value"
                                    description="The encoded IAB TCF consent value"
                                    width="size-5000"
                                    isRequired
                                  />
                                </DataElementSelector>
                                <OptionsWithDataElement
                                  label="GDPR Applies"
                                  name={`consent[${index}].gdprApplies`}
                                  dataTestIdPrefix="gdprApplies"
                                  options={[YES, NO]}
                                  defaultValue={YES.value}
                                />
                                <OptionsWithDataElement
                                  label="GDPR Contains Personal Data"
                                  name={`consent[${index}].gdprContainsPersonalData`}
                                  dataTestIdPrefix="gdprContainsPersonalData"
                                  options={[YES, NO]}
                                  defaultValue={NO.value}
                                />
                              </>
                            )}
                            {consent.length > 1 && (
                              <div className="u-gapTop">
                                <Button
                                  variant="secondary"
                                  onPress={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                  aria-label="Delete"
                                  data-test-id="deleteConsentButton"
                                >
                                  <Delete />
                                  <Text>Delete Consent Object</Text>
                                </Button>
                              </div>
                            )}
                          </Flex>
                        </Well>
                      </div>
                    );
                  })}
                </>
              );
            }}
          />
        );
      }}
    />
  );
};

export default ConsentObjects;
