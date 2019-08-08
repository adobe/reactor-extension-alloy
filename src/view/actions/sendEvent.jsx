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
import { object, string } from "yup";
import Textfield from "@react/react-spectrum/Textfield";
import ComboBox from "@react/react-spectrum/ComboBox";
import Select from "@react/react-spectrum/Select";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import InfoTip from "../components/infoTip";
import "./sendEvent.styl";

const getInitialValues = settings => {
  // settings is null if the user is creating a new rule component
  if (!settings) {
    settings = {};
  }

  const { propertyID = "", data = "", type = "" } = settings;

  return {
    propertyID,
    type,
    data
  };
};

const getSettings = values => {
  const settings = {
    propertyID: values.propertyID,
    data: values.data
  };

  if (values.type) {
    settings.type = values.type;
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element";
const validationSchema = object().shape({
  propertyID: string().required("Please specify an account"),
  data: string()
    .required(invalidDataMessage)
    .matches(/^%([^%]+)%$/, invalidDataMessage)
});

const SendEvent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo }) => {
        const accountOptions = initInfo.extensionSettings.accounts.map(
          account => ({
            value: account.propertyID,
            label: account.propertyID
          })
        );

        if (initInfo.settings) {
          const previouslySavedPropertyID = initInfo.settings.propertyID;
          if (
            !accountOptions.some(
              accountOption =>
                accountOption.value === initInfo.settings.propertyID
            )
          ) {
            accountOptions.unshift({
              value: previouslySavedPropertyID,
              label: `${previouslySavedPropertyID} (Deleted)`,
              disabled: true
            });
          }
        }

        return (
          <div>
            <div>
              <label
                htmlFor="propertyIDField"
                className="spectrum-Form-itemLabel"
              >
                Account
              </label>
              <div>
                <WrappedField
                  id="propertyIDField"
                  name="propertyID"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={accountOptions}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <label htmlFor="typeField" className="spectrum-Form-itemLabel">
                Type
              </label>
              <div>
                <WrappedField
                  id="typeField"
                  name="type"
                  component={ComboBox}
                  componentClassName="u-fieldLong"
                  supportDataElement
                  options={["viewStart"]}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <label htmlFor="dataField" className="spectrum-Form-itemLabel">
                Data
                <InfoTip>
                  Please specify a data element that will return a JavaScript
                  object. This object will be sent to the Adobe Experience
                  Platform.
                </InfoTip>
              </label>
              <div>
                <WrappedField
                  id="dataField"
                  name="data"
                  component={Textfield}
                  componentClassName="u-fieldLong"
                  supportDataElement
                />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

render(SendEvent);
