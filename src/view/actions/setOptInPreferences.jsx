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
import Alert from "@react/react-spectrum/Alert";
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
import "./setOptInPreferences.styl";
import InfoTipLayout from "../components/infoTipLayout";

const purposesEnum = {
  ALL: "all",
  NONE: "none",
  DATA_ELEMENT: "dataElement"
};

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    purposes = purposesEnum.ALL
  } = initInfo.settings || {};

  const initialValues = {
    instanceName
  };

  if (purposes === purposesEnum.ALL || purposes === purposesEnum.NONE) {
    initialValues.purposes = purposes;
    initialValues.purposesDataElement = "";
  } else {
    initialValues.purposes = purposesEnum.DATA_ELEMENT;
    initialValues.purposesDataElement = purposes;
  }

  return initialValues;
};

const getSettings = ({ values }) => {
  const { instanceName, purposes, purposesDataElement } = values;

  return {
    instanceName,
    purposes:
      purposes === purposesEnum.DATA_ELEMENT ? purposesDataElement : purposes
  };
};

const isOptInEnabled = (initInfo, formikProps) => {
  const matchingInstance = initInfo.extensionSettings.instances.find(
    instance => instance.name === formikProps.values.instanceName
  );
  return matchingInstance ? matchingInstance.optInEnabled : false;
};

const invalidDataMessage = "Please specify a data element";
const validationSchema = object().shape({
  purposesDataElement: string().when("purposes", {
    is: purposesEnum.DATA_ELEMENT,
    then: string()
      .required(invalidDataMessage)
      .matches(singleDataElementRegex, invalidDataMessage)
  })
});

const SetOptInPreferences = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo, formikProps }) => {
        return (
          <div>
            {isOptInEnabled(initInfo, formikProps) ? null : (
              <div>
                <Alert
                  id="optInDisabledAlert"
                  header="Opt-In Not Enabled"
                  variant="warning"
                >
                  Before Opt-In preferences can be set, Opt-In must be enabled
                  for the instance within the extension configuration.
                </Alert>
              </div>
            )}
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
                labelFor="purposesField"
                label="The user has opted into:"
              />
              <WrappedField
                id="purposesField"
                name="purposes"
                component={RadioGroup}
                componentClassName="u-flexColumn"
              >
                <Radio value={purposesEnum.ALL} label="All purposes" />
                <Radio value={purposesEnum.NONE} label="No purposes" />
                <Radio
                  value={purposesEnum.DATA_ELEMENT}
                  label="Purposes provided by data element"
                />
              </WrappedField>
            </div>
            {formikProps.values.purposes === purposesEnum.DATA_ELEMENT ? (
              <div className="FieldSubset u-gapTop">
                <InfoTipLayout tip='The data element should return "all" or "none".'>
                  <FieldLabel
                    labelFor="purposesDataElementField"
                    label="Data Element"
                  />
                </InfoTipLayout>
                <div>
                  <WrappedField
                    id="purposesDataElementField"
                    name="purposesDataElement"
                    component={Textfield}
                    componentClassName="u-fieldLong"
                    supportDataElement
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

render(SetOptInPreferences);
