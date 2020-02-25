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
import React from "react";
import Select from "@react/react-spectrum/Select";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import { object, string } from "yup";
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import "./setConsent.styl";
import InfoTipLayout from "../components/infoTipLayout";

const purposesEnum = {
  IN: "in",
  OUT: "out",
  DATA_ELEMENT: "dataElement"
};

/*
 * The settings object for this action has the form of:
 * {
 *   instanceName, // the name of the instance
 *   consent: {
 *     general // valid values are "in" and "out"
 *   }
 * }
 * ---OR---
 * {
 *   instanceName,
 *   // this should resolve to either { general: "in" } or { general: "out" }
 *   consent: "%dataElement123%"
 * }
 *
 * The formic object looks like this:
 * {
 *   instanceName,
 *   option, // "in", "out", or "dataElement"
 *   dataElement
 * }
 *
 * When we get to more granular purposes, we can augment the settings object to include
 * additional purposes. We will need to re-vamp the UI and the formic object when that happens.
 */
const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    consent
  } = initInfo.settings || {};

  const initialValues = {
    instanceName
  };

  if (typeof consent === "string") {
    initialValues.option = purposesEnum.DATA_ELEMENT;
    initialValues.dataElement = consent;
  } else if (
    consent &&
    consent.general &&
    (consent.general === purposesEnum.IN ||
      consent.general === purposesEnum.OUT)
  ) {
    initialValues.option = consent.general;
    initialValues.dataElement = "";
  } else {
    initialValues.option = purposesEnum.IN;
    initialValues.dataElement = "";
  }

  return initialValues;
};

const getSettings = ({ values }) => {
  const { instanceName, option, dataElement } = values;

  const settings = {
    instanceName
  };

  if (option === purposesEnum.IN || option === purposesEnum.OUT) {
    settings.consent = { general: option };
  } else {
    settings.consent = dataElement;
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element";
const validationSchema = object().shape({
  dataElement: string().matches(singleDataElementRegex, {
    message: invalidDataMessage,
    excludeEmptyString: true
  })
});

const SetConsent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo, formikProps }) => {
        return (
          <div>
            <div>
              <FieldLabel labelFor="instanceNameField" label="Instance" />
              <div>
                <WrappedField
                  id="instanceNameField"
                  name="instanceName"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={getInstanceOptions(initInfo)}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <FieldLabel
                labelFor="generalConsent"
                label="The user consented:"
              />
              <WrappedField
                id="generalConsentField"
                name="option"
                component={RadioGroup}
                componentClassName="u-flexColumn"
              >
                <Radio value={purposesEnum.IN} label="In" />
                <Radio value={purposesEnum.OUT} label="Out" />
                <Radio
                  value={purposesEnum.DATA_ELEMENT}
                  label="Consent provided by data element"
                />
              </WrappedField>
            </div>
            {formikProps.values.option === purposesEnum.DATA_ELEMENT ? (
              <div className="FieldSubset u-gapTop">
                <InfoTipLayout tip='The data element should return { general: "in" } or { general: "out" }.'>
                  <FieldLabel
                    labelFor="dataElementField"
                    label="Data Element"
                  />
                </InfoTipLayout>
                <div>
                  <WrappedField
                    id="dataElementField"
                    name="dataElement"
                    component={Textfield}
                    componentClassName="u-fieldLong"
                    supportDataElement="replace"
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      }}
    />
  );
};

render(SetConsent);
