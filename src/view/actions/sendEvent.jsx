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

import React from "react";
import { object, string } from "yup";
import Textfield from "@react/react-spectrum/Textfield";
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import "./sendEvent.styl";
import InfoTip from "../components/infoTip";

const getInitialValues = settings => {
  // settings is null if the user is creating a new rule component
  if (!settings) {
    settings = {};
  }

  const { data = "", type = "" } = settings;

  return {
    data,
    type
  };
};

const getSettings = values => {
  const settings = {
    data: values.data
  };

  if (values.type) {
    settings.type = values.type;
  }

  return settings;
};

const validationSchema = object().shape({
  data: string().matches(/^%([^%]+)%$/, "Please specify a data element")
});

const SendEvent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={() => {
        return (
          <div>
            <div>
              <label>
                <span className="Label">Type</span>
                <div>
                  <WrappedField
                    name="type"
                    component={Textfield}
                    componentClassName="u-longTextfield"
                    supportDataElement
                  />
                </div>
              </label>
            </div>
            <div className="u-gapTop">
              <label>
                <span className="Label">
                  Data
                  <InfoTip>
                    Please specify a data element that will return a JavaScript
                    object. This object will be sent to the Adobe Experience
                    Platform.
                  </InfoTip>
                </span>
                <div>
                  <WrappedField
                    name="data"
                    component={Textfield}
                    componentClassName="u-longTextfield"
                    supportDataElement
                  />
                </div>
              </label>
            </div>
          </div>
        );
      }}
    />
  );
};

render(SendEvent);
