/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "regenerator-runtime"; // needed for some of react-spectrum
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FieldArray } from "formik";
import Select from "@react/react-spectrum/Select";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";
import Button from "@react/react-spectrum/Button";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Delete from "@react/react-spectrum/Icon/Delete";
import Add from "@react/react-spectrum/Icon/Add";
import Well from "@react/react-spectrum/Well";
import Heading from "@react/react-spectrum/Heading";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import { object, string, array, mixed } from "yup";
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import "./setConsent.styl";
import InfoTipLayout from "../components/infoTipLayout";
import OptionsWithDataElement, {
  DATA_ELEMENT as DATA_ELEMENT_OPTION
} from "../components/optionsWithDataElement";

const IN = { value: "in", label: "In" };
const OUT = { value: "out", label: "Out" };
const FORM = { value: "form", label: "Fill out a form" };
const DATA_ELEMENT = { value: "dataElement", label: "Use a data element" };
const YES = { value: "yes", label: "Yes" };
const NO = { value: "no", label: "No" };
const ADOBE = { value: "adobe", label: "Adobe" };
const IAB_TCF = { value: "iab_tcf", label: "IAB TCF" };

/*
 * The settings object for this action has the form of:
 * {
 *   instanceName, // the name of the instance
 *   consent: [{
 *    standard: "Adobe",
 *    version: "1.0",
 *    value: {
 *      general // valid values are "in" and "out"
 *    }
 *   },
 *   {
 *     standard: "IAB TCF",
 *     version: "2.0",
 *     value: "1234abcd",
 *     gdprApplies: true,
 *     gdprContainsPersonalData: false
 *   },
 *   {
 *     standard: "Adobe",
 *     version: "2.0",
 *     value: "%dataElement123%"
 *   }
 *   ...]
 * }
 * ---OR---
 * {
 *   instanceName,
 *   // this should resolve to the preferences object above
 *   consent: "%dataElement123%"
 * }
 *
 * The formik object looks like this:
 * {
 *   instanceName,
 *   inputMethod, // "dataElement" or "form"
 *   dataElement: "%data_element%" or
 *   consent: [
 *     {
 *       standard: ("adobe" or "iab_tcf"),
 *       version: "1.0",
 *       general: optionsWithDataElement("in", "out"),
 *       value: "%data_element%"
 *       iabValue: "1234abcd", // or data_element
 *       gdprApplies: optionsWithDataElement(true, false),
 *       gdprContainsPersonalData: optionsWithDataElement(true, false)
 *     },
 *     ...
 *   ]
 * }
 *
 * When we get to more granular purposes, we can augment the settings object to include
 * additional purposes. We will need to re-vamp the UI and the formik object when that happens.
 */

const createBlankConsentObject = () => {
  return {
    standard: "adobe",
    version: "",
    general: { radio: IN.value, dataElement: "" },
    value: "",
    iabValue: "",
    gdprApplies: { radio: YES.value, dataElement: "" },
    gdprContainsPersonalData: { radio: NO.value, dataElement: "" }
  };
};

const applyInitialValuesForOptionsWithDataElement = (
  value,
  formikValues,
  options
) => {
  if (singleDataElementRegex.test(value)) {
    formikValues.radio = DATA_ELEMENT_OPTION;
    formikValues.dataElement = value;
  } else if (options.includes(value)) {
    formikValues.radio = value;
  }
};

