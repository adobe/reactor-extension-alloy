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
import getInstanceOptions from "../utils/getInstanceOptions";
import "./sendEvent.styl";

const getInitialValues = initInfo => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    viewStart = false,
    data = "",
    eventMergeId = ""
  } = initInfo.settings || {};

  return {
    instanceName,
    viewStart,
    data,
    eventMergeId
  };
};

const getSettings = values => {
  const settings = {
    instanceName: values.instanceName,
    data: values.data
  };

  // Only add viewStart if the value is different than the default (false).
  if (values.viewStart) {
    settings.viewStart = true;
  }

  if (values.eventMergeId) {
    settings.eventMergeId = values.eventMergeId;
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element";
const validationSchema = object().shape({
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
        return (
          <div>
            <div>
              <label
                htmlFor="instanceNameField"
                className="spectrum-Form-itemLabel"
              >
                Instance
              </label>
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
            <div className="u-gapTop">
              <label
                htmlFor="eventMergeIdField"
                className="spectrum-Form-itemLabel"
              >
                Event Merge ID (optional)
              </label>
              <div>
                <WrappedField
                  id="eventMergeIdField"
                  name="eventMergeId"
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
