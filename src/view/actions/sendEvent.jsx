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
import Checkbox from "@react/react-spectrum/Checkbox";
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

  const { propertyId = "", viewStart = false, data = "" } = settings;

  return {
    propertyId,
    viewStart,
    data
  };
};

const getSettings = values => {
  const settings = {
    propertyId: values.propertyId,
    data: values.data
  };

  // Only add viewStart if the value is different than the default (false).
  if (values.viewStart) {
    settings.viewStart = true;
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element";
const validationSchema = object().shape({
  propertyId: string().required("Please specify an instance"),
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
        const instanceOptions = initInfo.extensionSettings.instances.map(
          instance => ({
            value: instance.propertyId,
            label: instance.propertyId
          })
        );

        if (initInfo.settings) {
          const previouslySavedPropertyId = initInfo.settings.propertyId;
          if (
            !instanceOptions.some(
              instanceOption =>
                instanceOption.value === initInfo.settings.propertyId
            )
          ) {
            instanceOptions.unshift({
              value: previouslySavedPropertyId,
              label: `${previouslySavedPropertyId} (Deleted)`,
              disabled: true
            });
          }
        }

        return (
          <div>
            <div>
              <label
                htmlFor="propertyIdField"
                className="spectrum-Form-itemLabel"
              >
                Instance
              </label>
              <div>
                <WrappedField
                  id="propertyIdField"
                  name="propertyId"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={instanceOptions}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <WrappedField
                name="viewStart"
                component={Checkbox}
                label="Occurs at the start of a view"
              />
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