const booleanToYesNo = value => {
  if (value === true) {
    return YES.value;
  }
  if (value === false) {
    return NO.value;
  }
  // in this case it most likely is a dataElement string
  return value;
};

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    consent,
    identityMap
  } = initInfo.settings || {};

  const initialValues = {
    instanceName,
    identityMap
  };

  if (typeof consent === "string") {
    initialValues.inputMethod = DATA_ELEMENT.value;
    initialValues.dataElement = consent;
    initialValues.consentObjects = [createBlankConsentObject()];
  } else if (Array.isArray(consent)) {
    initialValues.inputMethod = FORM.value;
    initialValues.consent = consent.reduce((memo, consentObject) => {
      const formikConsentObject = createBlankConsentObject();
      if (consentObject.version) {
        formikConsentObject.version = consentObject.version;
      }
      if (consentObject.standard === ADOBE.label) {
        formikConsentObject.standard = ADOBE.value;
        if (consentObject.value && consentObject.value.general) {
          applyInitialValuesForOptionsWithDataElement(
            consentObject.value.general,
            formikConsentObject.general,
            [IN.value, OUT.value]
          );
        } else if (consentObject.value) {
          formikConsentObject.value = consentObject.value;
        }
      } else if (consentObject.standard === IAB_TCF.label) {
        formikConsentObject.standard = IAB_TCF.value;
        if (consentObject.value) {
          formikConsentObject.iabValue = consentObject.value;
        }
        if (consentObject.gdprApplies != null) {
          applyInitialValuesForOptionsWithDataElement(
            booleanToYesNo(consentObject.gdprApplies),
            formikConsentObject.gdprApplies,
            [YES.value, NO.value]
          );
        }
        if (consentObject.gdprContainsPersonalData != null) {
          applyInitialValuesForOptionsWithDataElement(
            booleanToYesNo(consentObject.gdprContainsPersonalData),
            formikConsentObject.gdprContainsPersonalData,
            [YES.value, NO.value]
          );
        }
      }
      memo.push(formikConsentObject);
      return memo;
    }, []);
  } else {
    initialValues.inputMethod = FORM.value;
    initialValues.dataElement = "";
    initialValues.consent = [createBlankConsentObject()];
  }
  return initialValues;
};

const getSettingsForOptionsWithDataElement = value => {
  if (value.radio === DATA_ELEMENT_OPTION) {
    return value.dataElement;
  }
  return value.radio;
};

const yesNoToBoolean = value => {
  if (value === YES.value) {
    return true;
  }
  if (value === NO.value) {
    return false;
  }
  // handle dataElement strings
  return value;
};

