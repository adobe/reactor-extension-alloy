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
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import "./setOptInPreferences.styl";

const purposesEnum = {
  ALL: "all",
  NONE: "none"
};

const getInitialValues = initInfo => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    purposes = purposesEnum.ALL
  } = initInfo.settings || {};

  return {
    instanceName,
    purposes
  };
};

const getSettings = values => values;

const isOptInEnabled = (initInfo, formikProps) => {
  const matchingInstance = initInfo.extensionSettings.instances.find(
    instance => instance.name === formikProps.values.instanceName
  );
  return matchingInstance ? matchingInstance.optInEnabled : false;
};

const SetOptInPreferences = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={({ initInfo, formikProps }) => {
        return (
          <div>
            {isOptInEnabled(initInfo, formikProps) ? null : (
              <div>
                <Alert header="Opt-In Not Enabled" variant="warning">
                  Before Opt-In preferences can be set, Opt-In must be enabled
                  for the instance within the extension configuration.
                </Alert>
              </div>
            )}
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
              <label
                htmlFor="purposesField"
                className="spectrum-Form-itemLabel"
              >
                The user has opted into:
              </label>
              <WrappedField
                id="purposesField"
                name="purposes"
                component={RadioGroup}
                componentClassName="u-flexColumn"
              >
                <Radio value={purposesEnum.ALL} label="All purposes" />
                <Radio value={purposesEnum.NONE} label="No purposes" />
              </WrappedField>
            </div>
          </div>
        );
      }}
    />
  );
};

render(SetOptInPreferences);
