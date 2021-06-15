import React from "react";
import { FieldArray, useField } from "formik";
import { Button, Item, Form, View, Text } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { TextField, Picker } from "./formikReactSpectrum3";
import ImperativeForm from "./imperativeForm";
import OptionsWithDataElement from "./optionsWithDataElement";
import DataElementSelector from "./dataElementSelector";

const ADOBE = { value: "adobe", label: "Adobe" };
const IAB_TCF = { value: "iab_tcf", label: "IAB TCF" };
const VERSION_1_0 = { value: "1.0", label: "1.0" };
const VERSION_2_0 = { value: "2.0", label: "2.0" };
const IN = { value: "in", label: "In" };
const OUT = { value: "out", label: "Out" };
const YES = { value: true, label: "Yes" };
const NO = { value: false, label: "No" };

const ConsentObjects = () => {
  const getInitialValues = ({ initInfo }) => {
    const { consent } = initInfo.settings || {};

    if (!Array.isArray(consent)) {
      return { consent: [] };
    }

    return {
      consent: consent.map(({ standard, version, value }) => {
        if (standard === ADOBE.value && version === VERSION_1_0.value) {
          return { standard, adobeVersion: version };
        }
        if (standard === ADOBE.value) {
          return { standard, adobeVersion: version, value };
        }
        return { standard, iabVersion: version, iabValue: value };
      })
    };
  };

  const getSettings = ({ values }) => {
    const consent = values.consent.map(
      ({ standard, adobeVersion, value, iabVersion, iabValue }) => {
        if (standard === ADOBE.value && adobeVersion === VERSION_1_0.value) {
          return { standard, version: adobeVersion };
        }
        if (standard === ADOBE.value) {
          return { standard, version: adobeVersion, value };
        }
        return { standard, version: iabVersion, value: iabValue };
      }
    );
    return { consent };
  };

  const [{ value: consent }] = useField("consent");
  return (
    <ImperativeForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      name="consentObjects"
      render={() => {
        return (
          <FieldArray
            name="consent"
            render={arrayHelpers => {
              return (
                <>
                  {consent.map((value, index) => {
                    return (
                      <View
                        key={index}
                        borderWidth="thin"
                        borderColor="dark"
                        borderRadius="medium"
                        padding="size-250"
                      >
                        <Form>
                          <Picker
                            data-test-id="standardSelect"
                            name={`consent[${index}].standard`}
                            label="Standard"
                            description="The consent standard for this consent object"
                            items={[ADOBE, IAB_TCF]}
                            width="size-5000"
                            isRequired
                          >
                            {item => <Item key={item.value}>{item.label}</Item>}
                          </Picker>
                          {value.standard === ADOBE.value && (
                            <Picker
                              data-test-id="adobeVersionSelect"
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
                                data-test-id="general"
                                name={`consent[${index}].general`}
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
                              />
                              <DataElementSelector>
                                <TextField
                                  data-test-id="iabValueField"
                                  name={`consent[${index}].iabValue`}
                                  label="value"
                                  description="The encoded IAB TCF consent value"
                                  width="size-5000"
                                />
                              </DataElementSelector>
                              <OptionsWithDataElement
                                label="GDPR Applies"
                                name={`consent[${index}].gdprApplies`}
                                data-test-id="gdprApplies"
                                options={[YES, NO]}
                                defaultValue={YES.value}
                              />
                              <OptionsWithDataElement
                                label="GDPR Contains Personal Data"
                                name={`consent[${index}].gdprContainsPersonalData`}
                                data-test-id=""
                                options={[YES, NO]}
                                defaultValue={NO.value}
                              />
                            </>
                          )}
                        </Form>
                        {consent.length > 1 && (
                          <Button
                            variant="secondary"
                            onPress={() => {
                              arrayHelpers.remove(index);
                            }}
                            aria-label="Delete"
                          >
                            <Delete />
                            <Text>Delete Consent Object</Text>
                          </Button>
                        )}
                      </View>
                    );
                  })}
                  <Button
                    variant="primary"
                    data-test-id="addConsentButton"
                    onPress={() => {
                      arrayHelpers.push({
                        standard: ADOBE.value,
                        adobeVersion: VERSION_1_0.value
                      });
                    }}
                  >
                    Add Consent Object
                  </Button>
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