const getSettings = ({ values }) => {
  const {
    instanceName,
    identityMap,
    inputMethod,
    dataElement,
    consent
  } = values;

  const settings = {
    instanceName
  };

  if (identityMap) {
    settings.identityMap = identityMap;
  }

  if (inputMethod === DATA_ELEMENT.value) {
    settings.consent = dataElement;
  } else {
    settings.consent = consent.reduce((memo, formikConsentObject) => {
      if (formikConsentObject.standard === ADOBE.value) {
        if (formikConsentObject.version === "1.0") {
          memo.push({
            standard: ADOBE.label,
            version: formikConsentObject.version,
            value: {
              general: getSettingsForOptionsWithDataElement(
                formikConsentObject.general
              )
            }
          });
        } else {
          memo.push({
            standard: ADOBE.label,
            version: formikConsentObject.version,
            value: formikConsentObject.value
          });
        }
      } else if (formikConsentObject.standard === IAB_TCF.value) {
        memo.push({
          standard: IAB_TCF.label,
          version: formikConsentObject.version,
          value: formikConsentObject.iabValue,
          gdprApplies: yesNoToBoolean(
            getSettingsForOptionsWithDataElement(
              formikConsentObject.gdprApplies
            )
          ),
          gdprContainsPersonalData: yesNoToBoolean(
            getSettingsForOptionsWithDataElement(
              formikConsentObject.gdprContainsPersonalData
            )
          )
        });
      }
      return memo;
    }, []);
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element.";
const validationSchema = object().shape({
  instanceName: string().required(),
  identityMap: string().matches(singleDataElementRegex, invalidDataMessage),
  dataElement: mixed().when("inputMethod", {
    is: DATA_ELEMENT.value,
    then: string()
      .matches(singleDataElementRegex, invalidDataMessage)
      .required(invalidDataMessage)
  }),
  consent: array().when("inputMethod", {
    is: FORM.value,
    then: array().of(
      object().shape({
        standard: string().required("Plesase specify a standard."),
        version: string().required("Please specify a version."),
        general: mixed().when(["standard", "version"], {
          is: (standard, version) =>
            standard === ADOBE.value && version === "1.0",
          then: object().shape({
            dataElement: mixed().when("radio", {
              is: DATA_ELEMENT_OPTION,
              then: string().matches(singleDataElementRegex, invalidDataMessage)
            })
          })
        }),
        value: mixed().when(["standard", "version"], {
          is: (standard, version) =>
            standard === ADOBE.value && version !== "1.0",
          then: string()
            .required()
            .matches(singleDataElementRegex, invalidDataMessage)
        }),
        iabValue: mixed().when("standard", {
          is: IAB_TCF.value,
          then: string().required("Please specify a value.")
        }),
        gdprApplies: mixed().when("standard", {
          is: IAB_TCF.value,
          then: object().shape({
            radio: string().required(),
            dataElement: mixed().when("radio", {
              is: DATA_ELEMENT_OPTION,
              then: string().matches(singleDataElementRegex, invalidDataMessage)
            })
          })
        }),
        gdprContainsPersonalData: mixed().when("standard", {
          is: IAB_TCF.value,
          then: object().shape({
            radio: string().required(),
            dataElement: mixed().when("radio", {
              is: DATA_ELEMENT_OPTION,
              then: string().matches(singleDataElementRegex, invalidDataMessage)
            })
          })
        })
      })
    )
  })
});

const ConsentObject = ({ formikConsentObject, index }) => {
  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout tip="The consent standard for this consent object">
          <FieldLabel labelFor={`consent.${index}.standard`} label="Standard" />
        </InfoTipLayout>
        <WrappedField
          data-test-id="standardSelect"
          id={`consent.${index}.standard`}
          name={`consent.${index}.standard`}
          component={Select}
          options={[ADOBE, IAB_TCF]}
          componentClassName="u-fieldLong"
        />
      </div>
      <div className="u-gapTop">
        <InfoTipLayout tip="The consent standard version for this consent object">
          <FieldLabel labelFor={`consent.${index}.version`} label="Version" />
        </InfoTipLayout>
        <WrappedField
          data-test-id="versionField"
          id={`consent.${index}.version`}
          name={`consent.${index}.version`}
          component={Textfield}
          componentClassName="u-fieldLong"
        />
      </div>
      {formikConsentObject.standard === ADOBE.value &&
        formikConsentObject.version === "1.0" && (
          <OptionsWithDataElement
            label="General Consent"
            infoTip="The general consent level. If provided through a data element, it should resolve to 'in' or 'out'."
            id={`consent_${index}_general`}
            data-test-id="general"
            name={`consent.${index}.general`}
            options={[IN, OUT]}
            values={formikConsentObject.general}
          />
        )}
      {formikConsentObject.standard === ADOBE.value &&
        formikConsentObject.version !== "1.0" && (
          <Fragment>
            <InfoTipLayout tip="A data element containing the Adobe consent XDM object">
              <FieldLabel labelFor={`consent_${index}_value`} label="Value" />
            </InfoTipLayout>
            <WrappedField
              data-test-id="valueField"
              id={`consent_${index}_value`}
              name={`consent.${index}.value`}
              component={Textfield}
              componentClassName="u-fieldLong"
              supportDataElement="replace"
            />
          </Fragment>
        )}
      {formikConsentObject.standard === IAB_TCF.value && (
        <div>
          <div className="u-gapTop">
            <InfoTipLayout tip="The encoded IAB TCF consent value">
              <FieldLabel
                labelFor={`consent_${index}_iabValue`}
                label="Value"
              />
            </InfoTipLayout>
            <WrappedField
              data-test-id="iabValueField"
              id={`consent_${index}_iabValue`}
              name={`consent.${index}.iabValue`}
              component={Textfield}
              componentClassName="u-fieldLong"
              supportDataElement="append"
            />
          </div>
          <OptionsWithDataElement
            label="GDPR Applies"
            infoTip="Does GDPR apply to this consent value? A data element should resolve to true or false."
            id={`consent_${index}_gdprApplies`}
            data-test-id="gdprApplies"
            name={`consent.${index}.gdprApplies`}
            options={[YES, NO]}
            values={formikConsentObject.gdprApplies}
          />
          <OptionsWithDataElement
            label="GDPR Contains Personal Data"
            infoTip="Does the event data associated with this user contain personal data? A data element should resolve to true or false."
            id={`consent_${index}_gdprContainsPersonalData`}
            data-test-id="gdprContainsPersonalData"
            name={`consent.${index}.gdprContainsPersonalData`}
            options={[YES, NO]}
            values={formikConsentObject.gdprContainsPersonalData}
          />
        </div>
      )}
    </div>
  );
};
ConsentObject.propTypes = {
  formikConsentObject: PropTypes.object,
  index: PropTypes.number
};

const SetConsent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo, formikProps }) => {
        const { values } = formikProps;
        return (
          <div>
            <div>
              <FieldLabel labelFor="instanceNameField" label="Instance" />
              <div>
                <WrappedField
                  data-test-id="instanceNameSelect"
                  id="instanceNameField"
                  name="instanceName"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={getInstanceOptions(initInfo)}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout tip="Use a data element to provide custom identity information as part of the setConsent command. This data element should resolve to an identity map object.">
                <FieldLabel
                  labelFor="identityMapField"
                  label="Identity Map (Optional)"
                />
              </InfoTipLayout>
              <WrappedField
                data-test-id="identityMapField"
                id="identityMapField"
                name="identityMap"
                component={Textfield}
                componentClassName="u-fieldLong"
                supportDataElement="replace"
              />
            </div>
            <div className="u-gapTop">
              <InfoTipLayout
                tip="You can use a guided form to enter the consent information,
                     or provide a data element."
              >
                <Heading variant="subtitle2">Consent Information</Heading>
              </InfoTipLayout>
              <WrappedField
                name="inputMethod"
                id="inputMethod"
                component={RadioGroup}
              >
                <Radio
                  data-test-id="inputMethodFormRadio"
                  value={FORM.value}
                  label={FORM.label}
                />
                <Radio
                  data-test-id="inputMethodDataElementRadio"
                  value={DATA_ELEMENT.value}
                  label={DATA_ELEMENT.label}
                  className="u-gapLeft2x"
                />
              </WrappedField>
            </div>
            {values.inputMethod === FORM.value && (
              <div>
                <FieldArray
                  name="consent"
                  render={arrayHelpers => (
                    <Fragment>
                      <div className="u-gapTop u-alignRight">
                        <Button
                          data-test-id="addConsentButton"
                          label="Add Consent Object"
                          icon={<Add />}
                          onClick={() => {
                            arrayHelpers.push(createBlankConsentObject());
                          }}
                        />
                      </div>
                      {values.consent.map((formikConsentObject, index) => (
                        <Well
                          key={`consent${index}`}
                          className="u-gapTop"
                          data-test-id={`instance${index}`}
                        >
                          <ConsentObject
                            formikConsentObject={formikConsentObject}
                            index={index}
                          />
                          <Button
                            data-test-id="deleteConsentButton"
                            label="Delete Consent Object"
                            icon={<Delete />}
                            variant="action"
                            disabled={values.consent.length === 1}
                            onClick={() => {
                              arrayHelpers.remove(index);
                            }}
                            className="u-gapTop"
                          />
                        </Well>
                      ))}
                    </Fragment>
                  )}
                />
              </div>
            )}
            {values.inputMethod === DATA_ELEMENT.value && (
              <div className="u-gapTop">
                <InfoTipLayout tip="A data element containing an array of consent objects">
                  <FieldLabel labelFor="dataElement" label="Data Element" />
                </InfoTipLayout>
                <WrappedField
                  data-test-id="dataElementField"
                  id="dataElement"
                  name="dataElement"
                  component={Textfield}
                  componentClassName="u-fieldLong"
                  supportDataElement="replace"
                />
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

render(SetConsent);
